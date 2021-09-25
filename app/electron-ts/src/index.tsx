import React from 'react';
import {render} from 'react-dom';
import 'antd/dist/antd.css';
import App from './App';
import {AppProvider} from "./context/AppProvider";

const app = (
    <AppProvider>
        <App/>
    </AppProvider>
);

render(app, document.getElementById('root'));
