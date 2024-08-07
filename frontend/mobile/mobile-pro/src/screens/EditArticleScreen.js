import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const EditArticleScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [nom, setNom] = useState('');
  const [codeArticle, setCodeArticle] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      const articleData = response.data;
      setArticle(articleData);
      setNom(articleData.nom);
      setCodeArticle(articleData.codeArticle);
      setDescription(articleData.description);
      setPrix(articleData.prix.toString());
      setQuantite(articleData.quantite.toString());
    } catch (error) {
      console.error('Error fetching article details:', error);
      Alert.alert('Error', 'Failed to fetch article details');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('codeArticle', codeArticle);
      formData.append('description', description);
      formData.append('prix', prix);
      formData.append('quantite', quantite);
      
      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await api.put(`/articles/${articleId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Article updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating article:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to update article');
    }
  };

  if (!article) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={nom} onChangeText={setNom} />

      <Text style={styles.label}>Article Code:</Text>
      <TextInput style={styles.input} value={codeArticle} onChangeText={setCodeArticle} />

      <Text style={styles.label}>Description:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Price:</Text>
      <TextInput style={styles.input} value={prix} onChangeText={setPrix} keyboardType="numeric" />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput style={styles.input} value={quantite} onChangeText={setQuantite} keyboardType="numeric" />

      <Button title="Change image" onPress={pickImage} />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : article.image ? (
        <Image source={{ uri: `${api.defaults.baseURL}/articles/${articleId}/image` }} style={styles.image} />
      ) : null}

      <Button title="Update Article" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EditArticleScreen;