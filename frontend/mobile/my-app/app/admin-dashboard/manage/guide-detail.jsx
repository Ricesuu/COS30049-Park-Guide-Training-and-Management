import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchData } from "../../../src/api/api";
import { API_URL } from "../../../src/constants/constants";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const GuideDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [guide, setGuide] = useState(null);
    const [trainingModules, setTrainingModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parkChanged, setParkChanged] = useState(false);
    const [selectedPark, setSelectedPark] = useState("");

    // Fetch guide details and training modules
    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                setLoading(true);

                // Fetch all park guides
                const parkGuidesResponse = await fetchData("/park-guides");
                const currentGuide = parkGuidesResponse.find(
                    (g) => g.guide_id.toString() === id
                );

                if (!currentGuide) {
                    setError("Guide not found");
                    setLoading(false);
                    return;
                }

                // Format guide information
                const guideInfo = {
                    id: currentGuide.guide_id.toString(),
                    name: `${currentGuide.first_name || "Unknown"} ${
                        currentGuide.last_name || "User"
                    }`,
                    role: "Park Guide",
                    status: getStatusFromCertification(
                        currentGuide.certification_status
                    ),
                    certification_status: currentGuide.certification_status,
                    license_expiry_date: currentGuide.license_expiry_date,
                    user_id: currentGuide.user_id,
                    guide_id: currentGuide.guide_id,
                    email: currentGuide.email || "unknown@example.com",
                    park: currentGuide.assigned_park || "",
                    user_status: currentGuide.user_status,
                };

                setGuide(guideInfo);
                setSelectedPark(guideInfo.park);

                // Fetch training modules and progress
                const modules = await fetchData("/training-modules");
                const progress = await fetchData("/guide-training-progress");

                // Filter progress for this specific guide
                const guideProgress = progress.filter(
                    (item) => item.guide_id === currentGuide.guide_id
                );

                // Only include modules that the guide is currently taking or has completed
                const enrolledModules = [];
                if (guideProgress.length > 0) {
                    guideProgress.forEach((progressEntry) => {
                        const moduleDetails = modules.find(
                            (module) =>
                                module.module_id === progressEntry.module_id
                        );
                        if (moduleDetails) {
                            enrolledModules.push({
                                ...moduleDetails,
                                status: progressEntry.status,
                                completion_date: progressEntry.completion_date,
                            });
                        }
                    });
                }

                setTrainingModules(enrolledModules);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching guide details:", err);
                setError(
                    "Failed to load guide details. Please try again later."
                );
                setLoading(false);
            }
        };

        fetchGuideDetails();
    }, [id]);

    // Helper function to convert certification_status to display status
    const getStatusFromCertification = (certificationStatus) => {
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
            default:
                return "Training";
        }
    };

    // Function to get appropriate color for status
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "text-green-600";
            case "in progress":
                return "text-blue-600";
            case "failed":
                return "text-red-600";
            default:
                return "text-gray-400";
        }
    };

    // Handle saving park assignment changes
    const handleSave = async () => {
        if (!parkChanged || !guide) return;

        try {
            // Use the endpoint for park assignment
            const payload = {
                park: selectedPark || null,
            };

            const response = await fetch(
                `${API_URL}/api/park-guides/assign/${guide.guide_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                console.error("Error updating park assignment:", responseData);
                return;
            }

            // Update local state
            setGuide({
                ...guide,
                park: selectedPark,
            });

            setParkChanged(false);
            alert("Park assignment updated successfully");
        } catch (err) {
            console.error("Error updating park assignment:", err);
            alert("Failed to update park assignment");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="rgb(22 163 74)" />
                    <Text className="mt-4 text-gray-600">
                        Loading guide details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-500 text-lg">{error}</Text>
                    <TouchableOpacity
                        className="mt-4 bg-gray-200 px-4 py-2 rounded"
                        onPress={() => router.back()}
                    >
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!guide) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg">Guide not found</Text>
                    <TouchableOpacity
                        className="mt-4 bg-gray-200 px-4 py-2 rounded"
                        onPress={() => router.back()}
                    >
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View className="bg-green-600 py-4 px-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-2"
                >
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">
                    Guide Details
                </Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Basic Information Card */}
                <View className="bg-white rounded-lg shadow p-4 mb-5">
                    <Text className="text-xl font-bold mb-4">{guide.name}</Text>

                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">Email:</Text>
                        <Text className="text-gray-700">{guide.email}</Text>
                    </View>

                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">Role:</Text>
                        <Text className="text-gray-700">{guide.role}</Text>
                    </View>

                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">Status:</Text>
                        <Text
                            className={`${
                                guide.status === "Active"
                                    ? "text-green-600"
                                    : guide.status === "Training"
                                    ? "text-blue-600"
                                    : "text-red-600"
                            }`}
                        >
                            {guide.status}
                        </Text>
                    </View>

                    {/* Only show license expiry for guides who are not in training */}
                    {guide.status !== "Training" &&
                        guide.license_expiry_date && (
                            <View className="flex-row mb-2">
                                <Text className="font-semibold w-1/3">
                                    License Expiry:
                                </Text>
                                <Text className="text-gray-700">
                                    {new Date(
                                        guide.license_expiry_date
                                    ).toLocaleDateString()}
                                </Text>
                            </View>
                        )}

                    {/* Only show park assignment for guides who are not in training */}
                    {guide.status !== "Training" && (
                        <View className="flex-row mb-2">
                            <Text className="font-semibold w-1/3">
                                Park Assignment:
                            </Text>
                            <View className="flex-1">
                                <TouchableOpacity
                                    className="border border-gray-300 rounded px-3 py-2"
                                    onPress={() => {
                                        // You could implement a park selection modal/dropdown here
                                        // For now, we'll just use a simple prompt
                                        const newPark = prompt(
                                            "Enter park name:",
                                            selectedPark
                                        );
                                        if (
                                            newPark !== null &&
                                            newPark !== selectedPark
                                        ) {
                                            setSelectedPark(newPark);
                                            setParkChanged(true);
                                        }
                                    }}
                                >
                                    <Text>
                                        {selectedPark || "Not assigned"}
                                    </Text>
                                </TouchableOpacity>

                                {parkChanged && (
                                    <TouchableOpacity
                                        className="mt-2 bg-green-600 rounded px-3 py-2"
                                        onPress={handleSave}
                                    >
                                        <Text className="text-white text-center">
                                            Save Changes
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                {/* Training Modules Section */}
                <View className="bg-white rounded-lg shadow p-4 mb-5">
                    <Text className="text-lg font-bold mb-4">
                        Training Modules
                    </Text>

                    {trainingModules.length === 0 ? (
                        <Text className="text-gray-500 italic text-center py-4">
                            No training modules taken
                        </Text>
                    ) : (
                        trainingModules.map((module) => (
                            <View
                                key={module.module_id}
                                className="border-b border-gray-200 pb-3 mb-3"
                            >
                                <Text className="font-bold text-lg">
                                    {module.module_name}
                                </Text>
                                <Text className="text-gray-700 mb-1">
                                    {module.description}
                                </Text>
                                <Text className="text-gray-600 text-sm mb-1">
                                    Duration: {module.duration || "N/A"} minutes
                                </Text>
                                <Text className="text-sm mb-1">
                                    {module.is_required
                                        ? "Required"
                                        : "Optional"}{" "}
                                    module
                                </Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text
                                        className={`${getStatusColor(
                                            module.status
                                        )} font-medium`}
                                    >
                                        Status: {module.status || "Not started"}
                                    </Text>
                                    {module.completion_date && (
                                        <Text className="text-gray-600 text-sm">
                                            Completed:{" "}
                                            {new Date(
                                                module.completion_date
                                            ).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-evenly mb-32">
                    {guide.status !== "Training" && (
                        <TouchableOpacity
                            className={`${
                                guide.status === "Active"
                                    ? "bg-red-100"
                                    : "bg-green-100"
                            } px-8 py-3 rounded-lg`}
                            onPress={() => {
                                // You would implement the suspend/activate functionality here
                                alert(
                                    `${
                                        guide.status === "Active"
                                            ? "Suspend"
                                            : "Activate"
                                    } functionality would be triggered here`
                                );
                            }}
                        >
                            <Text
                                className={`${
                                    guide.status === "Active"
                                        ? "text-red-600"
                                        : "text-green-600"
                                } font-semibold text-center`}
                            >
                                {guide.status === "Active"
                                    ? "Suspend"
                                    : "Activate"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {guide.status === "Training" &&
                        guide.certification_status === "pending_review" && (
                            <TouchableOpacity
                                className="bg-green-100 px-8 py-3 rounded-lg"
                                onPress={() => {
                                    // Implement certify functionality
                                    alert(
                                        "Certify functionality would be triggered here"
                                    );
                                }}
                            >
                                <Text className="text-green-600 font-semibold text-center">
                                    Certify
                                </Text>
                            </TouchableOpacity>
                        )}

                    <TouchableOpacity
                        className="bg-red-600 px-8 py-3 rounded-lg"
                        onPress={() => {
                            // Implement delete functionality
                            alert(
                                "Delete functionality would be triggered here"
                            );
                        }}
                    >
                        <Text className="text-white font-semibold text-center">
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GuideDetail;
