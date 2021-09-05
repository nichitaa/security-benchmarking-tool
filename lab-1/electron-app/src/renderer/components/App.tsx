import React, {useState} from 'react';
import {hot} from 'react-hot-loader';
import {Divider, Input, Table, Typography, Button} from 'antd';
const {Title} = Typography;
import {UploadFile} from './app-components/UploadFile'

import './App.less';


const App: React.FC = () => {
    console.log('😊 Loading React components [App.tsx]...');

    const [products, setProducts] = useState([]);
    const [msg, setMsg] = useState('');

    const productsColumns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'name',
        },
        {
            title: 'ProductNumber',
            dataIndex: 'ProductNumber',
            key: 'productNumber',
        },
    ];

    const sendNotification = () => {
        window.electron.notificationApi.sendNotification(msg);
    };

    const getProducts = async () => {
        const dbResult = await window.electron.dbApi.getProducts();
        setProducts(products => dbResult);
    };

    return (
        <>
            <div id="container">
                <Title
                    level={4}
                    style={{color: 'beige'}}>Electron - React - TS - SQL Server</Title>
            </div>
            <div id="container">
                <UploadFile/>
                <Button
                    type="primary"
                    style={{width: '100%'}}
                    onClick={getProducts}>getProducts()</Button>
                {products.length !== 0
                && <>
                    <Divider/>
                    <Table
                        rowKey={obj => obj.Name}
                        dataSource={products}
                        columns={productsColumns}
                        pagination={false}
                    />
                </>}
                <Divider/>
                <Button
                    type="dashed"
                    style={{width: '100%'}}
                    onClick={sendNotification}>sendNotification()</Button>
                <Divider/>
                <Button
                    type="dashed"
                    danger
                    style={{width: '100%'}}
                    onClick={() => setProducts([])}>clearProducts()</Button>
                <Divider/>
                <Input
                    value={msg}
                    onChange={(e) => {
                        setMsg(msg => e.target.value);
                    }}
                    placeholder={'message for your Notification'}
                />
            </div>
        </>
    );
};

export default hot(module)(App);
