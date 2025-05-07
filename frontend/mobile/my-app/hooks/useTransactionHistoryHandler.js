import { useEffect, useState } from "react";
import { auth } from "../lib/Firebase";
import Toast from "react-native-toast-message";
import apiClient from "../src/api/api";

export default function useTransactionHistoryHandler() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const refreshTransactions = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();

      const response = await apiClient.get("/payment-transactions/user-history", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load transactions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  const openModal = (base64Image) => {
    setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return {
    transactions,
    loading,
    modalVisible,
    selectedImage,
    openModal,
    closeModal,
    refreshTransactions, // ✅ now exposed for external use
  };
}
