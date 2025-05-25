import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import "../../ParkGuideStyle.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const base = "/park_guide"; // Central base path

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // ✅ Firebase logout
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // You can add a toast here if needed
    }
  };

  return (
    <aside className="sidebar">
      <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="logo" />      <button className="nav-btn" onClick={() => navigateTo(`${base}/dashboard`)}>Dashboard</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/training`)}>Training Module</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/certifications`)}>Certification & Licensing</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/performance`)}>Performance</button>
      
      <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
    </aside>
  );
};

export default Sidebar;
