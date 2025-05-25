import React, { useState } from "react";
import { Alert, LogBox } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { View, ActivityIndicator } from "react-native";
import * as FileSystem from 'expo-file-system';
import IdentificationContainer from "../../components/PGdashboard/Identification/IdentificationContainer";
import ImageCapture from "../../components/PGdashboard/Identification/ImageCapture";
import ResultDisplay from "../../components/PGdashboard/Identification/ResultDisplay";
import CameraComponent from "../../components/PGdashboard/Identification/PlantCamera";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const API_URL = "http://192.168.239.1:3000/api/plantmodel";

const Identification = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [identificationResult, setIdentificationResult] = useState(null);
    const [usePlantCamera, setUsePlantCamera] = useState(false);
    const [model, setModel] = useState('mbn'); // Default model set to 'mbn'
    const [identificationResults, setIdentificationResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const requestCameraPermission = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Camera and media library access are required."
            );
            return false;
        }
        return true;
    };

    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;
        setUsePlantCamera(true);
    };

    const uploadImage = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setIdentificationResult(null);
        }
    };

    const convertImageToBase64 = async (uri) => {
        try {
            return await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
        } catch (error) {
            console.error("Error converting image to base64:", error);
            throw error;
        }
    };

    const identifyOrchid = async () => {
        if (!image) {
            Alert.alert("No Image", "Please take or upload an image first.");
            return;
        }

        setLoading(true);

        try {
            const base64Image = await convertImageToBase64(image);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    model: model // Using the model state
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.predictions?.length > 0) {
                const topResults = data.predictions.slice(0, 3).map((result) => ({
                    name: result.info?.common_name || result.label,
                    scientificName: result.label,
                    confidence: result.probability,
                    description: result.info?.description || "No description available",
                    local_name: result.info?.local_name,
                    habitat: result.info?.habitat,
                    conservation_status: result.info?.conservation_status,
                }));
                setIdentificationResults(topResults);
                setSelectedIndex(0);
            } else {
                Alert.alert("No Results", "Could not identify the plant.");
            }

        } catch (error) {
            console.error("Error identifying orchid:", error);
            Alert.alert("Error", "Failed to identify the orchid. Please try again.");
        } finally {
            setLoading(false);
        }
    };

        const resetIdentification = () => {
            setImage(null);
            setIdentificationResults([]);
            setSelectedIndex(0);
        };


    const onPlantCameraPhotoTaken = (photoUri) => {
        setImage(photoUri);
        setUsePlantCamera(false);
        setIdentificationResult(null);
    };

    const switchModel = () => {
        setModel(prev => {
            if (prev === 'mbn') return 'rn';
            if (prev === 'rn') return 'vit';
            return 'mbn';
        });
    };

    return (
        <IdentificationContainer fullscreen={usePlantCamera}>
            {!usePlantCamera ? (
                <>
                    <ImageCapture
                        image={image}
                        takePicture={takePicture}
                        uploadImage={uploadImage}
                        identifyOrchid={identifyOrchid}
                        resetIdentification={resetIdentification}
                        loading={loading}
                        model={model}
                        switchModel={switchModel}
                    />
                <ResultDisplay
                    loading={loading}
                    identificationResults={identificationResults}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                />

                </>
            ) : (
                <CameraComponent
                    onPhotoTaken={onPlantCameraPhotoTaken}
                    onCancel={() => setUsePlantCamera(false)}
                />
            )}
        </IdentificationContainer>
    );
};

export default Identification;