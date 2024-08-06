import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { getWebSocket } from '../services/websocket';
import config from '../config/config';

const ArticleListScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    setupWebSocket();

    // Refresh articles when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchArticles();
    });

    return unsubscribe;
  }, [navigation]);

  const setupWebSocket = () => {
    const ws = getWebSocket();
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      Alert.alert('Error', 'Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'newArticle':
        setArticles(prevArticles => [data.data, ...prevArticles]);
        break;
      case 'updateArticle':
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article._id === data.data._id ? data.data : article
          )
        );
        break;
      case 'deleteArticle':
        setArticles(prevArticles => 
          prevArticles.filter(article => article._id !== data.data.id)
        );
        break;
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchArticles();
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/articles/search/${searchTerm}`);
      setArticles(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error searching articles:', error);
      Alert.alert('Error', 'Failed to search articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item._id })}
    >
      {item.image && (
        <Image
          source={{ uri: `${config.API_BASE_URL}/articles/${item._id}/image` }}
          style={styles.thumbnail}
        />
      )}
      <View style={styles.articleInfo}>
        <Text style={styles.articleTitle}>{item.nom}</Text>
        <Text>Code: {item.codeArticle}</Text>
        <Text>Price: {item.prix}€</Text>
        <Text>Quantity: {item.quantite}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by code or name"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No articles found</Text>
          }
          refreshing={isLoading}
          onRefresh={fetchArticles}
        />
      )}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ArticleListScreen;