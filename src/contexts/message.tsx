import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/api';

export type User = {
  id: string;
  name: string | undefined;
  login: string;
  avatar_url: string;
}

export type Message = {
  id: string;
  text: string;
  user_id: string;
  user: User
}

type Chat = {
  id: string;
  messages: Message[];
  users: User[];
}

type MessageContextData = {
  isMessageBoxOpen: boolean;
  isChatBoxOpen: boolean;
  userMessageBox: User | null;
  openChat: Chat | null;
  openMessageBox: () => void;
  closeMessageBox: () => void;
  closeChatBox: () => void;
  setUserMessage: (user: User) => void;
  fetchPrivateChat: (user_id: string, contact_id: string) => void;
}

export const MessageContext = createContext({} as MessageContextData);

type MessageProvider = {
  children: ReactNode;
}

export function MessageProvider(props: MessageProvider) {
  const [userMessageBox, setUserMessageBox] = useState<User | null>(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [openChat, setOpenChat] = useState<Chat | null>(null);

  function openMessageBox() {
    setIsMessageBoxOpen(true);
  }

  function closeMessageBox() {
    setIsMessageBoxOpen(false);
  }

  function closeChatBox() {
    setIsChatBoxOpen(false);
  }

  function setUserMessage(user: User) {
    setUserMessageBox(user);
  }

  async function fetchPrivateChat(user_id: string, contact_id: string) {
    const { data } = await api.post<Chat>('/chat', {
      user_id,
      contact_id
    });

    setOpenChat(data);
    setIsChatBoxOpen(true);
  }

  return (
    <MessageContext.Provider value={{
      isMessageBoxOpen,
      isChatBoxOpen,
      userMessageBox,
      openChat,
      openMessageBox,
      closeMessageBox,
      closeChatBox,
      setUserMessage,
      fetchPrivateChat
    }}>
      {props.children}
    </MessageContext.Provider>
  )
}