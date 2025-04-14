import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const AlertCard = ({ title, description, onRemove }) => {
    return (
        <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 15,
                marginBottom: 10,
                elevation: 5,
                shadowColor: "#000",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 16,
                        color: "#D32F2F",
                        fontWeight: "bold",
                    }}
                >
                    {title}
                </Text>
                <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>
                    {description}
                </Text>
            </View>
            <Text
                style={{
                    fontSize: 18,
                    color: "#D32F2F",
                    fontWeight: "bold",
                    padding: 5,
                }}
                onPress={onRemove} // Call the onRemove function when pressed
            >
                <FontAwesome name="remove" size={24} color="#D32F2F" />
            </Text>
        </View>
    );
};

export default AlertCard;
