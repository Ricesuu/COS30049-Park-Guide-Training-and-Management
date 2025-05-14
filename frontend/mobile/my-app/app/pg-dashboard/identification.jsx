import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

const Identification = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [identificationResult, setIdentificationResult] = useState(null);

  const requestCameraPermission = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log("Camera Permission:", cameraStatus);
    console.log("Media Library Permission:", mediaLibraryStatus);

    if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
      Alert.alert("Permission Denied", "Camera and media library access are required.");
      return false;
    }

    setCameraPermission(true);
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Media library access is required.");
      return false;
    }
    return true;
  };

  const takePicture = async () => {
    console.log("Take Picture button pressed");
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log("Camera permission not granted");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Camera result:", result);

    if (!result.canceled) {
      setImage(result.uri || result.assets?.[0]?.uri);
      setIdentificationResult(null);
      console.log("Image URI:", result.uri || result.assets?.[0]?.uri);
    } else {
      console.log("Camera action canceled");
    }
  };

  const uploadImage = async () => {
    console.log("Upload Image button pressed");
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      console.log("Media library permission not granted");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result);

    if (!result.canceled) {
      setImage(result.uri || result.assets?.[0]?.uri);
      setIdentificationResult(null);
      console.log("Image URI:", result.uri || result.assets?.[0]?.uri);
    } else {
      console.log("Image picker action canceled");
    }
  };

  const identifyOrchid = async () => {
    if (!image) {
      Alert.alert("No Image", "Please take or upload an image first.");
      console.log("No image selected");
      return;
    }

    console.log("Identifying orchid for image:", image);
    setLoading(true);

    try {
      // This is a mock identification - in a real app, this would call an API
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock result - would be replaced by actual API response
      const mockResult = {
        name: "Phalaenopsis Orchid",
        scientificName: "Phalaenopsis sp.",
        confidence: 0.92,
        description: "Also known as the Moth Orchid, this is one of the most popular orchids.",
        careInstructions: "Keep in bright, indirect light. Water when the growing medium is dry.",
      };
      
      setIdentificationResult(mockResult);
      console.log("Identification result:", mockResult);
    } catch (error) {
      console.error("Error identifying orchid:", error);
      Alert.alert("Error", "Failed to identify the orchid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetIdentification = () => {
    setImage(null);
    setIdentificationResult(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.title}>Orchid Identification</Text>
          
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={uploadImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

          {image && !identificationResult && (
            <TouchableOpacity 
              style={[styles.identifyButton, loading && styles.disabledButton]} 
              onPress={identifyOrchid}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.identifyButtonText}>Identify Orchid</Text>
              )}
            </TouchableOpacity>
          )}

          {identificationResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>{identificationResult.name}</Text>
              <Text style={styles.resultSubtitle}>{identificationResult.scientificName}</Text>
              <Text style={styles.resultConfidence}>
                Confidence: {(identificationResult.confidence * 100).toFixed(1)}%
              </Text>
              <Text style={styles.resultDescription}>{identificationResult.description}</Text>
              <Text style={styles.resultCare}>Care: {identificationResult.careInstructions}</Text>
              
              <TouchableOpacity style={styles.newSearchButton} onPress={resetIdentification}>
                <Text style={styles.newSearchButtonText}>New Identification</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -5,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(22, 163, 74)",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgb(22, 163, 74)",
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  identifyButton: {
    backgroundColor: "#f0ad4e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  identifyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  resultContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "rgb(22, 163, 74)",
    marginBottom: 5,
  },
  resultSubtitle: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  resultConfidence: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  resultCare: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  newSearchButton: {
    backgroundColor: "rgb(22, 163, 74)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  newSearchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default Identification;
