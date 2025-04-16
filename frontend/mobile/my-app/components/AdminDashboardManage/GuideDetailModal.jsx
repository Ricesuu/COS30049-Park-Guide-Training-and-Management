import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

const GuideDetailModal = ({ guide, onClose, onSave }) => {
    const [name, setName] = useState(guide.name);
    const [role, setRole] = useState(guide.role);
    const [status, setStatus] = useState(guide.status);
    const [park, setPark] = useState(guide.park);

    const handleSave = () => {
        onSave({ ...guide, name, role, status, park });
    };

    return (
        <Modal transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-6 rounded-lg w-4/5">
                    <Text className="text-lg font-bold mb-4">Edit Guide</Text>

                    <TextInput
                        className="border p-2 rounded mb-4"
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        className="border p-2 rounded mb-4"
                        placeholder="Role"
                        value={role}
                        onChangeText={setRole}
                    />
                    <TextInput
                        className="border p-2 rounded mb-4"
                        placeholder="Status"
                        value={status}
                        onChangeText={setStatus}
                    />
                    <TextInput
                        className="border p-2 rounded mb-4"
                        placeholder="Park"
                        value={park}
                        onChangeText={setPark}
                    />

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
