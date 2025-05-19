// components/PGdashboard/Identification/IdentificationContainer.jsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Header from "../../PGdashboard/PGDashboardHome/Header";
import PageHeader from "./PageHeader";

const IdentificationContainer = ({ children }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.container}>
                    <PageHeader />
                    {children}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        padding: 20,
        paddingBottom: 120,
    },
});

export default IdentificationContainer;
