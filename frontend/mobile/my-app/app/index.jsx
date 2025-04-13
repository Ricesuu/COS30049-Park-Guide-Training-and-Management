import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomePage = () => {
    const navigation = useNavigation();

    const [parkGuideCount, setParkGuideCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    const fetchParkGuideApprovals = async () => {
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setParkGuideCount(data.length);
    };

    const fetchTransactionApprovals = async () => {
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setTransactionCount(data.length);
    };

    useEffect(() => {
        fetchParkGuideApprovals();
        fetchTransactionApprovals();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        padding: 20,
                        paddingTop: 50,
                        paddingBottom: 30,
                        backgroundColor: "rgb(22, 163, 74)",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        Admin Dashboard
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "rgb(200, 255, 200)",
                            textAlign: "center",
                            fontStyle: "italic",
                        }}
                    >
                        Welcome back, Admin!
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: "white",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        marginTop: -5,
                        paddingBottom: 120,
                        zIndex: 1,
                        elevation: 10,
                        padding: 20,
                        flex: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            marginBottom: 10,
                            color: "#333",
                        }}
                    >
                        Pending Approvals
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 20,
                        }}
                    >
                        <Pressable
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 10,
                                padding: 20,
                                flex: 1,
                                marginRight: 10,
                                alignItems: "center",
                                elevation: 5,
                            }}
                            onPress={() =>
                                navigation.navigate("approvals", {
                                    initialTab: "parkGuide",
                                })
                            }
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    color: "#333",
                                }}
                            >
                                {parkGuideCount}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#666",
                                    marginTop: 5,
                                }}
                            >
                                Park Guides Left
                            </Text>
                        </Pressable>

                        <Pressable
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 10,
                                padding: 20,
                                flex: 1,
                                marginLeft: 10,
                                alignItems: "center",
                                elevation: 5,
                            }}
                            onPress={() =>
                                navigation.navigate("approvals", {
                                    initialTab: "transaction",
                                })
                            }
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    color: "#333",
                                }}
                            >
                                {transactionCount}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#666",
                                    marginTop: 5,
                                }}
                            >
                                Transactions Left
                            </Text>
                        </Pressable>
                    </View>

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
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginBottom: 20,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 10,
                                padding: 20,
                                flex: 1,
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
                                Good
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#666",
                                    marginTop: 5,
                                }}
                            >
                                Soil Quality
                            </Text>
                        </View>
                    </View>

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
                                    This is a description of activity #
                                    {index + 1}.
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomePage;
