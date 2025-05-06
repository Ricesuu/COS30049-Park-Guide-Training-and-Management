import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from "react-native";
import { fetchData } from "../../../src/api/api"; // Import fetchData utility
import { API_URL } from "../../../src/constants/constants"; // Import API_URL
import { auth } from "../../../lib/Firebase"; // Import Firebase auth

const ParkGuideApproval = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Function to fetch pending park guide users
    const fetchApplicants = async (isRefreshing = false) => {
        try {
            console.log("Fetching pending park guide users...");
            // Fetch all users
            const usersResponse = await fetchData("/users");

            // Filter for park guide users with pending status
            const pendingUsers = usersResponse.filter(
                (user) =>
                    user.role === "park_guide" &&
                    user.status.toLowerCase() === "pending"
            );

            console.log(
                `Found ${pendingUsers.length} pending park guide users`
            );
            setApplicants(pendingUsers);
        } catch (error) {
            console.error("Error fetching park guide approvals:", error);
        } finally {
            setLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    };

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchApplicants(true);
    };

    // Fetch applicants when the component mounts
    useEffect(() => {
        fetchApplicants();
    }, []);

    // Helper function to get current user token
    const getAuthToken = async () => {
        if (!auth.currentUser) {
            throw new Error("No authenticated user");
        }
        return await auth.currentUser.getIdToken(true);
    };

    const handleApprove = async (uid) => {
        try {
            // Get fresh token from Firebase
            const token = await getAuthToken();

            console.log(
                `Sending approval request for user ${uid} to ${API_URL}/api/users/${uid}`
            );
            const response = await fetch(`${API_URL}/api/users/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: "approved",
                    assigned_park: "Unassigned", // Default park assignment
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server response:", errorData);
                throw new Error("Failed to approve the park guide user");
            }

            const result = await response.json();
            console.log("Success:", result);

            // Remove the approved user from the list
            setApplicants((prev) =>
                prev.filter((applicant) => applicant.uid !== uid)
            );
        } catch (error) {
            console.error("Error approving park guide user:", error);
        }
    };

    const handleReject = async (uid) => {
        try {
            // Get fresh token from Firebase
            const token = await getAuthToken();

            console.log(
                `Sending rejection request for user ${uid} to ${API_URL}/api/users/${uid}`
            );
            const response = await fetch(`${API_URL}/api/users/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "rejected" }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server response:", errorData);
                throw new Error("Failed to reject the park guide user");
            }

            const result = await response.json();
            console.log("Success:", result);

            // Remove the rejected user from the list
            setApplicants((prev) =>
                prev.filter((applicant) => applicant.uid !== uid)
            );
        } catch (error) {
            console.error("Error rejecting park guide user:", error);
        }
    };

    // Render each applicant
    const renderApplicant = ({ item }) => (
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
                        Role: <Text className="font-medium">Park Guide</Text>
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Status:{" "}
                        <Text className="font-medium">{item.status}</Text>
                    </Text>
                </View>
            </View>
            <View className="flex-row justify-end space-x-2 gap-x-2">
                <TouchableOpacity
                    className="bg-red-100 px-4 py-2 rounded-lg"
                    onPress={() => handleReject(item.uid)}
                >
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-100 px-4 py-2 rounded-lg"
                    onPress={() => handleApprove(item.uid)}
                >
                    <Text className="text-green-600 font-semibold">
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
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
                Pending Park Guide Approvals
            </Text>
            {loading ? (
                <Text className="text-center text-gray-500 mt-5">
                    Loading...
                </Text>
            ) : (
                <FlatList
                    data={applicants}
                    keyExtractor={(item) => item.uid}
                    renderItem={renderApplicant}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-5">
                            No pending approvals.
                        </Text>
                    }
                    contentContainerStyle={{
                        paddingBottom: 140,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#4CAF50"]} // Android
                            tintColor="#4CAF50" // iOS
                        />
                    }
                />
            )}
        </View>
    );
};

export default ParkGuideApproval;
