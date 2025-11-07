import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { App, Login } from './App.jsx'
import MainLayout from './assets/Layouts/MainLayout/MainLayout.jsx'
import ShowCampaignDetail from './assets/Pages/ShowCampaignDetail.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path = '/events/:id' element={<ShowCampaignDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
