import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import WomenPage from "./pages/WomenPage";
import MenPage from "./pages/MenPage";
import OrderPage from "./pages/OrderPage";
import MyAccount from "./pages/MyAccount";

import DashboardPage from "./dashboard/DashboardPage";
import CustomersPage from "./dashboard/CustomersPage";
import OrdersPage from "./dashboard/OrdersPage";
import PostStylePage from "./dashboard/PostStylePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/account" element={<MyAccount />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/customers" element={<CustomersPage />} />
        <Route path="/dashboard/orders" element={<OrdersPage />} />
        <Route path="/dashboard/post-style" element={<PostStylePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;