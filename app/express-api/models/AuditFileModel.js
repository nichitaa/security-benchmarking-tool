const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const File = new Schema({
    filename: {
        iv: {type: String},
        content: {type: String}
    },
    file: {content: Buffer, content_type: String}
}, {timestamps: true});
const FileModel = mongoose.model('File', File);


const AuditSpecs = new Schema({
    spec_type: {type: String},
    spec_name: {type: String},
    spec_version: {type: String},
    spec_link: {type: String}
}, {_id: false});

const AuditVariable = new Schema({
    variable_name: {type: String},
    variable_default: {type: String},
    variable_description: {type: String},
    variable_info: {type: String}
}, {_id: false});

const AuditCustomItem = new Schema({
    policy_type: {type: String},
    policy_description: {type: String},
    policy_info: {type: String},
    policy_solution: {type: String},
    policy_collection: {type: String},
    policy_fields_selector: {type: String},
    policy_query: {type: String},
    policy_reference: {type: String},
    policy_see_also: {type: String},
    policy_value_type: {type: String},
    policy_value_data: {type: String},
    policy_Note: {type: String},
    policy_regex: {type: String},
    policy_expect: {type: String},
    policy_reg_option: {type: String},
    policy_key_item: {type: String},
    policy_reg_key: {type: String},
    policy_reg_item: {type: String}
}, {_id: false});

const AuditDocument = new Schema({
    audit_filename: {type: String},
    audit_revision: {type: String},
    audit_date: {type: String},
    audit_description: {type: String},
    audit_display_name: {type: String},
    audit_check_type_os: {type: String},
    audit_check_type_version: {type: String},
    audit_group_policy: {type: String},

    audit_custom_items: [AuditCustomItem],
    audit_variables: [AuditVariable],
    audit_specifications: AuditSpecs,

    audit_file: {type: Schema.Types.ObjectId, ref: 'File'}
}, {timestamps: true});

const AuditDocumentModel = mongoose.model('AuditDocument', AuditDocument);

module.exports = {
    AuditDocumentModel: AuditDocumentModel,
    FileModel: FileModel
};