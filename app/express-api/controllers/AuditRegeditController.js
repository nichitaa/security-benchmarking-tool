const fs = require('fs');
const path = require('path');
const regedit = require('regedit');

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
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = AuditRegeditController;