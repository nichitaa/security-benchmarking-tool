import React from 'react';
import {Button, Typography} from "antd";
import ReactJson from "react-json-view";
import {BackwardFilled} from "@ant-design/icons";
import {AuditDocument} from "../App";

const {Title} = Typography;

interface ParsedViewProps {
    onBackClick: Function,
    newWindowItem: AuditDocument
}

export const ParsedView = (props: ParsedViewProps) =>
    <>
        <Title
            style={{textAlign: 'center', color: '#555b6e'}}
            level={5}>
            <Button
                type={'dashed'}
                danger={true}
                onClick={() => props.onBackClick()}
                style={{marginRight: '10px'}}>
                <BackwardFilled/> back</Button>
            {props.newWindowItem.audit_display_name}
        </Title>
        <ReactJson
            displayObjectSize={true}
            enableClipboard={true}
            indentWidth={6}
            collapseStringsAfterLength={50}
            collapsed={1}
            src={props.newWindowItem}
            theme={'eighties'}
            displayDataTypes={false}
        />
    </>