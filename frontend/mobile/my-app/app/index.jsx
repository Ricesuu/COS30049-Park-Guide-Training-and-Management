import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomePage = () => {
    const navigation = useNavigation();

    const [parkGuideCount, setParkGuideCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    // Function to fetch Park Guide Approvals
    const fetchParkGuideApprovals = async () => {
        // Simulate fetching data (replace with API call if needed)
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setParkGuideCount(data.length);
    };

    // Function to fetch Transaction Approvals
    const fetchTransactionApprovals = async () => {
        // Simulate fetching data (replace with API call if needed)
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setTransactionCount(data.length);
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchParkGuideApprovals();
        fetchTransactionApprovals();
    }, []);

    return (
        <View className="bg-green-600 flex-1">
            {/* Admin Dashboard Header */}
            <View className="p-5 pt-12 pb-10 rounded-b-3xl">
                <Text className="text-3xl font-black text-white text-center tracking-wider drop-shadow-md">
                    Admin Dashboard
                </Text>
                <Text className="text-base text-green-100 text-center italic mt-1">
                    Welcome back, Admin!
                </Text>
            </View>

            {/* Dashboard Section */}
            <View
                className="bg-white pt-10 p-7 flex-1"
                style={{
                    elevation: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}
            >
                {/* Approvals Section */}
                <Text className="text-2xl font-bold mb-3 text-gray-700">
                    Pending Approvals
                </Text>
                <View className="flex-row justify-between mb-5 gap-2">
                    {/* Pending Park Guide Approvals Section */}
                    <Pressable
                        className="mb-5 bg-gray-200 rounded-lg p-7 flex-1 flex-column items-center justify-between"
                        onPress={() =>
                            navigation.navigate("approvals", {
                                initialTab: "parkGuide",
                            })
                        }
                    >
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "900",
                                textAlign: "center",
                                color: "#333",
                            }}
                        >
                            {parkGuideCount}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                textAlign: "center",
                                marginTop: 8,
                                color: "#666",
                            }}
                        >
                            Park Guides Left
                        </Text>
                    </Pressable>

                    {/* Pending Transaction Approvals Section */}
                    <Pressable
                        className="mb-5 bg-gray-200 rounded-lg p-7 flex-1 flex-column items-center justify-between"
                        onPress={() =>
                            navigation.navigate("approvals", {
                                initialTab: "transaction",
                            })
                        }
                    >
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: "900",
                                textAlign: "center",
                                color: "#333",
                            }}
                        >
                            {transactionCount}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                textAlign: "center",
                                marginTop: 8,
                                color: "#666",
                            }}
                        >
                            Transactions Left
                        </Text>
                    </Pressable>
                </View>

                {/* IoT Monitoring Section */}
                <Text className="text-2xl font-bold mb-3 text-gray-700">
                    IoT Monitoring
                </Text>
                <View className="flex-row justify-between mb-2 gap-2">
                    {/* Temperature */}
                    <View className="bg-gray-200 rounded-lg p-5 flex-1 items-center">
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: "#333",
                            }}
                        >
                            Temperature
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                marginTop: 8,
                                color: "#666",
                            }}
                        >
                            22°C
                        </Text>
                    </View>

                    {/* Humidity */}
                    <View className="bg-gray-200 rounded-lg p-5 flex-1 items-center">
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: "#333",
                            }}
                        >
                            Humidity
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                marginTop: 8,
                                color: "#666",
                            }}
                        >
                            45%
                        </Text>
                    </View>
                </View>

                {/* Soil Quality */}
                <View
                    className="flex-row justify-between gap-2"
                    style={{ marginBottom: 35 }}
                >
                    <View className="bg-gray-200 rounded-lg p-5 flex-1 items-center">
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: "#333",
                            }}
                        >
                            Soil Quality
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                marginTop: 8,
                                color: "#666",
                            }}
                        >
                            Good
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HomePage;
