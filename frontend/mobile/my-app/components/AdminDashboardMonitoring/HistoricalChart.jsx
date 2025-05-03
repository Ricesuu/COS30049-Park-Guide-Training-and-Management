import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const HistoricalChart = ({ type, data }) => {
    // Handle empty data gracefully
    if (!data || !data.labels || !data.values || data.labels.length === 0) {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 220,
                }}
            >
                <Text>No historical data available</Text>
            </View>
        );
    }

    // Get screen width for responsive chart
    const screenWidth = Dimensions.get("window").width - 40;

    // Determine suffix and color based on type
    const getSuffix = () => {
        const typeLower = type.toLowerCase();
        if (typeLower === "temperature") return "°C";
        if (typeLower === "humidity" || typeLower === "soil moisture")
            return "%";
        return "";
    };

    const getColor = () => {
        const typeLower = type.toLowerCase();
        if (typeLower === "temperature")
            return (opacity = 1) => `rgba(255, 69, 0, ${opacity})`;
        if (typeLower === "humidity")
            return (opacity = 1) => `rgba(0, 0, 255, ${opacity})`;
        if (typeLower === "soil moisture")
            return (opacity = 1) => `rgba(139, 69, 19, ${opacity})`;
        if (typeLower === "motion detection")
            return (opacity = 1) => `rgba(255, 165, 0, ${opacity})`;
        return (opacity = 1) => `rgba(34, 139, 34, ${opacity})`;
    };

    // If we have too many data points, sample them to avoid crowding the x-axis
    const sampleData = () => {
        if (data.labels.length <= 10) return data;

        const sampleInterval = Math.ceil(data.labels.length / 10);
        const sampledLabels = [];
        const sampledValues = [];

        for (let i = 0; i < data.labels.length; i += sampleInterval) {
            sampledLabels.push(data.labels[i]);
            sampledValues.push(data.values[i]);
        }

        return { labels: sampledLabels, values: sampledValues };
    };

    const chartData = sampleData();

    return (
        <View>
            {/* Chart Title */}
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 10,
                    textAlign: "center",
                }}
            >
                Today's{" "}
                {type
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}{" "}
                Data
            </Text>
            {/* Line Chart */}
            <LineChart
                data={{
                    labels: chartData.labels,
                    datasets: [
                        {
                            data:
                                chartData.values.length === 0
                                    ? [0]
                                    : chartData.values,
                        },
                    ],
                }}
                width={screenWidth}
                height={220}
                yAxisSuffix={getSuffix()}
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#f5f5f5",
                    backgroundGradientTo: "#f5f5f5",
                    decimalPlaces:
                        type.toLowerCase() === "motion detection" ? 0 : 1,
                    color: getColor(),
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "5",
                        strokeWidth: "2",
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
            {/* Show legend for motion detection */}
            {type.toLowerCase() === "motion detection" && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 20,
                        }}
                    >
                        <View
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: "orange",
                                borderRadius: 6,
                                marginRight: 5,
                            }}
                        />
                        <Text>1 = Motion Detected</Text>
                    </View>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <View
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: "orange",
                                borderRadius: 6,
                                marginRight: 5,
                                opacity: 0.3,
                            }}
                        />
                        <Text>0 = No Motion</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default HistoricalChart;
