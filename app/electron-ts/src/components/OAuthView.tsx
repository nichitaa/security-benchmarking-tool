import React from 'react';
import {Button, Row, Typography} from 'antd';
import {GithubOutlined, GoogleOutlined, TwitterOutlined} from '@ant-design/icons';

const {Title} = Typography;

const OAuthView = () => {
    const oauthLogin = (provider: 'google' | 'github' | 'twitter') => {
        window.open(`http://localhost:8080/api/auth/${provider}`, '_self');
    };
    return (
        <div className={'login-container'}>
            <Row style={{textAlign: 'center', justifyContent: 'center'}}>
                <Title
                    style={{display: 'inline-block', color: '#645790', marginBottom: '30px'}}
                    level={4}>
                    <code>Login to SB-Tool</code>
                </Title>
            </Row>
            <Row>
                <Button block={true} icon={<GoogleOutlined/>} onClick={() => oauthLogin('google')}>Google</Button>
            </Row>
            <Row>
                <Button block={true} icon={<GithubOutlined/>} onClick={() => oauthLogin('github')}>Github</Button>
            </Row>
            <Row>
                <Button block={true} icon={<TwitterOutlined/>} onClick={() => oauthLogin('twitter')}>Twitter</Button>
            </Row>
        </div>
    );
};

export default OAuthView;