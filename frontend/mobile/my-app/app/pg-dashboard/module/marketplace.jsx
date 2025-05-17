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
    LogBox,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
    fetchAvailableModules,
    purchaseModule,
} from "../../../services/moduleService";
import { formatPrice } from "../../../utils/priceFormatter";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const ModuleMarketplace = () => {
    const [availableModules, setAvailableModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(null);
    const router = useRouter();

    useEffect(() => {
        console.log("Module marketplace mounted, loading available modules...");
        loadAvailableModules();
    }, []); // Reset purchasing state when screen comes into focus or loses focus
    useFocusEffect(
        useCallback(() => {
            console.log(
                "Module marketplace screen focused, resetting purchasing state"
            );
            setPurchasing(null);

            // Also reset when screen loses focus
            return () => {
                console.log(
                    "Module marketplace screen unfocused, cleaning up state"
                );
                setPurchasing(null);
            };
        }, [])
    );

    const loadAvailableModules = async () => {
        setIsLoading(true);
        setPurchasing(null); // Also reset purchasing state when reloading data
        try {
            console.log("Fetching available modules...");
            const modules = await fetchAvailableModules();
            console.log(`Successfully loaded ${modules.length} modules`);
            setAvailableModules(modules);
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
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
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

                <Text style={styles.title}>Module Marketplace</Text>

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
                        {availableModules.map((module) => (
                            <View key={module.id} style={styles.moduleItem}>
                                <Image
                                    source={{ uri: module.imageUrl }}
                                    style={styles.moduleImage}
                                    defaultSource={require("../../../assets/images/module-placeholder.png")}
                                />
                                <View style={styles.moduleDetails}>
                                    <Text style={styles.moduleName}>
                                        {module.name}
                                    </Text>
                                    <Text style={styles.modulePrice}>
                                        {formatPrice(module.price)}
                                    </Text>
                                    <Text
                                        style={styles.moduleDescription}
                                        numberOfLines={2}
                                    >
                                        {module.description}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.purchaseButton}
                                        onPress={() =>
                                            handlePurchase(
                                                module.id,
                                                module.name,
                                                module.price
                                            )
                                        }
                                        disabled={purchasing === module.id}
                                    >
                                        {purchasing === module.id ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="white"
                                            />
                                        ) : (
                                            <Text
                                                style={
                                                    styles.purchaseButtonText
                                                }
                                            >
                                                Purchase
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
        color: "rgb(22, 163, 74)",
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
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    moduleImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: "#e0e0e0",
    },
    moduleDetails: {
        marginLeft: 10,
        flex: 1,
    },
    moduleName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
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
});

export default ModuleMarketplace;
