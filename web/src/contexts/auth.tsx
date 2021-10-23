import { createContext, ReactNode, useEffect, useState } from 'react';

import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl =
    'https://github.com/login/oauth/authorize?scope=user&client_id=4cf6aa409355544fa18d';

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    });

    const { token, user } = response.data;

    localStorage.setItem('@nlwHeat:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@nlwHeat:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@nlwHeat:token');

    if (token) {
      // enviar o token no cabeçalho da requisicao
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      // remover o code da url
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
