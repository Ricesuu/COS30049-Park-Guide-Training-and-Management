import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
} from "react-native";

export default function TransactionHistory({
  transactions,
  modalVisible,
  selectedImage,
  openModal,
  closeModal,
}) {
  const getStatusColor = (status) => {
    if (status === "approved") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  const formatTitleCase = (text) => {
    return text
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatMethod = (method) => {
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between border-b border-gray-200 py-2">
      <Text className="flex-[0.5] text-xs text-center text-gray-700">
        {item.payment_id}
      </Text>
      <Text
        className="flex-[0.8] text-xs text-center"
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {formatTitleCase(item.paymentPurpose)}
      </Text>
      <Text className="flex-[0.8] text-xs text-center">
        RM {Number(item.amountPaid).toFixed(2)}
      </Text>
      <Text className="flex-[0.8] text-xs text-center">
        {formatMethod(item.paymentMethod)}
      </Text>
      <Text
        className={`flex-[0.8] text-xs text-center font-bold ${getStatusColor(
          item.paymentStatus
        )}`}
      >
        {item.paymentStatus.toUpperCase()}
      </Text>
      <TouchableOpacity
        onPress={() => openModal(item.receiptImageBase64)}
        className="flex-[0.8]"
      >
        <Text className="text-xs text-center text-blue-600 underline">View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="m-5 bg-green-100 px-4 rounded-xl">
      <Text className="text-xl font-semibold m-2 p-3 text-center">
        Transaction History
      </Text>

      {/* Header */}
      <View className="flex-row justify-between border-b border-black py-2 bg-green-600">
        <Text className="flex-[0.5] text-xs text-white font-bold text-center">
          ID
        </Text>
        <Text className="flex-[0.8] text-xs text-white font-bold text-center">
          Purpose
        </Text>
        <Text className="flex-[0.8] text-xs text-white font-bold text-center">
          Amount
        </Text>
        <Text className="flex-[0.8] text-xs text-white font-bold text-center">
          Method
        </Text>
        <Text className="flex-[0.8] text-xs text-white font-bold text-center">
          Status
        </Text>
        <Text className="flex-[0.8] text-xs text-white font-bold text-center">
          Receipt
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.payment_id.toString()}
        scrollEnabled={false}
        className="bg-white mb-5"
        ListEmptyComponent={
          <Text className="text-center text-gray-500 py-6 font-medium">
            No transaction records found.
          </Text>
        }
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-70 justify-center items-center px-4">
          <View className="bg-white p-4 rounded-lg w-full max-h-[80%] items-center">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 300, height: 400, resizeMode: "contain" }}
            />
            <Pressable
              className="mt-4 px-4 py-2 bg-green-600 rounded-full"
              onPress={closeModal}
            >
              <Text className="text-white font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
