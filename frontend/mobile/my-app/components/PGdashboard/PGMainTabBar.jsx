// filepath: components/PGdashboard/PGMainTabBar.jsx
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import React, { useRef } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

/**
 * Custom TabBar component for rendering a bottom navigation bar with animated icons and labels
 * for the Park Guide Dashboard.
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

// This is the custom TabBar component that will be used in the Park Guide dashboard layout.
const PGMainTabBar = ({ state, descriptors, navigation }) => {
    // Define the colors for active and inactive tabs
    const activeColour = "rgb(22 163 74)";
    const inactiveColour = "rgb(156 163 175)"; // Define the icons for each tab using a mapping object
    const icons = {
        index: (props) => (
            <Ionicons
                name={props.focused ? "home" : "home-outline"}
                size={24}
                color={props.color}
            />
        ),
        module: (props) => (
            <Ionicons
                name={props.focused ? "book" : "book-outline"}
                size={24}
                color={props.color}
            />
        ),
        certificate: (props) => (
            <Ionicons
                name={props.focused ? "ribbon" : "ribbon-outline"}
                size={24}
                color={props.color}
            />
        ),
        plantinfo: (props) => (
            <Ionicons
                name={props.focused ? "leaf" : "leaf-outline"}
                size={24}
                color={props.color}
            />
        ),
        identification: (props) => (
            <Ionicons
                name={props.focused ? "search" : "search-outline"}
                size={24}
                color={props.color}
            />
        ),
        payment: (props) => (
            <FontAwesome5
                name="money-check-alt"
                size={24}
                color={props.color}
            />
        ),
        profile: (props) => (
            <Ionicons
                name={props.focused ? "person" : "person-outline"}
                size={24}
                color={props.color}
            />
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

                // Skip rendering tab items for hidden routes or system routes
                if (
                    [
                        "_sitemap",
                        "+not-found",
                        "marketplace",
                        "module-marketplace",
                        "edit-profile",
                        "payment",
                    ].includes(route.name) ||
                    options.href === null
                ) {
                    return null;
                }

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
                            {" "}
                            {/* Render the appropriate icon or a default icon if not found */}
                            {typeof icons[route.name] === "function" ? (
                                icons[route.name]({
                                    focused: isFocused,
                                    color: isFocused
                                        ? activeColour
                                        : inactiveColour,
                                })
                            ) : (
                                <Ionicons
                                    name={isFocused ? "apps" : "apps-outline"}
                                    size={24}
                                    color={
                                        isFocused
                                            ? activeColour
                                            : inactiveColour
                                    }
                                />
                            )}
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

export default PGMainTabBar;
