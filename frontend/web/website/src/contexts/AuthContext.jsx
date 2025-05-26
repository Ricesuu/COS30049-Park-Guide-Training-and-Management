import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/apiConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const navigate = useNavigate();
  // Function to get user role and status
  const getUserRole = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch user info");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching role:", err);
      throw err;
    }
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // User is signed in
          const token = await currentUser.getIdToken();
          const userData = await getUserRole(token);

          if (userData.status !== "approved") {
            await auth.signOut();
            setUser(null);
            setUserRole(null);
            setUserStatus(null);
            navigate("/login");
            return;
          }

          setUser(currentUser);
          setUserRole(userData.role);
          setUserStatus(userData.status);

          // Redirect based on role if on login page
          if (window.location.pathname === "/login") {
            navigate(
              userData.role === "admin"
                ? "/admin/dashboard"
                : "/park_guide/dashboard"
            );
          }
        } else {
          // User is signed out
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
          // Redirect to login if not on public routes
          const publicRoutes = [
            "/",
            "/login",
            "/register",
            "/forgot_password",
            "/reset_password",
            "/visitor",
            "/visitor/about",
            "/visitor/contact",
            "/visitor/feedback",
            "/visitor/map",
            "/visitor/info",
          ];
          if (!publicRoutes.includes(window.location.pathname)) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        // Handle error here (e.g., show toast)
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const value = {
    user,
    loading,
    userRole,
    userStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
