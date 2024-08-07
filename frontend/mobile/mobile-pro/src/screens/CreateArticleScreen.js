import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CreateArticleScreen = ({ navigation }) => {
  const theme = useTheme();
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

      await api.post('/articles', formData, {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      padding: theme.spacing.s,
      marginBottom: theme.spacing.m,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    imageButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    imageButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      marginBottom: theme.spacing.m,
      borderRadius: 5,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: theme.colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Enter article name"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <Text style={styles.label}>Article Code:</Text>
        <TextInput
          style={styles.input}
          value={codeArticle}
          onChangeText={setCodeArticle}
          placeholder="Enter article code"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholder="Enter article description"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={prix}
          onChangeText={setPrix}
          keyboardType="numeric"
          placeholder="Enter price"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          style={styles.input}
          value={quantite}
          onChangeText={setQuantite}
          keyboardType="numeric"
          placeholder="Enter quantity"
          placeholderTextColor={theme.colors.text + '80'}
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Pick an image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Creating...' : 'Create Article'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateArticleScreen;