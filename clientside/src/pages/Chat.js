import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const Chat = () => {
  const [userId, setUserId] = useState();
  const [users, setUsers] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(true); // State to control visibility of "Add friend" section


  const deleteAllCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(";");

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


  useEffect(() => {

    /**********Check Token***********/
    const token = localStorage.getItem("token");
    if (!token) {
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

    /***Start Fetching Details Of Chat Users List */

    const fetchUsers = async () => {
      const user_id = Cookies.get("userId");
      setUserId(user_id);
      try {
        const response = await fetch(`https://homelytics-project-server.onrender.com/find-users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const usersData = await response.json();
        const filteredUsers = usersData.filter(
          (user) => user._id !== userId && !joinedUsers.includes(user._id)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }

     
    };


    fetchUsers();
  }, [userId, joinedUsers]);

  const handleJoinPress = async (selectedUserId) => {
    try {
      const response = await fetch("https://homelytics-project-server.onrender.com/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstId: userId,
          secondId: selectedUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const chatData = await response.json();
      console.log("Chat created:", chatData);

      setJoinedUsers((prevJoinedUsers) => [...prevJoinedUsers, selectedUserId]);
    } catch (error) {
      console.error("Error creating chat:", error.message);
    }
  };

  /***************Socket Chat Groups Showing *********************/

  const [chatsWithReceiverNames, setChatsWithReceiverNames] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8050", {
      transports: ["websocket"],
      jsonp: false,
      forceNew: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected during cleanup");
    };
  }, [userId]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addnewuser", userId);
  }, [socket]);

  useEffect(() => {
    fetchUserChats(userId);
  }, [userId, socket]);

  useEffect(() => {
    fetchUserChats(userId);

    const intervalId = setInterval(() => {
      fetchUserChats(userId);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, socket]);

  const fetchUserChats = async (userId) => {
    try {
      const response = await fetch(
        `https://homelytics-project-server.onrender.com/findUserchat/chats/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const chatsData = await response.json();

      const chatsWithNames = await Promise.all(
        chatsData.map(async (chat) => {
          const receiverId =
            userId === chat.members[0] ? chat.members[1] : chat.members[0];
          const receiverName = await fetchUserName(receiverId);

          return {
            ...chat,
            receiverName,
          };
        })
      );

      setChatsWithReceiverNames(chatsWithNames);
    } catch (error) {
      console.error("Error fetching user chats:", error.message);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(
        `https://homelytics-project-server.onrender.com/find/byUserId/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.username || "Unknown";
    } catch (error) {
      console.error("Error fetching user name:", error.message);
      return "Unknown";
    }
  };

  const handleChatPress = (chatId, member1, member2) => {
    const senderId = userId === member1 ? member1 : member2;
    const receiverId = userId === member2 ? member1 : member2;
  
    window.location.href = `/chat/${chatId}/${senderId}/${receiverId}`;
  
    socket.emit('chatOpened', { chatId, senderId, receiverId });
  };
  

  return (
    <div className="flex flex-col items-center h-full mt-10">
      <div className="flex justify-center w-full py-4">
        <button
          className="bg-purple-700 text-white px-4 py-2 rounded-md mr-2"
          onClick={() => setShowAddFriend(false)} // Show Add friend section
        >
          Add Friend
        </button>
        <button
          className="bg-purple-700 text-white px-4 py-2 rounded-md"
          onClick={() => setShowAddFriend(true)} // Show Chat section
        >
          Chat
        </button>
      </div>
      {showAddFriend ? (
        <div className="bg-white justify-center rounded-lg p-6 w-full md:w-96 h-64 md:h-auto overflow-y-auto border-4 border-purple-700 mb-4 md:mb-0 justify-center items-center">
          <div className="flex flex-col items-center">
            {chatsWithReceiverNames.length === 0 ? (
              <p>No chats available</p>
            ) : (
              <div className="w-full">
                {chatsWithReceiverNames.map((chat) => (
                  <button
                    key={chat._id}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md mb-2 block w-full text-left"
                    onClick={() => handleChatPress(chat._id, chat.members[0], chat.members[1])}
                  >
                    Chat with {chat.receiverName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) :(
        <div className="bg-white justify-center rounded-lg p-6 w-full md:w-96 h-64 md:h-auto overflow-y-auto border-4 border-purple-700 mb-4 md:mb-0 justify-center items-center">
          <h2 className="text-purple-700 text-2xl font-semibold mb-4 ">
            Add Friend
          </h2>
          <ul>
            {users.map((user) => (
              <li key={user._id} className="mb-2">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block text-white  bg-purple-700 rounded-2xl px-3 py-1"
                    style={{ width: "150px" }}
                  >
                    {user.name}
                  </span>
                  <button
                    className="bg-purple-700 text-white px-3 py-1 rounded-full hover:bg-purple-700 hover:text-white transition duration-300"
                    onClick={() => handleJoinPress(user._id)}
                  >
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) }
    </div>
  );
  
};

export default Chat;
