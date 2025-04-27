import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlertContainer = ({ alerts }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Alerts</Text>
      {alerts.map((alert, index) => (
        <View key={index} style={styles.alertItem}>
          {/* Status Indicator */}
          <View
            style={[
              styles.statusCircle,
              alert.status === "safe" && styles.safe,
              alert.status === "alert" && styles.alert,
              alert.status === "danger" && styles.danger,
            ]}
          />
          {/* Alert Text */}
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  safe: {
    backgroundColor: "green",
  },
  alert: {
    backgroundColor: "orange",
  },
  danger: {
    backgroundColor: "red",
  },
  alertText: {
    fontSize: 16,
    color: "#555",
  },
});

export default AlertContainer;