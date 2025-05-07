import { createBrowserRouter } from "react-router-dom";
import ParkguideDashboard from "./pages/parkguideDashboard";
import ParkguideTraining from "./pages/parkguideTraining";
import ParkguideModule from "./pages/parkguideModule";
import ParkguideCert from "./pages/parkguideCert";
import ParkguidePerformance from "./pages/parkguidePerformance";
import ParkguidePayment from "./pages/parkguidePayment";
import ParkguideQuiz from "./pages/parkguideQuiz";
import ParkguidePlantInfo from "./pages/parkguidePlantInfo";
import ParkguideIdentification from "./pages/parkguideIdentification";

const router = createBrowserRouter([
  { path: "/", element: <ParkguideDashboard /> },
  { path: "/training", element: <ParkguideTraining /> },
  { path: "/parkguideModule", element: <ParkguideModule /> },
  { path: "/certifications", element: <ParkguideCert /> },
  { path: "/performance", element: <ParkguidePerformance /> },
  { path: "/payment", element: <ParkguidePayment /> },
  { path: "/quiz", element: <ParkguideQuiz /> },
  { path: "/plants", element: <ParkguidePlantInfo /> },
  { path: "/identify", element: <ParkguideIdentification /> },
]);

export default router;
