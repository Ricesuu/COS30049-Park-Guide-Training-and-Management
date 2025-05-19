import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { auth } from "../lib/Firebase";
import apiClient from "../src/api/api"; // Import the API client

const paymentOptions = [
  {
    label: "Registration + Course Enrollment Fee\n(RM 250)",
    value: "registration_and_enrollment",
    amount: "250",
  },
  {
    label: "License Renewal Fee\n(RM 100)",
    value: "license_renewal",
    amount: "100",
  },
];

export default function usePaymentHandler({ refreshTransactions } = {}) {
  const [open, setOpen] = useState(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [moduleInfo, setModuleInfo] = useState(null);

  const [items, setItems] = useState(
    paymentOptions.map(({ label, value }) => ({ label, value }))
  );

  const [paymentMethodItems, setPaymentMethodItems] = useState([
    { label: "Debit Card", value: "debit" },
    { label: "Credit Card", value: "credit" },
    { label: "Digital Wallet", value: "e_wallet" },
  ]);

  const [form, setForm] = useState({
    file: null,
    amountPaid: "250",
    paymentMethod: "debit",
    paymentPurpose: "registration_and_enrollment",
  });

  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (open) setOpenPaymentMethod(false);
  }, [open]);
  useEffect(() => {
    if (openPaymentMethod) setOpen(false);
  }, [openPaymentMethod]);
  // Update form when module info is set
  useEffect(() => {
    if (moduleInfo) {
      // Ensure module price is a valid number
      const modulePrice = typeof moduleInfo.price === 'string' 
        ? parseFloat(moduleInfo.price) 
        : (moduleInfo.price || 0);
        
      // Add a new option for module purchase if not already in the list
      const moduleOptionValue = `module_purchase_${moduleInfo.moduleId}`;
      if (!items.some(item => item.value === moduleOptionValue)) {
        setItems(prev => [
          ...prev,
          {
            label: `Module: ${moduleInfo.moduleName}\n(RM ${modulePrice.toFixed(2)})`,
            value: moduleOptionValue
          }
        ]);
      }
      
      // Set the form to use the module purchase option
      setForm({
        ...form,
        paymentPurpose: moduleOptionValue,
        amountPaid: modulePrice.toFixed(2),
        moduleId: moduleInfo.moduleId,
        moduleName: moduleInfo.moduleName
      });
      
      console.log("Module info set:", {...moduleInfo, price: modulePrice.toFixed(2)});
    }
  }, [moduleInfo]);

  const handlePurposeChange = (value) => {
    const selected = paymentOptions.find((p) => p.value === value);
    setForm({
      ...form,
      paymentPurpose: value,
      amountPaid: selected?.amount || "",
    });
  };

  const handlePaymentMethodChange = (callback) => {
    const value = callback(form.paymentMethod);
    setForm({ ...form, paymentMethod: value });
  };

  const handleFilePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.fileSize && file.fileSize > MAX_SIZE) {
        setFileError("File size must be under 5MB.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.mimeType)) {
        setFileError("Only JPG and PNG images are allowed.");
        return;
      }

      setForm({ ...form, file });
      setFilePreview(file.uri);
      setFileError(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.file) {
      setFileError("Please upload your payment receipt.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");

      const idToken = await currentUser.getIdToken();      const formData = new FormData();
      formData.append("uid", currentUser.uid);
      formData.append("paymentPurpose", form.paymentPurpose);
      formData.append("paymentMethod", form.paymentMethod);
      formData.append("amountPaid", form.amountPaid);
      
      // If this is a module purchase, add the module ID
      if (form.paymentPurpose.startsWith('module_purchase_') && form.moduleId) {
        const moduleId = form.moduleId;
        formData.append("moduleId", moduleId);
        formData.append("paymentPurpose", `Module Purchase: ${form.moduleName || 'Training Module'}`);
        console.log(`Submitting module purchase for moduleId: ${moduleId}`);
        
        // Debug: log all form data
        console.log("Form data for module purchase:", {
          moduleId: moduleId,
          moduleName: form.moduleName,
          paymentPurpose: `Module Purchase: ${form.moduleName || 'Training Module'}`,
          amountPaid: form.amountPaid
        });
      }
      
      formData.append("receipt", {
        uri: form.file.uri,
        name: form.file.fileName || "receipt.jpg",
        type: form.file.mimeType || "image/jpeg",
      });      const response = await fetch(
        `${apiClient.defaults.baseURL}/payment-transactions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        }
      );

      let data;
      try {
        data = await response.json();
        console.log("Payment response:", data);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: "Server response was invalid.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit payment");
      }

      Toast.show({
        type: "success",
        text1: "Payment Submitted",
        text2: "Your payment has been recorded. Please wait for admin approval.",
      });

      // ✅ Refresh transaction list if provided
      if (typeof refreshTransactions === "function") {
        refreshTransactions();
      }

      setForm({
        file: null,
        amountPaid: "250",
        paymentMethod: "debit",
        paymentPurpose: "registration_and_enrollment",
      });
      setFilePreview(null);
      setFileError(null);
    } catch (error) {
      console.error("Payment error:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error.message || "Please try again later.",
      });
    }
  };
  return {
    form,
    open,
    openPaymentMethod,
    items,
    paymentMethodItems,
    filePreview,
    fileError,
    setOpen,
    setItems,
    setOpenPaymentMethod,
    setPaymentMethodItems,
    handlePurposeChange,
    handlePaymentMethodChange,
    handleFilePick,
    handleSubmit,
    setModuleInfo
  };
}
