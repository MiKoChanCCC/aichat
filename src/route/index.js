import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import DashboardPage from "../pages/dashboardPage/dashboardPage";
import ChaPage from "../pages/chatPage/chaPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/chatPage/:id",
        element: <ChaPage />,
      },
    ],
  },
]);

export default route;
