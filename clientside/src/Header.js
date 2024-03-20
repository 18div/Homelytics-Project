import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
function Header() {
  const [userName, setUserName] = useState('');
  const [userId,setUserId] = useState(''); 
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from local storage:", token);
    if (token) {
      axios.get("https://homelytics-app.onrender.com/user", {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        const { success, name,useruniqId,userEmail } = response.data;
        if (success) {
          setUserName(name);
          setUserId(useruniqId);

          Cookies.set('userId', userId);
          Cookies.set('userName', name);
          Cookies.set('userEmail',userEmail)

        } else {
          console.error("Error fetching user's name:", response.data.message);
        }
      })
      .catch(error => {
        console.error("Error fetching user's name:", error);
      });
    } else {
      setUserName('');
    }
    
  },[userId]);
  


  return (
    <header className={"flex justify-between"}>
        <a href="/" className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 -rotate-45 text-purple-700"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          <span className="font-bold text-xl text-purple-700 hidden md:block">Homelytics</span>
        </a>
        <div className="hidden md:block ">
          <div className="flex border border-purple-700 rounded-full py-2 px-4 gap-3 shadow-md shadow-purple-300 items-center ">
          <div>AnyWhere</div>
          <div className="border-l border-purple-700"></div>
          <div>AnyType</div>
          <div className="border-l border-purple-700"></div>
          <div>AnyPrice</div>
          <button className="bg-purple-700  text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        </div>
        <Link to={userName ? '/account' :'/login'} className="flex border border-purple-700 rounded-full py-2 px-4 gap-3  items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border-gray-500 overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 relative top-1"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span className="ml-2 hidden md:block">{userName}</span>
        </Link>
      </header>
  )
}

export default Header