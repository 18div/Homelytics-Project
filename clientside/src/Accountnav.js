import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function AccountPage() {
  const [activeLink, setActiveLink] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check the current pathname to set the active link initially
    const pathname = location.pathname;
    if (pathname === "/account/profile") {
      setActiveLink("profile");
    } else if (pathname === "/account/bookings") {
      setActiveLink("bookings");
    } else if (pathname === "/account/places") {
      setActiveLink("accommodations");
    }

    // Check token and expiration
    const token = localStorage.getItem("token");
    if (!token) {
      // If token is not available, redirect to login page
      window.location.href = "/login";
    } else {
     
      const decodedToken = decodeToken(token);
      const currentTime = Date.now() / 1000; 

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        deleteAllCookies();
        alert("Your Current Session Expired");
        window.location.href = "/login";
      }
    }
  }, [location]);

  const deleteAllCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(";");

    // Loop through each cookie and delete it by setting its expiration time to a past date
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const decodeToken = (token) => {
    try {
      // Decode the token
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (error) {
      return null;
    }
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <nav className="w-full flex flex-col sm:flex-row justify-center mt-8 gap-2 mb-3">
      <Link
        className={`${
          activeLink === "profile"
            ? "bg-purple-700 text-white"
            : "bg-white text-purple-700"
        } border border-purple-700 rounded-full py-2 px-6 sm:py-1 sm:px-4`}
        to={"/account/profile"}
        onClick={() => handleLinkClick("profile")}
      >
        My profile
      </Link>
      <Link
        className={`${
          activeLink === "bookings"
            ? "bg-purple-700 text-white"
            : "bg-white text-purple-700"
        } border border-purple-700 rounded-full py-2 px-6 sm:py-1 sm:px-4`}
        to={"/account/bookings"}
        onClick={() => handleLinkClick("bookings")}
      >
        My bookings
      </Link>
      <Link
        className={`${
          activeLink === "accommodations"
            ? "bg-purple-700 text-white"
            : "bg-white text-purple-700"
        } border border-purple-700 rounded-full py-2 px-6 sm:py-1 sm:px-4`}
        to={"/account/places"}
        onClick={() => handleLinkClick("accommodations")}
      >
        My accommodations
      </Link>
    </nav>
  );
}

export default AccountPage;
