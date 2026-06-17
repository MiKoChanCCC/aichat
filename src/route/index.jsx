import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import DashboardPage from "../pages/dashboardPage/DashboardPage";
import ChatPage from "../pages/chatPage/ChatPage";
import RootLayout from "../layouts/rootLayout/RootLayout";
import DashboardLayout from "../layouts/dashboardLayout/DashboardLayout";

const route = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

export default route;
