import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, LogBox } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
import { useRoute } from "@react-navigation/native"; // Import useRoute
import CustomTabBar from "../../components/ADMINdashboard/AdminDashboardApprovals/ApprovalsTabBar";
import ParkGuideApproval from "../../components/ADMINdashboard/AdminDashboardApprovals/ParkGuideApproval";
import TransactionApproval from "../../components/ADMINdashboard/AdminDashboardApprovals/TransactionApproval";
import CertificationApproval from "../../components/ADMINdashboard/AdminDashboardApprovals/CertificationApproval";

const approvals = () => {
    const route = useRoute(); // Get route parameters
    const [index, setIndex] = useState(0); // Default to the first tab

    const [routes] = useState([
        { key: "parkGuide", title: "Park Guide" },
        { key: "certification", title: "Certification" },
        { key: "transaction", title: "Transaction" },
    ]);

    const renderScene = SceneMap({
        parkGuide: ParkGuideApproval,
        certification: CertificationApproval,
        transaction: TransactionApproval,
    });

    // Update the tab index whenever the route parameter changes
    useEffect(() => {
        if (route.params?.initialTab === "transaction") {
            setIndex(2); // Set to the "Transaction" tab
        } else if (route.params?.initialTab === "certification") {
            setIndex(1); // Set to the "Certification" tab
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
