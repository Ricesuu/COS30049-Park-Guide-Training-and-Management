import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CertificationsCard = ({ certifications = [] }) => {
    return (
        <View className="bg-white rounded-lg shadow p-4 mb-5">
            <Text className="text-lg font-bold mb-4">Certifications</Text>
            {certifications?.length > 0 ? (
                certifications.map((cert, index) => (
                    <View
                        key={cert?.cert_id || index}
                        className="flex-row items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                        <MaterialIcons
                            name="verified"
                            size={24}
                            color="rgb(22, 163, 74)"
                        />
                        <View className="ml-2 flex-1">
                            <Text className="text-base font-medium">
                                {cert?.module_name ||
                                    cert?.name ||
                                    "Unknown Certificate"}
                            </Text>
                            <View className="flex-row justify-between items-center mt-1">
                                <Text className="text-sm text-gray-600">
                                    Issued:{" "}
                                    {cert?.issued_date
                                        ? new Date(
                                              cert.issued_date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                                {cert?.expiry_date && (
                                    <Text className="text-sm text-gray-600">
                                        Expires:{" "}
                                        {new Date(
                                            cert.expiry_date
                                        ).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <Text className="text-gray-500 italic text-center py-4">
                    No certifications available
                </Text>
            )}
        </View>
    );
};

export default CertificationsCard;
