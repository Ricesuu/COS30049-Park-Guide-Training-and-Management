import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from "react-native";
import { fetchData } from "../../../src/api/api";
import { API_URL } from "../../../src/constants/constants";

import "../../../global.css";

const TransactionApproval = () => {
    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async (isRefreshing = false) => {
        try {
            console.log("Fetching payment transactions approvals...");

            const transactionsResponse = await fetchData(
                "/payment-transactions"
            );

            // Filter transactions with payment_status 'pending'
            const pendingTransactions = transactionsResponse.filter(
                (transaction) =>
                    transaction.payment_status &&
                    transaction.payment_status.toLowerCase() === "pending"
            );

            // Fetch user details for each pending transaction
            const userDetailsPromises = pendingTransactions.map((transaction) =>
                fetchData(`/users/${transaction.user_id}`)
            );

            const userDetails = await Promise.all(userDetailsPromises);

            // Combine transaction and user details
            const combinedData = pendingTransactions.map(
                (transaction, index) => ({
                    ...transaction,
                    ...userDetails[index], // Merge user details into the transaction object
                })
            );

            // Map the combined data to the format needed for display
            setTransactions(
                combinedData.map((transaction) => ({
                    id: transaction.payment_id?.toString() || "N/A",
                    name: `${transaction.first_name || "Unknown"} ${
                        transaction.last_name || "Unknown"
                    }`,
                    email: transaction.email || "No email provided",
                    amount: transaction.amount
                        ? `RM${transaction.amount}`
                        : "N/A",
                    date: transaction.transaction_date
                        ? new Date(
                              transaction.transaction_date
                          ).toLocaleDateString()
                        : "Unknown date",
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
    }, []);

    // Handle approve action - using API_URL from constants
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
                    body: JSON.stringify({ payment_status: "completed" }),
                }
            );

            if (!response.ok) {
                // Try to parse the error response as JSON
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

            console.log(`Transaction ${id} approved successfully`);

            // Refresh the transactions list after approval
            fetchTransactions();
        } catch (error) {
            console.error("Error approving transaction:", error);
        }
    };

    // Handle reject action - using API_URL from constants
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
                    body: JSON.stringify({ payment_status: "failed" }),
                }
            );

            if (!response.ok) {
                // Try to parse the error response as JSON
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

    const renderTransaction = ({ item }) => (
        <View className="bg-white p-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.email}</Text>
                </View>
                <View>
                    <Text className="text-sm text-gray-600">
                        Amount:{" "}
                        <Text className="font-medium">{item.amount}</Text>
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Date: <Text className="font-medium">{item.date}</Text>
                    </Text>
                </View>
            </View>
            <View className="flex-row justify-end space-x-2 gap-x-2">
                <TouchableOpacity
                    className="bg-red-100 px-4 py-2 rounded-lg"
                    onPress={() => handleReject(item.id)}
                >
                    <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-100 px-4 py-2 rounded-lg"
                    onPress={() => handleApprove(item.id)}
                >
                    <Text className="text-green-600 font-semibold">
                        Approve
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
                    <Text className="text-center text-gray-500 mt-5">
                        {loading ? "Loading..." : "No pending transactions."}
                    </Text>
                }
                contentContainerStyle={{
                    paddingBottom: 140,
                }}
            />
        </View>
    );
};

export default TransactionApproval;
