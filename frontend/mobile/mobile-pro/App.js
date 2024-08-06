import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { connectWebSocket, disconnectWebSocket, isConnected } from './services/websocket';
import { getToken, isAuthenticated } from './services/authManager';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    let wsConnectionInterval;
    if (isAuth && !isConnected()) {
      wsConnectionInterval = setInterval(async () => {
        try {
          const token = await getToken();
          if (token) {
            connectWebSocket(token);
          }
          if (isConnected()) {
            clearInterval(wsConnectionInterval);
          }
        } catch (err) {
          console.error('Error in WebSocket connection:', err);
          setError(err.toString());
        }
      }, 5000);
    }
    return () => {
      if (wsConnectionInterval) {
        clearInterval(wsConnectionInterval);
      }
    };
  }, [isAuth]);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
      if (authStatus) {
        const token = await getToken();
        if (token) {
          connectWebSocket(token);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setError(error.toString());
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    disconnectWebSocket();
  };

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>An error occurred:</Text>
          <Text>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator
        isAuthenticated={isAuth}
        setIsAuthenticated={setIsAuth}
        onLogout={handleLogout}
      />
    </SafeAreaProvider>
  );
}