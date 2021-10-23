import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { AuthProvider } from './contexts/auth';
import { MessageProvider } from './contexts/message';

import './styles/global.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
