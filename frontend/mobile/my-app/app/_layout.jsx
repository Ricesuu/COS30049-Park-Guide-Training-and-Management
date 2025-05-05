import { AuthProvider } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "../lib/toastConfig";
import { Slot } from "expo-router";

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
            <Toast config={toastConfig} />
        </AuthProvider>
    );
}
