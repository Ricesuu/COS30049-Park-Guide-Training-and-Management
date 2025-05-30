import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
    LogBox,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";
import { API_URL } from "../../src/constants/constants";
import axios from "axios";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const EditProfile = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem("authToken");

            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(`${API_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { first_name, last_name } = response.data;

            setFormData({
                first_name: first_name || "",
                last_name: last_name || "",
            });

            setError(null);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load profile information. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async () => {
        // Validate form data
        if (!formData.first_name.trim() || !formData.last_name.trim()) {
            Alert.alert(
                "Validation Error",
                "First name and last name are required"
            );
            return;
        }

        try {
            setIsSubmitting(true);
            const token = await AsyncStorage.getItem("authToken");

            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.put(
                `${API_URL}/api/users/profile`,
                {
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            Alert.alert(
                "Success",
                "Your profile has been updated successfully",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error("Error updating profile:", error);
            let errorMessage = "Failed to update profile. Please try again.";

            if (error.message === "Authentication required") {
                errorMessage = "Your session has expired. Please log in again.";
                // Redirect to login after alert
                Alert.alert("Session Expired", errorMessage, [
                    {
                        text: "OK",
                        onPress: () => router.replace("/"),
                    },
                ]);
            } else {
                Alert.alert("Update Failed", errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="rgb(22, 163, 74)"
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Edit Profile</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color="rgb(22, 163, 74)"
                            />
                            <Text style={styles.loadingText}>
                                Loading profile...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={fetchUserProfile}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    First Name
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.first_name}
                                    onChangeText={(text) =>
                                        handleInputChange("first_name", text)
                                    }
                                    placeholder="Enter your first name"
                                    autoCapitalize="words"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.last_name}
                                    onChangeText={(text) =>
                                        handleInputChange("last_name", text)
                                    }
                                    placeholder="Enter your last name"
                                    autoCapitalize="words"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                ) : (
                                    <Text style={styles.saveButtonText}>
                                        Save Changes
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => router.back()}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dashboard: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        paddingBottom: 120,
        zIndex: 1,
        elevation: 10,
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    formContainer: {
        padding: 15,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    saveButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 15,
    },
    saveButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "#f5f5f5",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    cancelButtonText: {
        color: "#666",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default EditProfile;
