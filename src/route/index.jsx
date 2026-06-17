import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import DashboardPage from "../pages/dashboardPage/DashboardPage";
import ChatPage from "../pages/chatPage/ChatPage";
import RootLayout from "../layouts/RootLayout";

const route = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

export default route;
