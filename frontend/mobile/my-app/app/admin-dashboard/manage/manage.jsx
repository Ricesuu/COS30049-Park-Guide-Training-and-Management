import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
    TextInput,
    TouchableOpacity,
    LogBox,
} from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
import { Picker } from "@react-native-picker/picker";
import ParkGuideCard from "../../../components/ADMINdashboard/AdminDashboardManage/ParkGuideCard";
import AddGuideButton from "../../../components/ADMINdashboard/AdminDashboardManage/GuideButtons";
import { fetchData } from "../../../src/api/api"; // Import fetchData utility
import { API_URL } from "../../../src/constants/constants"; // Import API_URL

const Manage = () => {
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [parks, setParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name"); // Helper function to convert certification_status to display status
    const getStatusFromCertification = (
        certificationStatus,
        hasRequestedPark
    ) => {
        if (!certificationStatus) return "Training";

        switch (certificationStatus.toLowerCase()) {
            case "certified":
                return "Active";
            case "suspended":
                return "Suspended";
            case "rejected":
                return "Rejected";
            case "pending_review":
                return "Ready for Certification";
            case "pending":
                return hasRequestedPark ? "Pending Approval" : "Training";
            default:
                return "Training";
        }
    }; // Function to fetch park guide data with user details
    const fetchGuides = async (isRefreshing = false) => {
        try {
            console.log("Fetching all park guides...");
            const parkGuidesResponse = await fetchData(
                "/park-guides" // Changed to fetch all guides
            );

            // Make sure we have a valid response
            if (!parkGuidesResponse || !Array.isArray(parkGuidesResponse)) {
                console.error("Invalid response format:", parkGuidesResponse);
                throw new Error("Invalid response format from server");
            } // First fetch park names for any guides with assigned parks
            const uniqueParkIds = [
                ...new Set(
                    parkGuidesResponse
                        .map((guide) => guide.assigned_park)
                        .filter(
                            (parkId) =>
                                parkId &&
                                parkId !== "Unassigned" &&
                                parkId !== "null"
                        )
                ),
            ];

            const parkNames = {};
            for (const parkId of uniqueParkIds) {
                try {
                    const parkResponse = await fetch(
                        `${API_URL}/api/parks/${parkId}`
                    );
                    if (parkResponse.ok) {
                        const parkData = await parkResponse.json();
                        parkNames[parkId] = parkData.park_name;
                    }
                } catch (err) {
                    console.error(
                        `Error fetching park name for ID ${parkId}:`,
                        err
                    );
                }
            }

            const guidesWithUserInfo = parkGuidesResponse.map((guide) => {
                const status = getStatusFromCertification(
                    guide.certification_status,
                    guide.requested_park_name
                );

                // Get park name from our fetched parks or use the ID if name not found
                const parkName = guide.assigned_park
                    ? parkNames[guide.assigned_park] || guide.assigned_park
                    : "";

                return {
                    id: guide.guide_id.toString(),
                    name: `${guide.first_name || "Unknown"} ${
                        guide.last_name || "User"
                    }`,
                    role: "Park Guide",
                    status: status,
                    certification_status:
                        guide.certification_status || "not applicable",
                    license_expiry_date: guide.license_expiry_date,
                    user_id: guide.user_id,
                    guide_id: guide.guide_id,
                    email: guide.email || "unknown@example.com",
                    park: parkName,
                    user_status: guide.user_status,
                };
            });

            setGuides(guidesWithUserInfo);
            setFilteredGuides(guidesWithUserInfo);
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

    // Function to fetch parks
    const fetchParks = async () => {
        try {
            console.log("Fetching parks...");
            const parksResponse = await fetchData("/parks");
            setParks(parksResponse);
        } catch (err) {
            console.error("Error fetching parks data:", err);
            setError("Failed to load parks data. Please try again later.");
        }
    };

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchGuides(true);
        fetchParks();
    };

    // Filter guides based on selected park, status, and search query
    const filterGuides = () => {
        let filtered = guides;
        if (selectedPark !== "all") {
            filtered = filtered.filter((guide) => guide.park === selectedPark);
        }

        if (searchQuery) {
            filtered = filtered.filter((guide) =>
                guide.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredGuides(filtered);
    };

    // Fetch guides and parks when the component mounts
    useEffect(() => {
        fetchGuides();
        fetchParks();
    }, []);

    useEffect(() => {
        filterGuides();
    }, [selectedPark, searchQuery]);
    const handleDelete = async (id) => {
        try {
            console.log(`Deleting guide with ID ${id}`);
            const response = await fetch(`${API_URL}/api/park-guides/${id}`, {
                method: "DELETE",
                headers: {},
            });

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
                console.warn("Could not parse response as JSON:", e);
            }

            // Update local state
            setGuides((prev) => prev.filter((guide) => guide.id !== id));

            filterGuides();

            Alert.alert("Success", "Guide has been successfully deleted");
        } catch (error) {
            console.error("Delete operation failed:", error);
            Alert.alert("Error", "Failed to delete guide. Please try again.");
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
                Park Guide Manager
            </Text>{" "}
            {/* Filters Row */}
            <View style={{ flexDirection: "row", padding: 10 }}>
                {/* Park Filter */}
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Picker
                        selectedValue={selectedPark}
                        onValueChange={(itemValue) => {
                            setSelectedPark(itemValue);
                            filterGuides();
                        }}
                    >
                        <Picker.Item label="All Parks" value="all" />
                        {parks.map((park) => (
                            <Picker.Item
                                key={park.park_id}
                                label={park.park_name}
                                value={park.park_name}
                            />
                        ))}
                    </Picker>{" "}
                </View>
            </View>
            {/* Search Bar */}
            <View style={{ padding: 10 }}>
                <TextInput
                    placeholder="Search by guide name"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        filterGuides();
                    }}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 5,
                        padding: 10,
                    }}
                />
            </View>
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
            ) : filteredGuides.length === 0 ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <Text style={{ textAlign: "center" }}>
                        No guides found matching your filters.
                    </Text>
                </View>
            ) : (
                /* List of Park Guides */
                <FlatList
                    data={filteredGuides}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ParkGuideCard guide={item} onDelete={handleDelete} />
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
        </View>
    );
};

export default Manage;
