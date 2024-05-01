import React, { useState } from "react";
import AccountPage from "./Accountpage";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaSwimmingPool,
  FaUtensils,
  FaWifi,
  FaCar,
  FaTv,
  FaBed,
} from "react-icons/fa";

import { MdLocalLaundryService} from "react-icons/md";
import { PiToiletLight } from "react-icons/pi";
import { IoCameraOutline } from "react-icons/io5";

function Addplace() {
  const userIdFromCookie = Cookies.get("userId");

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [checkIn, setCheckIn] = useState(0);
  const [checkOut, setCheckOut] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState();
  const [perks, setPerks] = useState({
    oven: false,
    swimmingPool: false,
    indianToilet: false,
    securityCamera: false,
    food: false,
    refrigerator: false,
    laundry: false,
    wifi: false,
    parking: false,
    tv: false,
    bed: false,
  });
  const [room, setRoom] = useState();
  const [lobby, setLobby] = useState();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleCheckInChange = (e) => setCheckIn(parseInt(e.target.value));
  const handleCheckOutChange = (e) => setCheckOut(parseInt(e.target.value));
  const handleMaxGuestsChange = (e) => setMaxGuests(parseInt(e.target.value));
  const handlePriceChange = (e) => setPrice(parseInt(e.target.value));
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleRoomChange = (e) => setRoom(e.target.files[0]);
  const handleLobbyChange = (e) => setLobby(e.target.files[0]);
  
const handlePerkChange = (perk) => {
  setPerks({ ...perks, [perk]: !perks[perk] });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("owner", userIdFromCookie);
      formData.append("title", title);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("message", message);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("maxGuests", maxGuests);
      formData.append("price", price);
      formData.append("image", file);
      formData.append("roomPhotos", room);
      formData.append("lobbyPhotos", lobby);

      formData.append("perks", JSON.stringify(perks));

      const response = await axios.post("https://homelytics-project.onrender.com/places", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        alert("Place added successfully");
        resetForm();
        
      } else {
        alert("Failed to add place");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setAddress("");
    setFile("");
    setDescription("");
    setCheckIn(0); 
    setCheckOut(0);
    setMaxGuests(0);
    setPrice(0);
    setMessage("");
    setPerks({
      oven: false,
      swimmingPool: false,
      indianToilet: false,
      securityCamera: false,
      food: false,
      refrigerator: false,
      laundry: false,
      wifi: false,
      parking: false,
      tv: false,
      bed: false,
    });
  };

  return (
    <div>
      <AccountPage />
      <div className="max-w-6xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Title:</span>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Address:</span>
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleAddressChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description:</span>
            <input
              type="text"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Message:</span>
            <input
              type="text"
              name="description"
              value={message}
              onChange={handleMessageChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Upload Image:</span>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="imageFile"
                name="image"
                onChange={handleFileChange}
              />
              <button
                type="submit"
                className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Upload
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-gray-700">Room Photos:</span>
            <input
              type="file"
              name="roomPhotos"
              onChange={handleRoomChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Lobby Photos:</span>
            <input
              type="file"
              name="lobbyPhotos"
              onChange={handleLobbyChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          
          <label className="block ">
          <span className="text-gray-700">Perks:</span>
          <div className="grid grid-cols-6 gap-4">
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.oven}
                onChange={() => handlePerkChange("oven")}
              />
              <span className="text-gray-700"><FaUtensils /> Oven</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.swimmingPool}
                onChange={() => handlePerkChange("swimmingPool")}
              />
              <span className="text-gray-700"><FaSwimmingPool /> Swimming Pool</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.indianToilet}
                onChange={() => handlePerkChange("indianToilet")}
              />
              <span className="text-gray-700"><PiToiletLight /> Western Toilet</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.securityCamera}
                onChange={() => handlePerkChange("securityCamera")}
              />
              <span className="text-gray-700"><IoCameraOutline /> Security Camera</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.food}
                onChange={() => handlePerkChange("food")}
              />
              <span className="text-gray-700"><FaUtensils /> Food</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.refrigerator}
                onChange={() => handlePerkChange("refrigerator")}
              />
              <span className="text-gray-700"><FaBed /> Refrigerator</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.laundry}
                onChange={() => handlePerkChange("laundry")}
              />
              <span className="text-gray-700"><MdLocalLaundryService /> Laundry</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.wifi}
                onChange={() => handlePerkChange("wifi")}
              />
              <span className="text-gray-700"><FaWifi /> Wifi</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.parking}
                onChange={() => handlePerkChange("parking")}
              />
              <span className="text-gray-700"><FaCar /> Parking</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.tv}
                onChange={() => handlePerkChange("tv")}
              />
              <span className="text-gray-700"><FaTv /> TV</span>
            </label>
            <label className="block flex items-center gap-2">
              <input
                type="checkbox"
                checked={perks.bed}
                onChange={() => handlePerkChange("bed")}
              />
              <span className="text-gray-700"><FaBed /> Bed</span>
            </label>
          </div>
          </label>

          <label className="block">
            <span className="text-gray-700">Check In:</span>
            <input
              type="number"
              name="checkIn"
              value={checkIn}
              onChange={handleCheckInChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Check Out:</span>
            <input
              type="number"
              name="checkOut"
              value={checkOut}
              onChange={handleCheckOutChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Max Guests:</span>
            <input
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleMaxGuestsChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Price:</span>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handlePriceChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Place
          </button>
        </form>
      </div>
    </div>
  );
}

export default Addplace;
