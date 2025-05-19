// components/PGdashboard/Profile/ProfileStats.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileStats = ({ certifications, trainingProgress }) => {
    // Calculate statistics
    const completedModules =
        trainingProgress?.filter((m) => m.progress === 100)?.length || 0;
    const totalModules = trainingProgress?.length || 0;
    const activeCerts =
        certifications?.filter((c) => {
            // Check if expiry date is in the future
            if (!c.expiry_date) return false;
            const expiry = new Date(c.expiry_date);
            return expiry > new Date();
        })?.length || 0;

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedModules}</Text>
                <Text style={styles.statLabel}>Completed Modules</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activeCerts}</Text>
                <Text style={styles.statLabel}>Active Certifications</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                    {totalModules > 0
                        ? Math.round((completedModules / totalModules) * 100)
                        : 0}
                    %
                </Text>
                <Text style={styles.statLabel}>Training Progress</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 20,
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        marginVertical: 15,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#16a34a",
    },
    statLabel: {
        fontSize: 12,
        color: "#757575",
        marginTop: 5,
    },
    divider: {
        width: 1,
        height: "80%",
        backgroundColor: "#E0E0E0",
    },
});

export default ProfileStats;
