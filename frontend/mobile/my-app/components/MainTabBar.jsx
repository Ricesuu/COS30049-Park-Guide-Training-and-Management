import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import React, { useRef } from "react";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

/**
 * Custom TabBar component for rendering a bottom navigation bar with animated icons and labels.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.state - The navigation state object containing the current route index and routes.
 * @param {Array} props.state.routes - Array of route objects in the navigation state.
 * @param {number} props.state.index - The index of the currently focused route.
 * @param {Object} props.descriptors - An object containing descriptors for each route, including options like labels and titles.
 * @param {Object} props.navigation - The navigation object used to handle navigation actions.
 *
 * @returns {JSX.Element} A custom tab bar component with animated icons and labels.
 */

// This is the custom TabBar component that will be used in the app's layout.
const MainTabBar = ({ state, descriptors, navigation }) => {
    // Define the colors for active and inactive tabs
    const activeColour = "green";
    const inactiveColour = "gray";

    // Define the icons for each tab using a mapping object
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

    // Render the tab bar
    return (
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

                // Animation setup
                const scaleAnim = useRef(new Animated.Value(1)).current;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }

                    // Trigger scale animation
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.2,
                            duration: 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 100,
                            useNativeDriver: true,
                        }),
                    ]).start();
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                // Render each tab item
                // Use Pressable to handle press events and apply animations
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
                        {/* Animated icon and label for each tab item */}
                        <Animated.View
                            style={{
                                transform: [{ scale: scaleAnim }],
                                alignItems: "center",
                            }}
                        >
                            {icons[route.name]({
                                color: isFocused
                                    ? activeColour
                                    : inactiveColour,
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
                        </Animated.View>
                    </Pressable>
                );
            })}
        </View>
    );
};

// Styles for the TabBar component
const styles = StyleSheet.create({
    // Style for the tab bar container
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

    // Style for each tab item
    TabBarItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
});

export default MainTabBar;
