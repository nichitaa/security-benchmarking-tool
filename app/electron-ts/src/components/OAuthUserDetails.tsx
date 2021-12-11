import React, {useContext, useEffect} from 'react';
import {Avatar, Button, Col, Collapse, Row, Tooltip, Typography} from 'antd';
import {checkIfVerifiedEmailAction, logoutAction, sendVerificationMailAction} from '../context/reducer';
import {AppContext} from '../context/context';
import ReactJson from 'react-json-view';
import {LogoutOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';

const {Text} = Typography;
const {Panel} = Collapse;

const OAuthUserDetails = () => {
    const {state, dispatch} = useContext(AppContext);
    const {user} = state;

    useEffect(() => {
        if (!state.isEmailVerified) dispatch(checkIfVerifiedEmailAction())
    }, [])

    const logout = () => dispatch(logoutAction());

    const sendVerificationMail = () => dispatch(sendVerificationMailAction())

    return (
        <div style={{padding: '5px', marginBottom: '10px'}}>
            <Row gutter={[8, 8]}>
                <Col span={3}>
                    <Avatar shape="square" size={85}
                            className={'profile-image'}
                            src={user?.picture || user?.photos[0].value}
                            icon={<UserOutlined/>}/>
                </Col>
                <Col span={17}>
                    <Collapse bordered={false} defaultActiveKey={['user-details']}>
                        <Panel
                            showArrow={false}
                            style={{border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '5px'}}
                            key={'user-details'}
                            header={
                                <Row justify={'space-between'}>
                                    <Text style={{color: '#645790', fontWeight: 'normal', fontSize: '15px'}}
                                          code={true}>
                                        User details
                                    </Text>
                                    <Text style={{color: '#645790', fontWeight: 'normal', fontSize: '15px'}}
                                          code={true}>
                                        👾 made by: nichitaa (FAF-192)
                                    </Text>
                                </Row>}
                        >
                            <ReactJson
                                name={'userDetails'}
                                displayObjectSize={true}
                                enableClipboard={true}
                                indentWidth={6}
                                collapseStringsAfterLength={50}
                                collapsed={0}
                                src={user}
                                theme={'eighties'}
                                displayDataTypes={false}
                            />
                        </Panel>
                    </Collapse>
                    <Row>
                        <Col span={20}>
                            {user && user.displayName &&
                                <Text style={{color: '#645790', fontWeight: 'normal', fontSize: '15px'}} code={true}>
                                    user: {user.displayName}</Text>}
                        </Col>
                    </Row>
                    <Row justify={'space-between'}>
                        <Col>
                            {user && user.provider
                                && <Text style={{color: '#645790', fontWeight: 'normal', fontSize: '15px'}} code={true}>
                                    provider: {user.provider}</Text>}
                        </Col>
                    </Row>
                </Col>
                <Col span={2}>
                    {!state.isEmailVerified &&
                        <Tooltip title={`verify: ${user?.emails[0]?.value}`} placement={'bottomRight'}>
                            <Button loading={state.emailVerificationLoading} style={{color: '#fca103', borderColor: '#fca103'}} icon={<MailOutlined/>}
                                    block={true} onClick={sendVerificationMail}/>
                        </Tooltip>}
                    {state.isEmailVerified &&
                        <Tooltip title={`verified: ${user.emails[0].value}`} placement={'bottomRight'}>
                            <Button loading={state.emailVerificationLoading} style={{color: '#73d13d', borderColor: '#73d13d'}} icon={<MailOutlined/>}
                                    block={true} onClick={sendVerificationMail}/>
                        </Tooltip>}
                </Col>
                <Col span={2}>
                    <Tooltip title={`Logout`} placement={'bottomRight'}>
                        <Button style={{color: '#f5222d', borderColor: '#f5222d'}} icon={<LogoutOutlined/>} block={true} onClick={logout}/>
                    </Tooltip>
                </Col>
            </Row>
        </div>
    );
};

export default OAuthUserDetails;