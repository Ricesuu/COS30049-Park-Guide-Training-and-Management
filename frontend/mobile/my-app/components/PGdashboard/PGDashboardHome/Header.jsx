import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Park Guide Dashboard</Text>
            <Text style={styles.subtitle}>Welcome back, Park Guide!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 30,
        backgroundColor: "rgb(22, 163, 74)",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "rgb(200, 255, 200)",
        textAlign: "center",
        fontStyle: "italic",
    },
});

export default Header;
