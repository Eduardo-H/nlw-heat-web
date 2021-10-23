import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

import { api } from '../../services/api';

import logoImg from '../../assets/logo.svg';

import styles from './styles.module.scss';
import { ChatRequest } from '../ChatRequest';
import { MessageContext } from '../../contexts/message';

export type User = {
  id?: string;
  name: string | undefined;
  login: string;
  avatar_url: string;
}

type Message = {
  id: string;
  text: string;
  user_id: string;
  user: User
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    isMessageBoxOpen,
    openMessageBox,
    setUserMessage
  } = useContext(MessageContext);

  function handleImageClick(user_id: string, user: User) {
    setUserMessage({
      id: user_id,
      name: user.name,
      login: user.login,
      avatar_url: user.avatar_url
    });

    openMessageBox();
  }

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ]);

        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    async function getMessages() {
      const { data } = await api.get<Message[]>('/messages/last-3');
      setMessages(data);
    }

    getMessages();
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {
          messages.map(message => (
            <motion.li
              key={message.id}
              initial={{ x: -70 }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
              className={styles.message}
            >
              <p className={styles.messageContent}>{message.text}</p>

              <div className={styles.messageUser}>
                <div onClick={() => handleImageClick(message.user_id, message.user)} className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.login} />
                </div>
                <span>
                  {message.user.name ? message.user.name : message.user.login}
                </span>
              </div>
            </motion.li>
          ))
        }
      </ul>

      {isMessageBoxOpen && <ChatRequest />}
    </div>
  );
}