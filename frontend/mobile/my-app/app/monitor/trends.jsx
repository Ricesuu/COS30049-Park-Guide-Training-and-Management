import React from "react";
import { View, Text } from "react-native";
import HistoricalChart from "../../components/AdminDashboardMonitoring/HistoricalChart";

const TrendsPage = ({ route }) => {
    const { type, data } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={{ padding: 20 }}>
                <HistoricalChart type={type} data={data} />
            </View>
        </View>
    );
};

export default TrendsPage;
