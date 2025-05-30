import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ParkGuideCard = ({ guide = null }) => {
    const router = useRouter();

    // Early return if guide is null or undefined
    if (!guide) {
        return (
            <View
                className="bg-white p-4 rounded-lg shadow mb-3"
                style={{ elevation: 5 }}
            >
                <Text className="text-gray-500">No guide data available</Text>
            </View>
        );
    }

    // Add a guard clause for when guide is undefined
    if (!guide) {
        return (
            <View className="bg-white p-4 rounded-lg shadow mb-3">
                <Text className="text-gray-500">No guide data available</Text>
            </View>
        );
    }

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
                        Certification Expiry:{" "}
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
            </View>

            {/* Action buttons */}
            <View className="flex-column space-y-2 gap-2 justify-center">
                {/* Details button - navigates to guide detail page */}
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
