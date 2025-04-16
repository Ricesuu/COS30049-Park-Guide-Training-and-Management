import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

const MonitoringCard = ({ type, value, onPress }) => {
    const cardWidth = (Dimensions.get("window").width - 30) / 2; // Half the screen width with padding

    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                marginBottom: 10,
                width: cardWidth, // Set width for grid layout
                elevation: 5,
                shadowColor: "#000",
            }}
            onPress={onPress}
        >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                {type}
            </Text>
            <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
                {value}
            </Text>
        </TouchableOpacity>
    );
};

export default MonitoringCard;
