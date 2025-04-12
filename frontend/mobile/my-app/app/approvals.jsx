import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import CustomTabBar from "../components/ApprovalsTabBar";

const ParkGuideApproval = () => (
    <View style={styles.scene}>
        <Text style={styles.sectionHeader}>Pending Approvals</Text>

        {/* Park Guide Applicant Listing 1 */}
        <View className="bg-white p-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">John Doe</Text>
                    <Text className="text-gray-500 text-xs">
                        john@gmail.com
                    </Text>
                </View>

                <View>
                    <Text className="text-sm text-gray-600">
                        Applied for:{" "}
                        <Text className="font-medium">Park Guide</Text>
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Location:{" "}
                        <Text className="font-medium">Bako National Park</Text>
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-end space-x-2 gap-x-2 ">
                <TouchableOpacity className="bg-red-100 px-4 py-2 rounded-lg">
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-green-100 px-4 py-2 rounded-lg">
                    <Text className="text-green-600 font-semibold">
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Park Guide Applicant Listing 2 */}
        <View className="bg-white p-4 mb-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">John Cena</Text>
                    <Text className="text-gray-500 text-xs">
                        johnCena@gmail.com
                    </Text>
                </View>

                <View>
                    <Text className="text-sm text-gray-600">
                        Applied for:{" "}
                        <Text className="font-medium">Park Guide</Text>
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Location:{" "}
                        <Text className="font-medium">Bako National Park</Text>
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-end space-x-2 gap-x-2 ">
                <TouchableOpacity className="bg-red-100 px-4 py-2 rounded-lg">
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-green-100 px-4 py-2 rounded-lg">
                    <Text className="text-green-600 font-semibold">
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const TransactionApproval = () => (
    <View style={styles.scene}>
        <Text style={styles.sectionHeader}>Transaction Approval</Text>
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
        paddingTop: 20,
        backgroundColor: "#F5F5F5", // White background for the scene
    },
    sectionHeader: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default approvals;
