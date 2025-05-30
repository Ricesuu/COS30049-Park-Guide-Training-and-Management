// components/PGdashboard/Common/Dashboard.jsx
import React from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import Header from "../PGDashboardHome/Header";

const Dashboard = ({ children, noScroll, onRefresh, refreshing }) => {
    const Content = () => (
        <View style={styles.container}>
            <Header />
            <View style={styles.dashboard}>{children}</View>
        </View>
    );

    return noScroll ? (
        <Content />
    ) : (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Content />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 163, 74)",
    },
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
    paymentPending: {
        backgroundColor: "#F59E0B",
        padding: 4,
        borderRadius: 8,
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 1,
    },
    paymentPendingText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default Dashboard;
