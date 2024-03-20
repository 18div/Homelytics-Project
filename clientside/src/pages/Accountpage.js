import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import AccountNav from "../Accountnav.js"
function AccountPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [useremail, setUseremail] = useState('');


  useEffect(() => {
    const userIdFromCookie = Cookies.get('userId');
    const userNameFromCookie = Cookies.get('userName');
    const userEmailFromCookie = Cookies.get('userEmail');
  
    if (userIdFromCookie && userNameFromCookie && userEmailFromCookie) {
      setUserId(userIdFromCookie);
      setUserName(userNameFromCookie);
      setUseremail(userEmailFromCookie);
    }
  }, []);

  const logout = () => {
    Cookies.remove('userId');
    Cookies.remove('userName');
    Cookies.remove('userEmail');
    localStorage.removeItem('token');

  };

  return (
      <div>
         <AccountNav/>
         <div className="text-center max-w-lg mx-auto">
         <div>
         Logged in as <b>{userName}</b><br/>
         <b> {useremail} </b>
         </div>
          <Link to="/login">
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </Link>
        </div>
      </div>
  );
}

export default AccountPage;
