import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { DataContext } from './DataProvider';

//Declare Private Route Protector
const PrivateRoute = ({ children }) => {

    //Obtain userLoggedIn variable from DataProvider
    const { userLoggedIn } = useContext(DataContext);

    //If userLoggedIn is false, navigate to Login page
    if (!userLoggedIn) {
        return <Navigate to="/"/>;
    }

    return children;

};

export default PrivateRoute;
