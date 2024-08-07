import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CreateArticleScreen = ({ navigation }) => {
  const [nom, setNom] = useState('');
  const [codeArticle, setCodeArticle] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    if (!nom.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!codeArticle.trim()) {
      Alert.alert('Error', 'Article Code is required');
      return false;
    }
    if (!prix.trim() || isNaN(parseFloat(prix))) {
      Alert.alert('Error', 'Price must be a valid number');
      return false;
    }
    if (!quantite.trim() || isNaN(parseInt(quantite))) {
      Alert.alert('Error', 'Quantity must be a valid integer');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
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

      const response = await api.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Article created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating article:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

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

      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Create Article" onPress={handleSubmit} disabled={isLoading} />
      {isLoading && <Text style={styles.loadingText}>Creating article...</Text>}
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
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CreateArticleScreen;