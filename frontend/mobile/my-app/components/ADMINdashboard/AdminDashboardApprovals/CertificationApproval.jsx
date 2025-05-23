import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { fetchData } from "../../../src/api/api";
import { API_URL } from "../../../src/constants/constants";
import { auth } from "../../../lib/Firebase";

const CertificationApproval = () => {
    const [pendingCertifications, setPendingCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPendingCertifications = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            const response = await fetchData(
                "/guide-training-progress/pending-certifications"
            );
            setPendingCertifications(response || []);
        } catch (error) {
            console.error("Error fetching pending certifications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPendingCertifications(true);
    };

    useEffect(() => {
        fetchPendingCertifications();
    }, []);

    const handleApprove = async (guideId) => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(
                `${API_URL}/api/certifications/${guideId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        certification_status: "certified",
                        update_guide_status: true,
                    }),
                }
            );

            if (response.ok) {
                fetchPendingCertifications();
            } else {
                console.error("Failed to approve certification");
            }
        } catch (error) {
            console.error("Error approving certification:", error);
        }
    };

    const renderCertification = ({ item }) => (
        <View className="bg-white p-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">
                        {item.first_name} {item.last_name}
                    </Text>
                    <Text className="text-gray-500 text-xs">{item.email}</Text>
                </View>
                <View>
                    <Text className="text-sm text-gray-600">
                        Completed Modules: {item.completed_modules}
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Training Status: {item.training_status}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                className="bg-green-100 px-4 py-2 rounded-lg"
                onPress={() => handleApprove(item.guide_id)}
            >
                <Text className="text-green-600 font-semibold">Certify</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "#F5F5F5" }}>
            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 10,
                    shadowColor: "#000",
                    elevation: 10,
                }}
            >
                Pending Certifications
            </Text>
            {loading ? (
                <Text className="text-center text-gray-500 mt-5">
                    Loading...
                </Text>
            ) : (
                <FlatList
                    data={pendingCertifications}
                    keyExtractor={(item) => item.guide_id.toString()}
                    renderItem={renderCertification}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-5">
                            No pending certifications.
                        </Text>
                    }
                    contentContainerStyle={{
                        paddingBottom: 140,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#4CAF50"]}
                            tintColor="#4CAF50"
                        />
                    }
                />
            )}
        </View>
    );
};

export default CertificationApproval;
