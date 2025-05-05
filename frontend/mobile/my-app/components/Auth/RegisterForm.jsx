import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import TextInputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import AnimatedButton from "../AnimatedButton";

export default function RegisterForm({ onSubmit, errors = {} }) {
    const router = useRouter();
    const navigateTo = (path) => router.push(path);

    const [role] = useState("park_guide");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = () => {
        onSubmit({
            role,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        });
    };

    return (
        <View className="flex-1 bg-white px-6 pt-8 pb-16 rounded-t-3xl -mt-10">
            <Text className="text-3xl font-bold text-center text-black p-3">
                Create An Account
            </Text>
            <Text className="text-sm text-center text-gray-700 mb-4">
                This registration form is for{" "}
                <Text className="font-bold text-gray-700">Park Guides</Text>{" "}
                only.
            </Text>

            {/* First Name */}
            <TextInputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            {errors?.firstName && (
                <Text className="text-red-500 text-xs mb-2">
                    {errors.firstName}
                </Text>
            )}

            {/* Last Name */}
            <TextInputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            {errors?.lastName && (
                <Text className="text-red-500 text-xs mb-2">
                    {errors.lastName}
                </Text>
            )}

            {/* Email */}
            <TextInputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {errors?.email && (
                <Text className="text-red-500 text-xs mb-2">
                    {errors.email}
                </Text>
            )}

            {/* Password */}
            <PasswordInputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <Text className="w-full text-xs text-gray-500 mb-1">
                Use 8 or more characters with a mix of letters, numbers &
                symbols.
            </Text>
            {errors?.password && (
                <Text className="text-red-500 text-xs mb-2">
                    {errors.password}
                </Text>
            )}

            {/* Confirm Password */}
            <PasswordInputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {errors?.confirmPassword && (
                <Text className="text-red-500 text-xs mb-2">
                    {errors.confirmPassword}
                </Text>
            )}

            {/* Create Account Button */}
            <AnimatedButton
                label="Create Account"
                onPress={handleSubmit}
                className="bg-green-600 mb-4"
            />

            {/* Login Prompt */}
            <View className="flex-row justify-center mt-4">
                <Text className="text-black">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigateTo("/")}>
                    <Text className="font-bold text-green-600 underline">
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
