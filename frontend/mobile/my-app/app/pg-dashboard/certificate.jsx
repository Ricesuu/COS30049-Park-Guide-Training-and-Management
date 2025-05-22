import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    LogBox,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../lib/Firebase";
import axios from "axios";
import { API_URL } from "../../src/constants/constants";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const Certificate = () => {
    const router = useRouter();
    const [selectedCert, setSelectedCert] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [certifications, setCertifications] = useState([]);
    const [availableCertifications, setAvailableCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user's certificates from the API
    useEffect(() => {
        fetchUserCertifications();
    }, []);

    // Add a second useEffect that depends on certifications to ensure
    // we have the certificates loaded before filtering available ones
    useEffect(() => {
        if (certifications) {
            fetchAvailableCertifications();
        }
    }, [certifications]);
    const fetchUserCertifications = async () => {
        try {
            setLoading(true);
            const idToken = await auth.currentUser.getIdToken();

            const response = await axios.get(
                `${API_URL}/api/certifications/user`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            console.log("User certifications:", response.data);

            if (!response.data || response.data.length === 0) {
                console.log("No certifications found for user");
                setCertifications([]);
                return;
            }

            // Map the API data to our component's expected format
            const mappedCertifications = response.data.map((cert) => ({
                id: cert.cert_id,
                name: cert.module_name,
                moduleId: cert.module_id,
                expiryDate: new Date(cert.expiry_date)
                    .toISOString()
                    .split("T")[0],
                issuedDate: new Date(cert.issued_date)
                    .toISOString()
                    .split("T")[0],
                image: getImageForCertificate(cert.module_id),
                obtained: true,
                description:
                    cert.description ||
                    "This certification validates your knowledge and skills in this area.",
            }));

            setCertifications(mappedCertifications);
        } catch (error) {
            console.error("Error fetching certifications:", error);
            // Don't show error for empty certifications, just set to empty array
            setCertifications([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchAvailableCertifications = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();

            // Fetch user's modules (completed and in progress)
            const completedResponse = await axios.get(
                `${API_URL}/api/training-modules/user`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            // Fetch all available modules
            const availableResponse = await axios.get(
                `${API_URL}/api/training-modules/available`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            console.log("User modules:", completedResponse.data);
            console.log("Available modules:", availableResponse.data);

            // Ensure we have valid data before proceeding
            if (!completedResponse.data || !availableResponse.data) {
                console.log("No module data available");
                setAvailableCertifications([]);
                return;
            }

            // Find modules that are completed (100%) but don't have certificates yet
            const completedModules = completedResponse.data.filter(
                (module) =>
                    module.completion_percentage === 100 &&
                    module.paymentStatus === "approved"
            );

            const completedModuleIds = completedModules.map(
                (module) => module.id
            );
            const certificationModuleIds = certifications
                ? certifications.map((cert) => cert.moduleId)
                : [];

            // Filter out modules that already have certificates
            const availableForCertification = completedModules.filter(
                (module) => !certificationModuleIds.includes(module.id)
            );

            // Map to the format our component expects
            const mappedAvailableCerts = availableForCertification.map(
                (module) => ({
                    id: module.id,
                    name: module.name,
                    moduleId: module.id,
                    expiryDate: null,
                    image: getImageForCertificate(module.id),
                    obtained: false,
                    description:
                        module.description ||
                        "You've completed this module. Take the quiz to earn your certification!",
                })
            );

            // Also add modules that are available for purchase but not yet completed
            // Filter to include modules that are 'purchased' or 'pending'
            const purchasableModules = availableResponse.data.filter(
                (module) => {
                    // Check for a valid purchase status
                    const hasPurchaseStatus =
                        module && typeof module.purchase_status === "string";

                    // Only include modules with valid purchase status that are not completed and not certified
                    return (
                        hasPurchaseStatus &&
                        (module.purchase_status === "purchased" ||
                            module.purchase_status === "pending") &&
                        !completedModuleIds.includes(module.id) &&
                        !certificationModuleIds.includes(module.id)
                    );
                }
            );

            const mappedPurchasableModules = purchasableModules.map(
                (module) => ({
                    id: module.id,
                    name: module.name || "Training Module",
                    moduleId: module.id,
                    expiryDate: null,
                    image: getImageForCertificate(module.id),
                    obtained: false,
                    description:
                        "Complete this module and pass the quiz to earn your certification.",
                    incomplete: true,
                    pending: module.purchase_status === "pending",
                })
            );

            setAvailableCertifications([
                ...mappedAvailableCerts,
                ...mappedPurchasableModules,
            ]);
            console.log("Available certifications set:", [
                ...mappedAvailableCerts,
                ...mappedPurchasableModules,
            ]);
        } catch (error) {
            console.error("Error fetching available certifications:", error);
            // Don't show error for empty available certifications, just set to empty array
            setAvailableCertifications([]);
        }
    };

    // Helper function to get image based on module ID
    const getImageForCertificate = (moduleId) => {
        // These are fallback images based on module ID
        const moduleImages = {
            1: require("../../assets/images/firstaid.jpg"),
            2: require("../../assets/images/Semenggoh.jpeg"),
            3: require("../../assets/images/wildlife_safety.jpg"),
            4: require("../../assets/images/advanced_guide.png"),
        };

        return moduleImages[moduleId] || moduleImages[(moduleId % 4) + 1]; // Fallback to one of the 4 images
    };

    const openModal = (cert) => {
        setSelectedCert(cert);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedCert(null);
        setModalVisible(false);
    };
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Certifications</Text>
                        {!loading && (
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={() => {
                                    setLoading(true);
                                    fetchUserCertifications();
                                }}
                            >
                                <Text style={styles.refreshButtonText}>
                                    Refresh
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color="rgb(22, 163, 74)"
                            />
                            <Text style={styles.loadingText}>
                                Loading certifications...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => {
                                    setLoading(true);
                                    setError(null);
                                    fetchUserCertifications();
                                }}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {/* User's active certifications */}
                            {certifications.length > 0 ? (
                                <>
                                    <Text style={styles.sectionTitle}>
                                        My Certifications
                                    </Text>
                                    {certifications.map((cert, index) => (
                                        <View
                                            key={index}
                                            style={styles.certItem}
                                        >
                                            <Image
                                                source={cert.image}
                                                style={styles.certImage}
                                            />
                                            <View style={styles.certDetails}>
                                                <Text style={styles.certName}>
                                                    {cert.name}
                                                </Text>
                                                <Text style={styles.certExpiry}>
                                                    Expiry: {cert.expiryDate}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.infoButton}
                                                    onPress={() =>
                                                        openModal(cert)
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.infoButtonText
                                                        }
                                                    >
                                                        More Info
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            ) : (
                                <View style={styles.noCertsContainer}>
                                    <Text style={styles.noCertsText}>
                                        You don't have any certifications yet.
                                    </Text>
                                    <Text style={styles.noCertsSubtext}>
                                        Complete modules and pass the quizzes
                                        from your computer to earn
                                        certifications.
                                    </Text>
                                </View>
                            )}

                            {/* Available certifications */}
                            {availableCertifications.length > 0 && (
                                <>
                                    <Text
                                        style={[
                                            styles.sectionTitle,
                                            { marginTop: 20 },
                                        ]}
                                    >
                                        Available Certifications
                                    </Text>
                                    {availableCertifications.map(
                                        (cert, index) => (
                                            <View
                                                key={`available-${index}`}
                                                style={styles.certItem}
                                            >
                                                <Image
                                                    source={cert.image}
                                                    style={[
                                                        styles.certImage,
                                                        cert.incomplete && {
                                                            opacity: 0.6,
                                                        },
                                                        cert.pending && {
                                                            opacity: 0.4,
                                                        },
                                                    ]}
                                                />
                                                <View
                                                    style={styles.certDetails}
                                                >
                                                    <Text
                                                        style={styles.certName}
                                                    >
                                                        {cert.name}
                                                        {cert.pending &&
                                                            " (Pending)"}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.certDescription
                                                        }
                                                        numberOfLines={2}
                                                    >
                                                        {cert.description}
                                                    </Text>{" "}
                                                    {cert.pending ? (
                                                        <View
                                                            style={
                                                                styles.pendingStatus
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.pendingText
                                                                }
                                                            >
                                                                Awaiting payment
                                                                approval
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <View></View>
                                                    )}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Modal for Certificate Details */}
            {selectedCert && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>
                                {selectedCert.name}
                            </Text>
                            <Image
                                source={selectedCert.image}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalExpiry}>
                                Expiry Date: {selectedCert.expiryDate}
                            </Text>
                            <Text style={styles.modalDescription}>
                                {selectedCert.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={() => {
                                    // Handle certificate download
                                    Alert.alert(
                                        "Certificate Download",
                                        "Your certificate is being prepared for download.",
                                        [{ text: "OK" }]
                                    );
                                }}
                            >
                                <Text style={styles.downloadButtonText}>
                                    Download Certificate
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.renewButton}
                                onPress={() => {
                                    // Handle certificate renewal
                                    Alert.alert(
                                        "Certificate Renewal",
                                        "Your certificate renewal request has been submitted.",
                                        [{ text: "OK" }]
                                    );
                                }}
                            >
                                <Text style={styles.renewButtonText}>
                                    Renew Certificate
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dashboard: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        paddingBottom: 120,
        zIndex: 1,
        elevation: 10,
        padding: 20,
        flex: 1,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    refreshButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    refreshButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    certItem: {
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    certImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    certDetails: {
        marginLeft: 10,
        flex: 1,
    },
    certName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    certExpiry: {
        fontSize: 14,
        marginTop: 4,
        color: "#666",
    },
    infoButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    infoButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    pendingStatus: {
        backgroundColor: "#f0ad4e4d",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    pendingText: {
        color: "#f0ad4e",
        fontSize: 12,
        fontWeight: "bold",
    },
    completeButton: {
        backgroundColor: "#3b82f6",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    completeButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "rgb(22, 163, 74)",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    noCertsContainer: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginTop: 20,
    },
    noCertsText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 10,
        textAlign: "center",
    },
    noCertsSubtext: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "rgb(22, 163, 74)",
    },
    certDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 15,
        marginTop: 10,
    },
    modalImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalExpiry: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    downloadButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    downloadButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    renewButton: {
        backgroundColor: "#f0ad4e",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    renewButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Certificate;
