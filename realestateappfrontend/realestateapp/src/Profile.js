import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Custom_Navbar';
import CustomFooter from './Custom_Footer.js';
import { DataContext } from './DataProvider.js';
import axios from 'axios';
import './Profile.css'; //CSS


const Profile = () => {

    //Declare all profile variables
    const { userLoggedIn, setUserLoggedIn } = useContext(DataContext);
    const { editProfile, setEditProfile } = useContext(DataContext);
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ street, setStreet ] = useState('');
    const [ apartment, setApartment ] = useState('');
    const [ city, setCity ] = useState('');
    const [ stateProvince, setStateProvince ] = useState('');
    const [ country, setCountry ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ showDeletePopup, setShowDeletePopup ] = useState(false);
    const navigate = useNavigate();

    //Edit button switch handler
    const editProfileHandler = () => {
        if (editProfile === false) {
            setEditProfile(true);
            localStorage.setItem('editProfile', 'true');
            console.log("Editing Profile.")
        } else {
            setEditProfile(false);
            localStorage.setItem('editProfile', 'false');
            console.log("Editing Completed.")
        }
    }

    //Populate Profile Function
    const populateProfile = async (e) => {

        //Obtain Profile data from backend
        try {

            const response = await fetch('http://localhost:5000/profile',
                {
                    mode: 'cors',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', //Allow cookies to be sent and received
                })

            if (!response.ok) {
                console.error("Profile Data Response Error: ", response.statusText);
                return;
            }

            const data = await response.json(); //Properly parse response
            console.log("Profile Data Received: ", data);

            //Set Profile variables from data acquired
            if (data.success) {

                //Set states for the received profile data
                    Promise.all([
                    setFirstName(data.data["First Name"]),
                    setLastName(data.data["Last Name"]),
                    setStreet(data.data["Street"]),
                    setApartment(data.data["Apartment"]),
                    setCity(data.data["City"]),
                    setStateProvince(data.data["State/Province"]),
                    setCountry(data.data["Country"]),
                    setPhone(data.data["Phone"]),
                    setEmail(data.data["Email"]),
                    ])
            } else {
                console.error("Profile data retrieval failed: ", data.message);
            }
        } catch (error) {
            console.error("Could not Populate Profile Data: ", error);

        }
    };




    //Call populateProfile when editProfile is false
    useEffect(() => {
        if (!editProfile) {
            populateProfile();
        }
    }, [editProfile]);

    //sendProfileInfo Function
    const sendProfileInfo = async (e) => {
        e.preventDefault(); //Prevent page reload

        //Post request to send profile info to backend to be entered into database
        try {
            const response = await fetch('http://localhost:5000/profile',
            {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', //Allow cookies to be sent and received
                body: JSON.stringify({
                    firstName,
                    lastName,
                    street,
                    apartment,
                    city,
                    stateProvince,
                    country,
                    phone,
                    email
                })
            });

            //If a valid response is returned, set editProfile to false.
            if(response.ok) {
                setEditProfile(false);
                console.log("Profile Updated Successfully!");

            } else {
                console.log("Profile Could Not be Updated.")

            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    }

    //Delete profile initation function: Displays delete profile <div>
    const deleteProfileInitiation = () => (
        <>
        <br/>
        <br/>
            <div className='deleteprofileconfirmation'>
                <br/>
                <span>Are you sure you want to delete your profile?</span>
                <br/>
                <br/>
                <button className='deleteyes' onClick={() => {
                    deleteProfileAuthorization(true)}}>Yes</button>
                <br/>
                <br/>
                <button className='deleteno' onClick={() => {
                    deleteProfileAuthorization(false)}}>No</button>
            </div>
        </>
        );

    //Delete profile authorization function
    const deleteProfileAuthorization = async (shouldDelete) => {


        if (shouldDelete) {


            //Post request to remove profile data
            try {

                const response = await fetch('http://localhost:5000/deleteprofile',
                    {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', //Allow cookies to be sent and received
                    })

                if (!response.ok) {
                    console.error("Profile Deletion Failed: ", response.statusText);
                    return;
                } else if (response.ok) {//Valid response navigates user back to Login page
                    setUserLoggedIn(false);
                    localStorage.setItem('userLoggedIn', 'false');
                    localStorage.removeItem('userId');
                    alert('Profile Deleted');
                    navigate('/');
                };
            } catch (error) {
                console.error("Error Deleting Profile:", error);
            }
        } else { //If shouldDelete argument is false, set showDeletePopup to false
            setShowDeletePopup(false);
        }
    };

    return (

    <>
    <Navbar/>
    <div className='mainwrapper'>
        {editProfile === true ? ( //Check to see if user is editing profile
        <>
            <div className="profilemain">
                    <div className='profilewrapper'>
                        <div className='profiletitle'>Profile</div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <button onClick = {editProfileHandler} className='editprofilebutton'>Edit Profile</button>
                        <br/>
                        <br/>
                        <button onClick={sendProfileInfo} className='saveprofilebutton'>Save Profile</button>
                        <br/>
                        <br/>
                        <div className='personalinfo'>
                            <strong>Personal Information</strong>
                            <br/>
                            <br/>
                            <br/>
                            <div>
                                <label for='firstname' className='label-above'>First Name:</label>
                                <br/>
                                <input type='text' id='firstname' value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                            </div>
                            <br/>
                            <label for='lastname' className='label-above'>Last Name:</label>
                            <br/>
                            <input type='text' id='lastname'value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                            <br/>
                            <label for='street' className='label-above'>Street:</label>
                            <br/>
                            <input type='text' id='street' value={street} onChange={(e) => setStreet(e.target.value)}></input>
                            <br/>
                            <label for='apartment' className='label-above'>Apartment:</label>
                            <br/>
                            <input type='text' id='apartment' value={apartment} onChange={(e) => setApartment(e.target.value)}></input>
                            <br/>
                            <label for='city' className='label-above'>City:</label>
                            <br/>
                            <input type='text' id='city' value={city} onChange={(e) => setCity(e.target.value)}></input>
                            <br/>
                            <label for='stateprovince' className='label-above'>State/Province:</label>
                            <br/>
                            <input type='text' id='stateprovince' value={stateProvince} onChange={(e) => setStateProvince(e.target.value)}></input>
                            <br/>
                            <label for='country' className='label-above'>Country:</label>
                            <br/>
                            <input type='text' id='country' value={country} onChange={(e) => setCountry(e.target.value)}></input>
                            <br/>
                            <br/>
                        </div>
                        <div className='contactinfo'>
                            <strong>Contact Information</strong>
                            <br/>
                            <br/>
                            <br/>
                            <label for='phone' className='label-above'>Phone:</label>
                            <br/>
                            <input type='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            <br/>
                            <label for='email' className='label-above'>E-mail:</label>
                            <br/>
                            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            <br/>
                            <br/>
                        </div>
                    </div>
            </div>
            <CustomFooter/>
            </>
        ) : (<>
            <div className="profilemain">
                <div className="profilewrapper">
                    <div className='profiletitle'>Profile</div>
                    <br/>
                    <br/>
                    <br/>
                    <button onClick = {editProfileHandler}>Edit Profile</button>
                    <br/>
                    <br/>
                    <button onClick={() => setShowDeletePopup(true)}>Delete Profile</button>
                    {showDeletePopup && deleteProfileInitiation()}
                    <br/>
                    <br/>
                    <br/>
                    <strong>Personal Information</strong>
                    <br/>
                    <br/>
                    <br/>
                    <label>First Name:</label>
                    <span>{firstName}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>Last Name:</label>
                    <span>{lastName}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>Street:</label>
                    <span>{street}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>Apartment:</label>
                    <span>{apartment}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>City:</label>
                    <span>{city}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>State/Province:</label>
                    <span>{stateProvince}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>Country:</label>
                    <span>{country}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <br/>
                    <strong>Contact Information</strong>
                    <br/>
                    <br/>
                    <br/>
                    <label>Phone:</label>
                    <span>{phone}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <label>E-mail:</label>
                    <span>{email}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                </div>
            </div>
            <CustomFooter/>
            </>
        )}
    </div>
    </>
    );
}

export default Profile;
