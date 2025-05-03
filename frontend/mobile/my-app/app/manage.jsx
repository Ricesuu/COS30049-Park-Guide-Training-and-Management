import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import ParkGuideCard from "../components/AdminDashboardManage/ParkGuideCard";
import AddGuideButton from "../components/AdminDashboardManage/GuideButtons";
import GuideDetailModal from "../components/AdminDashboardManage/GuideDetailModal";
import { fetchData } from "../src/api/api"; // Import fetchData utility
import { API_URL } from "../src/constants/constants"; // Import API_URL

const Manage = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Function to fetch park guide data with user details
    const fetchGuides = async (isRefreshing = false) => {
        try {
            console.log("Fetching certified park guides...");
            const parkGuidesResponse = await fetchData("/park-guides"); // Fetch data from the ParkGuides table

            // Filter guides with certification_status 'certified'
            const certifiedGuides = parkGuidesResponse.filter(
                (guide) =>
                    guide.certification_status &&
                    guide.certification_status.toLowerCase() === "certified"
            );

            // Fetch user details for each certified guide
            const userDetailsPromises = certifiedGuides.map(
                (guide) => fetchData(`/users/${guide.user_id}`) // Fetch user details by user_id
            );

            const userDetails = await Promise.all(userDetailsPromises);

            // Combine park guide and user details and format data structure for UI
            const guidesWithUserInfo = certifiedGuides.map((guide, index) => ({
                id: guide.guide_id.toString(),
                name: `${userDetails[index].first_name} ${userDetails[index].last_name}`,
                role: "Park Guide",
                status:
                    guide.certification_status === "certified"
                        ? "Active"
                        : "Suspended",
                license_expiry_date: guide.license_expiry_date, // Include certification expiry date
                user_id: guide.user_id,
                guide_id: guide.guide_id,
                email: userDetails[index].email,
            }));

            setGuides(guidesWithUserInfo);
            setError(null);
        } catch (err) {
            console.error("Error fetching guides data:", err);
            setError("Failed to load guides data. Please try again later.");
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
        fetchGuides(true);
    };

    // Fetch guides when the component mounts
    useEffect(() => {
        fetchGuides();
    }, []);

    const handleEdit = (guide) => {
        setSelectedGuide(guide);
        setIsModalVisible(true);
    };

    const handleSuspend = async (id) => {
        try {
            const guideToUpdate = guides.find((guide) => guide.id === id);
            if (!guideToUpdate) return;

            const newStatus =
                guideToUpdate.status === "Active" ? "suspended" : "certified";

            // Show confirmation dialog using Alert
            Alert.alert(
                "Confirm Action",
                `Are you sure you want to ${
                    guideToUpdate.status === "Active" ? "suspend" : "activate"
                } this guide?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text:
                            guideToUpdate.status === "Active"
                                ? "Suspend"
                                : "Activate",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                // Update guide status in the API
                                const response = await fetch(
                                    `${API_URL}/api/park-guides/${guideToUpdate.guide_id}`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            certification_status: newStatus,
                                        }),
                                    }
                                );

                                if (!response.ok) {
                                    const errorData = await response.json();
                                    console.error(
                                        "Server response:",
                                        errorData
                                    );
                                    throw new Error(
                                        "Failed to update guide status"
                                    );
                                }

                                const result = await response.json();
                                console.log("Success:", result);

                                // Update local state
                                setGuides((prev) =>
                                    prev.map((guide) =>
                                        guide.id === id
                                            ? {
                                                  ...guide,
                                                  status:
                                                      guide.status === "Active"
                                                          ? "Suspended"
                                                          : "Active",
                                              }
                                            : guide
                                    )
                                );

                                // Show success message
                                Alert.alert(
                                    "Success",
                                    `Guide has been successfully ${
                                        guideToUpdate.status === "Active"
                                            ? "suspended"
                                            : "activated"
                                    }.`
                                );
                            } catch (err) {
                                console.error(
                                    "Error updating guide status:",
                                    err
                                );
                                setError(
                                    "Failed to update guide status. Please try again later."
                                );
                            }
                        },
                    },
                ]
            );
        } catch (err) {
            console.error("Error updating guide status:", err);
            setError("Failed to update guide status. Please try again later.");
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting guide with ID ${id}`);

            Alert.alert(
                "Confirm Delete",
                "Are you sure you want to delete this guide?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const response = await fetch(
                                    `${API_URL}/api/park-guides/${id}`,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            // Only include Content-Type if you were sending a body,
                                            // but DELETE often doesn't. Let's try without it too for a moment.
                                            // If the simple curl works but this doesn't, headers are suspect.
                                            // "Content-Type": "application/json",
                                            // "Accept": "application/json" // Removed for testing
                                        },
                                    }
                                );

                                const responseText = await response.text();
                                console.log("Raw response:", responseText);

                                if (!response.ok) {
                                    throw new Error(
                                        `Delete failed with status ${response.status}: ${responseText}`
                                    );
                                }

                                let result;
                                try {
                                    result = JSON.parse(responseText);
                                } catch (e) {
                                    console.warn(
                                        "Could not parse response as JSON:",
                                        e
                                    );
                                }

                                // Update local state
                                setGuides((prev) =>
                                    prev.filter((guide) => guide.id !== id)
                                );

                                Alert.alert(
                                    "Success",
                                    "Guide has been successfully deleted"
                                );
                            } catch (error) {
                                console.error(
                                    "Delete operation failed:",
                                    error
                                );
                                Alert.alert(
                                    "Error",
                                    "Failed to delete guide. Please try again."
                                );
                            }
                        },
                    },
                ]
            );
        } catch (err) {
            console.error("Error in handleDelete:", err);
            Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
            );
        }
    };

    const handleSave = async (updatedGuide) => {
        try {
            console.log("Saving updated guide:", updatedGuide);

            if (!updatedGuide.guide_id) {
                console.error(
                    "Missing guide_id in updatedGuide:",
                    updatedGuide
                );
                setError("Cannot update guide - missing guide ID");
                return;
            }

            // Use the simplified endpoint just for park assignment
            const payload = {
                park: updatedGuide.park || null,
            };

            console.log(
                `Assigning guide ${updatedGuide.guide_id} to park:`,
                payload.park
            );

            // Use the new endpoint specifically for park assignment
            const response = await fetch(
                `${API_URL}/api/park-guides/assign/${updatedGuide.guide_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseData = await response.json();
            console.log("API response:", responseData);

            if (!response.ok) {
                console.error("Server error response:", responseData);
                throw new Error("Failed to update guide information");
            }

            // Update local state on success
            setGuides((prev) =>
                prev.map((guide) =>
                    guide.id === updatedGuide.id ? updatedGuide : guide
                )
            );
            setIsModalVisible(false);
            console.log("Guide updated successfully");
        } catch (err) {
            console.error("Error updating guide:", err);
            setError("Failed to update guide. Please try again later.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                    backgroundColor: "rgb(22 163 74)",
                }}
            >
                Manage Park Guides
            </Text>

            {/* Loading state */}
            {loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color="rgb(22 163 74)" />
                    <Text style={{ marginTop: 10 }}>Loading guides...</Text>
                </View>
            ) : error ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <Text style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </Text>
                </View>
            ) : guides.length === 0 ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <Text style={{ textAlign: "center" }}>
                        No certified guides found.
                    </Text>
                </View>
            ) : (
                /* List of Park Guides */
                <FlatList
                    data={guides}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ParkGuideCard
                            guide={item}
                            onEdit={handleEdit}
                            onSuspend={handleSuspend}
                            onDelete={handleDelete}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["rgb(22 163 74)"]} // Android
                            tintColor="rgb(22 163 74)" // iOS
                        />
                    }
                    contentContainerStyle={{ padding: 10 }}
                    ListFooterComponent={
                        <View style={{ marginTop: 10, marginBottom: 100 }}>
                            <AddGuideButton
                                onPress={() => console.log("Add new guide")}
                            />
                        </View>
                    }
                />
            )}

            {/* Guide Detail Modal */}
            {isModalVisible && (
                <GuideDetailModal
                    guide={selectedGuide}
                    onClose={() => setIsModalVisible(false)}
                    onSave={handleSave}
                />
            )}
        </View>
    );
};

export default Manage;
