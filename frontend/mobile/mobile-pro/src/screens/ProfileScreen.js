import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { logout } from '../services/authManager';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 15,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    infoText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 10,
    },
    logoutButton: {
      backgroundColor: theme.colors.notification,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 30,
    },
    logoutButtonText: {
      color: theme.colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color={theme.colors.white} />
        </View>
        <Text style={styles.username}>User Profile</Text>
      </View>

      <Text style={styles.sectionTitle}>Account Information</Text>
      <View style={styles.infoItem}>
        <Ionicons name="person-outline" size={24} color={theme.colors.text} />
        <Text style={styles.infoText}>Username: John Doe</Text>
      </View>
      <View style={styles.infoItem}>
        <Ionicons name="mail-outline" size={24} color={theme.colors.text} />
        <Text style={styles.infoText}>Email: john.doe@example.com</Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>App Information</Text>
      <View style={styles.infoItem}>
        <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
        <Text style={styles.infoText}>Version: 1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;