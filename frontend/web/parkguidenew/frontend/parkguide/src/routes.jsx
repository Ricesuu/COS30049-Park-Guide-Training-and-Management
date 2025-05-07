import { createBrowserRouter } from "react-router-dom";
import ParkguideDashboard from "./pages/parkguideDashboard";
import ParkguideTraining from "./pages/parkguideTraining";
import ParkguideModule from "./pages/parkguideModule";
import ParkguideCert from "./pages/parkguideCert";
import ParkguidePerformance from "./pages/parkguidePerformance";

const router = createBrowserRouter([
  { path: "/", element: <ParkguideDashboard /> },
  { path: "/training", element: <ParkguideTraining /> },
  { path: "/parkguideModule", element: <ParkguideModule /> },
  { path: "/certifications", element: <ParkguideCert /> },
  { path: "/performance", element: <ParkguidePerformance /> },
]);

export default router;
