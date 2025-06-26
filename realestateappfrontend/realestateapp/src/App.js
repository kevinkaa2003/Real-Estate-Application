import './App.css';
import { useEffect, useRef, useState, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home.js';
import Contact from './Contact.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';
import Cart from './Cart.js';
import Booking from './Booking.js'
import ManageBookings from './ManageBooking.js';
import { DataContext } from './DataProvider.js';
import PrivateRoute from './PrivateRoute.js';
import LanguageSelect from './LanguageSelect.js';
//Japanese Translation Components
import Home_J from './Home_J.js';
import Contact_J from './Contact_J.js';
import Login_J from './Login_J.js';
import SignUp_J from './SignUp_J.js';
import Profile_J from './Profile_J.js';
import Cart_J from './Cart_J.js';
import Booking_J from './Booking_J.js';
import ManageBookings_J from './ManageBooking_J.js';




function App() {
  return (
    //Declare Routes
        <div className="App">
            <Routes>
              <Route path ='/' element = {
                      <LanguageSelect/>
              }/>
              <Route path ='/Home' element = {
                      <Home/>
              }/>
              <Route path = '/Login' element = {<Login/>}/>
              <Route path = '/SignUp' element = {<SignUp/>}/>
              <Route path = '/Booking' element = {<Booking/>}/>

              <Route path = '/ManageBookings' element = {
                <PrivateRoute>
                  <ManageBookings/>
                </PrivateRoute>
                }/>
              <Route path = '/Profile' element = {
                <PrivateRoute>
                    <Profile/>
                </PrivateRoute>
              } />
              <Route path = '/Cart' element= {
                    <Cart/>
                }
              />
              <Route path = '/Contact' element = {
                  <Contact/>
              }/>


              {/*Japanese Translation Routes */}
              <Route path ='/Home_J' element = {
                      <Home_J/>
              }/>
              <Route path = '/Login_J' element = {<Login_J/>}/>
              <Route path = '/SignUp_J' element = {<SignUp_J/>}/>
              <Route path = '/Booking_J' element = {<Booking_J/>}/>

              <Route path = '/ManageBookings_J' element = {
                <PrivateRoute>
                  <ManageBookings_J/>
                </PrivateRoute>
                }/>
              <Route path = '/Profile_J' element = {
                <PrivateRoute>
                    <Profile_J/>
                </PrivateRoute>
              } />
              <Route path = '/Cart_J' element= {
                    <Cart_J/>
                }
              />
              <Route path = '/Contact_J' element = {
                  <Contact_J/>
              }/>
            </Routes>
        </div>
  );
}

export default App;
