// components/PGdashboard/Profile/EditProfileButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EditProfileButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/pg-dashboard/edit-profile")}
        >
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    editProfileButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    editProfileText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 8,
    },
});

export default EditProfileButton;
