import { motion } from 'framer-motion';
import { useContext } from 'react';
import { VscClose } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { MessageContext } from '../../contexts/message';

import styles from './styles.module.scss';

export function ChatRequest() {
  const { user } = useContext(AuthContext);

  const {
    userMessageBox,
    closeMessageBox,
    fetchPrivateChat
  } = useContext(MessageContext);

  const name = userMessageBox?.name ? userMessageBox.name?.split(' ')[0] : userMessageBox?.login;

  function handleOpenChat() {
    if (user && userMessageBox) {
      fetchPrivateChat(user.id, userMessageBox?.id)
    }

    closeMessageBox();
  }

  return (
    <motion.div
      initial={{ y: -300 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      className={styles.chatRequestWrapper}
    >
      <div className={styles.user}>
        <div className={styles.userImage}>
          <img src={userMessageBox?.avatar_url} alt={userMessageBox?.login} />
        </div>
        <span>
          {userMessageBox?.name ? userMessageBox?.name : userMessageBox?.login}
        </span>

        <button onClick={closeMessageBox} className={styles.closeButton}>
          <VscClose size="20" />
        </button>
      </div>

      <p>Você gostaria de iniciar uma conversa privada com {name}?</p>

      <div className={styles.actionButtons}>
        <button onClick={closeMessageBox} className={styles.declineButton}>
          Não
        </button>
        <button onClick={handleOpenChat} className={styles.acceptButton}>
          Sim
        </button>
      </div>
    </motion.div>
  )
}