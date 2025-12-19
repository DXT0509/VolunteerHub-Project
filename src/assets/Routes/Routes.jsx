import { createBrowserRouter } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";

// Pages
import Home from "../Pages/HomePage/Home/Home.jsx";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import FaqPage from "../Pages/HomePage/VolunteerNeeds/FaqPage.jsx";
import NeedVolunteer from "../Pages/NeedVolunteer/NeedVolunteer.jsx";
// Import TSX profile component (omit extension for cross-platform)
import UserProfileStandalone from "../Pages/UserProfile/UserProfiles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "need-volunteer",
        element: <NeedVolunteer />,
      },
      {
        path: "support",
        element: <FaqPage />,
      },
      {
        path: "user-profile",
        element: <UserProfileStandalone />,
      },
    ],
  },
]);

export default router;
