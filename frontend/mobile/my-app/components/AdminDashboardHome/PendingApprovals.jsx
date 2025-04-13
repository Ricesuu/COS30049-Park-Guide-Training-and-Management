import React from "react";
import { View, Text, Pressable } from "react-native";

const PendingApprovals = ({ parkGuideCount, transactionCount, navigation }) => {
    return (
        <View>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "#333",
                }}
            >
                Pending Approvals
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                {/* Park Guide Approvals */}
                <Pressable
                    style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 10,
                        padding: 20,
                        flex: 1,
                        marginRight: 10,
                        alignItems: "center",
                        elevation: 5,
                    }}
                    onPress={() =>
                        navigation.navigate("approvals", {
                            initialTab: "parkGuide",
                        })
                    }
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        {parkGuideCount}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            marginTop: 5,
                        }}
                    >
                        Park Guides Left
                    </Text>
                </Pressable>

                {/* Transaction Approvals */}
                <Pressable
                    style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 10,
                        padding: 20,
                        flex: 1,
                        marginLeft: 10,
                        alignItems: "center",
                        elevation: 5,
                    }}
                    onPress={() =>
                        navigation.navigate("approvals", {
                            initialTab: "transaction",
                        })
                    }
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        {transactionCount}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            marginTop: 5,
                        }}
                    >
                        Transactions Left
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default PendingApprovals;
