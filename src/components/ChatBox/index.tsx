import { FormEvent, useContext, useState } from 'react';
import { VscArrowLeft } from 'react-icons/vsc';
import { FiSend } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';

import styles from './styles.module.scss';
import { Message } from '../Message';

export function ChatBox() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('/messages', {
      chat_id: '',
      message
    });

    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <div className={styles.header}>
        <button className={styles.backButton}>
          <VscArrowLeft />
        </button>

        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.login} />
        </div>
        <p className={styles.userName}>
          {user?.name ? user.name : user?.login}
        </p>
      </div>

      <div className={styles.messages}>
        <Message text="Fala mano" owner={true} />
        <Message text="Beleza?" owner={true} />
        <Message text="Salve" owner={false} />
        <Message text="Tudo tranquilo, e você?" owner={false} />
        <Message text="Fala mano" owner={true} />
        <Message text="Beleza?" owner={true} />
        <Message text="Salve" owner={false} />
        <Message text="Tudo tranquilo, e você?" owner={false} />
        <Message text="Fala mano" owner={true} />
        <Message text="Beleza?" owner={true} />
        <Message text="Salve" owner={false} />
        <Message text="Tudo tranquilo, e você?" owner={false} />
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