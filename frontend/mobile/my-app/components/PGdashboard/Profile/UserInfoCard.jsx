// components/PGdashboard/Profile/UserInfoCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const UserInfoCard = ({ userProfile, parkGuideInfo }) => {
    if (!userProfile) return null;

    const { first_name, last_name, email, role, status, created_at } =
        userProfile;
    const createdDate = new Date(created_at).toLocaleDateString();

    return (
        <View style={styles.infoContainer}>
            <View style={styles.userHeaderContainer}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {first_name && last_name
                            ? `${first_name.charAt(0)}${last_name.charAt(0)}`
                            : "U"}
                    </Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>
                        {first_name} {last_name}
                    </Text>
                    <View style={styles.badgeContainer}>
                        <Text
                            style={[
                                styles.badge,
                                role === "park_guide"
                                    ? styles.parkGuideBadge
                                    : styles.adminBadge,
                            ]}
                        >
                            {role === "park_guide"
                                ? "PARK GUIDE"
                                : role.toUpperCase()}
                        </Text>
                        <Text
                            style={[
                                styles.badge,
                                status === "approved"
                                    ? styles.approvedBadge
                                    : status === "pending"
                                    ? styles.pendingBadge
                                    : styles.rejectedBadge,
                            ]}
                        >
                            {status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Account Details</Text>

                <View style={styles.detailRow}>
                    <MaterialIcons
                        name="email"
                        size={20}
                        color="rgb(22, 163, 74)"
                    />
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{email}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons
                        name="person"
                        size={20}
                        color="rgb(22, 163, 74)"
                    />
                    <Text style={styles.detailLabel}>Role:</Text>
                    <Text style={styles.detailValue}>
                        {role === "park_guide"
                            ? "Park Guide"
                            : role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons
                        name="date-range"
                        size={20}
                        color="rgb(22, 163, 74)"
                    />
                    <Text style={styles.detailLabel}>Member Since:</Text>
                    <Text style={styles.detailValue}>{createdDate}</Text>
                </View>

                {parkGuideInfo && (
                    <>
                        <View style={styles.detailRow}>
                            <MaterialIcons
                                name="verified-user"
                                size={20}
                                color="rgb(22, 163, 74)"
                            />
                            <Text style={styles.detailLabel}>
                                License Status:
                            </Text>
                            <Text
                                style={[
                                    styles.detailValue,
                                    parkGuideInfo.certification_status ===
                                    "certified"
                                        ? styles.textSuccess
                                        : parkGuideInfo.certification_status ===
                                          "pending"
                                        ? styles.textWarning
                                        : styles.textDanger,
                                ]}
                            >
                                {parkGuideInfo.certification_status
                                    .charAt(0)
                                    .toUpperCase() +
                                    parkGuideInfo.certification_status.slice(1)}
                            </Text>
                        </View>

                        {parkGuideInfo.license_expiry_date && (
                            <View style={styles.detailRow}>
                                <MaterialIcons
                                    name="event"
                                    size={20}
                                    color="rgb(22, 163, 74)"
                                />
                                <Text style={styles.detailLabel}>
                                    License Expires:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {new Date(
                                        parkGuideInfo.license_expiry_date
                                    ).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    userHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgb(22, 163, 74)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    nameContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    badgeContainer: {
        flexDirection: "row",
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
        marginRight: 5,
        fontSize: 10,
        fontWeight: "bold",
    },
    parkGuideBadge: {
        backgroundColor: "#d1fae5",
        color: "rgb(6, 95, 70)",
    },
    adminBadge: {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
    },
    approvedBadge: {
        backgroundColor: "#d1fae5",
        color: "rgb(6, 95, 70)",
    },
    pendingBadge: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
    },
    rejectedBadge: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
    },
    detailsCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: "600",
        width: 110,
        marginLeft: 8,
        color: "#555",
    },
    detailValue: {
        flex: 1,
        color: "#333",
    },
    textSuccess: {
        color: "rgb(22, 163, 74)",
    },
    textWarning: {
        color: "#f59e0b",
    },
    textDanger: {
        color: "#ef4444",
    },
});

export default UserInfoCard;
