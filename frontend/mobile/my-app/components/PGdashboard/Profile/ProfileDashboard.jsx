// components/PGdashboard/Profile/ProfileDashboard.jsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Header from "../PGDashboardHome/Header";

const ProfileDashboard = ({
    isLoading,
    error,
    onRetry,
    onLogout,
    children,
}) => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Profile</Text>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={onLogout}
                        >
                            <AntDesign name="logout" size={20} color="white" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color="rgb(22, 163, 74)"
                            />
                            <Text style={styles.loadingText}>
                                Loading your profile...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={onRetry}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>{children}</>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dashboard: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        paddingBottom: 120,
        zIndex: 1,
        elevation: 10,
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    logoutButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    logoutText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ProfileDashboard;
