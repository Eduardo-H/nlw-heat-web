import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { VscArrowLeft } from 'react-icons/vsc';
import { FiSend } from 'react-icons/fi';
import { api } from '../../services/api';
import io from 'socket.io-client';

import { AuthContext } from '../../contexts/auth';
import { Message } from '../Message';
import { Message as MessageProps, MessageContext } from '../../contexts/message';

import styles from './styles.module.scss';

export function ChatBox() {
  const { user } = useContext(AuthContext);
  const {
    openChat,
    privateMessages,
    updatePrivateMessages,
    closeChatBox
  } = useContext(MessageContext);

  const [message, setMessage] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const contact = openChat?.users[0].id === user?.id ? openChat?.users[1] : openChat?.users[0];

  function scrollDown() {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('/chat/messages', {
      id: openChat?.id,
      text: message
    });

    setMessage('');
  }

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on(`new_private_message_${openChat?.id}`, (newMessage: MessageProps) => {
      updatePrivateMessages(newMessage);

      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });

    scrollDown()
  }, []);

  return (
    <div className={styles.sendMessageFormWrapper}>
      <div className={styles.header}>
        <button onClick={closeChatBox} className={styles.backButton}>
          <VscArrowLeft />
        </button>

        <div className={styles.userImage}>
          <img src={contact?.avatar_url} alt={contact?.login} />
        </div>
        <p className={styles.userName}>
          {contact?.name ? contact?.name : contact?.login}
        </p>
      </div>

      <div ref={messagesRef} className={styles.messages}>
        {
          privateMessages?.map(message => (
            <Message
              key={message.id}
              text={message.text}
              owner={message.user_id === user?.id}
            />
          ))
        }
      </div>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <input
          name="message"
          id="message"
          placeholder="Digite uma mensagem"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />

        <button type="submit">
          <FiSend />
        </button>
      </form>
    </div>
  )
}