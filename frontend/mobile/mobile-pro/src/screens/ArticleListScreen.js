import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import api from '../services/api';

const ArticleListScreen = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/articles');
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = debounce(async (query) => {
    // First, perform local filtering
    const localFiltered = articles.filter(article =>
      article.nom.toLowerCase().includes(query.toLowerCase()) ||
      article.codeArticle.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(localFiltered);

    // If the query looks like it could be a complete article code, perform API search
    if (query.length >= 3) {
      try {
        setIsLoading(true);
        const response = await api.get(`/articles/search/${query}`);
        const apiResults = Array.isArray(response.data) ? response.data : [response.data];
        
        // Merge API results with local results, removing duplicates
        const mergedResults = [...new Set([...apiResults, ...localFiltered])];
        setFilteredArticles(mergedResults);
      } catch (error) {
        console.error('Error searching articles:', error);
        // Don't set an error message here, as we still have local results
      } finally {
        setIsLoading(false);
      }
    }
  }, 300);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredArticles(articles);
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or code..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.trim() !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={() => handleSearchChange('')}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Text style={styles.createButtonText}>Create New Article</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyListText}>No articles found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
  },
  clearButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ArticleListScreen;