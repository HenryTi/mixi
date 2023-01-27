import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { MyUqAppView } from './app'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <MyUqAppView />
        </BrowserRouter>
    </React.StrictMode>,
)
