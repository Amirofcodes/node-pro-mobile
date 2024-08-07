import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const CreateArticleScreen = () => {
  const [nom, setNom] = useState('');
  const [codeArticle, setCodeArticle] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();
  const theme = useTheme();

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
    if (!nom.trim() || !codeArticle.trim() || !prix.trim() || !quantite.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

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
      console.error('Error creating article:', error);
      Alert.alert('Error', 'Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <Text style={[styles.title, { color: theme.colors.text }]}>Create New Article</Text>
        
        <TextInput
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Name"
          placeholderTextColor={theme.colors.text + '80'}
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Article Code"
          placeholderTextColor={theme.colors.text + '80'}
          value={codeArticle}
          onChangeText={setCodeArticle}
        />
        <TextInput
          style={[styles.input, styles.textArea, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Description"
          placeholderTextColor={theme.colors.text + '80'}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Price"
          placeholderTextColor={theme.colors.text + '80'}
          value={prix}
          onChangeText={setPrix}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
          placeholder="Quantity"
          placeholderTextColor={theme.colors.text + '80'}
          value={quantite}
          onChangeText={setQuantite}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.imageButtonText, { color: theme.colors.primary }]}>Pick an image</Text>
        </TouchableOpacity>
        
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Article</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
    borderRadius: 5,
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
});

export default CreateArticleScreen;