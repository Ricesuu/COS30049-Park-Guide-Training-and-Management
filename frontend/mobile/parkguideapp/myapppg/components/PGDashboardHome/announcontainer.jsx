import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const AnnounContainer = ({ announcements }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      <FlatList
        data={announcements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.announcementItem}>
            <Text style={styles.announcementTitle}>{item.title}</Text>
            <Text style={styles.announcementDate}>{item.date}</Text>
            <Text style={styles.announcementDescription}>{item.description}</Text>
          </View>
        )}
        nestedScrollEnabled={true} // Enable nested scrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Center content
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 10,
    width: "100%", // Match the width of ProfileView
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    textAlign: "center", // Centered the title
    
  },
  announcementItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", // Changed to black
  },
  announcementDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  announcementDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default AnnounContainer;