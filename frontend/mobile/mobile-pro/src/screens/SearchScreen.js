import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter an article code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/articles/search/${searchQuery}`);
      navigation.navigate('ArticleDetail', { articleId: response.data._id });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Not Found', 'No article found with the given code');
      } else {
        console.error('Error searching article:', error);
        Alert.alert('Error', 'An error occurred while searching. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Search Articles</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Enter article code"
          placeholderTextColor={theme.colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="search" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.helperText, { color: theme.colors.text }]}>
        Enter the article code to search for a specific article.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  helperText: {
    fontSize: 14,
  },
});

export default SearchScreen;