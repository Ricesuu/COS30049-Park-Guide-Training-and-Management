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

                try {
                    const certificationsUrl = `${API_URL}/api/certifications/user/${currentGuide.guide_id}`;
                    try {
                        const response = await axios.get(certificationsUrl);
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
                    Loading guide details...
                </Text>
            </View>
        </SafeAreaView>
    ) : error ? (
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
    ) : !guide ? (
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
                    {guide.status !== "Training" &&
                        guide.license_expiry_date && (
                            <View className="flex-row mb-2">
                                <Text className="font-semibold w-1/3">
                                    License Expiry:
                                </Text>
                                <Text className="text-gray-700">
                                    {formatDate(guide.license_expiry_date)}
                                </Text>
                            </View>
                        )}
                </View>

                <AssignedParkCard
                    guide={guide}
                    selectedPark={selectedPark}
                    setSelectedPark={setSelectedPark}
                    parkChanged={parkChanged}
                    setParkChanged={setParkChanged}
                    handleSave={handleSave}
                />

                <CertificationsCard certifications={certifications} />

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
                                    {`${
                                        module.is_required
                                            ? "Required"
                                            : "Optional"
                                    } module`}
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
                                            {formatDate(module.completion_date)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View className="flex-row justify-evenly mb-32">
                    {guide.status !== "Training" && (
                        <TouchableOpacity
                            className={`${
                                guide.status === "Active"
                                    ? "bg-red-100"
                                    : "bg-green-100"
                            } px-8 py-3 rounded-lg`}
                            onPress={() => {
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
