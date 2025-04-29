import React from "react";
import { View, Text } from "react-native";

const Header = () => {
    return (
        <View
            style={{
                padding: 20,
                paddingTop: 50,
                paddingBottom: 30,
                backgroundColor: "rgb(22, 163, 74)",
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                }}
            >
                Park Guide Dashboard
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    color: "rgb(200, 255, 200)",
                    textAlign: "center",
                    fontStyle: "italic",
                }}
            >
                Welcome back, Park Guide!
            </Text>
        </View>
    );
};

export default Header;
