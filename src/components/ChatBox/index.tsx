import { FormEvent, useContext, useState } from 'react';
import { VscArrowLeft } from 'react-icons/vsc';
import { FiSend } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';

import styles from './styles.module.scss';
import { Message } from '../Message';
import { MessageContext } from '../../contexts/message';

export function ChatBox() {
  const [message, setMessage] = useState('');

  const { user } = useContext(AuthContext);
  const { openChat, closeChatBox } = useContext(MessageContext);

  const contact = openChat?.users[0].id === user?.id ? openChat?.users[1] : openChat?.users[0];

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('/chat/messages', {
      chat_id: openChat?.id,
      message
    });

    setMessage('');
  }

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

      <div className={styles.messages}>
        {
          openChat?.messages.map(message => (
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