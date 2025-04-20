import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Certification = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certification Page</Text>
      <Text style={styles.description}>
        This is the certification page where users can view and manage their certifications.
      </Text>
      <Button
        title="Go Back to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default Certification;
