import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileView = ({ fullName, userId, profilePicture }) => {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image source={profilePicture} style={styles.profileImage} />

      {/* Full Name */}
      <Text style={styles.fullName}>{fullName}</Text>

      {/* User ID */}
      <Text style={styles.userId}>ID: {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userId: {
    fontSize: 16,
    color: "#555",
  },
});

export default ProfileView;