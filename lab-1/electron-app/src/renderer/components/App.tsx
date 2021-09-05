import React from 'react';
import {hot} from 'react-hot-loader';
import {Button, Typography} from 'antd';

const {Title} = Typography;
import UploadFile from './app-components/UploadFile';

import './App.less';


const App: React.FC = () => {
    console.log('😊 Loading React components [App.tsx]...');

    const sendNotification = () => {
        window.electron.notificationApi.sendNotification("Notification Message");
    };

    return (
        <>
            <div id="container">
                <Title
                    level={4}
                    style={{color: 'beige'}}>CS - Import audit files</Title>
            </div>
            <div id="container">
                <UploadFile/>
            </div>
        </>
    );
};

export default hot(module)(App);
