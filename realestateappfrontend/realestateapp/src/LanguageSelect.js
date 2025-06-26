import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LanguageSelect.css';
import bgImage from './tokyoguesthouse2.png';

const LanguageSelect = () => {
  const navigate = useNavigate();

  const goToHome = () => { navigate('/Home')};
  const goToHomeJ = () => { navigate('/Home_J')};

  return (
    <div
      className="language-select-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
        minHeight: '100vh',
        width: '100vw',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="welcomemessage">Tokyo Guest House Oji Music Lounge</div>
      <br />
      <br />
      <button className="lang-btn" onClick={goToHome} >English</button>
      <button className="lang-btn" onClick={goToHomeJ} >日本語</button>
    </div>
  );
};

export default LanguageSelect;
