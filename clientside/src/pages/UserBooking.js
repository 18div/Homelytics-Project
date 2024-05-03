import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

function UserBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placeDetails, setPlaceDetails] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = Cookies.get("userId");
        const response = await fetch(
          `https://homelytics-project-server.onrender.com/user/bookings?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings);
          setLoading(false);
        } else {
          console.error("Failed to fetch user bookings");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const promises = bookings.map(async (booking) => {
          const response = await fetch(
            `https://homelytics-project-server.onrender.com/place/${booking.placeId}`
          );
          if (response.ok) {
            const data = await response.json();
            return { [booking.placeId]: data.place }; // Storing place details with placeId as key
          } else {
            console.error("Failed to fetch place details");
            return null;
          }
        });
        const resolvedPromises = await Promise.all(promises);
        const placeDetailsObject = resolvedPromises.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setPlaceDetails(placeDetailsObject);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    if (bookings.length > 0) {
      fetchPlaceDetails();
    }
  }, [bookings]);

  const calculateTotalPrice = (booking) => {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
  
    // Calculate the number of nights between check-in and check-out dates
    let numNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
    // Handle the case where the check-out date is before the check-in date
    if (numNights < 0) {
      return 0; // Invalid dates, return 0 as total price
    }
  
    // Check if the check-out date is in a new month and the check-in date is in the previous month
    if (checkOutDate.getMonth() !== checkInDate.getMonth() && checkOutDate.getDate() < checkInDate.getDate()) {
      // Calculate the number of days left in the check-in month
      const daysInCheckInMonth = new Date(checkInDate.getFullYear(), checkInDate.getMonth() + 1, 0).getDate() - checkInDate.getDate() + 1;
      // Calculate the number of days in the check-out month
      const daysInCheckOutMonth = checkOutDate.getDate();
      // Calculate the total number of nights considering days in each month
      numNights = daysInCheckInMonth + daysInCheckOutMonth;
    }
  
    // Calculate the total price based on the number of nights and booking price
    return numNights * booking.price;
  };
  

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap justify-center">
          {" "}
          {/* Updated to justify-center */}
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="w-full sm:w-40 md:w-40 lg:w-96 p-2"
            >
              <div className="border rounded-lg p-4 flex flex-col items-center">
                {" "}
                {/* Updated to flex-col and added items-center */}
                {placeDetails[booking.placeId] && (
                  <div>
                    <h2 className="text-xl font-semibold mt-4">
                      Place Details
                    </h2>
                    <div className="text-gray-700 mb-2">
                      Title: {placeDetails[booking.placeId].title}
                    </div>
                    <div className="text-gray-700 mb-2">
                      Address: {placeDetails[booking.placeId].address}
                    </div>
                    {placeDetails[booking.placeId].photos && (
                      <img
                        src={`https://homelytics-project-server.onrender.com/${placeDetails[
                          booking.placeId
                        ].photos.slice(7)}`}
                        alt="Place"
                        className="mt-2 w-full h-auto"
                      />
                    )}
                    <div className="text-lg font-semibold mb-2">
                      Booking ID: {booking._id}
                    </div>
                    <div className="text-gray-700 mb-2">
                      Check-in Date:{" "}
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-700 mb-2">
                      Check-out Date:{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-700 mb-2">
                      Number of Guests: {booking.numGuests}
                    </div>
                    <div className="text-gray-700 mb-2">
                      Booking Date:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <button className="bg-purple-700 text-white rounded-md px-4 py-2 mt-4">
                      Pay - {calculateTotalPrice(booking)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBookingPage;
