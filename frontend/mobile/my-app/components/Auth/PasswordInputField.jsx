import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PasswordInputField({
    value,
    onChangeText,
    placeholder = "Password",
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="relative mb-4">
            <TextInput
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-400 placeholder:text-gray-400"
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
            />
            <Pressable
                className="absolute right-3 top-3"
                onPress={() => setShowPassword((prev) => !prev)}
            >
                <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="gray"
                />
            </Pressable>
        </View>
    );
}
