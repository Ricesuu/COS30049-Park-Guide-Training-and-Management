import React from "react";
import { TextInput } from "react-native";

export default function TextInputField({
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    autoCapitalize = "sentences",
}) {
    return (
        <TextInput
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-400 placeholder:text-gray-400"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
        />
    );
}
