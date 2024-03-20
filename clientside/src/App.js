import React from "react";
import { Route, Routes } from "react-router-dom";
import Indexpage from "./pages/Indexpage.js";
import Loginpage from "./pages/Loginpage.js";
import Layout from "./Layout.js";
import Registerpage from "./pages/Registerpage.js";
import Accountpage from "./pages/Accountpage.js";
import Accomodationpage from "./pages/Accomodationpage.js";
import Addplace from "./pages/Addplace.js";
import EditAccommodationPage from "./pages/EditAccommodationpage.js";
import Chat from "./pages/Chat.js";
import ChatScreen from "./pages/ChatScreen.js";
import Profile from "./pages/Profile.js";
import PlacePage from "./pages/viewplace.js"; // Import the PlacePage component
import UserBookingPage from "./pages/UserBooking.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Indexpage />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/chat/:chatId/:senderId/:receiverId" element={<ChatScreen />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/account" element={<Accountpage />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/places" element={<Accomodationpage />} />
        <Route path="/account/bookings" element={<UserBookingPage />} />
        <Route path="/account/places/add" element={<Addplace />} />
        <Route path="/account/places/edit/:id" element={<EditAccommodationPage />} />
        <Route path="/place/:id" element={<PlacePage />} />
      </Route>
    </Routes>
  );
}

export default App;
