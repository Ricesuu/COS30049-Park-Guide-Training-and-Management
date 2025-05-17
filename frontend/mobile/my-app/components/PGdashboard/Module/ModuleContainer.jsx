// components/PGdashboard/Module/ModuleContainer.jsx
import React from "react";
import { View, StyleSheet } from "react-native";

// This component is a simple container for module content
// Header and ScrollView are handled by the layout
const ModuleContainer = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        padding: 20,
        paddingBottom: 120,
    },
});

export default ModuleContainer;
