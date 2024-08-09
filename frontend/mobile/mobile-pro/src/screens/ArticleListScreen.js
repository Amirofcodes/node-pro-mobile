import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

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
      // Store articles in AsyncStorage
      await AsyncStorage.setItem('articles', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.nom.toLowerCase().includes(query.toLowerCase()) ||
          article.codeArticle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() =>
        navigation.navigate('ArticleDetail', { articleId: item._id })
      }
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
        <Text style={[styles.articleTitle, { color: theme.colors.text }]}>
          {item.nom}
        </Text>
        <Text style={[styles.articleCode, { color: theme.colors.text }]}>
          Code: {item.codeArticle}
        </Text>
        <Text style={[styles.articlePrice, { color: theme.colors.primary }]}>
          Price: {item.prix}€
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Search by name or code..."
          placeholderTextColor={theme.colors.text + '80'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Text style={styles.createButtonText}>Create New Article</Text>
      </TouchableOpacity>
      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {searchQuery ? 'No articles found' : 'No articles available'}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  articleItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: '#ccc',
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
    marginBottom: 4,
  },
  articleCode: {
    fontSize: 14,
    marginBottom: 4,
  },
  articlePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    fontSize: 16,
  },
});

export default ArticleListScreen;