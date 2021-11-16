import React, {useContext} from 'react';
import {Button, Row, Typography} from 'antd';
import ReactJson from 'react-json-view';
import {RollbackOutlined} from '@ant-design/icons';
import {toggleIsParsedView, updateParseViewItem} from '../context/reducer';
import {AppContext} from '../context/context';

const {Title} = Typography;

export const ParsedView = () => {

    const {state, dispatch} = useContext(AppContext);
    const {parsedViewItem} = state;

    const onBackClick = () => {
        dispatch(toggleIsParsedView(false));
        dispatch(updateParseViewItem(null));
    };

    return <>
        <Row style={{marginBottom: '10px'}} justify={'space-between'}>
            <Button
                icon={<RollbackOutlined/>}
                onClick={onBackClick}
                style={{marginRight: '10px'}}/>
            <Title level={4}>{parsedViewItem.audit_display_name}</Title>
        </Row>
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

};
