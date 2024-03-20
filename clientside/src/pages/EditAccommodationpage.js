import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EditAccommodationPage() {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`https://homelytics-project-server.onrender.com/edit/places/${id}`);
        if (response.data.success) {
          setAccommodation(response.data.place);
        } else {
          console.error("Failed to fetch accommodation:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching accommodation:", error);
      }
    };

    fetchAccommodation();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(`https://homelytics-project-server.onrender.com/places/update/${id}`, updatedData);
      if (response.data.success) {
        alert("Changes Saved")
      } else {
        console.error("Failed to update accommodation:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating accommodation:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {};
    formData.forEach((value, key) => {
      updatedData[key] = value;
    });
    handleUpdate(updatedData);
    alert("Changes Saved Successfully !!")
    window.location.href = `/account/places`;
  };

  if (!accommodation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-purple-700 text-center mt-8 text-2xl font-bold">Edit Accommodation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Title:</span>
          <input
            type="text"
            name="title"
            defaultValue={accommodation.title}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Address:</span>
          <input
            type="text"
            name="address"
            defaultValue={accommodation.address}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description:</span>
          <input
            type="text"
            name="description"
            defaultValue={accommodation.description}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Message:</span>
          <input
            type="text"
            name="message"
            defaultValue={accommodation.message}
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
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
        </label>
        <label className="block">
          <span className="text-gray-700">Rooms Image:</span>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="imageFile"
              name="image"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
        </label>
        <label className="block">
          <span className="text-gray-700">Lobby Image:</span>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="imageFile"
              name="image"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
        </label>
        <label className="block">
          <span className="text-gray-700">Check In:</span>
          <input
            type="number"
            name="checkIn"
            defaultValue={accommodation.checkIn}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Check Out:</span>
          <input
            type="number"
            name="checkOut"
            defaultValue={accommodation.checkOut}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Max Guests:</span>
          <input
            type="number"
            name="maxGuests"
            defaultValue={accommodation.maxGuests}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Price:</span>
          <input
            type="number"
            name="price"
            defaultValue={accommodation.price}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditAccommodationPage;