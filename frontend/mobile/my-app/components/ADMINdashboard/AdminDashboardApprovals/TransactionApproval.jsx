import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Modal,
    Image,
    ActivityIndicator,
    Dimensions,
    ScrollView,
} from "react-native";
import { fetchData } from "../../../src/api/api";
import { API_URL } from "../../../src/constants/constants";

import "../../../global.css";

const TransactionApproval = () => {
    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [receiptModalVisible, setReceiptModalVisible] = useState(false);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptImage, setReceiptImage] = useState(null);

    const fetchTransactions = async (isRefreshing = false) => {
        try {
            console.log("Fetching payment transactions approvals...");

            const transactionsResponse = await fetchData(
                "/payment-transactions"
            );

            // Filter transactions with paymentStatus 'pending'
            const pendingTransactions = transactionsResponse.filter(
                (transaction) =>
                    transaction.paymentStatus &&
                    transaction.paymentStatus.toLowerCase() === "pending"
            );

            // Fetch user details for each pending transaction
            const userDetailsPromises = pendingTransactions.map((transaction) =>
                fetchData(`/users/${transaction.uid}`)
            );

            const userDetails = await Promise.all(userDetailsPromises);

            // Combine transaction and user details
            const combinedData = pendingTransactions.map(
                (transaction, index) => ({
                    ...transaction,
                    userDetails: userDetails[index] || {}, // Merge user details into the transaction object
                })
            );

            // Map the combined data to the format needed for display
            setTransactions(
                combinedData.map((transaction) => ({
                    id: transaction.payment_id?.toString() || "N/A",
                    name: `${transaction.userDetails.first_name || "Unknown"} ${
                        transaction.userDetails.last_name || "Unknown"
                    }`,
                    email: transaction.userDetails.email || "No email provided",
                    amount: transaction.amountPaid
                        ? `RM${transaction.amountPaid}`
                        : "N/A",
                    purpose: transaction.paymentPurpose || "Not specified",
                    method: transaction.paymentMethod || "Not specified",
                    date: transaction.transaction_date
                        ? new Date(
                              transaction.transaction_date
                          ).toLocaleDateString()
                        : "Unknown date",
                    uid: transaction.uid,
                }))
            );
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    };

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions(true);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);    // Handle approve action
    const handleApprove = async (id) => {
        try {
            console.log(`Approving transaction ${id}...`);

            const response = await fetch(
                `${API_URL}/api/payment-transactions/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paymentStatus: "approved" }),
                }
            );

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    throw new Error(
                        `Server responded with status: ${response.status}`
                    );
                }
                throw new Error(
                    errorData.error || "Failed to approve the transaction"
                );
            }

            const responseData = await response.json();
            console.log(`Transaction ${id} approved successfully:`, responseData);

            // Refresh the transactions list after approval
            fetchTransactions();
        } catch (error) {
            console.error("Error approving transaction:", error);
        }
    };

    // Handle reject action
    const handleReject = async (id) => {
        try {
            console.log(`Rejecting transaction ${id}...`);

            const response = await fetch(
                `${API_URL}/api/payment-transactions/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paymentStatus: "rejected" }),
                }
            );

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    throw new Error(
                        `Server responded with status: ${response.status}`
                    );
                }
                throw new Error(
                    errorData.error || "Failed to reject the transaction"
                );
            }

            console.log(`Transaction ${id} rejected successfully`);

            // Refresh the transactions list after rejection
            fetchTransactions();
        } catch (error) {
            console.error("Error rejecting transaction:", error);
        }
    };

    // Handle viewing receipt
    const handleViewReceipt = async (transaction) => {
        try {
            setSelectedTransaction(transaction);
            setReceiptModalVisible(true);
            setReceiptLoading(true);
            setReceiptImage(null);

            // Fetch the transaction details with the receipt image
            const response = await fetch(
                `${API_URL}/api/payment-transactions/${transaction.id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch receipt. Status: ${response.status}`
                );
            }

            const data = await response.json();

            if (!data.receipt_image) {
                throw new Error("No receipt image available");
            }

            // Convert base64 string to usable image source
            setReceiptImage(`data:image/jpeg;base64,${data.receipt_image}`);
            setReceiptLoading(false);
        } catch (error) {
            console.error("Error fetching receipt:", error);
            setReceiptLoading(false);
        }
    };

    const closeReceiptModal = () => {
        setReceiptModalVisible(false);
        setSelectedTransaction(null);
        setReceiptImage(null);
    };

    // Format payment method for display
    const formatPaymentMethod = (method) => {
        if (!method) return "N/A";

        return method
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Format payment purpose for display
    const formatPaymentPurpose = (purpose) => {
        if (!purpose) return "N/A";

        return purpose
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const renderTransaction = ({ item }) => (
        <TouchableOpacity
            className="bg-white p-4 border-b border-gray-200"
            onPress={() => handleViewReceipt(item)}
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <View className="mb-2">
                        <Text className="font-semibold text-lg">
                            {item.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            {item.email}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-sm text-gray-600">
                            Amount:{" "}
                            <Text className="font-medium">{item.amount}</Text>
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Purpose:{" "}
                            <Text className="font-medium">
                                {formatPaymentPurpose(item.purpose)}
                            </Text>
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Method:{" "}
                            <Text className="font-medium">
                                {formatPaymentMethod(item.method)}
                            </Text>
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Date:{" "}
                            <Text className="font-medium">{item.date}</Text>
                        </Text>
                    </View>
                    <Text className="text-blue-500 text-xs mt-2">
                        Tap to view receipt
                    </Text>
                </View>
                <View className="flex-col justify-center mr-6">
                    <TouchableOpacity
                        className="bg-green-100 px-4 py-3 rounded-lg w-24 items-center mb-2"
                        onPress={() => handleApprove(item.id)}
                    >
                        <Text className="text-green-600 font-semibold">
                            Approve
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-100 px-4 py-3 rounded-lg w-24 items-center"
                        onPress={() => handleReject(item.id)}
                    >
                        <Text className="text-red-600 font-semibold">
                            Reject
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const windowWidth = Dimensions.get("window").width;

    return (
        <View className="flex-1 pt-5 bg-gray-100">
            <Text className="text-2xl font-bold text-center mb-5">
                Transaction Approvals
            </Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-5 p-4">
                        {loading ? "Loading..." : "No pending transactions."}
                    </Text>
                }
                contentContainerStyle={{
                    paddingBottom: 140,
                }}
            />

            {/* Receipt Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={receiptModalVisible}
                onRequestClose={closeReceiptModal}
            >
                <View className="flex-1 justify-center items-center bg-black/70">
                    <View className="bg-white rounded-lg p-4 w-11/12 max-h-5/6">
                        <Text className="text-xl font-bold text-center mb-4">
                            Payment Receipt
                        </Text>

                        {selectedTransaction && (
                            <ScrollView className="mb-4">
                                <View className="p-2 border border-gray-200 rounded-lg mb-4">
                                    <Text className="text-gray-700">
                                        <Text className="font-bold">Name:</Text>{" "}
                                        {selectedTransaction.name}
                                    </Text>
                                    <Text className="text-gray-700">
                                        <Text className="font-bold">
                                            Amount:
                                        </Text>{" "}
                                        {selectedTransaction.amount}
                                    </Text>
                                    <Text className="text-gray-700">
                                        <Text className="font-bold">
                                            Purpose:
                                        </Text>{" "}
                                        {formatPaymentPurpose(
                                            selectedTransaction.purpose
                                        )}
                                    </Text>
                                    <Text className="text-gray-700">
                                        <Text className="font-bold">
                                            Method:
                                        </Text>{" "}
                                        {formatPaymentMethod(
                                            selectedTransaction.method
                                        )}
                                    </Text>
                                    <Text className="text-gray-700">
                                        <Text className="font-bold">Date:</Text>{" "}
                                        {selectedTransaction.date}
                                    </Text>
                                </View>

                                <View className="items-center justify-center border border-gray-300 rounded-lg p-2 h-96">
                                    {receiptLoading ? (
                                        <ActivityIndicator
                                            size="large"
                                            color="#38a169"
                                        />
                                    ) : receiptImage ? (
                                        <Image
                                            source={{ uri: receiptImage }}
                                            style={{
                                                width: windowWidth * 0.8,
                                                height: "100%",
                                            }}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Text className="text-red-500">
                                            Receipt image not available
                                        </Text>
                                    )}
                                </View>
                            </ScrollView>
                        )}

                        <View className="flex-row justify-between mt-4">
                            <TouchableOpacity
                                className="bg-gray-200 px-6 py-3 rounded-lg"
                                onPress={closeReceiptModal}
                            >
                                <Text className="text-gray-800 font-semibold">
                                    Close
                                </Text>
                            </TouchableOpacity>
                            {selectedTransaction && (
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity
                                        className="bg-red-100 px-6 py-3 rounded-lg mr-3"
                                        onPress={() => {
                                            handleReject(
                                                selectedTransaction.id
                                            );
                                            closeReceiptModal();
                                        }}
                                    >
                                        <Text className="text-red-600 font-semibold">
                                            Reject
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-green-100 px-6 py-3 rounded-lg"
                                        onPress={() => {
                                            handleApprove(
                                                selectedTransaction.id
                                            );
                                            closeReceiptModal();
                                        }}
                                    >
                                        <Text className="text-green-600 font-semibold">
                                            Approve
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TransactionApproval;
