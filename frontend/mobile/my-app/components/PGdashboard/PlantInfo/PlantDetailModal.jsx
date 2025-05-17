// components/PGdashboard/PlantInfo/PlantDetailModal.jsx
import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from "react-native";

const PlantDetailModal = ({ plant, visible, onClose }) => {
    return plant ? (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{plant.name}</Text>
                    <Image source={plant.image} style={styles.modalImage} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Scientific Name:</Text>
                        <Text style={styles.infoText}>
                            {plant.scientificName}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Habitat:</Text>
                        <Text style={styles.infoText}>{plant.habitat}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Description:</Text>
                        <Text style={styles.infoText}>{plant.description}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fun Fact:</Text>
                        <Text style={styles.infoText}>{plant.funFact}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    ) : null;
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        width: "100%",
        maxHeight: "90%",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#666",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 10,
        color: "rgb(22, 163, 74)",
        textAlign: "center",
    },
    modalImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        marginBottom: 15,
    },
    infoItem: {
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 2,
    },
    infoText: {
        fontSize: 15,
        color: "#555",
        lineHeight: 22,
    },
});

export default PlantDetailModal;
