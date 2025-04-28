import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from "react-native";
import { fetchData } from "../../src/api/api"; // Import fetchData utility

const ParkGuideApproval = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Function to fetch park guide data with user details
    const fetchApplicants = async (isRefreshing = false) => {
        try {
            console.log("Fetching park guide approvals...");
            const parkGuidesResponse = await fetchData("/park-guides"); // Fetch data from the ParkGuides table

            // Filter guides with certification_status 'pending'
            const pendingGuides = parkGuidesResponse.filter(
                (guide) =>
                    guide.certification_status &&
                    guide.certification_status.toLowerCase() === "pending"
            );

            // Fetch user details for each pending guide
            const userDetailsPromises = pendingGuides.map(
                (guide) => fetchData(`/users/${guide.user_id}`) // Fetch user details by user_id
            );

            const userDetails = await Promise.all(userDetailsPromises);

            // Combine park guide and user details
            const combinedData = pendingGuides.map((guide, index) => ({
                ...guide,
                ...userDetails[index], // Merge user details into the guide object
            }));

            setApplicants(combinedData);
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

    const BASE_URL = "http://192.168.1.110:3000"; // Check if this IP is correct for your backend

    const handleApprove = async (id) => {
        try {
            console.log(
                `Sending approval request for guide ${id} to ${BASE_URL}/api/park-guides/${id}`
            );
            const response = await fetch(`${BASE_URL}/api/park-guides/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ certification_status: "certified" }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server response:", errorData);
                throw new Error("Failed to approve the park guide");
            }

            const result = await response.json();
            console.log("Success:", result);

            // Remove the approved guide from the list
            setApplicants((prev) =>
                prev.filter((applicant) => applicant.guide_id !== id)
            );
        } catch (error) {
            console.error("Error approving park guide:", error);
        }
    };

    const handleReject = (id) => {
        setApplicants((prev) =>
            prev.filter((applicant) => applicant.guide_id !== id)
        );
        // Add API call to reject the applicant here
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
                        Assigned Park:{" "}
                        <Text className="font-medium">
                            {item.assigned_park}
                        </Text>
                    </Text>
                </View>
            </View>
            <View className="flex-row justify-end space-x-2 gap-x-2">
                <TouchableOpacity
                    className="bg-red-100 px-4 py-2 rounded-lg"
                    onPress={() => handleReject(item.guide_id)}
                >
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-100 px-4 py-2 rounded-lg"
                    onPress={() => handleApprove(item.guide_id)}
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
                    keyExtractor={(item) => item.guide_id.toString()}
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
