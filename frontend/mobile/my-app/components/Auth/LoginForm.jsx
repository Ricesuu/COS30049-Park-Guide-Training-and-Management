import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import TextInputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import AnimatedButton from "../AnimatedButton";
import { useLoginHandler } from "../../hooks/useLoginHandler";

export default function LoginForm() {
    const router = useRouter();
    const { handleLogin, errors, setErrors } = useLoginHandler();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigateTo = (path) => router.push(path);

    const handleEmailChange = (text) => {
        setEmail(text);
        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
    };

    return (
        <View className="flex-1 bg-white px-6 pt-8 pb-16 rounded-t-3xl">
            {/* Header */}
            <Text className="text-4xl font-bold text-center text-black p-3">
                Login
            </Text>
            <Text className="text-2xl font-semibold text-center text-emerald-900 mt-1 mb-6">
                Welcome back!
            </Text>

            {/* Email Input */}
            <TextInputField
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {errors.email ? (
                <Text className="text-red-500 text-sm mb-3 ml-1">
                    {errors.email}
                </Text>
            ) : null}

            {/* Password Input */}
            <PasswordInputField
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
            />
            {errors.password ? (
                <Text className="text-red-500 text-sm mb-3 ml-1">
                    {errors.password}
                </Text>
            ) : null}

            {/* Forgot Password */}
            <View className="items-center mb-6 mt-2">
                <TouchableOpacity
                    onPress={() => navigateTo("/forgot_password")}
                >
                    <Text className="text-gray-700 underline">
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Login Button */}
            <AnimatedButton
                label="Login"
                onPress={() => handleLogin(email, password)}
                className="bg-green-600 mb-4"
            />

            {/* Register Prompt */}
            <View className="flex-row justify-center mt-6">
                <Text className="text-black">Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigateTo("/register")}>
                    <Text className="font-bold text-green-600 underline">
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
