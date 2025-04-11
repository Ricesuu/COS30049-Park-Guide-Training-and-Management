import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

const TabBar = ({ state, descriptors, navigation }) => {
    const activeColour = "green";
    const inactiveColour = "gray";

    const icons = {
        index: (props) => (
            <AntDesign name="home" size={24} color={props.color} />
        ),
        approvals: (props) => (
            <AntDesign name="checkcircleo" size={24} color={props.color} />
        ),
        manage: (props) => (
            <MaterialIcons
                name="manage-accounts"
                size={24}
                color={props.color}
            />
        ),
        monitor: (props) => (
            <Entypo name="line-graph" size={24} color={props.color} />
        ),
        profile: (props) => (
            <AntDesign name="user" size={24} color={props.color} />
        ),
    };

    return (
        // TabBar container
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                if (["_sitemap", "+not-found"].includes(route.name))
                    return null;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                // Render each tab item
                // This is the individual tab item in the TabBar
                // It includes the label and handles press events
                return (
                    <Pressable
                        key={route.name}
                        style={styles.TabBarItem}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {icons[route.name]({
                            color: isFocused ? activeColour : inactiveColour,
                        })}
                        <Text
                            style={{
                                color: isFocused
                                    ? activeColour
                                    : inactiveColour,
                                fontWeight: isFocused ? "bold" : "normal",
                                fontSize: 12,
                            }}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

// Styles for the TabBar component
const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        overflow: "hidden", // Ensures proper rendering on Android
        elevation: 5, // Adds shadow on Android
    },

    TabBarItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
});

export default TabBar;
