import React, {useContext, useState} from 'react';
import {
    Checkbox,
    Form,
    Input,
    Collapse,
    Typography,
    Button,
    Row,
    Col,
    Tag,
} from "antd";
import {
    AlertOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FileAddOutlined,
    FileExcelOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {singlePolicyFixAction, singlePolicyScanAction, updateEditViewItemPolicies} from "../context/reducer";
import {AppContext} from "../context/context";

const {TextArea} = Input;
const {Panel} = Collapse;
const {Title, Text} = Typography;


export const CustomPolicyCard = (props) => {
    const {dispatch} = useContext(AppContext)
    const {policy} = props;
    const [loading, setLoading] = useState<null | boolean>(null);

    const singlePolicyScan = () => {
        setLoading(true);
        dispatch(singlePolicyScanAction(policy, () => setLoading(false)));
    }


    const applySinglePolicyFix = () => {
        setLoading(true);
        dispatch(singlePolicyFixAction(policy, () => setLoading(false)));
    }

    return (
        <div style={{

        }} className={'singleItem'}>
            <Form
                wrapperCol={{span: 24}}
                labelAlign={'left'}
            >
                <Row justify={'space-between'} style={{marginBottom: '5px'}}>
                    <Col>
                        <Checkbox onChange={(e) => {
                            dispatch(updateEditViewItemPolicies(policy, {isActive: e.target.checked}))
                        }}
                                  checked={policy.isActive}>
                            <Text
                                style={{fontWeight: 'bold', fontSize: '15px'}}
                                code={true}>
                                {policy.isActive
                                    ? <> #{props.idx + 1} <MinusCircleOutlined/></>
                                    : <> #{props.idx + 1} <PlusCircleOutlined/></>}
                            </Text>
                        </Checkbox>
                    </Col>
                    <Col>
                        {policy.isEnforced !== undefined && policy.isEnforced &&
                        <Tag style={{cursor: 'pointer'}} color={'red'} onClick={() => applySinglePolicyFix()}>apply
                            fix</Tag>}
                        {policy.warning &&
                        <AlertOutlined style={{color: '#fca103', marginRight: '5px', fontSize: '18px'}}/>}
                        {policy.passed &&
                        <CheckCircleOutlined style={{color: 'green', marginRight: '5px', fontSize: '18px'}}/>}
                        {policy.passed !== undefined && !policy.passed &&
                        <WarningOutlined style={{color: 'red', marginRight: '5px', fontSize: '18px'}}/>}
                        <Button size={'small'} type={'text'} onClick={singlePolicyScan}
                                loading={loading === null ? false : loading}>
                            <Title
                                style={{display: 'inline-block', fontSize: '15px'}}
                                level={5}>
                                <code>scan</code>
                            </Title>
                        </Button>
                    </Col>
                </Row>
                <Collapse>
                    <Panel header={
                        <Text style={{color: '#645790', fontWeight: 'bold', fontSize: '15px'}}
                              code={true}>[ % {policy.policy_type} % ] 📑
                        </Text>
                    } key={0}>
                        <Collapse
                            expandIcon={({isActive}) => {
                                if (isActive) return <FileExcelOutlined/>
                                return <FileAddOutlined/>
                            }}
                            style={{padding: '5px'}}
                            bordered={false}
                        >
                            {(policy.reason && policy.reason !== '') &&
                            <Panel style={{border: '1px solid #ff6380', borderRadius: '2px'}}
                                   header={<>reason <ExclamationCircleOutlined
                                       style={{color: '#ff6380'}}/></>} key={99}>
                                <Form.Item>
                                    <TextArea rows={7}
                                              defaultValue={policy.reason}/>
                                </Form.Item>
                            </Panel>}
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