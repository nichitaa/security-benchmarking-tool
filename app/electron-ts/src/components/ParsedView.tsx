import React, {useContext} from 'react';
import {Button, Typography} from "antd";
import ReactJson from "react-json-view";
import {BackwardFilled} from "@ant-design/icons";
import {toggleIsParsedView, updateParseViewItem} from "../context/reducer";
import {AppContext} from "../context/context";

const {Title} = Typography;

export const ParsedView = () => {

    const {state, dispatch} = useContext(AppContext);
    const {parsedViewItem} = state

    const onBackClick = () => {
        dispatch(toggleIsParsedView(false))
        dispatch(updateParseViewItem(null))
    }

    return <>
        <Title
            style={{textAlign: 'center', color: '#555b6e'}}
            level={5}>
            <Button
                type={'dashed'}
                danger={true}
                onClick={onBackClick}
                style={{marginRight: '10px'}}>
                <BackwardFilled/> back</Button>
            {parsedViewItem.audit_display_name}
        </Title>
        <ReactJson
            displayObjectSize={true}
            enableClipboard={true}
            indentWidth={6}
            collapseStringsAfterLength={50}
            collapsed={1}
            src={parsedViewItem}
            theme={'eighties'}
            displayDataTypes={false}
        />
    </>;

}
