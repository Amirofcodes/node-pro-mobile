import * as SecureStore from 'expo-secure-store';
import api, { setAuthToken } from './api';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

const storeToken = async (token) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
};

const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token } = response.data;
    await storeToken(token);
    setAuthToken(token);
    return true;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    return false;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('/auth/register', { username, password });
    console.log('Register response:', response.status, response.data);
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    return false;
  }
};

export const logout = async () => {
  await removeToken();
  setAuthToken(null);
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

export { getToken };