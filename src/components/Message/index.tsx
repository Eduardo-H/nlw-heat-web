import styles from './styles.module.scss';

interface MessageProps {
  text: string;
  owner: boolean;
}

export function Message({ text, owner }: MessageProps) {
  return (
    <div
      className={`
        ${styles.messageWrapper} ${owner ? styles.messageSent : styles.messageReceived}`
      }
    >
      {text}
    </div>
  )
}