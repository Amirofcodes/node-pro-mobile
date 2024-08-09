import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const PriceGuessingGameScreen = () => {
  const [article, setArticle] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    loadRandomArticle();
  }, []);

  const loadRandomArticle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const articlesJson = await AsyncStorage.getItem('articles');
      if (articlesJson) {
        const articles = JSON.parse(articlesJson);
        if (articles.length > 0) {
          const randomIndex = Math.floor(Math.random() * articles.length);
          setArticle(articles[randomIndex]);
        } else {
          setError('No articles available. Please add some articles first.');
        }
      } else {
        setError('No articles available. Please add some articles first.');
      }
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitGuess = () => {
    if (!userGuess || isNaN(userGuess)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for your guess.');
      return;
    }

    const guessedPrice = parseFloat(userGuess);
    const actualPrice = parseFloat(article.prix);
    const difference = Math.abs(actualPrice - guessedPrice);
    const percentageDifference = (difference / actualPrice) * 100;

    let message;
    let points = 0;

    if (percentageDifference === 0) {
      message = "Perfect guess! You win the item!";
      points = 100;
    } else if (percentageDifference <= 5) {
      message = "Very close! You get 50 points!";
      points = 50;
    } else if (percentageDifference <= 10) {
      message = "Close guess! You get 25 points!";
      points = 25;
    } else if (percentageDifference <= 20) {
      message = "Not bad! You get 10 points!";
      points = 10;
    } else {
      message = "Better luck next time!";
    }

    Alert.alert(
      'Result',
      `Your guess: €${guessedPrice.toFixed(2)}\nActual price: €${actualPrice.toFixed(2)}\n${message}\nPoints earned: ${points}`,
      [{ text: 'Play Again', onPress: loadRandomArticle }]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRandomArticle}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Guess the Price!</Text>
      {article && (
        <View>
          <Image
            source={{ uri: `${api.defaults.baseURL}/articles/${article._id}/image` }}
            style={styles.image}
          />
          <Text style={[styles.articleName, { color: theme.colors.text }]}>{article.nom}</Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {article.description}
          </Text>
          <View style={styles.guessContainer}>
            <Text style={[styles.euroSymbol, { color: theme.colors.text }]}>€</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Enter your guess"
              placeholderTextColor={theme.colors.text + '80'}
              keyboardType="numeric"
              value={userGuess}
              onChangeText={setUserGuess}
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmitGuess}
          >
            <Text style={styles.submitButtonText}>Submit Guess</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  articleName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  guessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  euroSymbol: {
    fontSize: 24,
    marginRight: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PriceGuessingGameScreen;