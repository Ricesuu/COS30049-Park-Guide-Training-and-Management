// components/PGdashboard/Identification/ImageCapture.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ImageCapture = ({
    image,
    takePicture,
    uploadImage,
    identifyOrchid,
    resetIdentification,
    loading,
}) => {
    return (
        <>
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>
                            No image selected
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takePicture}
                    disabled={loading}
                >
                    <MaterialIcons name="camera-alt" size={24} color="white" />
                    <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={uploadImage}
                    disabled={loading}
                >
                    <MaterialIcons name="file-upload" size={24} color="white" />
                    <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        !image && styles.disabledButton,
                    ]}
                    onPress={identifyOrchid}
                    disabled={!image || loading}
                >
                    <MaterialIcons name="search" size={24} color="white" />
                    <Text style={styles.buttonText}>Identify</Text>
                </TouchableOpacity>

                {image && (
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetIdentification}
                        disabled={loading}
                    >
                        <MaterialIcons name="refresh" size={24} color="white" />
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    placeholderContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
    },
    placeholderText: {
        color: "#9ca3af",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 0.48,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 6,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 0.48,
    },
    resetButton: {
        backgroundColor: "#ef4444",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 0.48,
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default ImageCapture;
