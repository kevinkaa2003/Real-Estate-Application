import logo from './logo.svg';
import './Contact.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import ContactWidget from './Contact_Widget_J.js';
import Navbar from './Custom_Navbar_J.js';
import CustomFooter from './Custom_Footer_J.js';
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
