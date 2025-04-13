import React from "react";
import { View, Text } from "react-native";

const IoTMonitoring = () => {
    return (
        <View>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "#333",
                }}
            >
                IoT Monitoring
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 10,
                        padding: 20,
                        flex: 1,
                        marginRight: 10,
                        alignItems: "center",
                        elevation: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        25°C
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            marginTop: 5,
                        }}
                    >
                        Temperature
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 10,
                        padding: 20,
                        flex: 1,
                        marginLeft: 10,
                        alignItems: "center",
                        elevation: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        45%
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            marginTop: 5,
                        }}
                    >
                        Soil Moisture
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default IoTMonitoring;
