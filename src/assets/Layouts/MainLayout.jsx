import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // đợi nội dung render rồi mới scroll
      const timer = setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  return (
    <div>
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Outlet */}
      <div className="min-h-[calc(100vh-363px)]">
        <ScrollRestoration></ScrollRestoration>
        <Outlet></Outlet>
      </div>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
