import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import ParkGuideCard from "../components/AdminDashboardManage/ParkGuideCard";
import AddGuideButton from "../components/AdminDashboardManage/GuideButtons";
import GuideDetailModal from "../components/AdminDashboardManage/GuideDetailModal";

const manage = () => {
    const [guides, setGuides] = useState([
        {
            id: "1",
            name: "John Doe",
            role: "Senior Guide",
            status: "Active",
            park: "Bako National Park",
        },
        {
            id: "2",
            name: "Jane Smith",
            role: "Junior Guide",
            status: "Suspended",
            park: "Semenggoh Wildlife Centre",
        },
        {
            id: "3",
            name: "Alice Johnson",
            role: "Guide",
            status: "Active",
            park: "Gunung Mulu National Park",
        },
        {
            id: "4",
            name: "Bob Brown",
            role: "Senior Guide",
            status: "Active",
            park: "Kinabalu Park",
        },
        {
            id: "5",
            name: "Charlie Davis",
            role: "Junior Guide",
            status: "Suspended",
            park: "Niah National Park",
        },
        {
            id: "6",
            name: "Diana Evans",
            role: "Guide",
            status: "Active",
            park: "Lambir Hills National Park",
        },
    ]);

    const [selectedGuide, setSelectedGuide] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleEdit = (guide) => {
        setSelectedGuide(guide);
        setIsModalVisible(true);
    };

    const handleSuspend = (id) => {
        setGuides((prev) =>
            prev.map((guide) =>
                guide.id === id
                    ? {
                          ...guide,
                          status:
                              guide.status === "Active"
                                  ? "Suspended"
                                  : "Active",
                      }
                    : guide
            )
        );
    };

    const handleDelete = (id) => {
        setGuides((prev) => prev.filter((guide) => guide.id !== id));
    };

    const handleSave = (updatedGuide) => {
        setGuides((prev) =>
            prev.map((guide) =>
                guide.id === updatedGuide.id ? updatedGuide : guide
            )
        );
        setIsModalVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                    backgroundColor: "rgb(22 163 74)",
                }}
            >
                Manage Park Guides
            </Text>

            {/* List of Park Guides */}
            <FlatList
                data={guides}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ParkGuideCard
                        guide={item}
                        onEdit={handleEdit}
                        onSuspend={handleSuspend}
                        onDelete={handleDelete}
                    />
                )}
                contentContainerStyle={{ padding: 10 }}
                ListFooterComponent={
                    <View style={{ marginTop: 10, marginBottom: 100 }}>
                        <AddGuideButton
                            onPress={() => console.log("Add new guide")}
                        />
                    </View>
                }
            />

            {/* Guide Detail Modal */}
            {isModalVisible && (
                <GuideDetailModal
                    guide={selectedGuide}
                    onClose={() => setIsModalVisible(false)}
                    onSave={handleSave}
                />
            )}
        </View>
    );
};

export default manage;
