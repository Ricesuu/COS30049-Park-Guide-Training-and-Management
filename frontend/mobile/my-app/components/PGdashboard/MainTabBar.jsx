import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import icons from @expo/vector-icons
import HomePage from "../../app/pg-dashboard/with-layout/index";
import Module from "../../app/pg-dashboard/with-layout/module";
import Certificate from "../../app/pg-dashboard/with-layout/certificate";
import PlantInfo from "../../app/pg-dashboard/with-layout/plantinfo";
import Identification from "../../app/pg-dashboard/with-layout/identification";

const Tab = createBottomTabNavigator();

const MainTabBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // Assign icons based on the route name
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Module") {
                        iconName = focused ? "book" : "book-outline";
                    } else if (route.name === "Certificate") {
                        iconName = focused ? "ribbon" : "ribbon-outline";
                    } else if (route.name === "Plant Info") {
                        iconName = focused ? "leaf" : "leaf-outline";
                    } else if (route.name === "Identification") {
                        iconName = focused ? "search" : "search-outline";
                    }

                    // Return the icon component
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "rgb(22, 163, 74)", // Active icon color
                tabBarInactiveTintColor: "gray", // Inactive icon color
            })}
        >
            <Tab.Screen name="Module" component={Module} />
            <Tab.Screen name="Certificate" component={Certificate} />
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Plant Info" component={PlantInfo} />
            <Tab.Screen name="Identification" component={Identification} />
        </Tab.Navigator>
    );
};

export default MainTabBar;
