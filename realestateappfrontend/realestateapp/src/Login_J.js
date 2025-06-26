import './Login.css';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider.js';
import Navbar from './Custom_Navbar_J.js';
import CustomFooter from './Custom_Footer_J.js';

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
                navigate('/Home_J');
                setMessage("ログインに成功しました。リダイレクトしています...");
            }
            else { //Inavlid response
                setMessage("ユーザー名またはパスワードが正しくありません。");
            }

            } catch (error) {
                setMessage("ログイン中にエラーが発生しました。もう一度お試しください。");
                console.error("Login error:", error.response ? error.response.data : error.message);
            }
        }

    //Go to signup page
    const goToSignUp = async (e) => {
        e.preventDefault(); //Prevent Page Reload
        navigate('/SignUp_J');
    }

    return (
        <>
        <Navbar/>

        <div className='loginformmain'>
            <div className='loginform'>
                <div className='loginwrapper'>
                    <strong>ログイン</strong>
                    <br/>
                    <br/>
                    <form onSubmit={loginAttempt}>
                        <br/>
                        <label for="Username">ユーザー名</label>
                        <br/>
                        <input id="Username" placeholder='ユーザー名' value={username} onChange={(e) => setUsername(e.target.value)}>
                        </input>
                        <br/>
                        <br/>
                        <br/>
                        <label for="Password">パスワード</label>
                        <br/>
                        <input id="Password" type='password' placeholder='パスワード' value={password} onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        <br/>
                        <br/>
                        <button type='submit' className='submitbutton'>サインイン</button>
                        <br/>
                        <br/>
                        <p>アカウントが必要ですか? </p> <button className='signupbutton' onClick={goToSignUp}>サインアップ</button>
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
