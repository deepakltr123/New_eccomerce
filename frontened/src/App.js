import React from "react"
import { useEffect } from "react";
import webFont from "webfontloader"
import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store"
import {useState} from "react"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import axios from "axios";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import orderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      const response = await axios.get("/api/v1/stripeapikey", {
        headers: {
          Authorization: `Bearer ${stripeApiKey}`, // Replace YOUR_SECRET_KEY with your actual API key
        },
      });
  
      const { data } = response;
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching Stripe API key:", error);
    }
  }
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
    store.dispatch(loadUser())
    getStripeApiKey();
  }, [])
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/Search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route path='/account' element={<ProtectedRoute Component={Profile} />}/>
        <Route path='/me/update' element={<ProtectedRoute Component={UpdateProfile} />}/>
        <Route path='/password/update' element={<ProtectedRoute Component={UpdatePassword} />}/>
        <Route path='/password/reset/:token' element={<ResetPassword/>}/>
        <Route path='/password/forgot' element={<ForgotPassword/>}/>
        <Route exact path="/cart" element={<Cart />} />
        <Route path='/shipping' element={<ProtectedRoute Component={Shipping} />}/>
        <Route path='/order/confirm' element={<ProtectedRoute Component={ConfirmOrder} />}/>
        {stripeApiKey && (
          <Route path='/process/payment' element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute Component={Payment} />
            </Elements>
          } />
        )}
        <Route path='/success' element={<ProtectedRoute Component={orderSuccess} />}/>
        <Route path='/orders' element={<ProtectedRoute Component={MyOrders} />}/>

      </Routes>
      <Footer />
    </Router>
  )
}
export default App