import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png"; // thay bằng logo của bạn

const Navbar = () => {
  const [user, setUser] = useState({
    displayName: "Demo User",
    email: "demo@example.com",
    photoURL: null, // nếu có avatar
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
  };

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
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Support 
            </NavLink>
          </div>

          {/* User Info / Login */}
          <div className="hidden md:flex md:items-center md:space-x-14">
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
              {/* Badge thông báo */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                3
              </span>
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
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            }
            onClick={() => setIsOpen(false)}
          >
            Home
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
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-blue-600 font-semibold rounded"
                : "block px-3 py-2 text-gray-700 hover:text-blue-600 rounded"
            }
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>
          {user ? (
            <div className="px-3 py-2 border-t border-gray-200 flex flex-col space-y-1">
              <span className="text-gray-700">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
