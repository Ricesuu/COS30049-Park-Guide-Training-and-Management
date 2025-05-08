// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Sidebar from './components/Sidebar'
// import Dashboard from './pages/Dashboard'
// import './App.css'
// import ParkGuideDetails from "./pages/ParkGuideDetails";
// import ParkGuides from './pages/ParkGuides';
// import IoTHub from './pages/IoTHub';
// import InfoManager from './pages/InfoManager';
// import InfoDetail from "./pages/InfoDetail";

// function App() {
  

//   return (
//     <Router>
//       <div className="flex">
//       <Sidebar />
//         <main className = "flex-1 pl-64 bg-gray-100 min-h-screen">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/guides/:id" element={<ParkGuideDetails />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/iot-hub" element={<IoTHub />} />
//             <Route path="/info-manager" element={<InfoManager />} />
//             <Route path="/park-guides" element={<ParkGuides/>} />
//             <Route path="/info-manager/:title" element={<InfoDetail />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   )
// }

// export default App

import React from "react";
import './App.css';
import { ToastContainer } from "react-toastify";
import RoutesHandler from "./RoutesHandler";
import "react-toastify/dist/ReactToastify.css"; 

export default function App() {
  return (
    <>
      <RoutesHandler />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />
    </>
  );
}





