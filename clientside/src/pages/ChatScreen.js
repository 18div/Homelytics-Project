import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from "react-router-dom";
const socket = io('https://homelytics-project-server.onrender.com/');

const ChatScreen = () => {
  const { chatId, senderId, receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderNames, setSenderNames] = useState({});
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("joinChat", { chatId, userId: senderId });

    fetchChatMessages(chatId);

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Fetch sender name and update state
      fetchSenderName(message.senderId);
    });

    socket.on("userDisconnected", (userId) => {
      console.log(`User ${userId} disconnected`);
    });

    return () => {
      socket.emit("leaveChat", { chatId, userId: senderId });
      socket.off("newMessage");
      socket.off("userDisconnected");
    };
  }, [chatId, senderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await fetch(`https://homelytics-project-server.onrender.com//chat/get/messages/${chatId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);

      data.forEach((message) => fetchSenderName(message.senderId));
    } catch (error) {
      console.error("Error fetching chat messages:", error.message);
    }
  };

  const fetchSenderName = async (senderId) => {
    try {
      const response = await fetch(`https://homelytics-project-server.onrender.com//find/byUserId/${senderId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSenderNames((prevNames) => ({
        ...prevNames,
        [senderId]: data.username || "Unknown",
      }));
    } catch (error) {
      console.error("Error fetching sender name:", error.message);
    }
  };

  const handleSend = async () => {
    try {
      const response = await fetch(`https://homelytics-project-server.onrender.com//chat/create/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          senderId,
          text: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      socket.emit("sendMessage", {
        chatId,
        senderId,
        text: newMessage,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const renderItem = ({ item, senderId, senderNames }) => {
    const isSender = item.senderId === senderId;
    const senderName = senderNames[item.senderId] || "Unknown";
  
    const messageDate = new Date(item.createdAt);
    const formattedDate = `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
  
    return (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} my-2`} key={item._id}>
        <div className={`max-w-xs ${isSender ? 'bg-yellow-100' : 'bg-white-700'} rounded-lg p-3 shadow-md border ${isSender ? 'border-green-500' : 'border-gray-400'}`}>
          <p className={`text-sm ${isSender ? 'text-black' : 'text-black-800'}`}>{`${isSender ? "You" : senderName}: ${item.text}`}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>
    );
  };
  

  return (
    <div className="max-w-screen-md mx-auto p-4 mt-10">
      <div ref={messagesContainerRef} className="min-h-96 max-h-96 overflow-y-auto mb-4 border-4 border-purple-400 rounded-lg border-gray-300 p-7">
        {messages.map((message, index) => (
          <div key={index}>
            {renderItem({
              item: message,
              senderId: senderId,
              senderNames: senderNames,
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2 px-4 py-2 rounded-lg border border-gray-400"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
      </div>
    </div>
  );
  
};

export default ChatScreen;
