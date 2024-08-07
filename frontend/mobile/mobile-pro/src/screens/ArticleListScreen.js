import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const ArticleListScreen = () => {
  const [articles, setArticles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item._id })}
    >
      <Text style={styles.articleTitle}>{item.nom}</Text>
      <Text>Code: {item.codeArticle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Text style={styles.createButtonText}>Create New Article</Text>
      </TouchableOpacity>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No articles found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  articleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ArticleListScreen;