import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import CustomTabBar from "../components/ApprovalsTabBar";

const ParkGuideApproval = () => (
    <View style={styles.scene}>
        <Text style={styles.sectionHeader}>
            Park Guide Application Approval
        </Text>
        <Text>List of pending park guide applications will appear here.</Text>
    </View>
);

const TransactionApproval = () => (
    <View style={styles.scene}>
        <Text style={styles.sectionHeader}>Transaction Approval</Text>
        <Text>List of pending transactions for approval will appear here.</Text>
    </View>
);

const approvals = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "parkGuide", title: "Park Guide" },
        { key: "transaction", title: "Transaction" },
    ]);

    const renderScene = SceneMap({
        parkGuide: ParkGuideApproval,
        transaction: TransactionApproval,
    });

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "rgb(22 163 74)", // Light gray background color
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginVertical: 10,
                    paddingTop: 10,
                }}
            >
                Approvals
            </Text>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get("window").width }}
                renderTabBar={(props) => <CustomTabBar {...props} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5", // White background for the scene
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default approvals;
