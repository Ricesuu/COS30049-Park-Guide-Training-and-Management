import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Homepage from "../../app/index"; // Use Homepage as the HomeScreen
import Certification from "../../app/certification"; // Import Certification screen

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Homepage} /> {/* Use Homepage */}
        <Stack.Screen name="Certification" component={Certification} /> {/* Add Certification */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;