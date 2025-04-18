import React from "react";
import { View, Text } from "react-native";

const RecentActivities = () => {
    return (
        <View style={{ marginTop: 20 }}>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "#333",
                }}
            >
                Recent Activities
            </Text>
            {[...Array(10)].map((_, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: 10,
                        padding: 15,
                        marginBottom: 10,
                        elevation: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#555",
                        }}
                    >
                        Activity #{index + 1}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#777",
                            marginTop: 5,
                        }}
                    >
                        This is a description of activity #{index + 1}.
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default RecentActivities;
