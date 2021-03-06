import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  name: string | undefined;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInURL: string;
  signOut: () => void;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string | undefined;
    login: string;
  }
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);
  const signInURL = import.meta.env.VITE_SIGN_IN_URL as string;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('/authenticate', {
      code: githubCode,
      type: 'web'
    });

    const { token, user } = response.data;

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    localStorage.setItem('@dowhile:token', token);

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    async function getProfile() {
      const token = localStorage.getItem('@dowhile:token');

      if (token) {
        api.defaults.headers.common.authorization = `Bearer ${token}`;

        const { data } = await api.get<User>('/profile');

        setUser(data);
      }
    }

    getProfile();
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInURL, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}