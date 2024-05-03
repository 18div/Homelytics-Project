import React, { useState, useEffect } from "react";
import Accountpage from "./Accountpage.js";
import axios from "axios";
import Cookies from "js-cookie";

function Profile() {
  const [user, setUser] = useState(null);
  const [URL, setUrl] = useState(null);

  useEffect(() => {
    const userIdFromCookie = Cookies.get("userId");
    const fetchUserData = async () => {
      try {
        if (userIdFromCookie) {
          const response = await axios.get(`https://homelytics-project-server.onrender.com//api/user/${userIdFromCookie}`)
          setUser(response.data.user);
        } else {
          console.error("User ID or token not found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  },[]);


  useEffect(() => {
    if (user && user.photo) {
      setUrl(user.photo.slice(7));
    }
  }, [user]); 


  return (
    
    <>
      <Accountpage />
      <div className="container mx-auto mt-8 flex justify-center ">
        {user && (
          <div className="border border-purple-700 max-w-md text-purple rounded-lg p-4">
          <h1 className="text-2xl font-semibold mb-4 text-center">My Profile</h1>
            <div className="flex justify-center mb-4">
              <img
                src={`https://homelytics-project-server.onrender.com//${URL}`}
                alt="User"
                className="rounded-full w-20 h-20 object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="font-semibold mb-2 text-purple">Name: {user.name}</p>
              <p className="font-semibold mb-2 text-purple">Email: {user.email}</p>
              <p className="font-semibold text-purple">ID: {user._id}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
