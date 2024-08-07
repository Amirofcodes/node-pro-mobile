import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import api from '../services/api';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
      Alert.alert('Error', 'Failed to fetch article details');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/articles/${articleId}`);
      Alert.alert('Success', 'Article deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting article:', error);
      Alert.alert('Error', 'Failed to delete article');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleDelete() }
      ]
    );
  };

  if (!article) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{article.nom}</Text>
      {article.image && (
        <Image
          source={{ uri: `${api.defaults.baseURL}/articles/${article._id}/image` }}
          style={styles.image}
        />
      )}
      <Text>Code: {article.codeArticle}</Text>
      <Text>Description: {article.description}</Text>
      <Text>Price: {article.prix}€</Text>
      <Text>Quantity: {article.quantite}</Text>
      <Button
        title="Edit Article"
        onPress={() => navigation.navigate('EditArticle', { articleId: article._id })}
      />
      <Button
        title="Delete Article"
        onPress={confirmDelete}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default ArticleDetailScreen;