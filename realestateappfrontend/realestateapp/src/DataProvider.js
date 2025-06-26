import React, { createContext, useContext, useState, useEffect } from 'react';


//Create Context
export const DataContext = createContext();


//Create Provider Element
export const DataProvider = ({children}) => {

    useEffect(() => {
        if (localStorage.getItem('userLoggedIn') === null) {
            localStorage.setItem('userLoggedIn', 'false'); //Initialize userLoggedIn in local storage
        }
    }, []);

    //userLoggedIn variable handling
    const [ userLoggedIn, setUserLoggedIn ] = useState(()=> {
        return localStorage.getItem('userLoggedIn') === 'true';
    });

    //editProfile variable
    const [ editProfile, setEditProfile ] = useState(false);

    //State to store cart product IDs for use on Cart Page
    const [ cartProducts, setCartProducts ] = useState([]);

    //Function For Filtering Product Object Key Value Pairs
    const getValues = (obj, keys) => {
        return keys.map(key => obj[key]);
    }

    //Function for adding a product to the local storage 'cartProducts' variable
        const addReservation = (product) => {
        const stored = localStorage.getItem('cartProducts');
        const existingCart = stored ? JSON.parse(stored) : [];
        // Convert date fields to ISO strings before storing
        const productToStore = {
            ...product,
            reservationStartDate: product.reservationStartDate instanceof Date
                ? product.reservationStartDate.toISOString()
                : product.reservationStartDate,
            reservationEndDate: product.reservationEndDate instanceof Date
                ? product.reservationEndDate.toISOString()
                : product.reservationEndDate,
        };
        existingCart.push(productToStore);
        localStorage.setItem('cartProducts', JSON.stringify(existingCart));
        setCartProducts(existingCart);
        console.log("Cart Products: ", existingCart);
    };
    const removeReservation = (reservationToRemove) => {
        const stored = localStorage.getItem('cartProducts');
        const existingCart = stored ? JSON.parse(stored) : [];
        const updatedCart = existingCart.filter(reservation =>
            !(
                String(reservation.reservationStartDate) === String(
                    reservationToRemove.reservationStartDate instanceof Date
                        ? reservationToRemove.reservationStartDate.toISOString()
                        : reservationToRemove.reservationStartDate
                ) &&
                String(reservation.reservationEndDate) === String(
                    reservationToRemove.reservationEndDate instanceof Date
                        ? reservationToRemove.reservationEndDate.toISOString()
                        : reservationToRemove.reservationEndDate
                ) &&
                reservation.roomOption === reservationToRemove.roomOption &&
                reservation.people === reservationToRemove.people
            )
        );
        localStorage.setItem('cartProducts', JSON.stringify(updatedCart));
        setCartProducts(updatedCart);
        console.log("Cart Products: ", updatedCart);
    };


    //set cartProducts to the local storage data for 'cartProducts' on page load
    useEffect(() => {
        const stored = localStorage.getItem('cartProducts');
        const savedCart = stored ? JSON.parse(stored) : [];
        setCartProducts(savedCart);

    }, []);

    //Delete cart function
    const deleteCart = () => {
        setCartProducts([]);
        const existingCart = JSON.parse(localStorage.getItem('cartProducts') || []);
        existingCart.splice(0, existingCart.length)
        localStorage.setItem('cartProducts', JSON.stringify(existingCart));
        console.log('Cart Deleted', existingCart);


    }

    //Room Price Handling
    const roomTypeOptionsArray = ['Dormitory', 'Double Room Shared Toilet & Shower', 'Double Room Private Toilet & Bath', 'Japanese Twin Room', '4 Bed Room']
    const [ dormitoryPrice, setDormitoryPrice ] = useState(3100);
    const [ doubleSharedPrice, setDoubleSharedPrice ] = useState(3200);
    const [ doublePrivatePrice, setDoublePrivatePrice ] = useState(3500);
    const [ japaneseTwinPrice, setJapaneseTwinPrice ] = useState(4000);
    const [ fourBedPrice, setFourBedPrice ] = useState(5000);


    //Music Schedule Handling
    const [ musicSchedule, setMusicSchedule ] = useState([]);
    //Fetch Music Schedule data 
    const fetchMusicScheduleData = async () => {
        

        try {
            const response = await fetch('http://localhost:5000/musicschedule', 
            
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'

            });

            const data = await response.json();

            if (response.ok) {

                setMusicSchedule(data.data);
                console.log("Music Schedule Data Received.");

            }
         
        }
        catch (error) {
            console.error("Error obtaining music schedule data: ", error)
        }
    }

    //Fetch Music Data on Mount
    useEffect(() => {
        fetchMusicScheduleData(); 
        console.log("Initial Music Schedule Fetch Initiated.")
    }, []);

  


    //Values to be passed to children
    const values = {userLoggedIn, setUserLoggedIn, editProfile, setEditProfile, cartProducts, setCartProducts, addReservation, deleteCart, removeReservation, dormitoryPrice, setDormitoryPrice, doubleSharedPrice, setDoubleSharedPrice, doublePrivatePrice, setDoublePrivatePrice, japaneseTwinPrice, setJapaneseTwinPrice, fourBedPrice, setFourBedPrice, musicSchedule, setMusicSchedule }


    return (<DataContext.Provider value ={values}>{/*Pass States to Children*/}
                {children}
            </DataContext.Provider>
    );
};
