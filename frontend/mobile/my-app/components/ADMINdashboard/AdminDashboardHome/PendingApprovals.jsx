import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { fetchData } from "../../../src/api/api"; // Assuming fetchData is a utility function to make API calls

const PendingApprovals = forwardRef(({ navigation }, ref) => {
    const [parkGuideCount, setParkGuideCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    const loadPendingApprovals = async () => {
        try {
            console.log("Fetching pending approvals...");

            // Fetch all users
            const usersResponse = await fetchData("/users");

            // Filter for park guide users with pending status
            const pendingParkGuides = usersResponse.filter(
                (user) =>
                    user.role === "park_guide" &&
                    user.status.toLowerCase() === "pending"
            );

            setParkGuideCount(pendingParkGuides.length);

            // Fetch data from the PaymentTransactions table
            const transactionsResponse = await fetchData(
                "/payment-transactions"
            );

            // Use the response directly as the data array
            const transactionsData = transactionsResponse || [];

            // Filter transactions with payment_status 'pending'
            const pendingTransactions = transactionsData.filter(
                (transaction) =>
                    transaction.payment_status &&
                    transaction.payment_status.toLowerCase() === "pending"
            );

            setTransactionCount(pendingTransactions.length);
        } catch (error) {
            console.error("Error fetching pending approvals:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshPendingApprovals: loadPendingApprovals,
    }));

    useEffect(() => {
        loadPendingApprovals();

        // Set up polling every 60 seconds
        const interval = setInterval(() => {
            loadPendingApprovals();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <Text style={styles.title}>Pending Approvals</Text>
            <View style={styles.row}>
                {/* Park Guide Approvals */}
                <Pressable
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("approvals", {
                            initialTab: "parkGuide",
                        })
                    }
                >
                    <Text style={styles.value}>{parkGuideCount}</Text>
                    <Text style={styles.label}>Park Guides Left</Text>
                </Pressable>

                {/* Transaction Approvals */}
                <Pressable
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate("approvals", {
                            initialTab: "transaction",
                        })
                    }
                >
                    <Text style={styles.value}>{transactionCount}</Text>
                    <Text style={styles.label}>Transactions Left</Text>
                </Pressable>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center", // Added to vertically center content
        elevation: 5,
    },
    value: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
    },
    label: {
        fontSize: 15,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
});

export default PendingApprovals;
