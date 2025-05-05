import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center bg-white px-6">
            <Text className="text-2xl font-bold text-red-600 mb-4">
                Access Denied
            </Text>
            <Text className="text-center text-gray-600 mb-6">
                You do not have permission to view this page.
            </Text>

            <TouchableOpacity
                onPress={() => router.replace("/")}
                className="bg-red-600 px-6 py-3 rounded-2xl"
            >
                <Text className="text-white font-semibold">
                    Return to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}
