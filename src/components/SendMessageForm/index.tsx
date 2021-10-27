import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';

import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      await api.post('/messages', { message });

      toast.success('Mensagem enviada com sucesso!');

      setMessage('');
    } catch (err) {
      toast.error('Não foi possível enviar sua mensagem');
    }
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.login} />
        </div>
        <strong className={styles.userName}>
          {user?.name ? user.name : user?.login}
        </strong>
        <a
          href={`https://github.com/${user?.login}`}
          target="_blank"
          className={styles.userGithub}
        >
          <VscGithubInverted size="16" />
          {user?.login}
        </a>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>

        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />

        <button type="submit">
          Enviar mensagem
        </button>
      </form>
    </div>
  )
}