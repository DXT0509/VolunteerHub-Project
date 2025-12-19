import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png"; // thay bằng logo của bạn
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState({
    displayName: "Demo User",
    email: "demo@example.com",
    photoURL: null, // nếu có avatar
  });

  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [openManageMobile, setOpenManageMobile] = useState(false);
  const [openAdminMobile, setOpenAdminMobile] = useState(false);

  const NOTIFICATIONS_URL =
    import.meta.env.VITE_NOTIFICATIONS_URL ||
    (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/notifications` : undefined);

  const normalizeNotificationCount = (data) => {
    // Hỗ trợ nhiều dạng phản hồi: array, {count}, {data: []}
    if (Array.isArray(data)) {
      // Nếu có trường read, đếm chưa đọc; nếu không, đếm tất cả
      const unread = data.filter((n) => n && typeof n === 'object' ? !n.read : true).length;
      return unread;
    }
    if (data && typeof data === 'object') {
      if (typeof data.count === 'number') return data.count;
      if (Array.isArray(data.data)) {
        const unread = data.data.filter((n) => n && typeof n === 'object' ? !n.read : true).length;
        return unread;
      }
    }
    return 0;
  };

  const fetchNotifications = async () => {
    if (!NOTIFICATIONS_URL) return; // thiếu env thì bỏ qua
    try {
      setNotifLoading(true);
      const { data } = await axios(NOTIFICATIONS_URL);
      const count = normalizeNotificationCount(data);
      setNotificationCount(count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll mỗi 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
  };
  const role = user?.role || 'guest';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 h-30 pt-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-30 w-auto" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:space-x-20 items-center text-xl font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/mycampaigns"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              My Campaign
            </NavLink>
            <Link
              to="/#contact"
              className="text-gray-700 hover:text-blue-600"
            >
              {t('nav.contact')}
            </Link>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              {t('nav.support')}
            </NavLink>
            {/* Volunteer extra */}
            {role === 'volunteer' && (
              <NavLink
                to="/my-campaign"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }
              >
                {t('nav.myCampaign')}
              </NavLink>
            )}
            {/* Manager dropdown */}
            {role === 'manager' && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600">
                  {t('nav.manage')}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg hidden group-hover:block">
                  <Link to="/manage/dashboard" className="block px-4 py-2 hover:bg-gray-100">{t('manage.dashboard')}</Link>
                  <Link to="/manage/volunteers" className="block px-4 py-2 hover:bg-gray-100">{t('manage.volunteers')}</Link>
                  <Link to="/manage/campaigns" className="block px-4 py-2 hover:bg-gray-100">{t('manage.campaigns')}</Link>
                  <Link to="/manage/reports" className="block px-4 py-2 hover:bg-gray-100">{t('manage.reports')}</Link>
                </div>
              </div>
            )}
            {/* Admin dropdown */}
            {role === 'admin' && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600">
                  {t('nav.admin')}
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg hidden group-hover:block">
                  <Link to="/admin/panel" className="block px-4 py-2 hover:bg-gray-100">{t('adminMenu.panel')}</Link>
                  <Link to="/admin/settings" className="block px-4 py-2 hover:bg-gray-100">{t('adminMenu.settings')}</Link>
                </div>
              </div>
            )}
          </div>

          {/* User Info / Login + Language */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Language Switcher (Buttons) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i18n.changeLanguage('vi')}
                className={`${i18n.language.startsWith('vi') ? 'bg-orange-500 text-white' : 'bg-black text-white'} px-2.5 py-1 rounded text-xs font-semibold`}
                aria-pressed={i18n.language.startsWith('vi')}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                className={`${i18n.language.startsWith('vi') ? 'bg-black text-white' : 'bg-orange-500 text-white'} px-2.5 py-1 rounded text-xs font-semibold`}
                aria-pressed={!i18n.language.startsWith('vi')}
              >
                EN
              </button>
            </div>
            {/* Nút thông báo */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 10-12 0v3c0 .386-.146.735-.405 1.001L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Badge thông báo (ẩn nếu 0) */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {user.displayName[0]}
                  </div>
                )}
                <span className="text-gray-700">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white shadow">
          {/* Language Switcher (Mobile Buttons) */}
          <div className="px-3 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('vi')}
              className={`${i18n.language.startsWith('vi') ? 'bg-orange-500 text-white' : 'bg-black text-white'} px-3 py-1 rounded text-xs font-semibold`}
              aria-pressed={i18n.language.startsWith('vi')}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={`${i18n.language.startsWith('vi') ? 'bg-black text-white' : 'bg-orange-500 text-white'} px-3 py-1 rounded text-xs font-semibold`}
              aria-pressed={!i18n.language.startsWith('vi')}
            >
              EN
            </button>
          </div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            }
            onClick={() => setIsOpen(false)}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            }
            onClick={() => setIsOpen(false)}
          >
            {t('nav.about')}
          </NavLink>
          <Link
            to="/#contact"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.contact')}
          </Link>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            }
            onClick={() => setIsOpen(false)}
          >
            {t('nav.support')}
          </NavLink>
          {/* Volunteer extra (mobile) */}
          {role === 'volunteer' && (
            <NavLink
              to="/my-campaign"
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                  : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
              }
              onClick={() => setIsOpen(false)}
            >
              {t('nav.myCampaign')}
            </NavLink>
          )}
          {/* Manager submenu (mobile) */}
          {role === 'manager' && (
            <div className="px-3 py-2">
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => setOpenManageMobile((v) => !v)}
              >
                {t('nav.manage')}
              </button>
              {openManageMobile && (
                <div className="mt-1 space-y-1">
                  <Link to="/manage/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('manage.dashboard')}</Link>
                  <Link to="/manage/volunteers" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('manage.volunteers')}</Link>
                  <Link to="/manage/campaigns" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('manage.campaigns')}</Link>
                  <Link to="/manage/reports" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('manage.reports')}</Link>
                </div>
              )}
            </div>
          )}
          {/* Admin submenu (mobile) */}
          {role === 'admin' && (
            <div className="px-3 py-2">
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => setOpenAdminMobile((v) => !v)}
              >
                {t('nav.admin')}
              </button>
              {openAdminMobile && (
                <div className="mt-1 space-y-1">
                  <Link to="/admin/panel" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('adminMenu.panel')}</Link>
                  <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setIsOpen(false)}>{t('adminMenu.settings')}</Link>
                </div>
              )}
            </div>
          )}
          {user ? (
            <div className="px-3 py-2 border-t border-gray-200 flex flex-col space-y-1">
              <span className="text-gray-700">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
