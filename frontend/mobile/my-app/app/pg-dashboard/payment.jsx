// app/pg-dashboard/payment.jsx

import React from "react";
import { View, Text, Image, Dimensions, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PaymentForm from "../../components/Payment/PaymentForm";
import TransactionHistory from "../../components/Payment/TransactionHistory";
import useTransactionHistoryHandler from "../../hooks/useTransactionHistoryHandler";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

const { height: screenHeight } = Dimensions.get("window");

export const Payment = () => {
  const {
    transactions,
    loading,
    modalVisible,
    selectedImage,
    openModal,
    closeModal,
    refreshTransactions,
  } = useTransactionHistoryHandler();

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <Header />
      <FlatList
        data={[]} // Dummy data
        keyExtractor={() => "dummy"}
        ListHeaderComponent={
          <View className="flex flex-col gap-6 min-h-screen bg-white rounded-t-3xl">
            {/* QR Section */}
            <LinearGradient
              colors={["#98FCBD", "#16a34a"]}
              className="items-center justify-center py-12 rounded-b-3xl"
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
