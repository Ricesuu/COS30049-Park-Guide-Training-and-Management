import React from "react";
import { AppRegistry, View, Text, StyleSheet } from "react-native";
import ProfileDisplay from "../components/parkguideDashboard/ProfileDisplay"; // Import the ProfileDisplay component
import { name as appName } from "../app.json"; // Corrected the path to app.json

const Homepage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Park Guide</Text>
      </View>

      {/* Profile Display */}
      <View style={styles.profileContainer}>
        <ProfileDisplay
          profilePicture={require("../assets/images/Ruiziq.jpg")} // Use require to load the image
          fullName="Ruiziq"
          id="12345"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});

// Register the app with AppRegistry
AppRegistry.registerComponent(appName, () => Homepage);

export default Homepage; // Export Homepage for navigation
