import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import useForgotPasswordHandler from "../../hooks/useForgotPasswordHandler";
import TextInputField from "./TextInputField";
import AnimatedButton from "../AnimatedButton";

export default function ForgotPasswordForm() {
    const { email, setEmail, error, handleSubmit } = useForgotPasswordHandler();

    const router = useRouter();
    const navigateTo = (path) => router.push(path);

    return (
        <View className="flex-1 bg-white px-6 pt-8 pb-16 rounded-t-3xl -mt-10">
            <Text className="text-3xl font-bold text-center text-black p-3">
                Forgot Your Password?
            </Text>
            <Text className="text-base text-gray-600 text-center pb-4 pt-2">
                Enter your email so we can send you a reset link.
            </Text>

            <TextInputField
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {error && (
                <Text className="text-red-600 text-sm mb-2">{error}</Text>
            )}

            <AnimatedButton
                label="Submit"
                onPress={handleSubmit}
                className="bg-green-600 mb-4 mt-4"
            />

            <Text className="text-center text-gray-800 mt-2">
                <Text
                    className="font-semibold"
                    onPress={() => router.push("/")}
                >
                    Back To Login
                </Text>
            </Text>
        </View>
    );
}
