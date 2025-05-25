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
    const [ongoingCertifications, setOngoingCertifications] = useState([]);
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
            setError(null);

            const idToken = await auth.currentUser.getIdToken();

            // First get the guide ID
            const guideResponse = await axios.get(
                `${API_URL}/api/park-guides/user`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            if (!guideResponse.data || !guideResponse.data.guide_id) {
                console.log("No guide information found");
                setCertifications([]);
                return;
            }

            const guideId = guideResponse.data.guide_id;

            // Now fetch certifications using guide_id
            const response = await axios.get(
                `${API_URL}/api/certifications/user/${guideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            console.log("User certifications:", response.data);

            // Map the API data to our component's expected format
            const mappedCertifications = response.data.map((cert) => ({
                id: cert.cert_id,
                name: cert.module_name,
                moduleId: cert.module_id,
                expiryDate: cert.expiry_date
                    ? new Date(cert.expiry_date).toLocaleDateString()
                    : "No expiration date",
                issuedDate: new Date(cert.issued_date).toLocaleDateString(),
                image: getImageForCertificate(cert.module_id),
                obtained: true,
                description:
                    cert.description ||
                    "This certification validates your knowledge and skills in this area.",
            }));

            setCertifications(mappedCertifications);
        } catch (error) {
            console.error("Error fetching certifications:", error);
            setError("Failed to load certifications. Please try again.");
            setCertifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableCertifications = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();

            // Get the user's modules (both completed and in-progress)
            const completedResponse = await axios.get(
                `${API_URL}/api/training-modules/user`,
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            // Ensure we have valid data
            if (!completedResponse.data) {
                console.log("No module data available");
                setAvailableCertifications([]);
                return;
            }

            // Get IDs of modules that already have certifications
            const certificationModuleIds = certifications.map(
                (cert) => cert.moduleId
            );

            // Separate modules into completed and in-progress
            const { completedModules, ongoingModules } =
                completedResponse.data.reduce(
                    (acc, module) => {
                        const moduleId = module.module_id || module.id;
                        const hasNoCertificate =
                            !certificationModuleIds.includes(moduleId);
                        const isPaid = module.paymentStatus === "approved";

                        if (!hasNoCertificate) {
                            return acc;
                        }

                        const isCompleted =
                            module.completion_percentage === 100 ||
                            module.status === "completed" ||
                            module.module_status === "completed";

                        if (isCompleted && isPaid) {
                            acc.completedModules.push(module);
                        } else if (isPaid) {
                            acc.ongoingModules.push(module);
                        }

                        return acc;
                    },
                    { completedModules: [], ongoingModules: [] }
                );

            // Map completed modules to available certifications
            const mappedAvailableCerts = completedModules.map((module) => ({
                id: module.module_id || module.id,
                name: module.module_name || module.name,
                moduleId: module.module_id || module.id,
                expiryDate: null,
                image: getImageForCertificate(module.module_id || module.id),
                description:
                    module.description ||
                    "Complete the necessary requirements to earn this certification.",
                obtained: false,
            }));

            // Map ongoing modules to show progress
            const mappedOngoingCerts = ongoingModules.map((module) => ({
                id: module.module_id || module.id,
                name: module.module_name || module.name,
                moduleId: module.module_id || module.id,
                image: getImageForCertificate(module.module_id || module.id),
                description:
                    "Complete all quizzes and modules to earn this certification.",
                obtained: false,
                ongoing: true,
            }));

            setAvailableCertifications(mappedAvailableCerts);
            setOngoingCertifications(mappedOngoingCerts);
        } catch (error) {
            console.error("Error fetching available certifications:", error);
            setAvailableCertifications([]);
            setOngoingCertifications([]);
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
                        <View style={styles.content}>
                            {/* Current Certifications Section */}
                            <Text style={styles.sectionTitle}>
                                Current Certifications
                            </Text>
                            {certifications && certifications.length > 0 ? (
                                <>
                                    {certifications.map((cert, index) => (
                                        <View
                                            key={index}
                                            style={styles.certItem}
                                        >
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

                            {/* Ongoing Certifications Section */}
                            {ongoingCertifications.length > 0 && (
                                <>
                                    <Text
                                        style={[
                                            styles.sectionTitle,
                                            { marginTop: 20 },
                                        ]}
                                    >
                                        Ongoing Certifications
                                    </Text>
                                    {ongoingCertifications.map(
                                        (cert, index) => (
                                            <View
                                                key={`ongoing-${index}`}
                                                style={[
                                                    styles.certItem,
                                                    styles.ongoingCertItem,
                                                ]}
                                            >
                                                <View
                                                    style={styles.certDetails}
                                                >
                                                    <Text
                                                        style={styles.certName}
                                                    >
                                                        {cert.name}
                                                    </Text>
                                                    <Text
                                                        style={styles.certNote}
                                                    >
                                                        Complete all quizzes and
                                                        modules to get certified
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            )}

                            {/* Available Certifications Section */}
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
                        </View>
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
    certProgress: {
        fontSize: 14,
        marginTop: 4,
        color: "#007bff",
        fontWeight: "bold",
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
    ongoingCertItem: {
        backgroundColor: "#f3f4f6",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    progressText: {
        fontSize: 14,
        color: "#6b7280",
        marginVertical: 4,
    },
    certNote: {
        fontSize: 12,
        color: "#9ca3af",
        fontStyle: "italic",
        marginTop: 4,
    },
});

export default Certificate;
