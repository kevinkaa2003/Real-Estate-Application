import logo from './logo.svg';

import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';
import Slideshow from './Custom_Slideshow.js'
import { DataContext } from './DataProvider.js';
import tokyo3 from './tokyoguesthouse3.png';
import tokyo4 from './tokyoguesthouse4.png';
import './Home.css';
import FoodSlideshow from './Food_Slideshow.js';

//Home component
const Home = () => {
    const navigate = useNavigate();
    const goToBooking = () => {
        navigate('/Booking');
    }

    const goToContact = () => {
        navigate('/Contact');
    }

    const { musicSchedule, setMusicschedule } = useContext(DataContext);
    
    return (
        <>
        <Navbar/>
        <Slideshow/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="homeinfowrapper">
            <div className="conceptinfo">
                <h1>Concept</h1>
                <p>Tokyo Guesthouse Oji Music Lounge opened in 2017. The Guesthouse is situated approx. 3 minutes from JR Oji Station, close to Ueno and other main locations. It is surrounded by parks and beautiful Japanese townscape.</p>
                <br/>
                <p>Through Music, we want to share a wonderful time with musicians and music lovers from all around the World. Please have a good time and enjoy yourselves. We are looking forward to your visit.</p>
            </div>
            <div className="hostelinfo">
                <h1>Hostel</h1>
                <h4>Check In:</h4>
                <p>14:00 - 22:00</p>
                <h4>Check Out:</h4>
                <p>7:00 - 10:00</p>
                <span>The Guesthouse provides many type of rooms, from dormitory type rooms to private rooms. Please feel free to contact us for long stays or group use.</span>
                <div className="hostelcontactbuttons">
                    <button onClick={goToBooking}>Book Now</button>
                    <button onClick={goToContact}>Contact Us</button>
                </div>
            </div>
            <div className="foodinfo">
                {FoodSlideshow()}
                <br/>
                <br/>
                <br/>
                <h1>Food & Drink</h1>
                <h4>Cafe & Bar:</h4>
                <p>11:30 - 22:00</p>
                <h4>Lunch:</h4>
                <p>11:30 - 15:00</p>
                <div className="fooddescription">
                    <p>The cafe space is available not only for the guests, but also to the public. From original cafe menus, to homemade hearth-baked pizza, we provide a large selection of food and beverages.</p>
                </div>
            </div>
            <div className="musicloungeinfo">
                <img src={tokyo4}/>
                <br/>
                <br/>
                <br/>
                <h1>Music Lounge</h1>
                <div className="musicloungedescription">
                    <p>Live concerts by host musicians and other artists are regularly held in the music lounge, situated on the first floor. You can also play the electric piano and the guitar.</p>
                </div>
                <div className='musicscheduletitle'>
                    <h2>Schedule</h2>
                </div>
                <div className='musicscheduletable'>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Artist
                                </th>
                                <th>
                                    Time
                                </th>
                            </tr>
                        </thead>
                        {musicSchedule.map((res, idx) => (
                            <tr
                                key={idx}
                                className='musicschedulehome'
                            >
                            <td>
                                {res["Date"]}
                            </td>
                            <td>
                                {res["Artist"]}
                            </td>
                            <td>
                                {res["Time"]}
                            </td>

                            </tr>

                        ))}
                    </table>
                </div>
            </div>
        </div>
        <CustomFooter></CustomFooter>
        </>
    );
}

export default Home;
