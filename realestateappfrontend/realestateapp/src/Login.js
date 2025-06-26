import './Login.css';
import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';

//Login component
const Login = () => {

    //Declare login variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { userLoggedIn, setUserLoggedIn } = useContext(DataContext);


    //Login attempt function
    const loginAttempt = async (e) => {
        e.preventDefault(); //Prevent page reload

        //POST request
        try {
            const response = await fetch('http://localhost:5000/login',
                {
                method: 'POST', //POST Method for login
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', //This allows cookies to be sent and received
                body: JSON.stringify({ username, password }) //Sending credentials
                }
            );


            const data = await response.json();

            //Valid response check

            if (response.ok) {
                console.log('Login successful');
                setUserLoggedIn(true);
                localStorage.setItem('userLoggedIn', 'true');
                if (data.userID) {
                    localStorage.setItem('userId', data.userID);
                }
                navigate('/Home');
                setMessage("Login successful! Redirecting...");
            }
            else { //Inavlid response
                setMessage("Incorrect username or password.");
            }

            } catch (error) {
                setMessage("Error logging in. Please try again.");
                console.error("Login error:", error.response ? error.response.data : error.message);
            }
        }

    //Go to signup page
    const goToSignUp = async (e) => {
        e.preventDefault(); //Prevent Page Reload
        navigate('/SignUp');
    }

    return (
        <>
        <Navbar/>

        <div className='loginformmain'>
            <div className='loginform'>
                <div className='loginwrapper'>
                    <strong>Login</strong>
                    <br/>
                    <br/>
                    <form onSubmit={loginAttempt}>
                        <br/>
                        <label for="Username">Your Username</label>
                        <br/>
                        <input id="Username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}>

                        </input>
                        <br/>
                        <br/>
                        <br/>
                        <label for="Password">Your Password</label>
                        <br/>
                        <input id="Password" type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        <br/>
                        <br/>
                        <button type='submit' className='submitbutton'>Sign In</button>
                        <br/>
                        <br/>
                        <p>Need an Account? </p> <button className='signupbutton' onClick={goToSignUp}>Sign Up</button>
                        <br/>
                    </form>

                </div>
                <div className='loginmessage'>
                    <br/>
                    <br/>
                    <br/>
                {message && <p>{message}</p>}
            </div>
            </div>
        </div>
        <CustomFooter/>
    </>
    );
}
export default Login;
