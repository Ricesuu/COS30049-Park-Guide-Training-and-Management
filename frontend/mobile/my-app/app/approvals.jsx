import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import CustomTabBar from "../components/ApprovalsTabBar";
import ParkGuideApproval from "../components/ParkGuideApproval";
import TransactionApproval from "../components/TransactionApproval";

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
