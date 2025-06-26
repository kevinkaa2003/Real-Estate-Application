import './Cart.css';
import { useState, useEffect, useContext } from 'react';
import Navbar from './Custom_Navbar.js';
import CustomFooter from './Custom_Footer.js';
import { DataContext } from './DataProvider.js';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; //PayPal Import
import Checkout from './PayPalButtons.js';
import emailjs from '@emailjs/browser';
import trashicon from './trashicon.png';


//Cart component
const Cart = () => {

    //Declare Variables
    const navigate = useNavigate();
    const { deleteCart, removeReservation, setCartProducts, dormitoryPrice, setDormitoryPrice, doubleSharedPrice, setDoubleSharedPrice, doublePrivatePrice, setDoublePrivatePrice, japaneseTwinPrice, setJapenseTwinPrice, fourBedPrice, setFourBedPrice } = useContext(DataContext);
    const stored = localStorage.getItem('cartProducts');
    const cartProducts = stored ? JSON.parse(stored) : [];
    const [ roomPrice, setRoomPrice ] = useState(0);
    const roomTypeOptionsArray = ['Dormitory', 'Double Room Shared Toilet & Shower', 'Double Room Private Toilet & Bath', 'Japanese Twin Room', '4 Bed Room']
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const goToBooking = () => {
        navigate('/Booking');
    };

    // Helper to get price per room type
    const getRoomPrice = (roomOption) => {
        switch(roomOption) {
            case 'Dormitory': return dormitoryPrice;
            case 'Double Room Shared Toilet & Shower': return doubleSharedPrice;
            case 'Double Room Private Toilet & Bath': return doublePrivatePrice;
            case 'Japanese Twin Room': return japaneseTwinPrice;
            case '4 Bed Room': return fourBedPrice;
            default: return 0;
        }
    };

    // Helper to get number of nights
    const getNights = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    };

    //Calculate total function
    const total = () => {
        if (!Array.isArray(cartProducts) || cartProducts.length === 0) return '0.00';
        const rawTotal = cartProducts.reduce((sum, product) => {
            const nights = getNights(product.reservationStartDate, product.reservationEndDate);
            const price = getRoomPrice(product.roomOption);
            return sum + (nights * price);
        }, 0);
        return rawTotal.toFixed(2); //Reduce total to two decimal places
    };

    //Cart display function
    const cartDisplay = () => {

        const formatDateJST = (dateStr) => {
            return new Date(dateStr).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
        };

        // Before rendering, map cartProducts to include a total/subtotal for each reservation
        const cartProductsWithTotal = cartProducts.map(product => {
            const nights = getNights(product.reservationStartDate, product.reservationEndDate);
            const price = getRoomPrice(product.roomOption);
            return {
                ...product,
                total: Number((nights * price).toFixed(2)) // or subtotal if you prefer
            };
        });

        return (
            <>
            <div className='cartmain'>
                <div className='paymentinfo'>
                    <div className='paymenttitle'>Payment</div>
                    <br/>
                <PayPalScriptProvider
                        options={{
                            "client-id": "AflkHTwJg57QfgHe6h9UeGlTmTQqky4v1zvIfox_YLbprrMa9dwL-pg2mH0qqQIApalZX7S8BMqhQBsR",
                            currency: "JPY",
                            intent: "capture",
                            components: "buttons,hosted-fields"
                        }}
                        >
                    <Checkout total={total()} onPaymentSuccess={handlePaymentSuccess} cartProducts={cartProductsWithTotal}/>
                </PayPalScriptProvider>
                </div>
                <div className="cartinfo">
                    <div className='carttitle'>Cart</div>
                    <br/>
                    {cartProducts.map((product, index) => {
                        const nights = getNights(product.reservationStartDate, product.reservationEndDate);
                        const price = getRoomPrice(product.roomOption);
                        return (
                            <>
                            <div key={index} className="cartproduct">
                                <span>
                                    <p>{`${product.roomOption}:`}</p> {`${formatDateJST(product.reservationStartDate)} - ${formatDateJST(product.reservationEndDate)} | Nights: ${nights} | Price per night: ¥${price}`}<p>{`Subtotal: ¥${(nights * price).toFixed(2)}`}</p>
                                </span>
                                <button className="deletecartitem" onClick={() => removeReservation(product)}><img src={trashicon}/>Delete Reservation</button>
                            </div>
                            <br/>
                            </>
                        );
                    })}
                    <br/>
                    <br/>
                    <div className='carttotal'>
                        <br/>
                        Total: ¥{total()}
                    </div>
                    <br/>
                    <br/>
                    <div className='cartbookanotherreservation'>
                        <button onClick={() => {
                            goToBooking();
                            }}>Book A Reservation</button>
                    </div>
                    <div className='deletecart'>
                        <button onClick={() => {
                            deleteCart();
                            }}>Delete Cart</button>
                    </div>
                </div>
            </div>
            </>
        );
    }


    //Successful payment function
    const handlePaymentSuccess = () => {
        //Clear cart, show success message, etc.
        setCartProducts([]);
        localStorage.setItem('cartProducts', JSON.stringify([]));
        setPaymentSuccess(true);


    };

    useEffect(() => {
        if (paymentSuccess) {
        window.scrollTo(0, 0);
        // Optionally reset paymentSuccess after scroll
        setPaymentSuccess(false);
    }
    }, [paymentSuccess]);


    return (
        <>
        <Navbar/>
        <div className='cartpagebody'>
            {cartDisplay()}
        </div>
        <CustomFooter/>
        </>
    );
}

export default Cart;
