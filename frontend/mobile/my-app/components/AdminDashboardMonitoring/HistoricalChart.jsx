import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const HistoricalChart = ({ type, data }) => {
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
                {type} Historical Data
            </Text>

            {/* Line Chart */}
            <LineChart
                data={{
                    labels: data.labels, // e.g., ["12 PM", "1 PM", "2 PM"]
                    datasets: [
                        {
                            data: data.values, // e.g., [25, 26, 27]
                        },
                    ],
                }}
                width={350} // Width of the chart
                height={220} // Height of the chart
                yAxisSuffix={type === "Temperature" ? "°C" : "%"} // Add suffix based on type
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#f5f5f5",
                    backgroundGradientTo: "#f5f5f5",
                    decimalPlaces: 1, // Number of decimal places
                    color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Line color
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

export default HistoricalChart;
