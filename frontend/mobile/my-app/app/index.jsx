import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/AdminDashboardHome/Header";
import PendingApprovals from "../components/AdminDashboardHome/PendingApprovals";
import IoTMonitoring from "../components/AdminDashboardHome/IoTMonitoring";
import RecentActivities from "../components/AdminDashboardHome/RecentActivities";

const HomePage = () => {
    const navigation = useNavigation();

    const [parkGuideCount, setParkGuideCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    const fetchParkGuideApprovals = async () => {
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setParkGuideCount(data.length);
    };

    const fetchTransactionApprovals = async () => {
        const data = [
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
        ];
        setTransactionCount(data.length);
    };

    useEffect(() => {
        fetchParkGuideApprovals();
        fetchTransactionApprovals();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
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
                    <PendingApprovals
                        parkGuideCount={parkGuideCount}
                        transactionCount={transactionCount}
                        navigation={navigation}
                    />

                    {/* IoT Monitoring */}
                    <IoTMonitoring />

                    {/* Recent Activities */}
                    <RecentActivities />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomePage;
