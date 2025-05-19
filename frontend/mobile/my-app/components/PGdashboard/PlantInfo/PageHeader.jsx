// components/PGdashboard/PlantInfo/PageHeader.jsx
import React from "react";
import { Text, StyleSheet } from "react-native";

const PageHeader = () => {
    return <Text style={styles.title}>Orchid Information</Text>;
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "rgb(22, 163, 74)",
    },
});

export default PageHeader;
