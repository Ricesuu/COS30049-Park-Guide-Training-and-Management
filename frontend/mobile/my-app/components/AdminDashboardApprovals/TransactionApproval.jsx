import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import "../../global.css"; // Import global CSS styles

const TransactionApproval = () => {
    const [transactions, setTransactions] = useState([]);

    // Function to fetch transaction data
    const fetchTransactions = async () => {
        // Simulate fetching data (replace this with an API call if needed)
        const data = [
            {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                transactionId: "123456789",
                amount: "RM200",
                date: "2023-10-01",
            },
            {
                id: "2",
                name: "Jane Smith",
                email: "jane.smith@example.com",
                transactionId: "987654321",
                amount: "RM500",
                date: "2023-10-02",
            },
        ];
        setTransactions(data);
    };

    // Fetch transactions when the component mounts
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Handle approve and reject actions
    const handleApprove = (id) => {
        setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
        );
    };

    const handleReject = (id) => {
        setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
        );
    };

    // Render each transaction
    const renderTransaction = ({ item }) => (
        <View className="bg-white p-4 flex-row justify-between items-center border-y-2 border-gray-200">
            <View>
                <View className="mb-2">
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.email}</Text>
                </View>
                <View>
                    <Text className="text-sm text-gray-600">
                        Transaction ID:{" "}
                        <Text className="font-medium">
                            {item.transactionId}
                        </Text>
                    </Text>
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
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-5">
                        No pending transactions.
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
