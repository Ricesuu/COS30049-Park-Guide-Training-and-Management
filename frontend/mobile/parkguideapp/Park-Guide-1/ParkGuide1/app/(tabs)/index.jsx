import React from "react";
import { View, StyleSheet } from "react-native";
import ProfileView from "@/components/Dashboard/ProfileView"; // Keep this import
import Header from "@/components/Header"; // Ensure this is the correct path

const Homepage = () => {
  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header title="Profile" />

      {/* Profile View */}
      <ProfileView
        fullName="John Doe"
        userId="12345"
        profilePicture={require("../../assets/images/Ruiziq.jpg")} // Ensure this path is correct
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default Homepage;


