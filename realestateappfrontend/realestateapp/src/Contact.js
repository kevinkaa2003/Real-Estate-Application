import logo from './logo.svg';
import './Contact.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import ContactWidget from './Contact_Widget.js';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';
import { DataProvider } from './DataProvider.js';

//Contact Component
const Contact = () => {
  return (
    <>
    <DataProvider>
      <Navbar/>
      <ContactWidget/>
      <CustomFooter/>
    </DataProvider>
    </>
  );
}

export default Contact;
