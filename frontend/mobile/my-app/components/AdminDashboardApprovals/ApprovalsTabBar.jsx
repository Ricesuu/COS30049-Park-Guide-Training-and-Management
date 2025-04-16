import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const white = "#FFFFFF";
const lightGray = "#D9D9D9";

const CustomTabBar = ({ navigationState, jumpTo }) => {
    return (
        <View style={styles.tabBar}>
            {navigationState.routes.map((route, index) => {
                const isFocused = navigationState.index === index;

                const onPress = () => {
                    jumpTo(route.key); // Use jumpTo to navigate between tabs
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        style={[
                            styles.tabItem,
                            isFocused && styles.tabItemFocused,
                        ]}
                    >
                        {route.key === "parkGuide" ? (
                            <MaterialCommunityIcons
                                name={
                                    isFocused
                                        ? "account-alert"
                                        : "account-alert-outline"
                                }
                                size={24}
                                color={isFocused ? white : lightGray}
                            />
                        ) : route.key === "transaction" ? (
                            <MaterialIcons
                                name="currency-exchange"
                                size={24}
                                color={isFocused ? white : lightGray}
                            />
                        ) : null}
                        <Text
                            style={[
                                styles.tabLabel,
                                isFocused && styles.tabLabelFocused,
                            ]}
                        >
                            {route.title}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        backgroundColor: "rgb(22 163 74)",
        shadowColor: "#000",
        elevation: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        gap: 5,
    },
    tabItemFocused: {
        borderBottomWidth: 3,
        borderBottomColor: "white",
    },
    tabLabel: {
        color: lightGray,
        fontSize: 16,
        fontWeight: "normal",
    },
    tabLabelFocused: {
        color: "white",
        fontWeight: "bold",
    },
});

export default CustomTabBar;
