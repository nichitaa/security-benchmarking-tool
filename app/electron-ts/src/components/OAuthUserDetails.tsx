import React, {useContext} from 'react';
import {Avatar, Button, Col, Collapse, Row, Typography} from 'antd';
import {logoutAction} from '../context/reducer';
import {AppContext} from '../context/context';
import ReactJson from 'react-json-view';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';

const {Text} = Typography;
const {Panel} = Collapse;

const OAuthUserDetails = () => {
    const {state, dispatch} = useContext(AppContext);
    const {user} = state;

    const logout = () => {
        dispatch(logoutAction());
    };

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

                    <Collapse bordered={false}>
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
                                displayObjectSize={true}
                                enableClipboard={true}
                                indentWidth={6}
                                collapseStringsAfterLength={50}
                                collapsed={1}
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
                <Col span={4}>
                    <Button icon={<LogoutOutlined/>} block={true} onClick={logout}>Logout</Button>
                </Col>
            </Row>
        </div>
    );
};

export default OAuthUserDetails;