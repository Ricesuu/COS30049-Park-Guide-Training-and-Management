import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import CustomTabBar from "../../components/AdminDashboardApprovals/ApprovalsTabBar";
import ParkGuideApproval from "../../components/AdminDashboardApprovals/ParkGuideApproval";
import TransactionApproval from "../../components/AdminDashboardApprovals/TransactionApproval";

const approvals = () => {
    const route = useRoute(); // Get route parameters
    const [index, setIndex] = useState(0); // Default to the first tab

    const [routes] = useState([
        { key: "parkGuide", title: "Park Guide" },
        { key: "transaction", title: "Transaction" },
    ]);

    const renderScene = SceneMap({
        parkGuide: ParkGuideApproval,
        transaction: TransactionApproval,
    });

    // Update the tab index whenever the route parameter changes
    useEffect(() => {
        if (route.params?.initialTab === "transaction") {
            setIndex(1); // Set to the "Transaction" tab
        } else if (route.params?.initialTab === "parkGuide") {
            setIndex(0); // Set to the "Park Guide" tab
        }
    }, [route.params?.initialTab]); // Listen for changes to initialTab

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22 163 74)" }}>
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

export default approvals;
