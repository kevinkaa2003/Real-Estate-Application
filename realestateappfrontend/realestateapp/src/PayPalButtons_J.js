import './PayPalButtons.css';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

//Declare base path for Paypal requests
const API_BASE_URL = 'http://localhost:5000/api';

//Checkout component
const Checkout = ({total, cartProducts, onPaymentSuccess}) => {

    //Declare variables
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    //Create order function
    const createOrder = async () => {
        //Check if order total is greater than zero
        if (Number(total) > 0) {

            //Declare response from post request
            const response = await axios.post(
                `${API_BASE_URL}/create-paypal-order`, // Full URL
                { amount: total.toString() }
            );

            return response.data.orderID; //Return OrderID from response
        } else {
            alert("カートは空です");
        }
    };


    //Declare on approve function
    const onApprove = async (data) => {
        try {
            // Format cart dates to YYYY-MM-DD
            const formattedCartProducts = cartProducts.map(product => {
                const formatDate = (isoStr) => {
                    const date = new Date(isoStr);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                return {
                    ...product,
                    reservationStartDate: formatDate(product.reservationStartDate),
                    reservationEndDate: formatDate(product.reservationEndDate)
                };
            });

        const captureResponse = await axios.post(
            `${API_BASE_URL}/capture-paypal-order`,
            {
                orderID: data.orderID,
                cartProducts: formattedCartProducts
            }
        );

        const orderDetails = captureResponse.data.orderDetails;

        // Prepare template params for EmailJS
        const templateParams = {
            payer_name: orderDetails.payerName,
            payer_email: orderDetails.payerEmail, // Fixed typo: was emailEmail
            orderID: orderDetails.paypalOrderId
        };

        // Send confirmation email
        await emailjs.send(
            'service_nq9jxwl',
            'template_lvig8nl',
            templateParams,
            '5xgP6vguaJHGTQ-E4'
        );

        alert("支払いが完了しました！");
        onPaymentSuccess();
        setError(null);
    } catch (err) {
        console.error("Capture error:", err);
        setError("An error occurred during payment processing.");
        throw err;
    }
    };


    return (
        <>
        <div className="checkout-container">
            {Number(total) === 0 && <div className="cartmessage">カートは空です</div>}
            <br/>
            <br/>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder = {createOrder}
                onApprove = {onApprove}
                onError={(err) => { console.error("Paypal Error: ", err);
                }}

                disabled={isProcessing}
            />
        </div>
     </>
    );
};

export default Checkout;
