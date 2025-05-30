import React from "react";
import { View, Text } from "react-native";

export const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <View
      style={{
        backgroundColor: "#ecfdf5",
        borderLeftColor: "#16a34a",
        borderLeftWidth: 6,
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#14532d", marginBottom: 4 }}>
        {text1}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#166534",
          flexWrap: "wrap",
        }}
        numberOfLines={0}
      >
        {text2}
      </Text>
    </View>
  ),

  error: ({ text1, text2, ...rest }) => (
    <View
      style={{
        backgroundColor: "#fef2f2",
        borderLeftColor: "#dc2626",
        borderLeftWidth: 6,
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#7f1d1d", marginBottom: 4 }}>
        {text1}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#991b1b",
          flexWrap: "wrap",
        }}
        numberOfLines={0}
      >
        {text2}
      </Text>
    </View>
  ),
};
