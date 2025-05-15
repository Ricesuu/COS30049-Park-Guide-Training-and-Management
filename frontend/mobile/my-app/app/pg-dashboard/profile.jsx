import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";
import { API_URL } from "../../src/constants/constants";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [parkGuideInfo, setParkGuideInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [assignedPark, setAssignedPark] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchParkGuideInfo(),
        fetchUserCertifications(),
        fetchTrainingProgress(),
        fetchPaymentHistory()
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserProfile(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile information. Please try again.");
      throw error;
    }
  };
  const fetchParkGuideInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/api/park-guides/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setParkGuideInfo(response.data);
      
      // If park guide has an assigned park, fetch it
      if (response.data && response.data.assigned_park) {
        fetchAssignedPark(response.data.assigned_park, token);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching park guide info:", error);
      // Don't throw error to allow other data to load
      return null;
    }
  };

  const fetchAssignedPark = async (parkId, token) => {
    try {
      if (!parkId || !token) return;
      
      const response = await axios.get(`${API_URL}/api/parks/${parkId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAssignedPark(response.data);
    } catch (error) {
      console.error("Error fetching assigned park:", error);
    }
  };
  const fetchUserCertifications = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/api/certifications/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCertifications(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching certifications:", error);
      return [];
    }
  };
  const fetchTrainingProgress = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/api/guide-training-progress/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTrainingProgress(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching training progress:", error);
      return [];
    }
  };
    const fetchPaymentHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/api/payment-transactions/user-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPaymentHistory(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  };  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              // Clear all stored tokens and user data
              await AsyncStorage.multiRemove(["authToken", "userRole", "userId"]);
              
              // Navigate to login screen
              router.replace("/");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Logout Error", "Failed to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  const renderUserInfo = () => {
    if (!userProfile) return null;

    const { first_name, last_name, email, role, status, created_at } = userProfile;
    const createdDate = new Date(created_at).toLocaleDateString();

    return (
      <View style={styles.infoContainer}>
        <View style={styles.userHeaderContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {first_name && last_name ? 
                `${first_name.charAt(0)}${last_name.charAt(0)}` : 
                "U"}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {first_name} {last_name}
            </Text>
            <View style={styles.badgeContainer}>
              <Text style={[styles.badge, 
                role === "park_guide" ? styles.parkGuideBadge : styles.adminBadge]}>
                {role === "park_guide" ? "PARK GUIDE" : role.toUpperCase()}
              </Text>
              <Text style={[styles.badge, 
                status === "approved" ? styles.approvedBadge : 
                status === "pending" ? styles.pendingBadge : 
                styles.rejectedBadge]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="rgb(22, 163, 74)" />
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{email}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color="rgb(22, 163, 74)" />
            <Text style={styles.detailLabel}>Role:</Text>
            <Text style={styles.detailValue}>
              {role === "park_guide" ? "Park Guide" : role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="date-range" size={20} color="rgb(22, 163, 74)" />
            <Text style={styles.detailLabel}>Member Since:</Text>
            <Text style={styles.detailValue}>{createdDate}</Text>
          </View>

          {parkGuideInfo && (
            <>
              <View style={styles.detailRow}>
                <MaterialIcons name="verified-user" size={20} color="rgb(22, 163, 74)" />
                <Text style={styles.detailLabel}>License Status:</Text>
                <Text style={[
                  styles.detailValue, 
                  parkGuideInfo.certification_status === "certified" ? styles.textSuccess : 
                  parkGuideInfo.certification_status === "pending" ? styles.textWarning : 
                  styles.textDanger
                ]}>
                  {parkGuideInfo.certification_status.charAt(0).toUpperCase() + parkGuideInfo.certification_status.slice(1)}
                </Text>
              </View>

              {parkGuideInfo.license_expiry_date && (
                <View style={styles.detailRow}>
                  <MaterialIcons name="event" size={20} color="rgb(22, 163, 74)" />
                  <Text style={styles.detailLabel}>License Expires:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(parkGuideInfo.license_expiry_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderAssignedPark = () => {
    if (!assignedPark) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Assigned Park</Text>
        <View style={styles.parkHeader}>
          <FontAwesome5 name="tree" size={24} color="rgb(22, 163, 74)" />
          <Text style={styles.parkName}>{assignedPark.park_name}</Text>
        </View>
        <Text style={styles.parkLocation}>
          <FontAwesome5 name="map-marker-alt" size={14} color="#666" /> {assignedPark.location}
        </Text>
        <Text style={styles.parkDescription}>{assignedPark.description}</Text>
        {assignedPark.wildlife && (
          <View style={styles.wildlifeContainer}>
            <Text style={styles.wildlifeTitle}>
              <FontAwesome5 name="paw" size={14} color="#666" /> Notable Wildlife:
            </Text>
            <Text style={styles.parkDescription}>{assignedPark.wildlife}</Text>
          </View>
        )}
      </View>
    );
  };
  const renderCertifications = () => {
    if (certifications.length === 0) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>My Certifications</Text>
        {certifications.map((cert, index) => (
          <View key={index} style={styles.certItem}>
            <MaterialIcons name="verified" size={24} color="rgb(22, 163, 74)" />
            <View style={styles.certDetails}>
              <Text style={styles.certName}>{cert.name || cert.module_name}</Text>
              <Text style={styles.certDate}>
                Issued: {new Date(cert.issued_date || cert.issue_date).toLocaleDateString()}
              </Text>
              {(cert.expiry_date) && (
                <Text style={styles.certDate}>
                  Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTrainingProgress = () => {
    if (trainingProgress.length === 0) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Training Progress</Text>
        {trainingProgress.map((item, index) => (
          <View key={index} style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{item.module_name}</Text>
              <View style={[
                styles.statusBadge, 
                item.status === "Completed" ? styles.completedBadge : 
                item.status === "in progress" ? styles.inProgressBadge : 
                styles.notStartedBadge
              ]}>
                <Text style={styles.statusText}>
                  {item.status === "Completed" ? "COMPLETED" : 
                   item.status === "in progress" ? "IN PROGRESS" : 
                   "NOT STARTED"}
                </Text>
              </View>
            </View>
            {item.status === "Completed" && item.completion_date && (
              <Text style={styles.progressDetail}>
                Completed on: {new Date(item.completion_date).toLocaleDateString()}
              </Text>
            )}
            {item.status === "in progress" && (
              <Text style={styles.progressDetail}>
                Progress: {item.progress || "In progress"}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPaymentHistory = () => {
    if (paymentHistory.length === 0) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        {paymentHistory.slice(0, 5).map((payment, index) => (
          <View key={index} style={styles.paymentItem}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentPurpose}>{payment.paymentPurpose}</Text>
              <Text style={[
                styles.paymentStatus,
                payment.paymentStatus === "approved" ? styles.textSuccess :
                payment.paymentStatus === "pending" ? styles.textWarning :
                styles.textDanger
              ]}>
                {payment.paymentStatus.toUpperCase()}
              </Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentMethod}>
                <Ionicons 
                  name={
                    payment.paymentMethod === "credit" ? "card" :
                    payment.paymentMethod === "debit" ? "card-outline" :
                    "wallet"
                  } 
                  size={14} 
                  color="#666" 
                /> {" "}
                {payment.paymentMethod === "e_wallet" ? "E-Wallet" : 
                 payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)} 
              </Text>
              <Text style={styles.paymentAmount}>${payment.amountPaid}</Text>
            </View>
            <Text style={styles.paymentDate}>
              {new Date(payment.transaction_date).toLocaleDateString()}
            </Text>
          </View>
        ))}
        {paymentHistory.length > 5 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push("/pg-dashboard/payment")}
          >
            <Text style={styles.viewAllText}>View All Payments</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <View style={styles.dashboard}>
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <AntDesign name="logout" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
              <Text style={styles.loadingText}>Loading your profile...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchAllUserData}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {renderUserInfo()}
              {renderAssignedPark()}
              {renderCertifications()}
              {renderTrainingProgress()}
              {renderPaymentHistory()}

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => router.push("/pg-dashboard/edit-profile")}
              >
                <MaterialIcons name="edit" size={20} color="white" />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -5,
    paddingBottom: 120,
    zIndex: 1,
    elevation: 10,
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(22, 163, 74)",
  },
  logoutButton: {
    backgroundColor: "rgb(22, 163, 74)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "rgb(22, 163, 74)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 20,
  },
  userHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgb(22, 163, 74)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  parkGuideBadge: {
    backgroundColor: "#4CAF50",
  },
  adminBadge: {
    backgroundColor: "#673AB7",
  },
  approvedBadge: {
    backgroundColor: "#66BB6A",
  },
  pendingBadge: {
    backgroundColor: "#FFA726",
  },
  rejectedBadge: {
    backgroundColor: "#EF5350",
  },
  detailsCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
    marginLeft: 10,
    width: 100,
  },
  detailValue: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  textSuccess: {
    color: "rgb(22, 163, 74)",
    fontWeight: "500",
  },
  textWarning: {
    color: "#FFA726",
    fontWeight: "500",
  },
  textDanger: {
    color: "#EF5350",
    fontWeight: "500",
  },
  parkHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  parkName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  parkLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  parkDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  wildlifeContainer: {
    marginTop: 8,
  },
  wildlifeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  certItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f8f0",
    padding: 10,
    borderRadius: 8,
  },
  certDetails: {
    marginLeft: 10,
    flex: 1,
  },
  certName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  certDate: {
    fontSize: 14,
    color: "#666",
  },
  progressItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "rgb(22, 163, 74)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
  },
  inProgressBadge: {
    backgroundColor: "#FFC107",
  },
  notStartedBadge: {
    backgroundColor: "#9E9E9E",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
  progressDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  paymentItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentPurpose: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: 14,
    color: "#666",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  paymentDate: {
    fontSize: 13,
    color: "#888",
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 5,
  },
  viewAllText: {
    color: "rgb(22, 163, 74)",
    fontWeight: "500",
  },
  editProfileButton: {
    backgroundColor: "rgb(22, 163, 74)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  editProfileText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Profile;
