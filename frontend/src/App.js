import './App.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewProduct from './pages/NewProduct';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import ScrollToTop from './components/ScrollToTop';
import OrdersPage from './pages/ordersPage';
import CartPage from './pages/CartPage';
import Pay from './pages/Pay';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';
import { io } from 'socket.io-client';
import { addNotification } from "./features/userSlice";
import Footer from './components/Footer';
import React from 'react';

import AllCategory from './pages/AllCategory';

function App() {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("ws://localhost:8080");
    
    socket.off('notification').on('notification', (msgObj, user_id) => {
      if (user_id === user._id) {
        dispatch(addNotification(msgObj));
      }
    });

    socket.off("new-order").on("new-order", (msgObj) => {
      if (user.isAdmin) {
        dispatch(addNotification(msgObj));
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          {!user && (<>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </>
          )}

          {user && (
            <>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/pay" element={<Pay />} />
              {/* <Route path="/checkout" element={<CheckoutForm />} /> */}
              <Route path="/orders" element={<OrdersPage />} />
            </>
          )}

          {user && user.isAdmin && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/product/:id/edit" element={<EditProductPage />} />
            </>
          )}

          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/all" element={<AllCategory />} />
          <Route path='/new-product' element={<NewProduct />} />
          <Route path='*' element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    
    </div>
  );
}

export default App;
