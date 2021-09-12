import React from 'react';
import {Checkbox, Form, Input, Collapse, Typography} from "antd";
import {FileAddOutlined, FileExcelOutlined} from "@ant-design/icons";

const {TextArea} = Input;
const {Panel} = Collapse;
const {Title} = Typography;


export const CustomPolicyCard = (props) => {
    const {policy} = props;
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
                <Form.Item style={{marginBottom: '0px'}} label={'active'}>
                    <Checkbox onChange={(e) => props.updateSinglePolicyActiveState(e.target.checked, props.idx)}
                              checked={policy.isActive}/>
                </Form.Item>
                <Collapse
                    expandIcon={({ isActive }) => {
                        if(isActive) return <FileExcelOutlined />
                        return <FileAddOutlined />
                    }}
                    style={{padding: '5px'}}
                    defaultActiveKey={['1', '2']}
                    bordered={false}
                >
                    <Panel header={'policy type'} key={1}>
                        <Form.Item>
                            <Input defaultValue={policy.policy_type}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'policy description'} key={2}>
                        <Form.Item>
                            <TextArea defaultValue={policy.policy_description}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'policy info'} key={3}>
                        <Form.Item>
                            <TextArea rows={7} defaultValue={policy.policy_info}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'policy solution'} key={4}>
                        <Form.Item>
                            <TextArea rows={7} defaultValue={policy.policy_solution}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'policy reference'} key={5}>
                        <Form.Item>
                            <Input defaultValue={policy.policy_reference}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'see also link'} key={6}>
                        <Form.Item>
                            <Input defaultValue={policy.policy_see_also}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'regex'} key={7}>
                        <Form.Item>
                            <Input defaultValue={policy.policy_regex}/>
                        </Form.Item>
                    </Panel>
                    <Panel header={'expect'} key={8}>
                        <Form.Item>
                            <Input defaultValue={policy.policy_expect}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Title
                    style={{display: 'inline-block', color: '#645790', fontSize: '15px'}}
                    level={5}>
                    <code>[{props.idx + 1}] 📑</code>
                </Title>
            </Form>
        </div>
    )
}