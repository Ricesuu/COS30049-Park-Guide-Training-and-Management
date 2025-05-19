// components/PGdashboard/Module/ModuleList.jsx
import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ModuleCard from "./ModuleCard";

const ModuleList = ({
    modules,
    isLoading,
    error,
    onModulePress,
    onRefresh,
    refreshing,
    onBrowseModules,
}) => {
    return isLoading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loadingText}>Loading modules...</Text>
        </View>
    ) : error ? (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Modules</Text>
                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={onBrowseModules}
                >
                    <AntDesign name="appstore1" size={16} color="white" />
                    <Text style={styles.browseButtonText}>Browse Modules</Text>
                </TouchableOpacity>
            </View>

            {modules.length > 0 ? (
                <FlatList
                    data={modules}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ModuleCard module={item} onPress={onModulePress} />
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No modules found. Check back later for new content or
                        browse available modules.
                    </Text>
                    <TouchableOpacity
                        style={styles.browseMoreButton}
                        onPress={onBrowseModules}
                    >
                        <Text style={styles.browseMoreButtonText}>
                            Browse Modules
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    browseButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    browseButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
        marginLeft: 5,
    },
    listContainer: {
        paddingTop: 5,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: "#757575",
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        color: "#757575",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    browseMoreButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    browseMoreButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ModuleList;
