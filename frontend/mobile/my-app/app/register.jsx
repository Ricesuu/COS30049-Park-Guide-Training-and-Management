import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import ImageCarousel from "../components/Auth/ImageCarousel";
import RegisterForm from "../components/Auth/RegisterForm";
import { useRegisterHandler } from "../hooks/useRegisterHandler";

export default function RegisterPage() {
    const carouselImages = [
        require("../assets/pitcher_plant.jpg"),
        require("../assets/rafflesia.jpg"),
        require("../assets/orchid.jpg"),
    ];

    const { validateForm, registerUser } = useRegisterHandler();
    const [errors, setErrors] = useState({});

    const handleSubmit = (form) => {
        const validationErrors = validateForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        registerUser(form);
    };

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
                    <RegisterForm onSubmit={handleSubmit} errors={errors} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
