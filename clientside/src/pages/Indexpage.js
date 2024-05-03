import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function Indexpage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState();

  const handleClicked = (id) => {
    window.location.href = `/chat/${id}`;
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`https://homelytics-project-server.onrender.com//all/places`);
        if (response.data.success) {
          setPlaces(response.data.places);
          setLoading(false);
        } else {
          console.error("Failed to fetch places:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();

    const owner_id = Cookies.get("userId");
    setUserId(owner_id);
    console.log("chatting owner" + userId);
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-9">
      {places.map((place, index) => {
        const slicedUrl = place.photos.slice(7);
        return (
          <Link
            key={index}
            to={`/place/${place._id}`}
            className="bg-gray-100 shadow-md rounded-lg flex flex-col"
            style={{ minHeight: "300px" }} // Set a minimum height for each box
          >
            <img
              src={`https://homelytics-project-server.onrender.com//${slicedUrl}`}
              alt={place.title}
              className="w-full object-cover rounded-t-lg border border-purple-000"
              style={{ maxHeight: "250px" }} 
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{place.title}</h3>
                <p className="text-gray-600 mb-2">{place.description}</p>
              </div>
              <h3 className="text-gray-600 mb-2 font-bold">{place.address}</h3>
              <p className="text-purple-700 font-semibold">
                Price per Night: ${place.price}
              </p>
            </div>
          </Link>
        );
      })}
      <div className="fixed bottom-0 left-0 right-0  flex justify-end mr-4 mb-4">
        <Link onClick={() => handleClicked(userId)} className="bg-purple-700 text-white py-2 px-4 rounded-full text-lg">Chat</Link>
      </div>
    </div>
  );
}

export default Indexpage;
