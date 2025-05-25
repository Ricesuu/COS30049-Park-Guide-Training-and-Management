import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    LogBox,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchData } from "../../../src/api/api";
import axios from "axios";
import { API_URL } from "../../../src/constants/constants";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import AssignedParkCard from "../../../components/ADMINdashboard/AdminDashboardManage/AssignedParkCard";
import CertificationsCard from "../../../components/ADMINdashboard/AdminDashboardManage/CertificationsCard";
import LicenseExpiryWarning from "../../../components/ADMINdashboard/AdminDashboardManage/LicenseExpiryWarning"; // Add this import
import { auth } from "../../../lib/Firebase";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const GuideDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [guide, setGuide] = useState(null);
    const [trainingModules, setTrainingModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parkChanged, setParkChanged] = useState(false);
    const [selectedPark, setSelectedPark] = useState("");
    const [certifications, setCertifications] = useState([]);

    const getStatusFromCertification = (certificationStatus) => {
        if (!certificationStatus) return "Training";
        switch ((certificationStatus || "").toLowerCase()) {
            case "certified":
                return "Active";
            case "suspended":
                return "Suspended";
            case "rejected":
                return "Rejected";
            case "pending_review":
                return "Ready for Certification";
            case "pending":
                return "Training";
            default:
                return "Training";
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return "Invalid date";
        }
    };
    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                setLoading(true);

                // Get authentication token
                const token = await auth.currentUser?.getIdToken();
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const parkGuidesResponse = await fetchData("/park-guides");
                const currentGuide = parkGuidesResponse.find(
                    (g) => g.guide_id.toString() === id
                );

                if (!currentGuide) {
                    setError("Guide not found");
                    setLoading(false);
                    return;
                }

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

                const modules = await fetchData("/training-modules");
                const progress = await fetchData("/guide-training-progress");

                const guideProgress = progress.filter(
                    (item) => item.guide_id === currentGuide.guide_id
                );
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

                // Sort modules by status - in progress first, then completed
                enrolledModules.sort((a, b) => {
                    const getStatusPriority = (status) => {
                        switch (status?.toLowerCase()) {
                            case "in progress":
                                return 1;
                            case "completed":
                                return 2;
                            default:
                                return 3;
                        }
                    };
                    return (
                        getStatusPriority(a.status) -
                        getStatusPriority(b.status)
                    );
                });

                // Sort modules by status - in progress first, then completed
                const sortedModules = enrolledModules.sort((a, b) => {
                    // Helper function to get sort priority
                    const getStatusPriority = (status) => {
                        switch (status?.toLowerCase()) {
                            case "in progress":
                                return 1;
                            case "completed":
                                return 2;
                            default:
                                return 3;
                        }
                    };
                    return (
                        getStatusPriority(a.status) -
                        getStatusPriority(b.status)
                    );
                });

                try {
                    const certificationsUrl = `${API_URL}/api/certifications/user/${currentGuide.guide_id}`;
                    try {
                        const response = await axios.get(certificationsUrl, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setCertifications(response.data || []);
                    } catch (certError) {
                        if (
                            certError.response &&
                            certError.response.status === 404
                        ) {
                            console.log(
                                "No certifications found for this guide - returning empty array"
                            );
                            setCertifications([]);
                        } else {
                            console.warn(
                                "Warning: Error fetching certifications:",
                                certError.message
                            );
                            setCertifications([]);
                        }
                    }
                } catch (error) {
                    console.error("Error in certification fetch block:", error);
                    setCertifications([]);
                }

                setTrainingModules(sortedModules);
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
    }, [id]); // Using the getStatusFromCertification function defined above

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

    const handleSave = async () => {
        if (!parkChanged || !guide) return;

        try {
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

    return loading ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="rgb(22 163 74)" />
                <Text className="mt-4 text-gray-600">
                    Loading Guide Details...
                </Text>
            </View>
        </SafeAreaView>
    ) : error ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 text-lg">
                    {error.charAt(0).toUpperCase() + error.slice(1)}
                </Text>
                <TouchableOpacity
                    className="mt-4 bg-gray-200 px-4 py-2 rounded"
                    onPress={() => router.back()}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ) : !guide ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Guide Not Found</Text>
                <TouchableOpacity
                    className="mt-4 bg-gray-200 px-4 py-2 rounded"
                    onPress={() => router.back()}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ) : !guide.name ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Invalid Guide Data</Text>
                <TouchableOpacity
                    className="mt-4 bg-gray-200 px-4 py-2 rounded"
                    onPress={() => router.back()}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ) : (
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
                <View className="bg-white rounded-lg shadow p-4 mb-5">
                    <Text className="text-xl font-bold mb-4">
                        {guide.name || "Unknown"}
                    </Text>
                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">Email:</Text>
                        <Text className="text-gray-700">
                            {guide.email || "N/A"}
                        </Text>
                    </View>
                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">Role:</Text>
                        <Text className="text-gray-700">
                            {guide.role || "Park Guide"}
                        </Text>
                    </View>
                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">
                            License Status:
                        </Text>
                        <Text
                            className={`${
                                (
                                    guide.certification_status || ""
                                ).toLowerCase() === "certified"
                                    ? "text-green-600"
                                    : (
                                          guide.certification_status || ""
                                      ).toLowerCase() === "pending"
                                    ? "text-blue-600"
                                    : "text-red-600"
                            }`}
                        >
                            {guide.certification_status
                                ? guide.certification_status
                                      .charAt(0)
                                      .toUpperCase() +
                                  guide.certification_status.slice(1)
                                : "Pending"}
                        </Text>
                    </View>
                    <View className="flex-row mb-2">
                        <Text className="font-semibold w-1/3">
                            License Expiry:
                        </Text>{" "}
                        <Text className="text-gray-700">
                            {formatDate(guide.license_expiry_date)}
                        </Text>
                    </View>
                </View>{" "}
                {guide.license_expiry_date && (
                    <LicenseExpiryWarning
                        guideId={guide.guide_id}
                        expiryDate={guide.license_expiry_date}
                        guideName={guide.name}
                    />
                )}
                <AssignedParkCard guide={guide} />
                <CertificationsCard certifications={certifications} />
                <View className="bg-white rounded-lg shadow p-4 mb-5">
                    <Text className="text-lg font-bold mb-4">
                        Training Modules
                    </Text>
                    {trainingModules.length === 0 ? (
                        <Text className="text-gray-500 italic text-center py-4">
                            No Training Modules Taken
                        </Text>
                    ) : (
                        trainingModules.map((module) => (
                            <View
                                key={module.module_id}
                                className="border-b border-gray-200 pb-3 mb-3"
                            >
                                <Text className="font-bold text-lg">
                                    {module.module_name}
                                </Text>{" "}
                                <Text className="text-gray-700 mb-1">
                                    {module.description &&
                                        module.description
                                            .charAt(0)
                                            .toUpperCase() +
                                            module.description.slice(1)}
                                </Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text
                                        className={`${getStatusColor(
                                            module.status
                                        )} font-medium`}
                                    >
                                        Status:{" "}
                                        {module.status
                                            ? module.status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              module.status.slice(1)
                                            : "Not Started"}
                                    </Text>
                                    {module.completion_date && (
                                        <Text className="text-gray-600 text-sm">
                                            Completed:{" "}
                                            {formatDate(module.completion_date)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>{" "}
                <View className="mt-4 mb-40">
                    <TouchableOpacity
                        className="bg-red-500 py-3 px-4 rounded-lg"
                        onPress={async () => {
                            if (
                                window.confirm(
                                    "Are you sure you want to delete this guide? This action cannot be undone."
                                )
                            ) {
                                try {
                                    const token =
                                        await auth.currentUser?.getIdToken();
                                    if (!token) {
                                        throw new Error("Not authenticated");
                                    }

                                    const response = await fetch(
                                        `${API_URL}/api/park-guides/${guide.guide_id}`,
                                        {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    if (!response.ok) {
                                        throw new Error(
                                            "Failed to delete guide"
                                        );
                                    }

                                    alert("Guide successfully deleted");
                                    router.back(); // Navigate back to the guides list
                                } catch (error) {
                                    console.error(
                                        "Error deleting guide:",
                                        error
                                    );
                                    alert(
                                        "Failed to delete guide. Please try again."
                                    );
                                }
                            }
                        }}
                    >
                        <Text className="text-white text-center font-semibold">
                            Delete Guide
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GuideDetail;
