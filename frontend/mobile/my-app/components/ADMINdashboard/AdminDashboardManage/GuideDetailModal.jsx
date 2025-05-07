import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

const GuideDetailModal = ({ guide, onClose, onSave }) => {
    // Only allow editing the park assignment
    const [park, setPark] = useState(guide.park || "null");

    const handleSave = () => {
        // Only update the park field, keep everything else the same
        onSave({
            ...guide,
            park: park,
        });
    };

    return (
        <Modal transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-6 rounded-lg w-4/5">
                    <Text className="text-lg font-bold mb-4">
                        Edit Guide Assignment
                    </Text>

                    {/* Display non-editable guide info */}
                    <View className="mb-4">
                        <Text className="font-bold text-gray-700">Name:</Text>
                        <Text className="text-gray-600">{guide.name}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="font-bold text-gray-700">Role:</Text>
                        <Text className="text-gray-600">{guide.role}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="font-bold text-gray-700">Status:</Text>
                        <Text className="text-gray-600">{guide.status}</Text>
                    </View>

                    {/* Editable park assignment */}
                    <View className="mb-4">
                        <Text className="font-bold text-gray-700 mb-1">
                            Assigned Park:
                        </Text>
                        <TextInput
                            className="border p-2 rounded mb-4"
                            placeholder="Assigned Park"
                            value={park}
                            onChangeText={setPark}
                        />
                    </View>

                    {/* Buttons for saving or canceling */}
                    <View className="flex-row justify-end space-x-4 gap-2">
                        <TouchableOpacity
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                            onPress={onClose}
                        >
                            <Text className="text-gray-600">Cancel</Text>
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
