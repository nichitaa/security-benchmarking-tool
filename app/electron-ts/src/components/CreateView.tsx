import React, {useContext, useEffect, useState} from 'react';
import {Alert, Badge, Button, Checkbox, Col, Collapse, Input, Row, Spin, Tag, Tooltip, Typography} from 'antd';
import {CustomPolicyCard} from './CustomPolicyCard';
import {showMessage} from '../utils';
import {insertAuditDocument} from '../services/api';
import {AppContext} from '../context/context';
import {
    CheckSquareOutlined,
    CloseSquareOutlined,
    RollbackOutlined,
    SaveOutlined,
    SecurityScanOutlined
} from '@ant-design/icons';
import {
    backupMachineRegistry,
    batchPolicyItemsFixAction,
    enforceAllPolicies,
    inspectEditViewItem,
    toggleIsEditView,
    updateEditViewItemPolicies,
    updateFilteredCustomItemsAction
} from '../context/reducer';
import {IAuditCustomItem} from '../types';

const {Panel} = Collapse;
const {Search} = Input;
const {Title, Text} = Typography;

const CreateView = () => {

    const {state, dispatch} = useContext(AppContext);
    const {
        editViewItem,
        inspectIsLoading,
        passedNumber,
        failNumber,
        warningNumber,
        showInspectionResult,
        backupLoading,
        batchFixLoading,
        filteredCustomItems
    } = state;

    const [newAuditDocumentName, setNewAuditDocumentName] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [allChecked, setAllChecked] = useState(false);

    useEffect(() => {
        dispatch(updateFilteredCustomItemsAction(editViewItem.audit_custom_items));
        return () => {
            dispatch(updateFilteredCustomItemsAction([]));
        };
    }, []);

    const onSearchChange = (search) => {
        const searchString = search.toLowerCase();
        setSearchValue(prev => searchString);
        if (searchString.trim() === '') {
            dispatch(updateFilteredCustomItemsAction(editViewItem.audit_custom_items));
        } else {
            const temp: IAuditCustomItem[] = [];
            editViewItem.audit_custom_items.forEach(el => {
                let includes = false;
                for (let key in el) {
                    if (typeof el[key] === 'string') {
                        const value = el[key].toLowerCase();
                        if (value.includes(searchString)) includes = true;
                    }
                }
                if (includes) temp.push(el);
            });
            dispatch(updateFilteredCustomItemsAction(temp));
        }
    };

    const enforceFailedTests = (bool) => {
        dispatch(enforceAllPolicies(bool));
    };

    const toggleAllPoliciesActiveState = (bool) => {
        editViewItem.audit_custom_items.forEach(el => {
            dispatch(updateEditViewItemPolicies(el, {isActive: bool}));
        });
    };

    const saveCurrentConfiguration = () => {
        let docName = newAuditDocumentName.replace(/\s/g, '').toLowerCase();
        console.log('docname: ', docName);
        if (docName.length === 0) {
            showMessage('error', 'audit document name could not be blank', 2);
        } else {
            const body = editViewItem;
            const activePolicies = filteredCustomItems.filter((el: IAuditCustomItem) => el.isActive);
            if (activePolicies.length === 0) {
                showMessage('error', 'select al least one item', 2);
            } else {
                body.audit_custom_items = [...activePolicies];
                body.audit_filename = docName + '.audit';
                delete body.audit_file;
                console.log('current configuration: ', body);
                insertAuditDocument(body).then(res => {
                    console.log('[insertAuditDocument] response: ', res);
                    if (res.isSuccess) {
                        dispatch(toggleIsEditView(false));
                        showMessage('success', 'new audit configuration successfully saved', 1);
                    } else showMessage('error', res.error, 2);
                })
                    .catch(err => console.log('error: ', err));
            }
        }
    };

    const handleInspectAll = () => {
        dispatch(inspectEditViewItem());
    };

    const fixEnforcedItems = () => {
        dispatch(batchPolicyItemsFixAction());
    };

    const backupRegistryKeys = () => {
        dispatch(backupMachineRegistry());
    };

    return <>
        <Spin spinning={inspectIsLoading || backupLoading || batchFixLoading}
              tip={inspectIsLoading ? 'scanning system...' : backupLoading ? 'backup system registry...' : 'applying policy constraints on system...'}>
            <Row gutter={[3, 0]} style={{marginBottom: '10px'}}>
                <Col span={2}>
                    <Tooltip title={'back'}>
                        <Button block={true}
                                icon={<RollbackOutlined/>}
                                onClick={() => dispatch(toggleIsEditView(false))}/>
                    </Tooltip>
                </Col>
                <Col span={9}>
                    <Input
                        required={true}
                        placeholder={'Enter a new audit document name'}
                        onChange={e => setNewAuditDocumentName(e.target.value)}
                        onPressEnter={saveCurrentConfiguration}
                    />
                </Col>
                <Col span={9}>
                    <Search
                        placeholder="find a policy by a keyword"
                        allowClear
                        size="middle"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onSearch={(val) => onSearchChange(val)}
                    />
                </Col>
                <Col>
                    <Tooltip title={allChecked ? 'uncheck all items' : 'check all items'} placement={'bottomRight'}>
                        <Button icon={allChecked ? <CloseSquareOutlined/> : <CheckSquareOutlined/>} onClick={() => {
                            toggleAllPoliciesActiveState(!allChecked);
                            setAllChecked(prev => !prev);
                        }}/>
                    </Tooltip>
                </Col>
                <Col>
                    <Tooltip title={'save checked items to new policy'} placement={'bottomRight'}>
                        <Button icon={<SaveOutlined/>} onClick={saveCurrentConfiguration}/>
                    </Tooltip>
                </Col>
                <Col style={{textAlign: 'center'}}>
                    <Tooltip title="System Scan" placement={'bottomRight'}>
                        <Button onClick={handleInspectAll}
                                loading={inspectIsLoading}
                                style={{color: '#fca103', borderColor: '#fca103'}}
                                icon={<SecurityScanOutlined/>}
                        />
                    </Tooltip>
                </Col>
            </Row>

            <Row style={{marginBottom: '10px'}} gutter={[8, 8]}>
                <Row justify={'space-between'} style={{width: '100%', marginTop: '7px'}}>
                    <Col>
                        <Title
                            style={{display: 'inline-block', color: '#645790', fontSize: '15px'}}
                            level={5}>
                            <code>found [{filteredCustomItems.length}] 📑 policies</code>
                        </Title>
                    </Col>
                    <Col>
                        {showInspectionResult
                        &&
                        <>
                            <span style={{marginRight: '20px'}}>
                                <Badge count={passedNumber}
                                       style={{backgroundColor: '#f6ffed', color: '#389e0d', borderColor: '#b7eb8f'}}>
                                    <Tag color="green">passed 😄</Tag>
                                </Badge>
                            </span>

                            <span style={{marginRight: '20px'}}>
                                <Badge count={warningNumber}
                                       style={{backgroundColor: '#fffbe6', color: '#d48806', borderColor: '#ffe58f'}}>
                                    <Tag color="gold">warning 😕</Tag>
                                </Badge>
                            </span>
                            <span style={{marginRight: '20px'}}>
                                <Badge count={failNumber}
                                       style={{backgroundColor: '#fff2e8', color: '#d4380d', borderColor: '#ffbb96'}}>
                                    <Tag color="volcano">fail 💀</Tag>
                                </Badge>
                            </span>
                        </>
                        }
                    </Col>
                </Row>
            </Row>
            <Row gutter={[8, 8]} style={{width: '100%'}}>
                <Collapse style={{width: '100%'}}>
                    <Panel header={
                        <Text style={{fontWeight: 'bold', color: '#9E2A2B', fontSize: '17px'}} code={true}>
                            ADVANCE SYSTEM FIX !
                        </Text>
                    } key={'0'}>
                        <Row gutter={[8, 8]} justify={'space-between'}>
                            <Col>
                                <Checkbox onChange={(e) => {
                                    enforceFailedTests(e.target.checked);
                                }}>
                                    <Text
                                        style={{fontWeight: 'bold', fontSize: '15px'}}
                                        code={true}>
                                        check all suspected items
                                    </Text>
                                </Checkbox>
                            </Col>
                            <Col>
                                <Button size={'small'} danger={true} onClick={() => fixEnforcedItems()}>
                                    Apply fix for all items
                                </Button>
                            </Col>
                            <Col>
                                <Button size={'small'} style={{color: 'green', borderColor: 'green'}}
                                        onClick={() => backupRegistryKeys()}>Backup
                                    Registry
                                </Button>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
            </Row>

            <Row gutter={[11, 11]} style={{marginTop: '10px'}}>
                {filteredCustomItems.map((item, index) => {
                    return <Col key={index} span={filteredCustomItems.length === 1 ? 24 : 12}>
                        <CustomPolicyCard
                            idx={index}
                            policy={item}/>
                    </Col>;
                })}
                {filteredCustomItems.length === 0 &&
                <Alert banner={true} style={{width: '100%'}} message={`No available search result for : ${searchValue}`}
                       type="error"/>}
            </Row>
        </Spin>
    </>;
};

export default CreateView;