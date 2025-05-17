// components/PGdashboard/Profile/ProfileHeader.jsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileHeader = ({ userProfile, parkGuideInfo }) => {
    const router = useRouter();

    return (
        <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
                {userProfile?.profile_image ? (
                    <Image
                        source={{ uri: userProfile.profile_image }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.profileImagePlaceholderText}>
                            {userProfile?.first_name?.charAt(0)}
                            {userProfile?.last_name?.charAt(0)}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                    {userProfile?.first_name} {userProfile?.last_name}
                </Text>
                <Text style={styles.guideId}>
                    ID: {parkGuideInfo?.guide_id}
                </Text>
                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusIndicator,
                            {
                                backgroundColor:
                                    parkGuideInfo?.status === "approved"
                                        ? "#4CAF50"
                                        : parkGuideInfo?.status === "pending"
                                        ? "#FFC107"
                                        : "#F44336",
                            },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {parkGuideInfo?.status === "approved"
                            ? "Active"
                            : parkGuideInfo?.status === "pending"
                            ? "Pending Approval"
                            : "Inactive"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push("/pg-dashboard/edit-profile")}
            >
                <MaterialIcons name="edit" size={24} color="#007BFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
    },
    profileImageContainer: {
        marginRight: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
    },
    profileImagePlaceholderText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#757575",
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    guideId: {
        fontSize: 14,
        color: "#757575",
        marginBottom: 5,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    statusText: {
        fontSize: 14,
        color: "#757575",
    },
    editButton: {
        padding: 10,
    },
});

export default ProfileHeader;
