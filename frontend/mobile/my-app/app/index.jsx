import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import ImageCarousel from "../components/Auth/ImageCarousel";
import LoginForm from "../components/Auth/LoginForm";

export default function LoginPage() {
    const carouselImages = [
        require("../assets/hornbill.jpg"),
        require("../assets/hawksbill_turtle.jpg"),
        require("../assets/orang_utan.jpeg"),
    ];

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
                    <ImageCarousel images={carouselImages} />
                    <LoginForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
