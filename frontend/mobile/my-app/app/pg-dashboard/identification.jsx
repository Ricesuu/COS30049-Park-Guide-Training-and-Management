import React, { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

// Import Components
import IdentificationContainer from "../../components/PGdashboard/Identification/IdentificationContainer";
import ImageCapture from "../../components/PGdashboard/Identification/ImageCapture";
import ResultDisplay from "../../components/PGdashboard/Identification/ResultDisplay";

const Identification = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [identificationResult, setIdentificationResult] = useState(null);

    const requestCameraPermission = async () => {
        const { status: cameraStatus } =
            await Camera.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        console.log("Camera Permission:", cameraStatus);
        console.log("Media Library Permission:", mediaLibraryStatus);

        if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Camera and media library access are required."
            );
            return false;
        }

        setCameraPermission(true);
        return true;
    };

    const requestMediaLibraryPermission = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Media library access is required."
            );
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
                description:
                    "Also known as the Moth Orchid, this is one of the most popular orchids.",
                careInstructions:
                    "Keep in bright, indirect light. Water when the growing medium is dry.",
            };

            setIdentificationResult(mockResult);
            console.log("Identification result:", mockResult);
        } catch (error) {
            console.error("Error identifying orchid:", error);
            Alert.alert(
                "Error",
                "Failed to identify the orchid. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetIdentification = () => {
        setImage(null);
        setIdentificationResult(null);
    };

    return (
        <IdentificationContainer>
            <ImageCapture
                image={image}
                takePicture={takePicture}
                uploadImage={uploadImage}
                identifyOrchid={identifyOrchid}
                resetIdentification={resetIdentification}
                loading={loading}
            />
            <ResultDisplay
                loading={loading}
                identificationResult={identificationResult}
            />
        </IdentificationContainer>
    );
};

export default Identification;
