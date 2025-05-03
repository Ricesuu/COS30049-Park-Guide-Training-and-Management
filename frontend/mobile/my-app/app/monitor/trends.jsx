import React from "react";
import { View, Text } from "react-native";
import HistoricalChart from "../../components/AdminDashboardMonitoring/HistoricalChart";

const TrendsPage = ({ route }) => {
    const { type, data } = route.params;

    // Check if data is valid
    const hasValidData =
        data && data.labels && data.values && data.labels.length > 0;

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
                {type
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}{" "}
                Trends
            </Text>
            {/* Historical Chart */}
            <View
                style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: hasValidData ? "flex-start" : "center",
                }}
            >
                {hasValidData ? (
                    <HistoricalChart type={type} data={data} />
                ) : (
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                            No historical data available for {type}.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default TrendsPage;
