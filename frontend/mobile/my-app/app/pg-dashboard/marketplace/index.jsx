import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
    fetchAvailableModules,
    purchaseModule,
} from "../../../services/moduleService";
import { formatPrice } from "../../../utils/priceFormatter";

const ModuleMarketplace = () => {
    const [availableModules, setAvailableModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [compulsoryModules, setCompulsoryModules] = useState([]);
    const [completedCompulsoryModules, setCompletedCompulsoryModules] =
        useState([]);
    const router = useRouter();

    useEffect(() => {
        console.log("Module marketplace mounted, loading available modules...");
        loadAvailableModules();
    }, []); // Reset purchasing state when screen comes into focus or loses focus
    useFocusEffect(
        useCallback(() => {
            console.log(
                "Marketplace screen focused, resetting purchasing state"
            );
            setPurchasing(null);

            // Also reset when screen loses focus
            return () => {
                console.log("Marketplace screen unfocused, cleaning up state");
                setPurchasing(null);
            };
        }, [])
    );

    const loadAvailableModules = async (isRefreshing = false) => {
        if (!isRefreshing) {
            setIsLoading(true);
        }
        setPurchasing(null); // Also reset purchasing state when reloading data
        try {
            console.log("Fetching available modules...");
            const modules = await fetchAvailableModules();
            // Sort modules by module_order if available, otherwise by id
            const sortedModules = modules.sort(
                (a, b) => (a.module_order || a.id) - (b.module_order || b.id)
            );
            console.log(`Successfully loaded ${modules.length} modules`);

            // Filter and track compulsory modules
            const compulsoryMods = sortedModules.filter(
                (module) => module.is_compulsory
            );
            const completedCompulsoryMods = compulsoryMods.filter(
                (module) => module.purchase_status === "purchased"
            );

            setCompulsoryModules(compulsoryMods);
            setCompletedCompulsoryModules(completedCompulsoryMods);
            setAvailableModules(sortedModules);
            setError(null);
        } catch (error) {
            console.error("Error loading available modules:", error);
            setError("Failed to load modules. Please try again later.");
            Alert.alert(
                "Error",
                "Failed to load available modules. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    }; // Handle free module enrollments directly without payment
    const handleFreeEnrollment = async (moduleId, moduleName) => {
        setPurchasing(moduleId);
        try {
            // Import the direct enrollment function from moduleService
            const {
                directEnrollModule,
            } = require("../../../services/moduleService");

            // Call direct enrollment for free modules
            await directEnrollModule(moduleId, moduleName);

            // Show success message
            Alert.alert(
                "Enrollment Successful",
                `You have successfully enrolled in ${moduleName}!`,
                [
                    {
                        text: "View My Modules",
                        onPress: () => router.replace("/pg-dashboard/module"),
                    },
                ]
            );
        } catch (error) {
            console.error("Error enrolling in free module:", error);
            Alert.alert(
                "Enrollment Failed",
                "Unable to enroll in this module. Please try again later."
            );
        } finally {
            setPurchasing(null);
        }
    };

    const handlePurchase = async (moduleId, moduleName, price) => {
        setPurchasing(moduleId);
        // Use try/catch to ensure we reset purchasing state if navigation fails
        try {
            router.push({
                pathname: "/pg-dashboard/payment",
                params: {
                    moduleId,
                    moduleName,
                    price,
                    returnTo: "/pg-dashboard/marketplace/",
                },
            });
        } catch (error) {
            console.error("Error navigating to payment page:", error);
            setPurchasing(null);
        }
    };

    const handleBackToModules = () => {
        router.push("/pg-dashboard/module");
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadAvailableModules(true);
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToModules}
                >
                    <Text style={styles.backButtonText}>
                        &lt; Back to My Modules
                    </Text>
                </TouchableOpacity>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color="rgb(22, 163, 74)"
                        />
                        <Text style={styles.loadingText}>
                            Loading available modules...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={loadAvailableModules}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : availableModules.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateTitle}>
                            No Modules Available
                        </Text>
                        <Text style={styles.emptyStateText}>
                            There are currently no modules available for
                            purchase. Please check back later.
                        </Text>
                    </View>
                ) : (
                    <View>
                        {compulsoryModules.length > 0 && (
                            <View style={styles.compulsoryNotice}>
                                <Text style={styles.compulsoryNoticeTitle}>
                                    Compulsory Modules
                                </Text>
                                <Text style={styles.compulsoryNoticeText}>
                                    Complete all compulsory modules to unlock
                                    additional modules.
                                    {"\n"}Progress:{" "}
                                    {completedCompulsoryModules.length}/
                                    {compulsoryModules.length}
                                </Text>
                            </View>
                        )}
                        {availableModules.map((module) => (
                            <View key={module.id} style={styles.moduleItem}>
                                <View style={styles.moduleDetails}>
                                    {" "}
                                    <View style={styles.badgeContainer}>
                                        {module.is_compulsory && (
                                            <View
                                                style={styles.compulsoryBadge}
                                            >
                                                <Text
                                                    style={
                                                        styles.compulsoryText
                                                    }
                                                >
                                                    Compulsory
                                                </Text>
                                            </View>
                                        )}
                                        {module.price > 0 && (
                                            <View
                                                style={[
                                                    styles.statusLabel,
                                                    module.purchase_status ===
                                                    "pending"
                                                        ? styles.pendingStatus
                                                        : null,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.statusText,
                                                        module.purchase_status ===
                                                        "pending"
                                                            ? styles.pendingStatusText
                                                            : null,
                                                    ]}
                                                >
                                                    {module.purchase_status ===
                                                    "pending"
                                                        ? "Payment Pending Approval"
                                                        : null}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            styles.moduleName,
                                            module.isLocked &&
                                                styles.lockedModuleName,
                                        ]}
                                    >
                                        {module.name}
                                    </Text>
                                    <Text style={styles.modulePrice}>
                                        {module.price === 0
                                            ? "FREE"
                                            : formatPrice(module.price)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.moduleDescription,
                                            module.isLocked &&
                                                styles.lockedModuleDescription,
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {module.description}
                                    </Text>{" "}
                                    <TouchableOpacity
                                        style={[
                                            styles.purchaseButton,
                                            module.isLocked ||
                                            module.purchase_status ===
                                                "purchased" ||
                                            module.purchase_status === "pending"
                                                ? styles.disabledButton
                                                : null,
                                        ]}
                                        onPress={() => {
                                            if (
                                                module.purchase_status ===
                                                "pending"
                                            ) {
                                                Alert.alert(
                                                    "Payment Pending",
                                                    "Your payment for this module is pending approval. Please wait for confirmation."
                                                );
                                                return;
                                            }
                                            if (
                                                !module.is_compulsory &&
                                                compulsoryModules.length !==
                                                    completedCompulsoryModules.length
                                            ) {
                                                Alert.alert(
                                                    "Cannot Purchase Module",
                                                    "You must complete all compulsory modules first."
                                                );
                                                return;
                                            }
                                            if (
                                                module.purchase_status ===
                                                "purchased"
                                            ) {
                                                Alert.alert(
                                                    "Already Purchased",
                                                    "You have already purchased this module."
                                                );
                                                return;
                                            }
                                            if (module.price === 0) {
                                                handleFreeEnrollment(
                                                    module.id,
                                                    module.name
                                                );
                                            } else {
                                                handlePurchase(
                                                    module.id,
                                                    module.name,
                                                    module.price
                                                );
                                            }
                                        }}
                                        disabled={
                                            purchasing === module.id ||
                                            !module.canPurchase ||
                                            module.purchase_status === "pending"
                                        }
                                    >
                                        {purchasing === module.id ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="white"
                                            />
                                        ) : (
                                            <Text
                                                style={[
                                                    styles.purchaseButtonText,
                                                    module.isLocked ||
                                                    module.purchase_status ===
                                                        "purchased"
                                                        ? styles.disabledButtonText
                                                        : null,
                                                ]}
                                            >
                                                {module.purchase_status ===
                                                "purchased"
                                                    ? "Already Enrolled"
                                                    : module.purchase_status ===
                                                      "pending"
                                                    ? "Payment Pending"
                                                    : module.price === 0
                                                    ? "Sign Up for Free"
                                                    : "Sign Up for Module"}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    disabledButtonText: {
        color: "#9ca3af",
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: "rgb(22, 163, 74)",
        fontWeight: "bold",
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
    emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    moduleItem: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    moduleName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    lockedModuleName: {
        color: "#9ca3af",
    },
    modulePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e67e22",
        marginVertical: 2,
    },
    moduleDescription: {
        fontSize: 14,
        marginTop: 4,
        color: "#666",
    },
    lockedModuleDescription: {
        color: "#9ca3af",
    },
    purchaseButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "flex-start",
        minWidth: 100,
        alignItems: "center",
    },
    purchaseButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#e5e7eb",
        opacity: 0.8,
    },
    compulsoryBadge: {
        backgroundColor: "#dc2626",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    compulsoryText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    lockedBadge: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    lockedText: {
        color: "#6b7280",
        fontSize: 12,
        fontWeight: "500",
    },
    lockMessage: {
        color: "#ef4444",
        fontSize: 12,
        marginTop: 8,
        marginBottom: 8,
    },
    compulsoryNotice: {
        backgroundColor: "rgb(240, 255, 244)", // Light green background
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "rgb(22, 163, 74)",
    },
    compulsoryNoticeTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 4,
    },
    compulsoryNoticeText: {
        color: "#333",
        lineHeight: 20,
    },
    pendingBadge: {
        backgroundColor: "#eab308",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    pendingText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    statusLabel: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
        alignSelf: "flex-start",
    },
    approvedStatus: {
        backgroundColor: "#dcfce7", // light green
    },
    pendingStatus: {
        backgroundColor: "#fef9c3", // light yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    approvedStatusText: {
        color: "#166534", // dark green
    },
    pendingStatusText: {
        color: "#854d0e", // dark yellow
    },
    badgeContainer: {
        marginBottom: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
});

export default ModuleMarketplace;
