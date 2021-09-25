export interface IAuditCustomItem {
    policy_type?: string,
    policy_description?: string,
    policy_info?: string,
    policy_solution?: string,
    policy_reference?: string,
    policy_see_also?: string,
    policy_value_type?: string,
    policy_value_data?: string,
    policy_Note?: string,
    policy_regex?: string,
    policy_expect?: string,
    policy_reg_option?: string,
    policy_reg_key?: string,
    policy_reg_item?: string,
    policy_key_item?: string,
    passed?: boolean,
    warning?: boolean,
    isActive?: boolean
}

export interface IAuditVariable {
    variable_name?: string,
    variable_default?: string,
    variable_description?: string,
    variable_info?: string
}

export interface IAuditSpecifications {
    spec_type?: string,
    spec_name?: string,
    spec_version?: string,
    spec_link?: string
}

export interface IAuditFile {
    file?: {
        content: Buffer,
        content_type: string
    },
    filename?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

export interface IAuditDocument {
    audit_filename?: string,
    audit_revision?: string,
    audit_date?: string,
    audit_description?: string,
    audit_display_name?: string,
    audit_check_type_os?: string,
    audit_check_type_version?: string,
    audit_group_policy?: string,
    audit_custom_items?: IAuditCustomItem[],
    audit_variables?: IAuditVariable[],
    audit_specifications?: IAuditSpecifications[],
    audit_file?: IAuditFile,
    createdAt?: string,
    updatedAt?: string,
    __v?: number,
}