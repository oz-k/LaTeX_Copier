import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './components/popup/Popup';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
