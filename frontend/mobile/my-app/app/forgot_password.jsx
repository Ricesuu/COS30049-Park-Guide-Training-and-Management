import React from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
} from "react-native";

import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import Toast from "react-native-toast-message";

export default function ForgotPasswordPage() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Image */}
                    <View className="h-[40vh] w-full overflow-hidden mb-5">
                        <Image
                            source={require("../assets/password_recovery.png")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Form */}
                    <ForgotPasswordForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
