// app/pg-dashboard/payment/index.jsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import PaymentForm from "../../../components/Payment/PaymentForm";
import TransactionHistory from "../../../components/Payment/TransactionHistory";
import useTransactionHistoryHandler from "../../../hooks/useTransactionHistoryHandler";
import { purchaseModule } from "../../../services/moduleService";
import { formatPrice } from "../../../utils/priceFormatter";

const { height: screenHeight } = Dimensions.get("window");

const Payment = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    // Extract module information from params if coming from marketplace
    const moduleId = params.moduleId;
    const moduleName = params.moduleName;
    const price = params.price ? parseFloat(params.price) : 0;
    const returnTo = params.returnTo;

    useEffect(() => {
        if (moduleId && moduleName) {
            console.log("Module purchase info from params:", {
                moduleId,
                moduleName,
                price,
            });
        }
    }, [moduleId, moduleName, price]);

    const {
        transactions,
        loading,
        modalVisible,
        selectedImage,
        openModal,
        closeModal,
        refreshTransactions,
    } = useTransactionHistoryHandler();

    // Handle module purchase
    const handleModulePurchase = async (paymentMethod) => {
        if (!moduleId) return;

        setIsProcessing(true);
        try {
            // Prepare payment details
            const paymentDetails = {
                moduleName: moduleName,
                paymentMethod: paymentMethod || "Credit Card",
                amount: price,
            };

            // Process purchase
            await purchaseModule(moduleId, paymentDetails); // Show success message
            Alert.alert(
                "Payment Successful",
                `You have successfully purchased ${moduleName}!`,
                [
                    {
                        text: "View My Modules",
                        onPress: () => router.replace("/pg-dashboard/module"),
                    },
                    {
                        text: "Back",
                        onPress: () =>
                            router.replace("/pg-dashboard/marketplace"),
                        style: "cancel",
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Payment Failed",
                "Unable to process your payment. Please try again later."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <FlatList
            data={[]} // Dummy data
            keyExtractor={() => "dummy"}
            ListHeaderComponent={
                <>
                    {/* Green header with back button */}{" "}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButtonContainer}
                            onPress={() => {
                                // Always navigate back to marketplace
                                router.replace("/pg-dashboard/marketplace");
                            }}
                        >
                            <Text style={styles.backButtonText}>&lt; Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                        {/* QR Section */}
                        <LinearGradient
                            colors={["#98FCBD", "#16a34a"]}
                            className="items-center justify-center py-12 rounded-3xl"
                        >
                            <Text className="text-3xl font-semibold mb-4 text-black">
                                Scan To Pay
                            </Text>
                            <Image
                                source={require("../../../assets/qr-code-payment.png")}
                                className="w-60 h-60 rounded-lg p-4"
                                resizeMode="contain"
                            />
                        </LinearGradient>

                        {/* Payment Form receives refreshTransactions and module info */}
                        <PaymentForm
                            refreshTransactions={refreshTransactions}
                            moduleId={moduleId}
                            moduleName={moduleName}
                            modulePrice={price}
                        />

                        {/* Transaction History receives the rest */}
                        <TransactionHistory
                            transactions={transactions}
                            loading={loading}
                            modalVisible={modalVisible}
                            selectedImage={selectedImage}
                            openModal={openModal}
                            closeModal={closeModal}
                        />
                    </View>
                </>
            }            contentContainerStyle={{
                minHeight: screenHeight,
                paddingBottom: 120, // Extra padding to avoid content being covered by navigation
                backgroundColor: "white",
                paddingLeft: 0,
                paddingRight: 0,
            }}
        />
    );
};

export default Payment;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonContainer: {
        marginRight: 16,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },    contentContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 0, // Removed padding to eliminate white space
        gap: 24,
    },
});
