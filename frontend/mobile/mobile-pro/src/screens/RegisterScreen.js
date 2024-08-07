import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { register } from '../services/authManager';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await register(username, password);
      if (success) {
        Alert.alert(
          'Success',
          'Registration successful. Please log in with your new credentials.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        setError('Registration failed. Please try again with a different username.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 40,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: 'center',
      marginBottom: 15,
    },
    loginLink: {
      marginTop: 20,
      alignItems: 'center',
    },
    loginText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Ionicons name="person-outline" size={24} color={theme.colors.text} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Username"
          placeholderTextColor={theme.colors.text + '80'}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor={theme.colors.text + '80'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.text + '80'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;