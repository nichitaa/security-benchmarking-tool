const fs = require('fs');
const path = require('path');
const os = require('os');
const regedit = require('regedit');
const sudo = require('sudo-prompt');

class AuditRegeditController {

    // https://docs.tenable.com/nessus/compliancechecksreference/Content/PDF/NessusComplianceChecksReference.pdf
    async testPolicy(req, res, next) {
        const body = req.body;
        // console.log(body);
        if (body.policy_type) {
            switch (body.policy_type) {
                // if registry key exists or not
                case 'REG_CHECK': {
                    regedit.list(body.policy_value_data, function (err, regResult) {
                        switch (body.policy_reg_option) {
                            case 'MUST_EXIST': {
                                if (reg_check(regResult, body.policy_value_data, body.policy_key_item)) {
                                    return res.json({isSuccess: true, data: regResult});
                                } else {
                                    return res.json({
                                        isSuccess: false,
                                        data: regResult,
                                        reason: `registry key: ${body.policy_key_item} does not exists in path: ${body.policy_value_data}`
                                    });
                                }
                            }
                            case 'MUST_NOT_EXIST': {
                                if (!reg_check(regResult, body.policy_value_data, body.policy_key_item)) {
                                    return res.json({isSuccess: true, data: regResult});
                                } else {
                                    return res.json({
                                        isSuccess: false,
                                        data: regResult,
                                        reason: `registry key: ${body.policy_key_item} exists in path: ${body.policy_value_data}`
                                    });
                                }
                            }
                            default: {
                                return res.json({
                                    isSuccess: false,
                                    data: regResult,
                                    reason: `invalid registry option ${body.policy_reg_option} (accepting only: MUST_EXIST | MUST_NOT_EXIST`
                                });
                            }
                        }
                    });
                    break;
                }
                // checks the value of a registry key
                case 'REGISTRY_SETTING': {
                    regedit.list(body.policy_reg_key, function (err, regResult) {
                        const r = regResult[body.policy_reg_key];
                        if (r.exists) {
                            if (r.values[body.policy_reg_item] !== undefined) {
                                // console.log('item: ', r.values[body.policy_reg_item]);
                                const bool = isNumeric(body.policy_value_data);
                                let valCompare = null;
                                if (bool) valCompare = parseInt(body.policy_value_data);
                                const [isArr, arrComp] = isArray(body.policy_value_data);
                                const [isArrReg, arrReg] = isArray(r.values[body.policy_reg_item].value);
                                if (isArr && isArrReg) {
                                    if (arrComp.every(el => arrReg.includes(el))) {
                                        return res.json({isSuccess: true, data: regResult});
                                    } else {
                                        return res.json({
                                            isSuccess: true,
                                            data: regResult,
                                            reason: `not all values from:  ${JSON.stringify(arrComp)} are present in ${JSON.stringify(arrReg)}`
                                        });
                                    }
                                }
                                if (r.values[body.policy_reg_item].value === valCompare) {
                                    return res.json({isSuccess: true, data: regResult});
                                } else if (body.policy_reg_option && body.policy_reg_option === 'CAN_NOT_BE_NULL' && r.values[body.policy_reg_item].value !== null) {
                                    return res.json({
                                        isSuccess: true,
                                        warning: true,
                                        data: regResult,
                                        reason: `Registry value: ${r.values[body.policy_reg_item].value} is different from expected value: ${valCompare}, but validated CAN_NOT_BE_NULL`
                                    });
                                } else if (body.policy_reg_option && body.policy_reg_option === 'CAN_BE_NULL') {
                                    return res.json({
                                        isSuccess: true,
                                        warning: true,
                                        data: regResult,
                                        reason: `Registry value: ${r.values[body.policy_reg_item].value} is different from expected value: ${valCompare}, but validates CAN_BE_NULL`
                                    });
                                } else {
                                    return res.json({
                                        isSuccess: false,
                                        warning: true,
                                        data: regResult,
                                        reason: `Registry value: ${r.values[body.policy_reg_item].value} does not match expected value: ${valCompare}`
                                    });
                                }
                            } else {
                                return res.json({
                                    isSuccess: false,
                                    data: regResult,
                                    reason: `Registry value: ${r.values[body.policy_reg_item]} does not exists in path: ${body.policy_reg_key}`
                                });
                            }
                        } else {
                            return res.json({
                                isSuccess: false,
                                data: regResult,
                                reason: `Could not find registry path: ${body.policy_reg_key} on this machine`
                            });
                        }
                    });
                    break;
                }
                default: {
                    return res.json({
                        isSuccess: false,
                        reason: `invalid policy type: ${body.policy_type} (accepting only: REG_CHECK | REGISTRY_SETTING)`
                    });
                }
            }
        } else {
            res.json({isSuccess: false, reason: `Can not validate policy type: ${body.policy_type}`});
        }
    }

    async batchEnforce(req, res, next) {
        const body = req.body;
        // console.log("body: ", body);
        const items = body.items;
        let cmd = '';
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // console.log('item: ', item);
            switch (item.policy_type) {
                case 'REG_CHECK': {
                    regedit.list(item.policy_value_data, function (err, regResult) {
                        return regCheckFix(regResult, err, item, res, true);
                    });
                    break;
                }
                case 'REGISTRY_SETTING': {
                    try {
                        const regResult = await regedit.promisified.list(item.policy_reg_key);
                        const r = regResult[item.policy_reg_key];
                        if (r.exists) {
                            if (!item.policy_reg_item.startsWith('Update') && item.policy_value_type === 'POLICY_DWORD') {
                                if (cmd === '') cmd += `reg add ${item.policy_reg_key} /v ${item.policy_reg_item} /t REG_DWORD /d ${item.policy_value_data} /f`;
                                else cmd += ` && reg add ${item.policy_reg_key} /v ${item.policy_reg_item} /t REG_DWORD /d ${item.policy_value_data} /f`;
                            }
                        }
                    } catch (e) {
                        console.error('Error : ', e.message);
                    }
                    break;
                }
                default: {
                    return res.send({isSuccess: false, err: `invalid policy type ${item.policy_type}`});
                }
            }
        }
        sudo.exec(cmd,
            {name: 'updatingdwords'},
            (err) => {
                if (err) {
                    console.log('Error on Command execution: ', err);
                    res.send({isSuccess: false, error: err.message});
                } else {
                    res.send({isSuccess: true, message: 'registry keys are fixed'});
                }
            }
        );
    }

    async enforcePolicy(req, res, next) {
        const body = req.body;
        console.log('body: ', body);
        if (body.policy_type) {
            switch (body.policy_type) {
                case 'REG_CHECK': {
                    regedit.list(body.policy_value_data, function (err, regResult) {
                        // create new regedit key with given value
                        return regCheckFix(regResult, err, body, res, false);
                    });
                    break;
                }
                case 'REGISTRY_SETTING': {
                    regedit.list(body.policy_reg_key, function (err, regResult) {
                        const r = regResult[body.policy_reg_key];
                        if (r.exists) {
                            if (!body.policy_reg_item.startsWith('Update')) {
                                if (body.policy_value_type === 'POLICY_DWORD') {
                                    console.log('exists key: ', body.policy_reg_key);
                                    // REG ADD \\ComputerName\HKLM\Software\MySubkey /v AppInfo /t REG_DWORD /d 0
                                    const cmd = `reg add ${body.policy_reg_key} /v ${body.policy_reg_item} /t REG_DWORD /d ${body.policy_value_data} /f`;
                                    console.log('command : ', cmd);
                                    const option = {name: 'addingreg'};
                                    sudo.exec(cmd, option, function (error) {
                                        if (error) res.send({isSuccess: false, err: err.message});
                                        else {
                                            res.send({isSuccess: true});
                                        }
                                    });
                                } else {
                                    res.send({isSuccess: false, err: 'value type is not POLICY_DWORD'});
                                }
                            } else {
                                res.send({isSuccess: false, err: 'reg item starts with Update'});
                            }

                        } else {
                            res.send({
                                isSuccess: false,
                                err: `path: ${body.policy_reg_key} reg_key: ${body.policy_reg_key} does not exists`
                            });
                        }
                    });
                    break;
                }
                default: {
                    return res.json({
                        isSuccess: false,
                        reason: `invalid policy type: ${body.policy_type} (accepting only: REG_CHECK | REGISTRY_SETTING)`
                    });
                }
            }
        } else {
            res.json({isSuccess: false, reason: `Can not validate policy type: ${body.policy_type}`});
        }
        // res.send({isSuccess: true})
    }

    async backupRegistry(req, res, next) {
        console.log('backup registry keys');
        // get user desktop directory
        const homeDir = os.homedir();
        const desktopDir = `${homeDir}\\Desktop`;

        // create new folder
        const folderName = 'regedit-backup' + Math.floor(new Date().getTime() / 1000);
        const dir = desktopDir + '\\' + folderName;

        // create folder
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // run command to save exported registry keys to the newly created folder
        const option = {
            'name': 'registry backup for all keys'
        };
        const keys = ['HKLM', 'HKCU', 'HKCR', 'HKU', 'HKCC'];
        let command = '';
        keys.map((key, idx) => {
            if (idx === 0) command += `reg export ${key} ${dir}\\${key}_backup.reg`;
            else command += ` && reg export ${key} ${dir}\\${key}_backup.reg`;
        });
        console.log('running export command: ', command);
        sudo.exec(command,
            option,
            (err) => {
                if (err) {
                    console.log('error: ', err);
                    res.send({isSuccess: false, error: err.message});
                } else {
                    res.send({isSuccess: true, message: 'all registry keys are exported', dir: dir});
                }
            }
        );
    }

}

function regCheckFix(regResult, err, body, res, isBatch) {
    if (!reg_check(regResult, body.policy_value_data, body.policy_key_item) && !err) {
        console.log('reg check something is wrong');
        const newRegeditFileName = 'import_regedit_' + Math.floor(new Date().getTime() / 1000) + '.reg';
        const dir = path.join(__dirname, '/../regedit_files/' + newRegeditFileName);

        // new import_regedit file
        fs.writeFile(dir, 'Windows Registry Editor Version 5.00\n' +
            '; chrome version: 94.0.4606.61\n', function (writeErr) {
            if (writeErr && !isBatch) res.send({isSuccess: false, err: 'could not write to file!'});
            else {
                // replace HotKey prefixes with full name
                let newKey = body.policy_value_data;
                if (newKey.startsWith('HKLM')) newKey = newKey.replace('HKLM', 'HKEY_LOCAL_MACHINE');
                else if (newKey.startsWith('HKCU')) newKey = newKey.replace('HKCU', 'HKEY_CURRENT_USER');
                else if (newKey.startsWith('HKCR')) newKey = newKey.replace('HKCR', 'HKEY_CLASSES_ROOT');
                else if (newKey.startsWith('HKU')) newKey = newKey.replace('HKU', 'HKEY_USERS');
                else if (newKey.startsWith('HKCC')) newKey = newKey.replace('HKCC', 'HKEY_CURRENT_CONFIG');
                else return res.send({
                        isSuccess: false,
                        err: 'the prefix of key shout start with: HKLM | HKCU | HKCR | HKU | HKCC'
                    });
                console.log('adding new key: ', newKey);

                // open the newly created file
                fs.open(dir, 'a', 666, function (e, id) {
                    // write new regedit keys and values for it
                    fs.write(id, `\n[${newKey}]\n"${body.policy_key_item}"=dword:00000001` + os.EOL, null, 'utf8', function (err) {
                        fs.close(id, function (err) {
                            if (err && !isBatch) res.send({isSuccess: false, err: err.message});
                            else {
                                // import the newly created file with cmd
                                const option = {name: 'regtemplate'};
                                const cmd = `cd regedit_files && reg import ${newRegeditFileName}`;
                                sudo.exec(cmd, option, (err) => {
                                    if (err && !isBatch) res.send({isSuccess: false, err: err.message});
                                    else if (!isBatch) {
                                        res.send({
                                            isSuccess: true,
                                            message: `new ${newRegeditFileName} file successfully imported!`
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    } else if (!isBatch) {
        return res.send({isSuccess: false, data: regResult});
    }
}

function reg_check(reg, path, key) {
    const r = reg[path];
    if (r.exists) {
        return r.values[key];
    } else {
        return false;
    }
}

function isArray(str) {
    if (typeof str === 'string') {
        let split = str.split(',');
        if (split.length !== 0) {
            split = split.map(el => el.trim());
            return [true, split];
        }
        return [false, []];
    }
    return [false, []];
}

function isNumeric(str) {
    if (typeof str != 'string') return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = AuditRegeditController;