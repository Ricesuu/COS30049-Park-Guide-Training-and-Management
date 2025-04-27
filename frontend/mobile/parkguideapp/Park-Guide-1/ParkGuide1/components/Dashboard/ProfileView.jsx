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
    width: "90%", // Smaller width
    alignSelf: "center", // Center horizontally
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10, // Rounded corners
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    marginVertical: 10, // Space around the container
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProfileView;