import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Input, Row, Switch, Typography, Spin, Tag, Collapse} from "antd";
import {CustomPolicyCard} from "./CustomPolicyCard";
import {objectClone, showMessage} from "../utils";
import {insertAuditDocument} from "../services/api";
import {AppContext} from "../context/context";
import {
    backupMachineRegistry,
    batchPolicyItemsFixAction,
    enforceAllPolicies,
    inspectEditViewItem,
    toggleIsEditView
} from "../context/reducer";
import {IAuditCustomItem, IAuditDocument} from "../types";

const {Panel} = Collapse;
const {Search} = Input;
const {Title, Text} = Typography;

const CreateView = () => {

    const {state, dispatch} = useContext(AppContext)
    const {
        editViewItem,
        inspectIsLoading,
        passedNumber,
        failNumber,
        warningNumber,
        showInspectionResult,
        backupLoading,
        batchFixLoading
    } = state

    const [auditContent, setAuditContent] = useState<IAuditDocument>({});
    const [newAuditDocumentName, setNewAuditDocumentName] = useState<string>('');
    const [filteredCustomItems, setFilteredCustomItems] = useState<IAuditCustomItem[]>([]);
    const [initialCustomItems, setInitialCustomItems] = useState<IAuditCustomItem[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    useEffect(() => {
        const clone = objectClone(editViewItem);
        setAuditContent(clone);
        const temp: IAuditCustomItem[] = [];
        for (let el of clone.audit_custom_items) temp.push({...el, isActive: true});
        setFilteredCustomItems(prev => temp);
        setInitialCustomItems(prev => temp);
    }, [editViewItem]);

    const onSearchChange = (search) => {
        const searchString = search.toLowerCase();
        setSearchValue(prev => searchString);
        if (searchString.trim() === '') {
            setFilteredCustomItems(prev => initialCustomItems)
        } else {
            const temp: object[] = [];
            initialCustomItems.map(el => {
                let includes = false;
                for (let key in el) {
                    if (typeof el[key] === 'string') {
                        const value = el[key].toLowerCase();
                        if (value.includes(searchString)) includes = true;
                    }
                }
                if (includes) temp.push(el)
                return el;
            });
            setFilteredCustomItems(prev => temp);
        }
    }

    const enforceFailedTests = (bool) => {
        dispatch(enforceAllPolicies(bool))
    }

    const togglePolicyActiveState = (bool) => {
        const temp: object[] = [];
        for (let el of initialCustomItems) {
            temp.push({...el, isActive: bool})
        }
        setSearchValue(prev => '');
        setFilteredCustomItems(prev => temp);
        setInitialCustomItems(prev => temp);
    }

    const updateSinglePolicyActiveState = (bool, idx) => {
        let item: IAuditCustomItem = {}
        setFilteredCustomItems(prev => prev.map((el, index) => {
            if (idx === index) {
                el.isActive = bool;
                item = el;
            }
            return el;
        }))
        const areSameObjects = (obj1, obj2) => {
            return JSON.stringify(obj1) === JSON.stringify(obj2)
        }


        setInitialCustomItems(prev => prev.map(el => {
            if (areSameObjects(el, item)) {
                el.isActive = item.isActive
            }
            return el;
        }))
    }

    const saveCurrentConfiguration = () => {
        if (newAuditDocumentName.trim() === '') {
            showMessage('error', 'please enter new audit document name', 2);
        } else {
            const body = auditContent;
            const activePolicies = filteredCustomItems.filter((el: IAuditCustomItem) => el.isActive);
            body.audit_custom_items = [...activePolicies];
            body.audit_filename = newAuditDocumentName + '.audit';
            delete body.audit_file
            console.log('current configuration: ', body);
            insertAuditDocument(body).then(res => {
                console.log('[insertAuditDocument] response: ', res);
                if (res.isSuccess) {
                    dispatch(toggleIsEditView(false))
                    showMessage('success', 'new audit configuration successfully saved', 1);
                } else showMessage('error', res.error, 2);
            })
                .catch(err => console.log("error: ", err))
        }
    }

    const handleInspectAll = () => {
        dispatch(inspectEditViewItem())
    }

    const handleChangeAuditDocumentName = (e) => {
        if (e.target.value.trim().length === e.target.value.length) setNewAuditDocumentName(prev => e.target.value)
    }

    const fixEnforcedItems = () => {
        dispatch(batchPolicyItemsFixAction());
    }

    const backupRegistryKeys = () => {
        dispatch(backupMachineRegistry())
    }

    return <>
        <Spin spinning={inspectIsLoading || backupLoading || batchFixLoading}
              tip={inspectIsLoading ? 'scanning system...' : backupLoading ? 'backup system registry...' : 'applying policy constraints on system...'}>
            <Row gutter={[8, 8]} style={{marginBottom: '10px'}}>
                <Col span={4}>
                    <Button danger={true} type={'dashed'} style={{width: '100%'}}
                            onClick={() => dispatch(toggleIsEditView(false))}>{'< Back'}</Button>
                </Col>
                <Col style={{textAlign: 'center'}} offset={6} span={6}>
                    <Switch checkedChildren={'disable all'}
                            unCheckedChildren={'select all'}
                            defaultChecked={true}
                            onChange={bool => togglePolicyActiveState(bool)}/>
                </Col>
                <Col span={4}>
                    <Button style={{width: '100%'}} onClick={saveCurrentConfiguration}>
                        Save
                    </Button>
                </Col>
                <Col span={4}>
                    <Button loading={inspectIsLoading} onClick={handleInspectAll}
                            style={{width: '100%', color: '#fca103', borderColor: '#fca103'}}>
                        System scan
                    </Button>
                </Col>
            </Row>

            <Row style={{marginBottom: '10px'}} gutter={[8, 8]}>
                <Col span={12}>
                    <Input
                        placeholder={'Enter a new audit document name'}
                        value={newAuditDocumentName}
                        onChange={handleChangeAuditDocumentName}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) saveCurrentConfiguration();
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Search
                        placeholder="find a policy by a keyword"
                        allowClear
                        enterButton="Search"
                        size="middle"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onSearch={(val) => onSearchChange(val)}
                    />
                </Col>
                <Row justify={'space-between'} style={{width: '100%'}}>
                    <Col>
                        <Title
                            style={{display: 'inline-block', color: '#645790', fontSize: '15px'}}
                            level={5}>
                            <code>found [{filteredCustomItems.length}] 📑 policies</code>
                        </Title>
                    </Col>
                    <Col>
                        {showInspectionResult
                        && <Title
                            style={{display: 'inline-block', color: '#645790', fontSize: '15px'}}
                            level={5}>
                            <Tag color="green">passed [{passedNumber}] 😄</Tag>
                            <Tag color="gold">warning [{warningNumber}] 😕</Tag>
                            <Tag color="volcano">fail [{failNumber}] 💀</Tag>
                        </Title>}
                    </Col>
                </Row>
            </Row>
            <Row gutter={[8, 8]} style={{width: '100%'}}>
                <Collapse style={{width: '100%'}}>
                    <Panel header={
                        <Text style={{fontWeight: 'bold', color: '#9E2A2B', fontSize: '17px'}} code={true}>ADVANCE
                            SYSTEM FIX !</Text>
                    } key={'0'}>
                        <Row gutter={[8, 8]} justify={'space-between'}>
                            <Col>
                                <Text code={true}
                                      style={{fontWeight: 'bold', color: '#645790'}}>
                                    select all failed
                                    items</Text>
                                <Switch
                                    size={'small'}
                                    style={{marginRight: '5px'}}
                                    // checkedChildren={'disable'}
                                    // unCheckedChildren={'select'}
                                    defaultChecked={false}
                                    onChange={bool => enforceFailedTests(bool)}
                                />
                            </Col>
                            <Col>
                                <Button size={'small'} danger={true} onClick={() => fixEnforcedItems()}>
                                    Fix enforced items
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

            <Row gutter={[8, 8]} style={{marginTop: '10px'}}>
                {filteredCustomItems.map((item, index) => {
                    return <Col key={index} span={filteredCustomItems.length === 1 ? 24 : 12}>
                        <CustomPolicyCard
                            updateSinglePolicyActiveState={updateSinglePolicyActiveState}
                            idx={index}
                            policy={item}/>
                    </Col>
                })}
                {filteredCustomItems.length === 0 && <p>Could not find any matching audit policy</p>}
            </Row>
        </Spin>
    </>
};

export default CreateView;