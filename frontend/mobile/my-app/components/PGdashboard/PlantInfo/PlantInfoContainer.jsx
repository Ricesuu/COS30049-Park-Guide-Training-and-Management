// components/PGdashboard/PlantInfo/PlantInfoContainer.jsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Header from "../PGDashboardHome/Header";

const PlantInfoContainer = ({ children }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>{children}</View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dashboard: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        padding: 20,
        paddingBottom: 120,
    },
});

export default PlantInfoContainer;
