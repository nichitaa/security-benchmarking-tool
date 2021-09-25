const fs = require('fs');
const path = require('path');
const regedit = require('regedit');

class AuditRegeditController {

    // https://docs.tenable.com/nessus/compliancechecksreference/Content/PDF/NessusComplianceChecksReference.pdf
    async testPolicy(req, res, next) {
        const body = req.body;
        console.log(body);
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
                                    return res.json({isSuccess: false, data: regResult});
                                }
                            }
                            case 'MUST_NOT_EXIST': {
                                if (!reg_check(regResult, body.policy_value_data, body.policy_key_item)) {
                                    return res.json({isSuccess: true, data: regResult});
                                } else {
                                    return res.json({isSuccess: false, data: regResult});
                                }
                            }
                            default: {
                                return res.json({isSuccess: false, data: regResult});
                            }
                        }
                    });
                    break;
                }
                // checks the value of a registry key
                case 'REGISTRY_SETTING': {
                    console.log('registry settings');
                    regedit.list(body.policy_reg_key, function (err, regResult) {
                        const r = regResult[body.policy_reg_key];
                        // console.log('r: ', r);
                        if (r.exists) {
                            // console.log('exists');
                            // console.log('key: ', body.policy_reg_item);
                            // console.log('val: ', r.values[body.policy_reg_item]);
                            if (r.values[body.policy_reg_item] !== undefined) {
                                console.log('item: ', r.values[body.policy_reg_item]);
                                const bool = isNumeric(body.policy_value_data);
                                let valCompare = null;
                                if (bool) valCompare = parseInt(body.policy_value_data);
                                const [isArr, arrComp] = isArray(body.policy_value_data);
                                const [isArrReg, arrReg] = isArray(r.values[body.policy_reg_item].value);
                                if (isArr && isArrReg) {
                                    // console.log("both arrays:");
                                    if (arrComp.every(el => arrReg.includes(el))) {
                                        return res.json({isSuccess: true, data: regResult});
                                    }
                                }
                                if (r.values[body.policy_reg_item].value === valCompare) {
                                    return res.json({isSuccess: true, data: regResult});
                                } else if (body.policy_reg_option && body.policy_reg_option === 'CAN_NOT_BE_NULL' && r.values[body.policy_reg_item].value !== null) {
                                    return res.json({isSuccess: true, warning: true, data: regResult});
                                } else if (body.policy_reg_option && body.policy_reg_option === 'CAN_BE_NULL') {
                                    return res.json({isSuccess: true, warning: true, data: regResult});
                                } else {
                                    return res.json({isSuccess: false, warning: true, data: regResult});
                                }
                            } else {
                                return res.json({isSuccess: false, data: regResult});
                            }
                        } else {
                            return res.json({isSuccess: false, data: regResult});
                        }
                    });
                    break;
                }
                default: {
                    return res.json({isSuccess: false, err: 'no such policy type'});
                }
            }
        } else {
            res.json({isSuccess: true});
        }
    }


}

function reg_check(reg, path, key) {
    // console.log('reg: ', reg);
    const r = reg[path];
    // console.log('r: ', r);
    if (r.exists) {
        return r.values[key];
    } else {
        return false;
    }
}

function isArray(str) {
    if(typeof str === 'string') {
        let split = str.split(',');
        if (split.length !== 0) {
            split = split.map(el => el.trim());
            // console.log('split: ', split);
            return [true, split];
        }
        return [false, []]
    }
    return [false, []]
}

function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = AuditRegeditController;