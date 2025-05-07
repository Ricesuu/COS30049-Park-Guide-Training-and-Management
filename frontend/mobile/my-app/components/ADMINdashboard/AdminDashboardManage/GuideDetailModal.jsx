import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { fetchData } from "../../../src/api/api";

const GuideDetailModal = ({ guide, onClose, onSave }) => {
    // State for editable fields
    const [park, setPark] = useState(guide.park || "");
    const [trainingModules, setTrainingModules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch training modules data when component mounts
    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                setLoading(true);
                // Fetch all training modules
                const modules = await fetchData("/training-modules");

                // Fetch guide's progress on training modules
                const progress = await fetchData("/guide-training-progress");

                // Filter progress for this specific guide
                const guideProgress = progress.filter(
                    (item) => item.guide_id === guide.guide_id
                );

                // Combine module data with guide's progress
                const modulesWithProgress = modules.map((module) => {
                    const progressEntry = guideProgress.find(
                        (item) => item.module_id === module.module_id
                    );

                    return {
                        ...module,
                        status: progressEntry
                            ? progressEntry.status
                            : "not started",
                        completion_date: progressEntry
                            ? progressEntry.completion_date
                            : null,
                    };
                });

                setTrainingModules(modulesWithProgress);
            } catch (error) {
                console.error("Error fetching training data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingData();
    }, [guide.guide_id]);

    const handleSave = () => {
        // Only update the park field, keep everything else the same
        onSave({
            ...guide,
            park: park,
        });
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

    return (
        <Modal transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-h-4/5">
                    <Text className="text-xl font-bold mb-4">
                        Park Guide Details
                    </Text>

                    <ScrollView className="mb-4">
                        {/* Basic Information Section */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-2 text-blue-600">
                                Basic Information
                            </Text>

                            <View className="mb-2">
                                <Text className="font-bold text-gray-700">
                                    Name:
                                </Text>
                                <Text className="text-gray-600">
                                    {guide.name}
                                </Text>
                            </View>

                            <View className="mb-2">
                                <Text className="font-bold text-gray-700">
                                    Email:
                                </Text>
                                <Text className="text-gray-600">
                                    {guide.email}
                                </Text>
                            </View>

                            <View className="mb-2">
                                <Text className="font-bold text-gray-700">
                                    Role:
                                </Text>
                                <Text className="text-gray-600">
                                    {guide.role}
                                </Text>
                            </View>

                            <View className="mb-2">
                                <Text className="font-bold text-gray-700">
                                    Status:
                                </Text>
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

                            {guide.license_expiry_date && (
                                <View className="mb-2">
                                    <Text className="font-bold text-gray-700">
                                        License Expiry:
                                    </Text>
                                    <Text className="text-gray-600">
                                        {new Date(
                                            guide.license_expiry_date
                                        ).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}

                            {/* Editable park assignment */}
                            <View className="mb-2">
                                <Text className="font-bold text-gray-700 mb-1">
                                    Assigned Park:
                                </Text>
                                <TextInput
                                    className="border p-2 rounded mb-1"
                                    placeholder="Enter park name"
                                    value={park}
                                    onChangeText={setPark}
                                />
                            </View>
                        </View>

                        {/* Training Modules Section */}
                        <View>
                            <Text className="text-lg font-bold mb-2 text-blue-600">
                                Training Modules
                            </Text>

                            {loading ? (
                                <View className="items-center py-4">
                                    <ActivityIndicator
                                        size="small"
                                        color="#4B5563"
                                    />
                                    <Text className="text-gray-500 mt-2">
                                        Loading training data...
                                    </Text>
                                </View>
                            ) : trainingModules.length === 0 ? (
                                <Text className="text-gray-500 italic">
                                    No training modules found
                                </Text>
                            ) : (
                                trainingModules.map((module) => (
                                    <View
                                        key={module.module_id}
                                        className="mb-3 p-3 border border-gray-200 rounded-md"
                                    >
                                        <Text className="font-bold">
                                            {module.module_name}
                                        </Text>
                                        <Text className="text-gray-600 text-sm mb-1">
                                            {module.description}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            Duration: {module.duration} minutes
                                        </Text>
                                        <View className="flex-row justify-between items-center mt-2">
                                            <Text
                                                className={`${getStatusColor(
                                                    module.status
                                                )} font-medium`}
                                            >
                                                Status:{" "}
                                                {module.status || "Not started"}
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
                    </ScrollView>

                    {/* Buttons for saving or canceling */}
                    <View className="flex-row justify-end space-x-4 gap-2">
                        <TouchableOpacity
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                            onPress={onClose}
                        >
                            <Text className="text-gray-600">Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-green-600 px-4 py-2 rounded-lg"
                            onPress={handleSave}
                        >
                            <Text className="text-white">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default GuideDetailModal;
