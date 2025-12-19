import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import './index.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import './i18n';
import App from './App.tsx'
import Footer from './assets/Components/Footer/Footer.jsx'
import Navbar from './assets/Components/Navbar/Navbar.jsx'
import Banner from './assets/Pages/HomePage/Banner/Banner.jsx'
import VolunteerNeeds from './assets/Pages/HomePage/VolunteerNeeds/VolunteerNeeds.jsx'
import router from './assets/Routes/Routes.jsx'

import { BrowserRouter } from 'react-router-dom'

// Initialize AOS once at app startup
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    {/* <App /> */}
    {/* <Footer /> */}
    {/* <Navbar /> */}
    {/* <Banner></Banner> */}
    {/* <VolunteerNeeds></VolunteerNeeds> */}
    <RouterProvider router={router}></RouterProvider>

  </StrictMode>,
)
