import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../components/AdminDashboardHome/Header";
import PendingApprovals from "../components/AdminDashboardHome/PendingApprovals";
import IoTMonitoring from "../components/AdminDashboardHome/IoTMonitoring";
import RecentActivities from "../components/AdminDashboardHome/RecentActivities";

const HomePage = () => {
    const [refreshing, setRefreshing] = useState(false); // State to track refresh status
    const iotMonitoringRef = useRef(null); // Reference to IoTMonitoring component
    const pendingApprovalsRef = useRef(null); // Reference to PendingApprovals component

    const handleRefresh = async () => {
        setRefreshing(true); // Start refreshing
        try {
            // Call your data-fetching functions here
            await Promise.all([
                pendingApprovalsRef.current?.refreshPendingApprovals(), // Trigger Pending Approvals refresh
                iotMonitoringRef.current?.refreshIoTData(), // Trigger IoT data refresh
            ]);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false); // Stop refreshing
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Header />

                {/* Dashboard Section */}
                <View
                    style={{
                        backgroundColor: "white",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        marginTop: -5,
                        paddingBottom: 120,
                        zIndex: 1,
                        elevation: 10,
                        padding: 20,
                        flex: 1,
                    }}
                >
                    {/* Pending Approvals */}
                    <PendingApprovals ref={pendingApprovalsRef} />

                    {/* IoT Monitoring */}
                    <IoTMonitoring ref={iotMonitoringRef} />

                    {/* Recent Activities */}
                    <RecentActivities />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomePage;
