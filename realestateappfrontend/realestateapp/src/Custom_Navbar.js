import React, { useState, useEffect, useContext } from 'react';
import './Custom_Navbar.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

//Navbar component
const Navbar = () => {

    //Declare Variables
    const[searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const[isInputFocused, setIsInputFocused] = useState(false);
    const { editProfile, setEditProfile, userLoggedIn, setUserLoggedIn } = useContext(DataContext);

    //Conditional Rendering of Search Results
    {isInputFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
        <div className='search-results' id='search-results'>
            {renderSearchResults(searchResults, searchTerm)}
        </div>
    )}



    //Search Function
    function search(event) {

        const input = event.target.value.toLowerCase();
        setSearchTerm(input); //Update the state

        const searchItems = [
            { name: "Home", url: "/Home" },
            { name: "Cart", url: "/Cart" },
            ...(userId !== '1' ? [{ name: "Profile", url: "/Profile" }] : []),
            { name: "Contact", url: "/Contact" },
            { name: "Phone", url: "/Contact" },
            { name: "Address", url: "/Contact" },
            { name: "E-mail", url: "/Contact" },
            { name: "Reservation", url: "/Booking" },
            { name: "Booking", url: "/Booking" }

         ];

         const filteredSearch = searchItems.filter(searchItems => searchItems.name.toLowerCase().includes(input));

         setSearchResults(filteredSearch);
    };

    //Render search results function
    function renderSearchResults(searchResults, searchTerm) {

        //Check if there are search results
        if (searchResults.length > 0) {
            return searchResults.map(function(result, index) {
                return (
                    <a key={index} onClick={() => navigate(result.url)}>{result.name}</a>
                )
            });
        }


        //Check if the search term is present and no results were found
        else if (searchTerm.length > 0) {
            return (
                <div className='noresultsdiv'>No Results Matched your Search</div>
            );
        }
        // If no search term is present, do not display anything
        else {

            return null ; //No need to render anything
        }
    };




    //Navigation
    const navigate = useNavigate();

    const goToLanguage = () => {
        navigate('/');
    }
    const goToHome = () => {
        navigate('/Home');
        setEditProfile(false); //Ensures Profile page refreshes on return
    };

    const goToContact = () => {
        navigate('/Contact');
        setEditProfile(false);
    };

    const goToProfile = () => {
        navigate('/Profile');
        setEditProfile(false); //Ensures Profile page refreshes on return
    };

    const goToCart = () => {
        navigate('/Cart');
    };

    const goToBooking = () => {
        navigate('/Booking');
    };

    const goToManageBookings = () => {
        navigate('/ManageBookings');
    };


    //Logout function
    const logout = () => {
        setUserLoggedIn(false);
        localStorage.setItem('userLoggedIn', 'false');
        localStorage.removeItem('userId');
        console.log(userLoggedIn, localStorage.getItem('userLoggedIn'));
        alert("You have been logged out.")
        navigate('/');
    }

    const userId = localStorage.getItem('userId');

    return (

        <>
        <div className="navbar">
            <div className="navbarcomponents">
                <div className='languagebtn'>
                    <button onClick={goToLanguage}>Change Language</button>
                </div>
                <div className = "navbarhome">
                    <button className = "navbarhomebtn" onClick={goToHome}>
                        Home
                    </button>
                </div>
                <div className="search"> {/*Search Bar */}
                    <input id="searchbar"
                    value = {searchTerm}
                    onChange= {search}
                    onFocusCapture={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                    type="text"
                    placeholder="Search..."/>
                    {isInputFocused && (searchTerm.length > 0 || searchResults.length > 0) && (
                        <div className="search-results" id="search-results">
                            {renderSearchResults(searchResults, searchTerm)}
                        </div>
                    )}
                </div>
                <div className='bookings'>
                    <button onClick={goToBooking}>Book a Room</button>
                </div>
                <div className="dropdowncontact"> {/*Create link to contact form. Create Links to each social media and list phone,email, and office location in DIV*/}
                    <button className="dropdowncontactbtn" onClick={goToContact}><a>Contact</a>
                    </button>
                    <div className="dropdown-content-contact">
                        <br/>
                        <br/>
                        <p>Phone: 03-6903-7256 </p>
                        <br/>
                        <p>Address: 2 Chome-4-17 Takinogawa, Kita City, Tokyo 114-0023 </p>
                        <br/>
                        <br/>
                        <a href="#" className="facebooknav">Facebook</a>
                        <a href="#" className="twitternav">Twitter</a>
                        <a href="#" className="instagramnav">Instagram</a>
                    </div>
                </div>
                <div className='cart'>
                    <button onClick={goToCart}>Cart</button>
                </div>
                {/* Conditional Auth Buttons */}

                {localStorage.getItem('userLoggedIn') === 'true' && (userId === '1') ? (
                    // Admin: Show Manage Bookings and Logout
                    <>
                        <div className='managebookings'>
                            <button onClick={goToManageBookings}>Manage Bookings</button>
                        </div>
                        <div className='logout'>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </>
                ) : localStorage.getItem('userLoggedIn') === 'true' ? (
                    // Non-admin: Show Profile and Logout
                    <>
                        <div className='profile'>
                            <button onClick={goToProfile}>Profile</button>
                        </div>
                        <div className='logout'>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </>
                ) : (
                    // Not logged in: Show Sign Up and Login
                    <>
                        <div className='signup'>
                            <button onClick={() => navigate('/Signup')}>Sign Up</button>
                        </div>
                        <div className='login'>
                            <button onClick={() => navigate('/Login')}>Login</button>
                        </div>
                    </>
                )}
            </div>
        </div>
        </>
     );
}

export default Navbar;
