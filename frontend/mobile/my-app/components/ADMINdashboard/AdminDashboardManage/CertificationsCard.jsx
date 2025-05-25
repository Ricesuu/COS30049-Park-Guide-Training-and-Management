import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

const ParkGuideCard = ({ guide, onDelete }) => {
    const router = useRouter();

    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete ${guide.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(guide.id),
                },
            ]
        );
    };

    const handleViewDetails = () => {
        router.push(`/admin-dashboard/manage/guide-detail?id=${guide.id}`);
    };

    return (
        <View
            className="bg-white p-4 rounded-lg shadow mb-3"
            style={{
                elevation: 5,
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            {/* Guide details */}
            <View className="flex-1 justify-center">
                <Text className="text-lg font-bold">{guide.name}</Text>
                <Text className="text-gray-600">Role: {guide.role}</Text>
                <Text
                    className={`${
                        guide.status === "Active"
                            ? "text-green-600"
                            : guide.status === "Training"
                            ? "text-blue-600"
                            : "text-red-600"
                    }`}
                >
                    Status: {guide.status}
                </Text>
                {guide.status !== "Training" && guide.license_expiry_date ? (
                    <Text className="text-gray-600">
                        License Expiry:{" "}
                        {new Date(
                            guide.license_expiry_date
                        ).toLocaleDateString()}
                    </Text>
                ) : (
                    guide.status !== "Training" && (
                        <Text className="text-gray-600 italic">
                            No certification expiry date available
                        </Text>
                    )
                )}
            </View>{" "}
            {/* Action buttons */}
            <View className="flex-column space-y-2 gap-2 justify-center">
                <TouchableOpacity
                    className="bg-blue-100 px-4 py-2 rounded-lg"
                    onPress={handleViewDetails}
                >
                    <Text className="text-blue-600 font-semibold text-center">
                        Details
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ParkGuideCard;
