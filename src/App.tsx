import { useContext } from 'react';

import { AuthContext } from './contexts/auth';
import { MessageContext } from './contexts/message';

import { LoginBox } from './components/LoginBox';
import { ChatBox } from './components/ChatBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';

import styles from './App.module.scss';


export function App() {
  const { user } = useContext(AuthContext);
  const { isChatBoxOpen } = useContext(MessageContext);

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      {!!user ?
        isChatBoxOpen ? <ChatBox /> : <SendMessageForm />
        : <LoginBox />
      }
    </main>
  );
}