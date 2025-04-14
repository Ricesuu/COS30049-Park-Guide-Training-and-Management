import React from "react";
import { View, Text } from "react-native";
import HistoricalChart from "../../components/AdminDashboardMonitoring/HistoricalChart";

const TrendsPage = ({ route }) => {
    const { type, data } = route.params; // Get the type (e.g., Temperature) and data from navigation params

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            {/* Header */}
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                    backgroundColor: "rgb(22, 163, 74)",
                }}
            >
                {type} Trends
            </Text>

            {/* Historical Chart */}
            <View style={{ padding: 20 }}>
                <HistoricalChart type={type} data={data} />
            </View>
        </View>
    );
};

export default TrendsPage;
