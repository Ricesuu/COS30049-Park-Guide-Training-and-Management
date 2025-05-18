// components/PGdashboard/PlantInfo/PlantItem.jsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const PlantItem = ({ plant, onPress }) => {
    return (
        <View style={styles.plantItem}>
            <Image source={plant.image} style={styles.plantImage} />
            <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantDescription}>{plant.description}</Text>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => onPress(plant)}
                >
                    <Text style={styles.infoButtonText}>More Info</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    plantItem: {
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    plantImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    plantDetails: {
        padding: 15,
    },
    plantName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    plantDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
        lineHeight: 20,
    },
    infoButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    infoButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
});

export default PlantItem;
