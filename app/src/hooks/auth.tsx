import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSessions from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const client_id = '6c0f40ca92eeae32eb71';
const scope = 'read:user';
const user_storage = '@nlwheat:user';
const token_storage = '@nlwheat:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthResponse = {
  user: User;
  token: string;
};

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIisSigningIn] = useState(false);

  async function signIn() {
    try {
      setIisSigningIn(true);

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}`;
      // prettier-ignore
      const authSessionResponse = await AuthSessions.startAsync({
      authUrl
    }) as AuthorizationResponse;

      if (
        authSessionResponse.type === 'success' &&
        authSessionResponse.params.error !== 'aces_denied'
      ) {
        const authResponse = await api.post('/authenticate', {
          code: authSessionResponse.params.code
        });
        const { user, token } = authResponse.data as AuthResponse;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await AsyncStorage.setItem(user_storage, JSON.stringify(user));
        await AsyncStorage.setItem(token_storage, token);

        setUser(user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIisSigningIn(false);
    }
  }

  async function signOut() {
    setUser(null);

    await AsyncStorage.removeItem(user_storage);
    await AsyncStorage.removeItem(token_storage);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(user_storage);
      const tokenStorage = await AsyncStorage.getItem(token_storage);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;

        setUser(JSON.parse(userStorage));
      }

      setIisSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isSigningIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
