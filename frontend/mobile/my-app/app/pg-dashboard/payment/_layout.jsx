import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

/**
 * Layout component for the Payment section
 * This provides a layout wrapper for the payment page without any header
 */
const PaymentLayout = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Payment",
                        animation: "slide_from_bottom",
                    }}
                />
            </Stack>
        </View>
    );
};

const styles = StyleSheet.create({});

export default PaymentLayout;
