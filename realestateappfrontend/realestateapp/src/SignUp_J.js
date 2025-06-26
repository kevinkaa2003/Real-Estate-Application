import './SignUp.css';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';
import Navbar from './Custom_Navbar_J.js';
import CustomFooter from './Custom_Footer_J.js';

//Signup function
const SignUp = () => {

    //Declare variables
    const [username, setUsername] = useState(''); //Not accessible from Login
    const [password, setPassword] = useState(''); //Not accessible from Login
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const goToHome = async (e) => {
        navigate('/Home_J');
    }
    const { setUserLoggedIn } = useContext(DataContext);


    //Signup Attempt function
    const signUpAttempt = async (e) => {
        e.preventDefault(); //Prevent page reload

        //If username and password fields are empty
        if (!username || !password) {
            console.error("Username and a Password Fields Empty.");
            return; //Stop execution if fields are empty
        }


        //Post request to backend to send valid username and password
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', //Allows cookies to be sent and received
                body: JSON.stringify({ username, password }) //Sending credentials
            });

            const data = await response.json();
            console.log("Sign Up response: ", data);

            //Valid response from backend
            if (response.ok) {

                console.log('Signup successful');
                setMessage("Sign Up successful! Redirecting..."); //Redirect User or Store Session Token
                localStorage.setItem('userLoggedIn', 'true');
                alert("Signup Successful.")
                setUserLoggedIn(true);
                goToHome(); //Send User to homepage after signup
            } else {
                setMessage("Invalid username or password.");

            }
            }
            catch (error) {
                setMessage("Error Signing Up. Please try again.");
                console.error("Sign Up error:", error.response ? error.response.data : error.message);
            }
        }

    return (
        <>
        <Navbar/>
        <div className='signupformmain'>
            <div className='signupform'>
                <div className='signupwrapper'>
                    <strong>サインアップ</strong>
                    <br/>
                    <br/>
                    <form onSubmit={signUpAttempt}>
                        <br/>
                        <label>ユーザー名</label>
                        <br/>
                        <input id='Username' placeholder='ユーザー名' value={username} onChange={(e) => setUsername(e.target.value)}>
                        </input>
                        <br/>
                        <br/>
                        <br/>
                        <label>パスワード</label>
                        <br/>
                        <input id='Password' type='password' placeholder='パスワード' value={password} onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        <br/>
                        <br/>
                        <button type='submit' className='submitbutton' >サインアップ</button>
                    </form>
                    <br/>
                    <div className='signup'>
                        <p>今すぐ登録！無料です！</p>
                    </div>
                    <br/>
                </div>
                <div className='signupmessage'>
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
export default SignUp;
