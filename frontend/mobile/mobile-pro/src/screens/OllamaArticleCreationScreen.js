import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { processOllamaResponse } from "../services/ollamaService";
import api from "../services/api";

const OllamaArticleCreationScreen = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [articleData, setArticleData] = useState({
    name: "",
    code: "",
    description: "",
    price: "0",
    quantity: "0",
  });
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to use this feature."
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        processImageWithOllama(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Error taking picture:", err);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const processImageWithOllama = async (imageUri) => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    try {
      console.log("Starting Ollama image processing...");
      const response = await processOllamaResponse(imageUri);
      console.log("Ollama processing completed:", response);
      if (response) {
        setArticleData({
          name: response.name || "",
          code: response.code || "",
          description: response.description || "",
          price: response.price ? response.price.toString() : "0",
          quantity: response.quantity ? response.quantity.toString() : "0",
        });
      }
    } catch (error) {
      console.error("Error processing image with Ollama:", error);
      setError("Failed to process image. Please try again. Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!articleData.name || !articleData.code) {
      Alert.alert(
        "Error",
        "Please ensure at least name and code are provided."
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", articleData.name);
      formData.append("codeArticle", articleData.code);
      formData.append("description", articleData.description);
      formData.append("prix", articleData.price);
      formData.append("quantite", articleData.quantity);

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("image", {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Article created successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating article:", error);
      Alert.alert("Error", "Failed to create article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setArticleData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Ollama Article Creation
      </Text>

      <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
        <Ionicons name="camera" size={24} color={theme.colors.primary} />
        <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
          Take Picture
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Processing image... This may take several minutes.
          </Text>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Attempt {retryCount + 1} of 3
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => processImageWithOllama(image)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.articleDataContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={articleData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholderTextColor={theme.colors.text + "80"}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>Code</Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={articleData.code}
            onChangeText={(text) => handleInputChange("code", text)}
            placeholderTextColor={theme.colors.text + "80"}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              { color: theme.colors.text },
            ]}
            value={articleData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholderTextColor={theme.colors.text + "80"}
            multiline
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Price
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={articleData.price}
            onChangeText={(text) => handleInputChange("price", text)}
            placeholderTextColor={theme.colors.text + "80"}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Quantity
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={articleData.quantity}
            onChangeText={(text) => handleInputChange("quantity", text)}
            placeholderTextColor={theme.colors.text + "80"}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleCreateArticle}
          >
            <Text style={styles.createButtonText}>Create Article</Text>
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  articleDataContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  createButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default OllamaArticleCreationScreen;