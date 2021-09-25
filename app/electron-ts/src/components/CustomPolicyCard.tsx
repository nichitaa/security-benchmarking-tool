import React, {useEffect, useState} from 'react';
import {Checkbox, Form, Input, Collapse, Typography, Button, Row, Col} from "antd";
import {
    AlertOutlined,
    CheckCircleOutlined,
    FileAddOutlined,
    FileExcelOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {testCustomItem} from "../services/api";

const {TextArea} = Input;
const {Panel} = Collapse;
const {Title} = Typography;


export const CustomPolicyCard = (props) => {
    const {policy} = props;
    const [loading, setLoading] = useState<null | boolean>(null);
    const [passed, setPassed] = useState<null | boolean>(null)
    const [warning, setWarning] = useState<null | boolean>(null)

    useEffect(() => {
        if (props.policy.passed !== undefined) {
            setLoading(false); // to display the icons result
            setPassed(props.policy.passed);
        }
        if (props.policy.warning !== undefined) setWarning(props.policy.warning);
    }, [props])

    const test = () => {
        setLoading(true);
        setTimeout(() => {
            testCustomItem(policy)
                .then(res => {
                    console.log('response: ', res)
                    if (res.isSuccess) setPassed(true);
                    if (res.warning) setWarning(true);
                    if (!res.isSuccess) setPassed(false)
                    setLoading(false)
                })
        }, 200)
    }

    return (
        <div style={{
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.01)'
        }}>
            <Form
                wrapperCol={{span: 24}}
                labelAlign={'left'}
            >
                <Row justify={'space-between'}>
                    <Form.Item style={{marginBottom: '0px'}} label={'active'}>
                        <Checkbox onChange={(e) => props.updateSinglePolicyActiveState(e.target.checked, props.idx)}
                                  checked={policy.isActive}/>
                    </Form.Item>
                    <Col>
                        {(loading !== null || props.passed !== undefined)
                        && <>
                            {warning !== null && warning &&
                            <AlertOutlined style={{color: '#fca103', marginRight: '5px', fontSize: '18px'}}/>}
                            {passed !== null && passed &&
                            <CheckCircleOutlined style={{color: 'green', marginRight: '5px', fontSize: '18px'}}/>}
                            {passed !== null && !passed &&
                            <WarningOutlined style={{color: 'red', marginRight: '5px', fontSize: '18px'}}/>}
                        </>}
                        <Button size={'small'} type={'text'} onClick={test}
                                loading={loading === null ? false : loading}>
                            <Title
                                style={{display: 'inline-block', fontSize: '15px'}}
                                level={5}>
                                <code>run</code>
                            </Title>
                        </Button>
                    </Col>

                </Row>
                <Collapse>
                    <Panel header={<Title
                        style={{display: 'inline-block', color: '#645790', fontSize: '15px'}}
                        level={5}>
                        <code>[#{props.idx + 1} {policy.policy_type}] 📑</code>
                    </Title>} key={0}>
                        <Collapse
                            expandIcon={({isActive}) => {
                                if (isActive) return <FileExcelOutlined/>
                                return <FileAddOutlined/>
                            }}
                            style={{padding: '5px'}}
                            bordered={false}
                        >
                            {policy.policy_type && <Panel header={'policy type'} key={1}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_type}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_description && <Panel header={'policy description'} key={2}>
                                <Form.Item>
                                    <TextArea defaultValue={policy.policy_description}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_info && <Panel header={'policy info'} key={3}>
                                <Form.Item>
                                    <TextArea rows={7} defaultValue={policy.policy_info}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_solution && <Panel header={'policy solution'} key={4}>
                                <Form.Item>
                                    <TextArea rows={7} defaultValue={policy.policy_solution}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_reference && <Panel header={'policy reference'} key={5}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_reference}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_see_also && <Panel header={'see also link'} key={6}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_see_also}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_key_item && <Panel header={'key item'} key={7}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_key_item}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_value_type && <Panel header={'value type'} key={8}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_value_type}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_value_data && <Panel header={'value data'} key={9}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_value_data}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_reg_option && <Panel header={'reg option'} key={10}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_reg_option}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_reg_key && <Panel header={'reg key'} key={11}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_reg_key}/>
                                </Form.Item>
                            </Panel>}
                            {policy.policy_reg_item && <Panel header={'reg item'} key={12}>
                                <Form.Item>
                                    <Input defaultValue={policy.policy_reg_item}/>
                                </Form.Item>
                            </Panel>}
                        </Collapse>
                    </Panel>
                </Collapse>
            </Form>
        </div>
    )
}