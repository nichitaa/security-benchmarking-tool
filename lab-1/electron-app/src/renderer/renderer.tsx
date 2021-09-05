import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import {inDev} from '../utils/helpers';

console.log('😁 Loading Renderer [renderer.tsx]...');

render(<App/>, document.getElementById('app'));

// Hot module replacement
if (inDev() && module.hot) module.hot.accept();
