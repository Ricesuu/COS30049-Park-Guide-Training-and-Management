import React from "react";
import { View, StyleSheet } from "react-native";
import ProfileView from "@/components/Dashboard/ProfileView";
import Header from "@/components/Header";
import CertContainer from "@/components/Dashboard/certcontainer";
import AlertContainer from "@/components/Dashboard/alertcontainer"; // Import AlertContainer

const Homepage = () => {
  const certifications = [
    {
      name: "First Aid Certification",
      expiryDate: "2025-12-31",
      image: require("../assets/images/firstaid.jpg"),
    },
    {
      name: "Park Guide License",
      expiryDate: "2024-08-20",
      image: require("../assets/images/Semenggoh.jpeg"),
    },
  ];

  const alerts = [
    { status: "safe", message: "All systems operational." },
    { status: "alert", message: "Unusual activity detected in Zone A." },
    { status: "danger", message: "Emergency in Zone B!" },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header title="Profile" />

      {/* Profile View */}
      <ProfileView
        fullName="John Doe"
        userId="12345"
        profilePicture={require("../assets/images/Ruiziq.jpg")}
      />

      {/* Certifications Container */}
      <CertContainer certifications={certifications} />

      {/* Alerts Container */}
      <AlertContainer alerts={alerts} />
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


