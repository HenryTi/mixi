import React from 'react'
import ReactDOM from 'react-dom/client'
//import { BrowserRouter } from 'react-router-dom';
//import { MyUqAppView } from './app'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import { ViewUqAppMy } from 'app';
// import { MyUqAppView } from 'test-router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ViewUqAppMy />
    </React.StrictMode>,
)
