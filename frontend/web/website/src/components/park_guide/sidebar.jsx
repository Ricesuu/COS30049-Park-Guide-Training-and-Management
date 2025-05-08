import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const base = "/park_guide"; // ✅ Central base path for all routes

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="logo" />

      <button className="nav-btn" onClick={() => navigateTo(`${base}/dashboard`)}>Dashboard</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/training`)}>Training Module</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/certifications`)}>Certification & Licensing</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/plants`)}>Plant Information</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/identify`)}>Plant Identification</button>
      <button className="nav-btn" onClick={() => navigateTo(`${base}/performance`)}>Performance</button>
      
      <button className="nav-btn logout" onClick={() => navigateTo('/logout')}>Logout</button> {/* assuming logout is handled separately */}
    </aside>
  );
};

export default Sidebar;
