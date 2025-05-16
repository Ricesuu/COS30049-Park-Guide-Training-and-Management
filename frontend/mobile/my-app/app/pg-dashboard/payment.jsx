// app/pg-dashboard/payment.jsx

import React, { useState, useEffect } from "react";
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import PaymentForm from "../../components/Payment/PaymentForm";
import TransactionHistory from "../../components/Payment/TransactionHistory";
import useTransactionHistoryHandler from "../../hooks/useTransactionHistoryHandler";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";
import { purchaseModule } from "../../services/moduleService";
import { formatPrice } from "../../utils/priceFormatter";

const { height: screenHeight } = Dimensions.get("window");

export const Payment = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract module information from params if coming from marketplace
  const moduleId = params.moduleId;
  const moduleName = params.moduleName;
  const price = params.price ? parseFloat(params.price) : 0;
  const returnTo = params.returnTo;
  
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
        paymentMethod: paymentMethod || 'Credit Card',
        amount: price,
      };
      
      // Process purchase
      await purchaseModule(moduleId, paymentDetails);
      
      // Show success message
      Alert.alert(
        "Payment Successful",
        `You have successfully purchased ${moduleName}!`,
        [
          { 
            text: "Go to My Modules", 
            onPress: () => router.replace("/pg-dashboard/module") 
          }
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
    // Show module purchase info if coming from marketplace
  const renderModulePurchaseInfo = () => {
    if (!moduleId) return null;
    
    return (
      <View className="bg-gray-100 p-4 rounded-lg mb-4">
        <Text className="text-lg font-bold text-gray-800">Module: {moduleName}</Text>
        <Text className="text-md text-gray-700">Price: {formatPrice(price)}</Text>
        <Text className="text-md text-gray-700 mb-2">Upload receipt to complete purchase</Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <Header />
      <FlatList
        data={[]} // Dummy data
        keyExtractor={() => "dummy"}
        ListHeaderComponent={
          <View className="flex flex-col gap-6 min-h-screen bg-white rounded-t-3xl p-4">
            {/* Module Purchase Info (if applicable) */}
            {renderModulePurchaseInfo()}
            
            {/* QR Section */}
            <LinearGradient
              colors={["#98FCBD", "#16a34a"]}
              className="items-center justify-center py-12 rounded-3xl"
            >
              <Text className="text-3xl font-semibold mb-4 text-black">Scan To Pay</Text>
              <Image
                source={require("../../assets/qr-code-payment.png")}
                className="w-60 h-60 rounded-lg p-4"
                resizeMode="contain"
              />
            </LinearGradient>

            {/* Payment Form receives refreshTransactions */}
            <PaymentForm refreshTransactions={refreshTransactions} />

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
        }
        contentContainerStyle={{ minHeight: screenHeight, paddingBottom: 120 }}
      />
    </View>
  );
};

export default Payment;
