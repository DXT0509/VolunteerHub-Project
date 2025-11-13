import React, { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import {App,Login} from "../../../App.jsx";
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in

    const payload = decodeJwt(token);
    const now = Date.now();
    const expMs = payload?.exp ? payload.exp * 1000 : null;
    const isExpired = expMs ? expMs <= now : false;

    // Avoid redirect loop on public routes
    const publicRoutes = ["/login", "/register", "/register-success", "/"];
    const isPublic = publicRoutes.includes(location.pathname);

    if (isExpired && !isPublic) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true, state: { reason: "expired" } });
    }
  }, [location.pathname, navigate]);

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-363px)]">
        <Outlet />
      </div>
      {/* Footer */}
    </div>
  );
};

export default MainLayout;