import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDate } from "../../../utils/formatHelpers";

const AnnounContainer = ({ announcements }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Announcements</Text>
            {announcements && announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                    <View key={index} style={styles.announcementItem}>
                        <View
                            style={[
                                styles.priorityCircle,
                                announcement.priority === "low"
                                    ? styles.lowPriority
                                    : announcement.priority === "mid"
                                    ? styles.midPriority
                                    : announcement.priority === "high"
                                    ? styles.highPriority
                                    : null,
                            ]}
                        />{" "}
                        <View style={styles.announcementDetails}>
                            <Text style={styles.announcementTitle}>
                                {announcement.title || "Untitled Announcement"}
                            </Text>
                            <Text style={styles.announcementDate}>
                                {formatDate(announcement.date, "No date")}
                            </Text>
                            <Text style={styles.announcementDescription}>
                                {announcement.description ||
                                    "No details available"}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.noAnnouncementsContainer}>
                    <Text style={styles.noAnnouncementsText}>
                        No announcements available
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 10,
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "black",
    },
    announcementItem: {
        flexDirection: "row", // Align priority circle and details horizontally
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
    },
    priorityCircle: {
        width: 20,
        height: 20,
        borderRadius: 10, // Makes it a circle
        marginRight: 10,
    },
    lowPriority: {
        backgroundColor: "green",
    },
    midPriority: {
        backgroundColor: "orange",
    },
    highPriority: {
        backgroundColor: "red",
    },
    announcementDetails: {
        flex: 1, // Allow details to take up remaining space
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    announcementDate: {
        fontSize: 14,
        color: "#888",
        marginBottom: 5,
    },
    announcementDescription: {
        fontSize: 14,
        color: "#555",
    },
    noAnnouncementsContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
        marginVertical: 10,
    },
    noAnnouncementsText: {
        fontSize: 16,
        color: "#888",
        fontStyle: "italic",
    },
});

export default AnnounContainer;
