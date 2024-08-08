import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/AppNavigator';
import { connectWebSocket, disconnectWebSocket } from './src/services/websocket';
import { getToken, isAuthenticated } from './src/services/authManager';
import NetInfo from '@react-native-community/netinfo';
import { useDarkMode } from './src/hooks/useDarkMode';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode, theme } = useDarkMode();

  useEffect(() => {
    checkAuthStatus();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && isAuth) {
        attemptWebSocketConnection();
      }
    });

    return () => {
      unsubscribe();
      disconnectWebSocket();
    };
  }, [isAuth]);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
      if (authStatus) {
        attemptWebSocketConnection();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setError(error.toString());
    }
  };

  const attemptWebSocketConnection = async () => {
    try {
      const token = await getToken();
      if (token) {
        connectWebSocket(token);
      }
    } catch (err) {
      console.error('Error in WebSocket connection:', err);
      setError(err.toString());
    }
  };

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <Text style={{ color: theme.colors.text }}>An error occurred:</Text>
          <Text style={{ color: theme.colors.text }}>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}