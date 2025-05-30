import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../ParkGuideStyle.css";
import "./ModulePurchase.css";
import { auth } from "../../Firebase";

const ModulePurchase = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("ModulePurchase mounted with moduleId:", moduleId);
    }, [moduleId]);
    const [module, setModule] = useState(null);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [formData, setFormData] = useState({
        paymentMethod: "credit",
        receipt: null,
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    // Add window resize listener for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                setLoading(true);
                const user = auth.currentUser;
                if (!user) {
                    console.error("User not authenticated");
                    setError("User not authenticated. Please log in again.");
                    setLoading(false);
                    return;
                }

                const token = await user.getIdToken();

                let statusResponse;
                try {
                    const user = auth.currentUser;
                    if (!user) {
                        throw new Error("User not authenticated");
                    }
                    const freshToken = await user.getIdToken(true);

                    statusResponse = await fetch(
                        `/api/training-modules/${moduleId}/purchase-status`,
                        {
                            headers: {
                                Authorization: `Bearer ${freshToken}`,
                            },
                        }
                    );

                    if (!statusResponse.ok) {
                        const errorData = await statusResponse
                            .json()
                            .catch(() => ({}));
                        throw new Error(
                            errorData.error ||
                                `Failed to fetch module purchase status: ${statusResponse.status} ${statusResponse.statusText}`
                        );
                    }
                } catch (fetchError) {
                    console.error(
                        "Network error checking purchase status:",
                        fetchError
                    );
                    throw new Error(`Network error: ${fetchError.message}`);
                }

                let statusData;
                try {
                    statusData = await statusResponse.json();
                    console.log("Module purchase status:", statusData);
                } catch (parseError) {
                    console.error(
                        "Error parsing purchase status response:",
                        parseError
                    );
                    throw new Error("Failed to read purchase status data");
                }

                setPurchaseStatus(statusData.status);

                if (statusData.module) {
                    setModule(statusData.module);
                } else if (statusData.purchase?.module) {
                    setModule(statusData.purchase.module);
                } else {
                    try {
                        const moduleResponse = await fetch(
                            `/api/training-modules/${moduleId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (!moduleResponse.ok) {
                            const errorData = await moduleResponse
                                .json()
                                .catch(() => ({}));
                            throw new Error(
                                errorData.error ||
                                    `Failed to fetch module details: ${moduleResponse.status} ${moduleResponse.statusText}`
                            );
                        }

                        const moduleData = await moduleResponse.json();
                        setModule(moduleData);
                    } catch (moduleError) {
                        console.error(
                            "Error fetching module details:",
                            moduleError
                        );
                        throw new Error(
                            `Could not load module information: ${moduleError.message}`
                        );
                    }
                }
            } catch (err) {
                console.error("Error fetching module data:", err);
                setError(
                    err.message ||
                        "An unknown error occurred while loading module information"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchModuleDetails();
    }, [moduleId]);
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            if (files[0]) {
                const file = files[0];
                if (file.size > 5 * 1024 * 1024) {
                    setErrors({
                        ...errors,
                        receipt: "File size must be under 5MB",
                    });
                    return;
                }

                setFormData({
                    ...formData,
                    receipt: file,
                });
                setErrors({
                    ...errors,
                    receipt: "",
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });

            if (errors[name]) {
                setErrors({
                    ...errors,
                    [name]: "",
                });
            }
        }
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = "Please select a payment method";
        }

        if (!formData.receipt) {
            newErrors.receipt = "Please upload your payment receipt";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show payment confirmation modal instead of processing immediately
        setShowConfirmation(true);
    };

    const handleConfirmedPayment = async () => {
        setShowConfirmation(false);
        setIsProcessing(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated. Please log in again.");
            }
            const token = await user.getIdToken();
            const userId = user.uid; // Use Firebase UID directly

            console.log("Creating form data with:", {
                uid: user.uid,
                user_id: userId,
                paymentPurpose: `Module Purchase: ${
                    module.module_name || module.name
                }`,
                paymentMethod: formData.paymentMethod,
                amountPaid: module.price,
                moduleId: moduleId,
                fileName: formData.receipt.name,
                fileType: formData.receipt.type,
            });

            if (
                module.price === 0 ||
                module.price === "0" ||
                module.price === "0.00"
            ) {
                let enrollResponse;
                try {
                    enrollResponse = await fetch(
                        `/api/training-modules/${moduleId}/enroll`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!enrollResponse.ok) {
                        const errorData = await enrollResponse
                            .json()
                            .catch(() => ({}));
                        throw new Error(
                            errorData.error ||
                                `Enrollment failed: ${enrollResponse.status} ${enrollResponse.statusText}`
                        );
                    }

                    // Show receipt for free module
                    setTransactionDetails({
                        transactionId: `FREE-${Date.now()}`,
                        date: new Date().toLocaleString(),
                        module: module.module_name || module.name,
                        price: "0.00",
                        status: "Completed",
                    });

                    // Show receipt for free modules
                    setShowReceipt(true);
                } catch (enrollError) {
                    console.error("Module enrollment error:", enrollError);
                    throw new Error(
                        enrollError.message || "Failed to enroll in free module"
                    );
                }
            } else {
                try {
                    // Create form data for submission
                    const paymentFormData = new FormData();
                    paymentFormData.append("uid", user.uid);
                    paymentFormData.append("moduleId", moduleId);
                    paymentFormData.append(
                        "paymentPurpose",
                        `Module Purchase: ${module.module_name || module.name}`
                    );
                    paymentFormData.append(
                        "paymentMethod",
                        formData.paymentMethod
                    );
                    paymentFormData.append(
                        "amountPaid",
                        parseFloat(module.price).toFixed(2)
                    );
                    paymentFormData.append("receipt_image", formData.receipt);
                    // Add transaction date
                    paymentFormData.append(
                        "transaction_date",
                        new Date().toISOString()
                    );
                    for (let [key, value] of paymentFormData.entries()) {
                        console.log(`FormData entry - ${key}:`, value);
                    }

                    // Send payment with receipt to backend
                    const paymentResponse = await fetch(
                        "/api/payment-transactions",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            body: paymentFormData,
                        }
                    );

                    if (!paymentResponse.ok) {
                        const errorData = await paymentResponse
                            .json()
                            .catch(() => ({}));
                        throw new Error(
                            errorData.error ||
                                `Payment failed: ${paymentResponse.status} ${paymentResponse.statusText}`
                        );
                    }

                    const paymentResult = await paymentResponse.json();
                    console.log(
                        "Payment processed successfully:",
                        paymentResult
                    ); // Generate transaction details for the receipt
                    setTransactionDetails({
                        transactionId:
                            paymentResult.paymentId || `TRX-${Date.now()}`,
                        date: new Date().toLocaleString(),
                        module: module.module_name || module.name,
                        price: parseFloat(module.price).toFixed(2),
                        status: "Pending Approval",
                    });

                    setPurchaseStatus("payment_pending");

                    // Show receipt
                    setShowReceipt(true);
                } catch (paymentError) {
                    console.error("Payment processing error:", paymentError);
                    throw new Error(
                        paymentError.message || "Payment processing failed"
                    );
                }
            }
        } catch (err) {
            console.error("Error processing payment:", err);
            alert(
                "Payment failed: " + (err.message || "Unknown error occurred")
            );
        } finally {
            setIsProcessing(false);
        }
    };
    const handleReceiptClose = () => {
        setShowReceipt(false);
        // Navigate back to training page with refresh parameter to trigger data reload
        navigate("/park_guide/training?refresh=" + Date.now());
    };

    const handleConfirmationCancel = () => {
        setShowConfirmation(false);
    };
    const enrollInFreeModule = async () => {
        try {
            setIsProcessing(true);

            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated. Please log in again.");
            }

            const token = await user.getIdToken();

            let enrollResponse;
            try {
                enrollResponse = await fetch(
                    `/api/training-modules/${moduleId}/enroll`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            moduleName: module.module_name || module.name,
                        }),
                    }
                );

                if (!enrollResponse.ok) {
                    const errorData = await enrollResponse
                        .json()
                        .catch(() => ({}));
                    throw new Error(
                        errorData.error ||
                            `Failed to enroll in module: ${enrollResponse.status} ${enrollResponse.statusText}`
                    );
                }
            } catch (fetchError) {
                console.error("Network error during enrollment:", fetchError);
                throw new Error(`Network error: ${fetchError.message}`);
            }

            let enrollData;
            try {
                enrollData = await enrollResponse.json();
                console.log("Enrollment successful:", enrollData);
            } catch (parseError) {
                console.error("Error parsing enrollment response:", parseError);
                throw new Error("Failed to process enrollment response");
            }

            setPurchaseStatus("active");

            // Generate transaction details for the receipt
            setTransactionDetails({
                transactionId: `FREE-${Date.now()}`,
                date: new Date().toLocaleString(),
                module: module.module_name || module.name,
                price: "0.00",
                status: "Completed",
            });

            // Show receipt instead of navigating away
            setShowReceipt(true);
        } catch (err) {
            console.error("Error enrolling in module:", err);
            alert(
                "Enrollment failed: " +
                    (err.message || "Unknown error occurred")
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Loading module information...</h2>
                    <div className="loading-spinner"></div>
                    <p className="loading-message">
                        Please wait while we fetch your module details. This
                        might take a few seconds.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Error</h2>
                    <div className="error-container">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="error-message">{error}</p>
                    </div>
                    <div className="error-actions">
                        <button
                            onClick={() => navigate("/park_guide/training")}
                            className="pay-button"
                        >
                            Back to Training
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="back-button"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Module Not Found</h2>
                    <div className="error-container">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        <p>
                            The requested module could not be found. It may have
                            been removed or you might not have access to it.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/park_guide/training")}
                        className="pay-button"
                    >
                        Back to Training
                    </button>
                </div>
            </div>
        );
    }

    if (purchaseStatus === "active") {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Module Already Purchased</h2>
                    <p>
                        You have already enrolled in{" "}
                        {module.module_name || module.name}.
                    </p>
                    <div className="payment-summary">
                        <h3>Module Details</h3>
                        <div className="payment-item">
                            <span>Name:</span>
                            <span>{module.module_name || module.name}</span>
                        </div>
                        {module.description && (
                            <div className="payment-item">
                                <span>Description:</span>
                                <span>{module.description}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => navigate("/park_guide/training")}
                        className="pay-button"
                    >
                        Go to My Modules
                    </button>
                </div>
            </div>
        );
    }

    if (purchaseStatus === "payment_pending") {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Payment Pending</h2>
                    <p>
                        Your payment for {module.module_name || module.name} is
                        being processed. Please check back later.
                    </p>
                    <button
                        onClick={() => navigate("/park_guide/training")}
                        className="pay-button"
                    >
                        Back to Training
                    </button>
                </div>
            </div>
        );
    }

    if (purchaseStatus === "payment_rejected") {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Payment Rejected</h2>
                    <p>
                        Your previous payment for{" "}
                        {module.module_name || module.name} was rejected. Please
                        try again.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="pay-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (module.price === 0 || module.price === "0" || module.price === "0.00") {
        return (
            <div className="payment-main-content">
                <div className="payment-container">
                    <h2>Enroll in {module.module_name || module.name}</h2>
                    <div className="status-badge free">FREE MODULE</div>
                    <p>This is a free module. No payment is required.</p>

                    <div className="payment-summary">
                        <h3>Module Details</h3>
                        <div className="payment-item">
                            <span>Name:</span>
                            <span>{module.module_name || module.name}</span>
                        </div>
                        {module.description && (
                            <div className="payment-item">
                                <span>Description:</span>
                                <span>{module.description}</span>
                            </div>
                        )}
                        <div className="payment-total">
                            <span>Price:</span>
                            <span>Free</span>
                        </div>
                    </div>

                    <button
                        className="pay-button"
                        onClick={enrollInFreeModule}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="processing-spinner"></span>
                                Processing...
                            </>
                        ) : (
                            "Enroll Now"
                        )}
                    </button>

                    <button
                        onClick={() => navigate("/park_guide/training")}
                        className="back-button"
                        style={{
                            marginTop: "10px",
                            padding: "10px 20px",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        Back to Training
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-main-content">
            {/* Payment confirmation modal */}
            {showConfirmation && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>Confirm Payment</h3>
                        <div className="confirmation-details">
                            <p>You are about to pay for:</p>
                            <h4>{module.module_name || module.name}</h4>
                            <div className="payment-total confirm">
                                <span>Total amount:</span>
                                <span>
                                    ${parseFloat(module.price).toFixed(2)}
                                </span>
                            </div>{" "}
                            <p className="payment-method">
                                Payment method:{" "}
                                {formData.paymentMethod
                                    .charAt(0)
                                    .toUpperCase() +
                                    formData.paymentMethod.slice(1)}
                            </p>
                        </div>{" "}
                        <div
                            className="modal-actions"
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <button
                                    className="pay-button"
                                    onClick={handleConfirmedPayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="processing-spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Payment"
                                    )}
                                </button>
                            </div>
                            <div style={{ flex: 1 }}>
                                <button
                                    className="back-button"
                                    onClick={handleConfirmationCancel}
                                    disabled={isProcessing}
                                    style={{
                                        marginTop: 0,
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt modal */}
            {showReceipt && transactionDetails && (
                <div className="modal-overlay">
                    <div className="modal-container receipt">
                        <div className="receipt-header">
                            <h3>Payment Receipt</h3>
                            <div className="receipt-status success">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span>Payment Successful</span>
                            </div>
                        </div>

                        <div className="receipt-body">
                            <div className="receipt-item">
                                <span>Transaction ID:</span>
                                <span>{transactionDetails.transactionId}</span>
                            </div>
                            <div className="receipt-item">
                                <span>Date:</span>
                                <span>{transactionDetails.date}</span>
                            </div>
                            <div className="receipt-item">
                                <span>Module:</span>
                                <span>{transactionDetails.module}</span>
                            </div>
                            <div className="receipt-item">
                                <span>Amount:</span>
                                <span>${transactionDetails.price}</span>
                            </div>
                            {transactionDetails.cardLast4 && (
                                <div className="receipt-item">
                                    <span>Payment Method:</span>
                                    <span>
                                        Credit Card (ending in{" "}
                                        {transactionDetails.cardLast4})
                                    </span>
                                </div>
                            )}
                            <div className="receipt-item">
                                <span>Status:</span>
                                <span>{transactionDetails.status}</span>
                            </div>
                        </div>

                        <div className="receipt-footer">
                            <p>
                                Thank you for your purchase. You can now access
                                your module in your training dashboard.
                            </p>
                            <button
                                className="pay-button"
                                onClick={handleReceiptClose}
                            >
                                Go to My Modules
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                className={`payment-container ${isMobileView ? "mobile" : ""}`}
            >
                <h2 className="payment-title">
                    Payment for {module.module_name || module.name}
                </h2>
                {/* Add QR Code Section */}
                <div className="qr-code-section">
                    <h3>Scan To Pay</h3>
                    <div className="qr-code-container">
                        <img
                            src="/images/qr-code-payment.png"
                            alt="QR Code for payment"
                            className="qr-code-image"
                        />
                    </div>
                </div>
                <div className="payment-summary">
                    <h3>Order Summary</h3>
                    <div className="payment-item">
                        <span>{module.module_name || module.name}</span>
                        <span>${parseFloat(module.price).toFixed(2)}</span>
                    </div>
                    {module.description && (
                        <div className="payment-item">
                            <span>Description:</span>
                            <span>{module.description}</span>
                        </div>
                    )}
                    <div className="payment-total">
                        <span>Total</span>
                        <span>${parseFloat(module.price).toFixed(2)}</span>
                    </div>
                </div>{" "}
                {showForm || purchaseStatus === "not_purchased" ? (
                    <form className="payment-form" onSubmit={handlePayment}>
                        <h3>Payment Details</h3>
                        <div className="form-section">
                            <div className="form-group">
                                <label htmlFor="paymentMethod">
                                    Payment Method
                                </label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className={
                                        errors.paymentMethod ? "error" : ""
                                    }
                                >
                                    <option value="credit">Credit Card</option>
                                    <option value="debit">Debit Card</option>
                                    <option value="e_wallet">E-Wallet</option>
                                </select>
                                {errors.paymentMethod && (
                                    <div className="error-message">
                                        {errors.paymentMethod}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="receipt">Upload Receipt</label>
                                <input
                                    type="file"
                                    id="receipt"
                                    name="receipt"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                                setErrors({
                                                    ...errors,
                                                    receipt:
                                                        "File size must be under 5MB",
                                                });
                                                return;
                                            }
                                            setFormData({
                                                ...formData,
                                                receipt: file,
                                            });
                                            setErrors({
                                                ...errors,
                                                receipt: "",
                                            });
                                        }
                                    }}
                                    className={errors.receipt ? "error" : ""}
                                />
                                {errors.receipt && (
                                    <div className="error-message">
                                        {errors.receipt}
                                    </div>
                                )}
                                <div className="receipt-note">
                                    <small>
                                        Please upload a clear image of your
                                        payment receipt (max 5MB)
                                    </small>
                                </div>
                            </div>
                        </div>{" "}
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <button
                                    type="submit"
                                    className="pay-button"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="processing-spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay $${parseFloat(
                                            module.price
                                        ).toFixed(2)}`
                                    )}
                                </button>
                            </div>

                            <div style={{ flex: 1 }}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/park_guide/training")
                                    }
                                    className="back-button"
                                    style={{
                                        marginTop: 0,
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button
                            onClick={() => setShowForm(true)}
                            className="pay-button"
                        >
                            Proceed to Payment
                        </button>

                        <button
                            onClick={() => navigate("/park_guide/training")}
                            className="back-button"
                            style={{
                                marginTop: "10px",
                                padding: "10px 20px",
                                backgroundColor: "#f0f0f0",
                                color: "#333",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "block",
                                width: "100%",
                            }}
                        >
                            Back to Training
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModulePurchase;
