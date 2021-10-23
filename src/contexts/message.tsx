import { createContext, ReactNode, useState } from 'react';
import { User } from '../components/MessageList';

type MessageContextData = {
  isMessageBoxOpen: boolean;
  userMessageBox: User | null;
  openMessageBox: () => void;
  closeMessageBox: () => void;
  setUserMessage: (user: User) => void;
}

export const MessageContext = createContext({} as MessageContextData);

type MessageProvider = {
  children: ReactNode;
}

export function MessageProvider(props: MessageProvider) {
  const [userMessageBox, setUserMessageBox] = useState<User | null>(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

  function openMessageBox() {
    setIsMessageBoxOpen(true);
  }

  function closeMessageBox() {
    setIsMessageBoxOpen(false);
  }

  function setUserMessage(user: User) {
    setUserMessageBox(user);
  }

  return (
    <MessageContext.Provider value={{
      isMessageBoxOpen,
      userMessageBox,
      openMessageBox,
      closeMessageBox,
      setUserMessage
    }}>
      {props.children}
    </MessageContext.Provider>
  )
}