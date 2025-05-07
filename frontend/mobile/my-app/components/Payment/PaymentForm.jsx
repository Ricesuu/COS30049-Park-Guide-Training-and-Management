// ✅ PaymentForm.jsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Feather } from "@expo/vector-icons";
import usePaymentHandler from "../../hooks/usePaymentHandler";
import AnimatedButton from "../AnimatedButton";

export default function PaymentForm({ refreshTransactions }) {
    const {
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
    } = usePaymentHandler({ refreshTransactions }); // ✅ pass down the prop

    return (
        <View className="flex-1 bg-white p-6 rounded-t-3xl shadow-inner -mt-12 z-0">
            <Text className="text-2xl font-bold text-center mb-4">
                Payment Form
            </Text>

            {/* Purpose Dropdown */}
            <View className="mb-5 z-10">
                <Text className="mb-1 font-medium">
                    What Are You Paying For?
                </Text>
                <DropDownPicker
                    open={open}
                    value={form.paymentPurpose}
                    items={items}
                    setOpen={setOpen}
                    setItems={setItems}
                    setValue={(callback) => {
                        const value = callback(form.paymentPurpose);
                        handlePurposeChange(value);
                    }}
                    placeholder="Select a purpose"
                    textStyle={{ fontSize: 14 }}
                    style={{
                        borderColor: "#888",
                        borderRadius: 12,
                        backgroundColor: "#f0fff4",
                        paddingHorizontal: 10,
                        minHeight: 48,
                    }}
                    dropDownContainerStyle={{
                        borderColor: "#888",
                        borderRadius: 12,
                        backgroundColor: "#f0fff4",
                        zIndex: 1000,
                    }}
                    listMode="SCROLLVIEW"
                    labelProps={{ numberOfLines: 2 }}
                />
            </View>

            {/* Amount Paid */}
            <View className="mb-5">
                <Text className="mb-1 font-medium">Amount Paid (MYR)</Text>
                <View className="bg-green-100 px-4 py-3 rounded-xl border border-gray-400 shadow-sm">
                    <Text className="text-base font-semibold text-gray-800">
                        {form.amountPaid ? `RM ${form.amountPaid}` : "—"}
                    </Text>
                </View>
            </View>

            {/* Payment Method Dropdown */}
            <View className="mb-5 z-10">
                <Text className="mb-1 font-medium">Payment Method</Text>
                <DropDownPicker
                    open={openPaymentMethod}
                    value={form.paymentMethod}
                    items={paymentMethodItems}
                    setOpen={setOpenPaymentMethod}
                    setValue={handlePaymentMethodChange}
                    setItems={setPaymentMethodItems}
                    placeholder="Select a method"
                    listMode="SCROLLVIEW"
                    textStyle={{ fontSize: 14 }}
                    style={{
                        borderColor: "#888",
                        borderRadius: 12,
                        backgroundColor: "#f0fff4",
                        paddingHorizontal: 10,
                        minHeight: 48,
                    }}
                    dropDownContainerStyle={{
                        borderColor: "#888",
                        borderRadius: 12,
                        backgroundColor: "#f0fff4",
                        zIndex: 1000,
                    }}
                />
            </View>

            {/* File Upload */}
            <View className="mb-5">
                <Text className="mb-2 font-medium">Upload Receipt</Text>
                <TouchableOpacity
                    onPress={handleFilePick}
                    className="flex items-center justify-center p-5 bg-green-100 border border-gray-400 rounded-xl shadow-sm"
                >
                    <Feather name="upload-cloud" size={36} color="#196f3d" />
                    <Text className="text-gray-700 mt-2 font-medium">
                        Tap to select image
                    </Text>
                </TouchableOpacity>

                {fileError && (
                    <Text className="text-red-600 mt-2 text-sm font-medium text-center">
                        {fileError}
                    </Text>
                )}

                {filePreview && (
                    <View className="items-center mt-4">
                        <Text className="text-sm font-medium mb-2">
                            Preview:
                        </Text>
                        <Image
                            source={{ uri: filePreview }}
                            className="w-40 h-40 rounded border"
                            resizeMode="cover"
                        />
                    </View>
                )}
            </View>

            {/* Submit Button */}
            <AnimatedButton
                label="Submit"
                onPress={handleSubmit}
                className="bg-green-600 mt-4"
            />
        </View>
    );
}
