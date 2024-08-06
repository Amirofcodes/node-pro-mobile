import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { logout } from '../services/authManager';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NODE-PRO Mobile</Text>
      <Button
        title="View Articles"
        onPress={() => navigation.navigate('ArticleList')}
      />
      <Button
        title="Create New Article"
        onPress={() => navigation.navigate('CreateArticle')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;