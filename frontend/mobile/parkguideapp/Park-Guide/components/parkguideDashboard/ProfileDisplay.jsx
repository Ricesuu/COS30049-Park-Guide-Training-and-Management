import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileDisplay = ({ profilePicture, fullName, id }) => {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image source={{ uri: profilePicture }} style={styles.profilePicture} />

      {/* Full Name */}
      <Text style={styles.fullName}>{fullName}</Text>

      {/* ID */}
      <Text style={styles.id}>ID: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  id: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProfileDisplay;