import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import api from '../services/api';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
      setError('Failed to fetch article details. Please try again.');
    } finally {
      setIsLoading(false);
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
        { text: "Delete", onPress: () => handleDelete(), style: "destructive" }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.m,
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    infoContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.s,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: theme.colors.notification,
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: 'center',
      marginTop: theme.spacing.m,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchArticleDetails}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {article.image && (
          <Image
            source={{ uri: `${api.defaults.baseURL}/articles/${article._id}/image` }}
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{article.nom}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Code:</Text>
            <Text style={styles.infoValue}>{article.codeArticle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price:</Text>
            <Text style={styles.infoValue}>{article.prix}€</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity:</Text>
            <Text style={styles.infoValue}>{article.quantite}</Text>
          </View>
        </View>
        <Text style={styles.description}>{article.description || 'No description available.'}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditArticle', { articleId: article._id })}
        >
          <Text style={styles.buttonText}>Edit Article</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>Delete Article</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ArticleDetailScreen;