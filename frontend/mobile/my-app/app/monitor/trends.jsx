import React from "react";
import { View, Text } from "react-native";
import HistoricalChart from "../../components/AdminDashboardMonitoring/HistoricalChart";
import MotionDetectionLog from "../../components/AdminDashboardMonitoring/MotionDetectionLog";

const TrendsPage = ({ route }) => {
    const { type, data } = route.params;

    // Check if data is valid
    const hasValidData =
        data && data.labels && data.values && data.labels.length > 0;

    // Function to format type string for display
    const formatTypeForDisplay = (typeStr) => {
        return typeStr
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Determine whether to show chart or timeline based on type
    const isMotionDetection = type.toLowerCase().includes("motion");

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
                {formatTypeForDisplay(type)} Trends
            </Text>

            {/* Chart or Timeline */}
            <View style={{ padding: 20, flex: 1 }}>
                {hasValidData ? (
                    isMotionDetection ? (
                        <MotionDetectionLog type={type} data={data} />
                    ) : (
                        <HistoricalChart type={type} data={data} />
                    )
                ) : (
                    <View
                        style={{
                            alignItems: "center",
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontSize: 16, textAlign: "center" }}>
                            No historical data available for{" "}
                            {formatTypeForDisplay(type)}.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default TrendsPage;
