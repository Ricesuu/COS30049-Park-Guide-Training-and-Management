// components/ADMINdashboard/AdminDashboardManage/AssignedParkCard.jsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Modify component to handle both display and editing functionality
const AssignedParkCard = ({
    guide,
    selectedPark,
    setSelectedPark,
    parkChanged,
    setParkChanged,
    handleSave,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [availableParks] = useState([
        "Yellowstone National Park",
        "Grand Canyon National Park",
        "Yosemite National Park",
        "Zion National Park",
        "Everglades National Park",
        "Sequoia National Park",
        "Olympic National Park",
        "Great Smoky Mountains National Park",
    ]);

    if (!guide) {
        return (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Assigned Park</Text>
                <View style={styles.emptyState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.emptyText}>
                        No guide data available
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Assigned Park</Text>
                {!isEditing && (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="rgb(22, 163, 74)"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {isEditing ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.input}
                        value={selectedPark}
                        onChangeText={(text) => {
                            setSelectedPark(text);
                            setParkChanged(true);
                        }}
                        placeholder="Enter park name or leave empty"
                        placeholderTextColor="#9CA3AF"
                    />
                    <View style={styles.buttonContainer}>
                        {" "}
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                setSelectedPark(guide.park || "");
                                setParkChanged(false);
                                setIsEditing(false);
                            }}
                        >
                            <Text
                                style={{ color: "#374151", fontWeight: "500" }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={() => {
                                handleSave();
                                setIsEditing(false);
                            }}
                            disabled={!parkChanged}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : guide.park && guide.park.trim() !== "" ? (
                <View style={styles.parkInfo}>
                    <Ionicons name="leaf" size={24} color="rgb(22, 163, 74)" />
                    <Text style={styles.parkName}>{guide.park}</Text>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.emptyText}>No park assigned</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    parkInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    parkName: {
        marginLeft: 10,
        fontSize: 16,
        color: "#374151",
        fontWeight: "500",
    },
    emptyState: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 6,
    },
    emptyText: {
        marginLeft: 8,
        fontSize: 15,
        color: "#6B7280",
        fontStyle: "italic",
    },
    editContainer: {
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: "#F3F4F6",
    },
    saveButton: {
        backgroundColor: "rgb(22, 163, 74)",
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
    },
});

export default AssignedParkCard;
