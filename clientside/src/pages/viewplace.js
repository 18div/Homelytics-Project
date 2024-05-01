import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PlacePage() {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState();
  const [url, setUrl] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [url3, setUrl3] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [checkoutError, setCheckoutError] = useState(false);

  const { id } = useParams();

  const handleClicked = (id) => {
    window.location.href = `/chat/${id}`;
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`https://homelytics-project.onrender.com/place/${id}`);
        if (response.data.success) {
          setPlace(response.data.place);
          setLoading(false);
        } else {
          console.error("Failed to fetch place:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchPlace();

    const owner_id = Cookies.get("userId");
    setUserId(owner_id);
    console.log("chatting owner" + userId);
  }, [userId, id]);

  useEffect(() => {
    if (place) {
      const slicedUrl = place.photos.slice(7);
      const slicedUrl2 = place.room.slice(7);
      const slicedUrl3 = place.lobby.slice(7);
      
      setUrl(slicedUrl);
      setUrl2(slicedUrl2);
      setUrl3(slicedUrl3);
    }
  }, [place]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
  };

  const handleCheckOutChange = (date) => {
    if (checkInDate && date < checkInDate) {
      setCheckoutError(true);
    } else {
      setCheckoutError(false);
    }
    setCheckOutDate(date);
  };

  const handleGuestIncrement = () => {
    setNumGuests(numGuests + 1);
  };

  const handleGuestDecrement = () => {
    if (numGuests > 1) {
      setNumGuests(numGuests - 1);
    }
  };

  const handleGuestChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= place.maxGuests) {
      setNumGuests(value);
    }
  };

  const handleBook = async () => {
    const bookingData = {
      placeId: place._id,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numGuests: numGuests,
      userId: userId,
      bookingDate: new Date()
    };
  
    try {
      const userBookings = await axios.get(`https://homelytics-project.onrender.com/user/bookings?userId=${userId}`);
      const overlappingBooking = userBookings.data.bookings.find(booking => {
        return (
          (new Date(booking.checkInDate) <= new Date(checkOutDate)) &&
          (new Date(booking.checkOutDate) >= new Date(checkInDate))
        );
      });
  
      if (overlappingBooking) {
        alert("You cannot book this place as you have overlapping booking dates.");
      } else {
        const response = await axios.post("https://homelytics-project.onrender.com/book", bookingData);
        if (response.data.success && numGuests <= place.maxGuests && !checkoutError) {
          alert("Thank you!!! Your booking is confirmed. Visit the Booking Page for confirmation.");
        } else {
          alert("Failed to book:", response.data.error);
        }
      }
    } catch (error) {
      console.error("Error booking:", error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 py-8 relative">
      {url && (
        <div className="w-full mb-8">
        <div className="relative mb-8">
          <img
            src={`https://homelytics-project.onrender.com/${url}`}
            alt={place.title}
            className="w-full h-auto object-cover rounded-lg mx-auto"
            style={{ maxHeight: '80vh' }}
          />
          <div className="absolute left-0 right-0 bottom-0 p-1 bg-black bg-opacity-50 text-white">
            <h2 className="text-2xl font-bold mb-2">{place.title}</h2>
          </div>
        </div>
        </div>
      )}
      
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} items-start`}>
        <div className="flex-1">
          <p className="text-lg text-black-700">{place.message}</p>
          <p className="text-2xl font-bold text-purple-700">{`Rs ${place.price}/-`}</p>
          <p className="text-2xl font-bold text-purple-700">{`Max-Guest :- ${place.maxGuests}`}</p>
          <div className="mt-4">
            <p className="text-center text-3xl font-bold text-purple-700">Start your booking</p>
          </div>
          <div className={`bg-purple-300 p-2 rounded-lg mt-4 flex ${isSmallScreen ? "flex-col" : "items-center flex-row"}`}>
            <div className={isSmallScreen ? "mb-1" : "mr-1"}>
              <DatePicker
                selected={checkInDate}
                onChange={handleCheckInChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Check-in"
              />
            </div>
            <div className={isSmallScreen ? "mb-1" : "mr-1"}>
              <DatePicker
                selected={checkOutDate}
                onChange={handleCheckOutChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Check-out"
              />
            </div>
            <div className={`flex ${isSmallScreen ? "flex-row" : "flex-column"} items-center`}>
              <button className="bg-white text-purple-700 px-2 py-1 rounded-full" onClick={handleGuestDecrement}>-</button>
              <input
                type="text"
                value={numGuests}
                onChange={handleGuestChange}
                className="w-10 text-center outline-none mx-2"
              />
              <button className="bg-white text-purple-700 px-2 py-1 rounded-full" onClick={handleGuestIncrement}>+</button>
            </div>
          </div>
          {checkoutError && (
            <p className="text-red-500">Checkout date must be after check-in date</p>
          )}
          {numGuests > place.maxGuests && (
            <p className="text-red-500">Number of guests cannot exceed maximum allowed guests</p>
          )}
          <div className="mt-4 text-center">
          <button onClick={handleBook} className="bg-purple-700 text-white py-2 px-4 rounded-full text-lg mt-2 text-center">Book</button>
          </div>
        </div>
        {isSmallScreen ? (
          <div className="flex flex-col mt-4">
            {url2 && (
              <img
                src={`https://homelytics-project.onrender.com/${url2}`}
                alt="Room"
                className="w-full h-auto mb-4 sm:mb-0 sm:mr-2"
              />
            )}
            {url3 && (
              <img
                src={`https://homelytics-project.onrender.com/${url3}`}
                alt="Lobby"
                className="w-full h-auto"
              />
            )}
          </div>
        ) : (
          <div className="flex justify-between mt-4 sm:mt-0">
            {url2 && (
              <img
                src={`https://homelytics-project.onrender.com/${url2}`}
                alt="Room"
                className="w-48 h-48 sm:w-96 sm:h-96 object-cover rounded-lg mb-4 sm:mr-2"
              />
            )}
            {url3 && (
              <img
                src={`https://homelytics-project.onrender.com/${url3}`}
                alt="Lobby"
                className="w-48 h-48 sm:w-96 sm:h-96 object-cover rounded-lg mb-4 sm:mr-2"
              />
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-end mr-4 mb-4">
        <Link
          onClick={() => handleClicked(userId)}
          className="bg-purple-700 text-white py-2 px-4 rounded-full text-lg"
        >
          Chat
        </Link>
      </div>
    </div>
  );
}

export default PlacePage;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Link, useParams } from "react-router-dom";

// function PlacePage() {
//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState();
//   const [url, setUrl] = useState(null);

//   const { id } = useParams();

//   const handleClicked = (id) => {
//     window.location.href = `/chat/${id}`;
//   };

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const response = await axios.get(`https://homelytics-project.onrender.com/place/${id}`);
//         if (response.data.success) {
//           setPlace(response.data.place);
//           setLoading(false);
//         } else {
//           console.error("Failed to fetch place:", response.data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching place:", error);
//       }
//     };

//     fetchPlace();

//     const owner_id = Cookies.get("userId");
//     setUserId(owner_id);
//     console.log("chatting owner" + userId);
//   }, [userId, id]);

//   useEffect(() => {
//     if (place) {
//       const slicedUrl = place.photos.slice(7);
//       setUrl(slicedUrl);
//     }
//   }, [place]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto px-8 py-8">
//       <div className="max-w-screen-lg mx-auto flex flex-wrap">
//         <div className="w-full md:w-1/2 pr-0 md:pr-8">
//           {url && (
//             <img
//               src={`https://homelytics-project.onrender.com/${url}`}
//               alt={place.title}
//               className="w-full h-80vh object-cover rounded-lg mb-8"
//             />
//           )}
//         </div>
//         <div className="w-full md:w-1/2">
//           <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg md:h-80vh">
//             <h2 className="text-3xl font-bold mb-2">{place.title}</h2>
//             <p className="text-lg text-gray-300">{place.description}</p>
//           </div>
//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-4">Perks:</h3>
//             <ul className="list-disc list-inside">
//               {Array.isArray(place.perks) &&
//                 place.perks.map((perk, index) => (
//                   <li key={index}>{perk}</li>
//                 ))}
//             </ul>
//           </div>
//           <div className="mt-8">
//             <p className="text-lg font-semibold">
//               Price per Night: ${place.price}
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="fixed bottom-0 left-0 right-0 flex justify-end mr-4 mb-4">
//         <Link
//           onClick={() => handleClicked(userId)}
//           className="bg-purple-700 text-white py-2 px-4 rounded-full text-lg"
//         >
//           Chat
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default PlacePage;
