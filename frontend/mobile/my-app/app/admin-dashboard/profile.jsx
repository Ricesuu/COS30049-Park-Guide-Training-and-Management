import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../lib/Firebase";
import { signOut } from "firebase/auth";
import { API_URL } from "../../src/constants/constants";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const ProfilePage = () => {
    const router = useRouter();
    const { authUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const token = await authUser.getIdToken();

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to fetch profile data"
                );
            }

            const data = await response.json();
            setProfileData(data);

            // Initialize form with current data
            setFirstName(data.first_name || "");
            setLastName(data.last_name || "");
        } catch (error) {
            console.error("Error fetching profile:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to load profile data",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeDetails = () => {
        setDetailsModalVisible(true);
    };

    const handleChangePassword = () => {
        setPasswordModalVisible(true);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await AsyncStorage.multiRemove([
                "userRole",
                "userStatus",
                "authToken",
            ]);
            Toast.show({
                type: "success",
                text1: "Logged Out",
                text2: "You have been successfully logged out",
                position: "bottom",
            });
            router.replace("/");
        } catch (error) {
            console.error("Error during logout:", error);
            Toast.show({
                type: "error",
                text1: "Logout Error",
                text2: "Failed to log out. Please try again.",
                position: "bottom",
            });
        }
    };

    const saveProfileDetails = async () => {
        // Validate inputs
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const token = await authUser.getIdToken();

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            await fetchProfileData(); // Refresh profile data
            setDetailsModalVisible(false);
            Toast.show({
                type: "success",
                text1: "Profile Updated",
                text2: "Your profile has been updated successfully",
                position: "bottom",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            Toast.show({
                type: "error",
                text1: "Update Error",
                text2: error.message || "Failed to update profile",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const saveNewPassword = async () => {
        // Validate inputs
        const newErrors = {};
        if (!newPassword) newErrors.newPassword = "New password is required";
        if (newPassword.length < 6)
            newErrors.newPassword = "Password must be at least 6 characters";
        if (newPassword !== confirmPassword)
            newErrors.confirmPassword = "Passwords don't match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const token = await authUser.getIdToken();

            const response = await fetch(
                `${API_URL}/api/users/change-password`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newPassword: newPassword,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to change password");
            }

            setPasswordModalVisible(false);
            setNewPassword("");
            setConfirmPassword("");

            Toast.show({
                type: "success",
                text1: "Password Changed",
                text2: "Your password has been updated successfully",
                position: "bottom",
            });

            // Force re-login for security
            Alert.alert(
                "Password Updated",
                "For security reasons, you'll be logged out and need to log in again with your new password.",
                [
                    {
                        text: "OK",
                        onPress: handleLogout,
                    },
                ]
            );
        } catch (error) {
            console.error("Error changing password:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "Failed to change password",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profileData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                <Text style={{ marginTop: 10 }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Profile</Text>

            {/* Profile Details */}
            <View style={styles.profileCard}>
                <Text style={styles.profileName}>
                    {profileData?.first_name} {profileData?.last_name}
                </Text>
                <Text style={styles.profileEmail}>{profileData?.email}</Text>
                <Text style={styles.profileRole}>
                    Role:{" "}
                    {profileData?.role === "admin"
                        ? "Administrator"
                        : profileData?.role}
                </Text>
                <Text style={styles.profileMember}>
                    Member since:{" "}
                    {new Date(profileData?.created_at).toLocaleDateString()}
                </Text>

                {/* Change Details Button */}
                <TouchableOpacity
                    style={styles.greenButton}
                    onPress={handleChangeDetails}
                >
                    <Text style={styles.buttonText}>Change Details</Text>
                </TouchableOpacity>

                {/* Change Password Button */}
                <TouchableOpacity
                    style={styles.greenButton}
                    onPress={handleChangePassword}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.redButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Change Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailsModalVisible}
                onRequestClose={() => setDetailsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Details</Text>

                        <Text style={styles.inputLabel}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <Text style={styles.errorText}>
                                {errors.firstName}
                            </Text>
                        )}

                        <Text style={styles.inputLabel}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <Text style={styles.errorText}>
                                {errors.lastName}
                            </Text>
                        )}

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => {
                                    setDetailsModalVisible(false);
                                    setErrors({});
                                    // Reset form to original values
                                    setFirstName(profileData?.first_name || "");
                                    setLastName(profileData?.last_name || "");
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={saveProfileDetails}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={passwordModalVisible}
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            secureTextEntry
                        />
                        {errors.newPassword && (
                            <Text style={styles.errorText}>
                                {errors.newPassword}
                            </Text>
                        )}

                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            secureTextEntry
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>
                                {errors.confirmPassword}
                            </Text>
                        )}

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => {
                                    setPasswordModalVisible(false);
                                    setErrors({});
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={saveNewPassword}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Activity Indicator for loading states */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 20,
        backgroundColor: "rgb(22, 163, 74)",
    },
    profileCard: {
        backgroundColor: "white",
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        alignItems: "center",
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    profileRole: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    profileMember: {
        fontSize: 14,
        color: "#777",
        marginBottom: 20,
    },
    greenButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: "80%",
    },
    redButton: {
        backgroundColor: "rgb(220, 38, 38)",
        padding: 15,
        borderRadius: 10,
        width: "80%",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    loadingOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: "85%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modalCancelButton: {
        backgroundColor: "#aaa",
        padding: 12,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    modalSaveButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 12,
        borderRadius: 5,
        flex: 1,
    },
});

export default ProfilePage;
