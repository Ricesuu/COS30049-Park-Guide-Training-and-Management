import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const ParkGuideApproval = () => {
    const [applicants, setApplicants] = useState([]);

    // Function to fetch applicant data
    const fetchApplicants = async () => {
        // Simulate fetching data (replace this with an API call if needed)
        const data = [
            {
                id: "1",
                name: "John Doe",
                email: "john@gmail.com",
                appliedFor: "Park Guide",
                location: "Bako National Park",
            },
            {
                id: "2",
                name: "John Xina",
                email: "johnxina@gmail.com",
                appliedFor: "Park Guide",
                location: "Bako National Park",
            },
        ];
        setApplicants(data);
    };

    // Fetch applicants when the component mounts
    useEffect(() => {
        fetchApplicants();
    }, []);

    // Handle approve and reject actions
    const handleApprove = (id) => {
        setApplicants((prev) =>
            prev.filter((applicant) => applicant.id !== id)
        );
    };

    const handleReject = (id) => {
        setApplicants((prev) =>
            prev.filter((applicant) => applicant.id !== id)
        );
    };

    // Render each applicant
    const renderApplicant = ({ item }) => (
        <View className="bg-white p-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.email}</Text>
                </View>
                <View>
                    <Text className="text-sm text-gray-600">
                        Applied for:{" "}
                        <Text className="font-medium">{item.appliedFor}</Text>
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Location:{" "}
                        <Text className="font-medium">{item.location}</Text>
                    </Text>
                </View>
            </View>
            <View className="flex-row justify-end space-x-2 gap-x-2">
                <TouchableOpacity
                    className="bg-red-100 px-4 py-2 rounded-lg"
                    onPress={() => handleReject(item.id)}
                >
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-100 px-4 py-2 rounded-lg"
                    onPress={() => handleApprove(item.id)}
                >
                    <Text className="text-green-600 font-semibold">
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "#F5F5F5" }}>
            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 10,
                    shadowColor: "#000",
                    elevation: 10,
                }}
            >
                Pending Approvals
            </Text>
            <FlatList
                data={applicants}
                keyExtractor={(item) => item.id}
                renderItem={renderApplicant}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-5">
                        No pending approvals.
                    </Text>
                }
                contentContainerStyle={{
                    paddingBottom: 140,
                }}
            />
        </View>
    );
};

export default ParkGuideApproval;
