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
  user: User;
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
  privateMessages: Message[];
  openMessageBox: () => void;
  closeMessageBox: () => void;
  closeChatBox: () => void;
  setUserMessage: (user: User) => void;
  updatePrivateMessages: (newMessage: Message) => void;
  fetchPrivateChat: (user_id: string, contact_id: string) => void;
}

export const MessageContext = createContext({} as MessageContextData);

type MessageProvider = {
  children: ReactNode;
}

export function MessageProvider(props: MessageProvider) {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [userMessageBox, setUserMessageBox] = useState<User | null>(null);
  const [openChat, setOpenChat] = useState<Chat | null>(null);
  const [privateMessages, setPrivateMessages] = useState<Message[]>([] as Message[]);

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

  function updatePrivateMessages(newMessage: Message) {
    setPrivateMessages(prevState => [
      ...prevState,
      newMessage
    ]);
  }

  async function fetchPrivateChat(user_id: string, contact_id: string) {
    const { data } = await api.post<Chat>('/chat', {
      user_id,
      contact_id
    });

    setOpenChat(data);
    setPrivateMessages(data.messages);
    setIsChatBoxOpen(true);
  }

  return (
    <MessageContext.Provider value={{
      isMessageBoxOpen,
      isChatBoxOpen,
      userMessageBox,
      openChat,
      privateMessages,
      updatePrivateMessages,
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