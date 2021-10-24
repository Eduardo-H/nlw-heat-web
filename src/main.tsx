import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/auth';
import { MessageProvider } from './contexts/message';

import './styles/global.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <MessageProvider>
        <App />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="colored"
          draggable
        />
      </MessageProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
