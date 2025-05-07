// Sidebar.jsx
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="logo" />
      <button className="nav-btn" onClick={() => navigateTo('/')}>Dashboard</button>
      <button className="nav-btn" onClick={() => navigateTo('/training')}>Training Module</button>
      <button className="nav-btn" onClick={() => navigateTo('/certifications')}>Certification & Licensing</button>
      <button className="nav-btn" onClick={() => navigateTo('/performance')}>Performance</button>
      <button className="nav-btn logout" onClick={() => navigateTo('/logout')}>Logout</button>
    </aside>
  );
};

export default Sidebar;
