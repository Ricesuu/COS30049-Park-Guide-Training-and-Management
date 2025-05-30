import React, { useRef, useState } from "react";
import {
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    LogBox,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
import Header from "../../components/ADMINdashboard/AdminDashboardHome/Header";
import PendingApprovals from "../../components/ADMINdashboard/AdminDashboardHome/PendingApprovals";
import IoTMonitoring from "../../components/ADMINdashboard/AdminDashboardHome/IoTMonitoring";
import { auth } from "../../lib/Firebase";

const HomePage = () => {
    const navigation = useNavigation(); // Use the navigation hook
    const [refreshing, setRefreshing] = useState(false); // State to track refresh status
    const pendingApprovalsRef = useRef(null);
    const iotMonitoringRef = useRef(null);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                pendingApprovalsRef.current?.refreshPendingApprovals(),
                iotMonitoringRef.current?.refreshIoTData(),
            ]);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
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
                <Header />
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
                    {" "}
                    <PendingApprovals
                        ref={pendingApprovalsRef}
                        navigation={navigation} // Pass navigation to PendingApprovals
                    />
                    <IoTMonitoring ref={iotMonitoringRef} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#e74c3c",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default HomePage;
