import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

import { api } from '../../services/api';

import logoImg from '../../assets/logo.svg';

import styles from './styles.module.scss';
import { ChatRequest } from '../ChatRequest';
import { Chat, Message, MessageContext } from '../../contexts/message';
import { AuthContext } from '../../contexts/auth';
import { VscComment } from 'react-icons/vsc';

export type User = {
  id: string;
  name: string | undefined;
  login: string;
  avatar_url: string;
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>();
  const [isChatListOpen, setIsChatListOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const {
    isMessageBoxOpen,
    openMessageBox,
    closeMessageBox,
    setUserMessage,
    getChatById
  } = useContext(MessageContext);

  function handleImageClick(selectedUser: User) {
    if (user?.id !== selectedUser.id) {
      if (isMessageBoxOpen) {
        closeMessageBox();
      }

      setUserMessage(selectedUser);
      openMessageBox();
    }
  }

  async function getChats() {
    const reponse = await api.get<Chat[]>('/chats/all');

    setChats(reponse.data);
    setIsChatListOpen(!isChatListOpen);
  }

  function handleOpenChat(id: string) {
    getChatById(id);
    setIsChatListOpen(false);
  }

  function updateMessages(prevState: Message[]) {
    if (prevState.length > 2) {
      return [
        messagesQueue[0],
        prevState[0],
        prevState[1]
      ];
    } else {
      return [messagesQueue[0], ...prevState];
    }
  }

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => updateMessages(prevState));

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
      <div className={styles.header}>
        <img src={logoImg} alt="DoWhile 2021" />

        {
          user && (
            <div>
              <button onClick={getChats}>
                <VscComment />
                Mensagens privadas
              </button>

              {
                isChatListOpen && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className={styles.chatList}
                  >
                    {
                      chats && chats.length > 0
                        ? chats?.map(chat => (
                          <button key={chat.id} onClick={() => handleOpenChat(chat.id)}>
                            <div className={styles.userImage}>
                              <img src={chat.users[0].avatar_url} alt={chat.users[0].login} />
                            </div>

                            <div className={styles.chatInfo}>
                              <p>
                                {chat.users[0].name ? chat.users[0].name : chat.users[0].login}
                              </p>
                              <span>
                                {chat.messages[0].text}
                              </span>
                            </div>
                          </button>
                        ))
                        : (
                          <p className={styles.noChats}>
                            Você não possui nenhuma conversa
                          </p>
                        )
                    }
                  </motion.div>
                )
              }
            </div>
          )
        }
      </div>

      <ul className={styles.messageList}>
        {
          messages.map(message => (
            <motion.li
              key={message.id}
              initial={{ x: -70, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={styles.message}
            >
              <p className={styles.messageContent}>{message.text}</p>

              <div className={styles.messageUser}>
                <div onClick={() => handleImageClick(message.user)} className={styles.userImage}>
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