import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const ArticleListScreen = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    fetchArticles();
  }, []);

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

  const performSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() === '') {
        setFilteredArticles(articles);
        return;
      }

      const localFiltered = articles.filter(article =>
        article.nom.toLowerCase().includes(query.toLowerCase()) ||
        article.codeArticle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(localFiltered);

      if (query.length >= 3) {
        try {
          setIsLoading(true);
          const response = await api.get(`/articles/search/${query}`);
          const apiResults = Array.isArray(response.data) ? response.data : [response.data];
          const mergedResults = [...new Set([...apiResults, ...localFiltered])];
          setFilteredArticles(mergedResults);
        } catch (error) {
          console.error('Error searching articles:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300),
    [articles]
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    performSearch(text);
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item._id })}
    >
      {item.image ? (
        <Image
          source={{ uri: `${api.defaults.baseURL}/articles/${item._id}/image` }}
          style={styles.articleImage}
        />
      ) : (
        <View style={[styles.articleImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={24} color={theme.colors.text} />
        </View>
      )}
      <View style={styles.articleInfo}>
        <Text style={styles.articleTitle}>{item.nom}</Text>
        <Text style={styles.articleCode}>Code: {item.codeArticle}</Text>
        <Text style={styles.articlePrice}>Price: {item.prix}€</Text>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: theme.spacing.m,
      color: theme.colors.text,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 25,
      alignItems: 'center',
      margin: theme.spacing.m,
    },
    createButtonText: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    articleItem: {
      flexDirection: 'row',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    articleImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: theme.spacing.m,
    },
    placeholderImage: {
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    articleInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    articleCode: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    articlePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: theme.spacing.s,
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: 'center',
      marginTop: theme.spacing.m,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or code..."
          placeholderTextColor={theme.colors.text + '80'}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Text style={styles.createButtonText}>Create New Article</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.errorText, { marginTop: 20 }]}>
            {searchQuery ? 'No articles found' : 'No articles available'}
          </Text>
        }
      />
    </View>
  );
};

export default ArticleListScreen;