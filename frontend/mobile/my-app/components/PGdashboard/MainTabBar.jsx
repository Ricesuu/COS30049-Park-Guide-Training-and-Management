import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5

import HomePage from "../../app/pg-dashboard/with-layout/index";
import Module from "../../app/pg-dashboard/with-layout/module";
import Certificate from "../../app/pg-dashboard/with-layout/certificate";
import PlantInfo from "../../app/pg-dashboard/with-layout/plantinfo";
import Identification from "../../app/pg-dashboard/with-layout/identification";
import Payment from "../../app/pg-dashboard/with-layout/payment"; // Import your Payment screen

const Tab = createBottomTabNavigator();

const MainTabBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // Icon
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Module") {
                        iconName = focused ? "book" : "book-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Certificate") {
                        iconName = focused ? "ribbon" : "ribbon-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Plant Info") {
                        iconName = focused ? "leaf" : "leaf-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Identification") {
                        iconName = focused ? "search" : "search-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Payment") {
                        return <FontAwesome5 name="money-check-alt" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: "rgb(22, 163, 74)",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="Module" component={Module} />
            <Tab.Screen name="Certificate" component={Certificate} />
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Plant Info" component={PlantInfo} />
            <Tab.Screen name="Identification" component={Identification} />
            <Tab.Screen name="Payment" component={Payment} />
        </Tab.Navigator>
    );
};

export default MainTabBar;
