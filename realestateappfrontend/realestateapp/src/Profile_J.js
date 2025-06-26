import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Custom_Navbar_J';
import CustomFooter from './Custom_Footer_J.js';
import { DataContext } from './DataProvider.js';
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
                <span>本当にプロフィールを削除してもよろしいですか?</span>
                <br/>
                <br/>
                <button className='deleteyes' onClick={() => {
                    deleteProfileAuthorization(true)}}>はい</button>
                <br/>
                <br/>
                <button className='deleteno' onClick={() => {
                    deleteProfileAuthorization(false)}}>いいえ</button>
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
                    alert('プロフィールを削除しました');
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
                        <div className='profiletitle'>プロフィール</div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <button onClick = {editProfileHandler} className='editprofilebutton'>プロフィールを編集</button>
                        <br/>
                        <br/>
                        <button onClick={sendProfileInfo} className='saveprofilebutton'>プロフィールを保存</button>
                        <br/>
                        <br/>
                        <div className='personalinfo'>
                            <strong>個人情報</strong>
                            <br/>
                            <br/>
                            <br/>
                            <div>
                                <label for='firstname' className='label-above'>ファーストネーム:</label>
                                <br/>
                                <input type='text' id='firstname' value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                            </div>
                            <br/>
                            <label for='lastname' className='label-above'>苗字:</label>
                            <br/>
                            <input type='text' id='lastname'value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                            <br/>
                            <label for='street' className='label-above'>通り:</label>
                            <br/>
                            <input type='text' id='street' value={street} onChange={(e) => setStreet(e.target.value)}></input>
                            <br/>
                            <label for='apartment' className='label-above'>アパート:</label>
                            <br/>
                            <input type='text' id='apartment' value={apartment} onChange={(e) => setApartment(e.target.value)}></input>
                            <br/>
                            <label for='city' className='label-above'>市:</label>
                            <br/>
                            <input type='text' id='city' value={city} onChange={(e) => setCity(e.target.value)}></input>
                            <br/>
                            <label for='stateprovince' className='label-above'>州/県:</label>
                            <br/>
                            <input type='text' id='stateprovince' value={stateProvince} onChange={(e) => setStateProvince(e.target.value)}></input>
                            <br/>
                            <label for='country' className='label-above'>国:</label>
                            <br/>
                            <input type='text' id='country' value={country} onChange={(e) => setCountry(e.target.value)}></input>
                            <br/>
                            <br/>
                        </div>
                        <div className='contactinfo'>
                            <strong>連絡先</strong>
                            <br/>
                            <br/>
                            <br/>
                            <label for='phone' className='label-above'>電話:</label>
                            <br/>
                            <input type='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            <br/>
                            <label for='email' className='label-above'>Eメール:</label>
                            <br/>
                            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            <br/>
                            <br/>
                        </div>
                        <br/>
                        <br/>
                    </div>
            </div>
            <CustomFooter/>
            </>
        ) : (<>
            <div className="profilemain">
                <div className="profilewrapper">
                    <div className='profiletitle'>プロフィール</div>
                    <br/>
                    <br/>
                    <br/>
                    <button onClick = {editProfileHandler}>プロフィールを編集</button>
                    <br/>
                    <br/>
                    <button onClick={() => setShowDeletePopup(true)}>プロフィールを削除</button>
                    {showDeletePopup && deleteProfileInitiation()}
                    <br/>
                    <br/>
                    <br/>
                    <strong>個人情報</strong>
                    <br/>
                    <br/>
                    <br/>
                    <label>ファーストネーム:</label>
                    <span>{firstName}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>苗字:</label>
                    <span>{lastName}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>通り:</label>
                    <span>{street}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>アパート:</label>
                    <span>{apartment}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>市:</label>
                    <span>{city}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>州/県:</label>
                    <span>{stateProvince}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <label>国:</label>
                    <span>{country}</span> {/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <br/>
                    <br/>
                    <strong>連絡先</strong>
                    <br/>
                    <br/>
                    <br/>
                    <label>電話:</label>
                    <span>{phone}</span>{/*RETRIEVED FROM BACKEND QUERY*/}
                    <br/>
                    <label>Eメール:</label>
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
