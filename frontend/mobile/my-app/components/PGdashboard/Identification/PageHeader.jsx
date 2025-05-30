// components/PGdashboard/Identification/PageHeader.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PageHeader = () => {
    return (
        <View>
            <Text style={styles.title}>Orchid Identification</Text>
        </View>
    );
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
