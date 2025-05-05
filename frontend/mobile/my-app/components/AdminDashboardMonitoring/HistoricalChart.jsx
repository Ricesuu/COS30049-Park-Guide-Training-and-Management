import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import PropTypes from "prop-types";

const HistoricalChart = ({ type, data }) => {
    // Handle empty data gracefully
    if (!data || !data.labels || !data.values || data.labels.length === 0) {
        return (
            <View style={styles.emptyContainer}>
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
    const chartData = useMemo(() => {
        if (data.labels.length <= 10) return data;

        const sampleInterval = Math.ceil(data.labels.length / 10);
        const sampledLabels = [];
        const sampledValues = [];

        for (let i = 0; i < data.labels.length; i += sampleInterval) {
            sampledLabels.push(data.labels[i]);
            sampledValues.push(data.values[i]);
        }

        return { labels: sampledLabels, values: sampledValues };
    }, [data]);

    const formattedTitle = type
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <View>
            {/* Chart Title */}
            <Text style={styles.title}>Today's {formattedTitle} Data</Text>
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
                yAxisLabel="" // Consider adding a label here
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
                style={styles.chart}
            />
            {/* Show legend for motion detection */}
            {type.toLowerCase() === "motion detection" && (
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDotActive} />
                        <Text>1 = Motion Detected</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDotInactive} />
                        <Text>0 = No Motion</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 220,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    legendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    legendDotActive: {
        width: 12,
        height: 12,
        backgroundColor: "orange",
        borderRadius: 6,
        marginRight: 5,
    },
    legendDotInactive: {
        width: 12,
        height: 12,
        backgroundColor: "orange",
        borderRadius: 6,
        marginRight: 5,
        opacity: 0.3,
    },
});

HistoricalChart.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
        labels: PropTypes.array,
        values: PropTypes.array,
    }),
};

export default HistoricalChart;
