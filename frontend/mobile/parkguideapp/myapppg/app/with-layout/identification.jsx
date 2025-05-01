import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

const Identification = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);

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
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: "orchid.jpg",
        type: "image/jpeg",
      });

      console.log("FormData:", formData);

      const response = await fetch("https://your-api-endpoint.com/identify", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      console.log("API Response:", data);

      if (response.ok) {
        Alert.alert("Identification Result", `This orchid is: ${data.orchidType}`);
      } else {
        Alert.alert("Error", data.message || "Failed to identify the orchid.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
      Alert.alert("Error", "An error occurred while identifying the orchid.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orchid Identification</Text>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
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

      <TouchableOpacity
        style={[
          styles.identifyButton,
          (!image || loading) && styles.disabledButton, // Disable button when no image or loading
        ]}
        onPress={identifyOrchid}
        disabled={!image || loading} // Disable button when no image or loading
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>Identifying...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Identify Orchid</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Changed to white for consistency
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(22, 163, 74)", // Updated to match the theme
    marginBottom: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  identifyButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgb(22, 163, 74)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Adds shadow for Android
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Identification;
