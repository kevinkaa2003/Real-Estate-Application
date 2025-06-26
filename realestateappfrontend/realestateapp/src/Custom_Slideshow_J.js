import React, { useEffect, useState, useRef } from 'react';
import './Custom_Slideshow.css';
import tokyo1 from './tokyoguesthouse1.png';
import tokyo2 from './tokyoguesthouse2.png';
import tokyo3 from './tokyoguesthouse3.png';
import tokyo4 from './tokyoguesthouse4.png';
import { useNavigate }from 'react-router-dom';

//Slideshow component
const Slideshow = () => {

    //Declare variables
    const [currentRow, setCurrentRow] = useState(0);
    const rowsRef = useRef([]);
    const navigate = useNavigate();

    //Slideshow effect
    useEffect(() => {
        rowsRef.current = document.querySelectorAll("#slideshowtable tr");
        showRow(0);
        const interval = setInterval (() => nextRow(), 10000); //Change slide every 10 seconds
        return () => clearInterval(interval); //Cleanup on unmount
    }, []);

    const goToBooking = () => {
        navigate('/Booking_J');
    }


    //Show row function
    function showRow(index) {
        rowsRef.current.forEach((row, i) => {
            const message = row.querySelector(".message");


            if (row) {
                row.style.display = i === index ? "table-row" : "none";
                row.classList.toggle("fade-in", i === index);
            }
            if (message) {
                message.classList.toggle("expand-width", i === index);

            }
        });
    }

    //Next row function
    function nextRow() {
        setCurrentRow((prev) => {
            const newIndex = (prev + 1 ) % rowsRef.current.length;
            showRow(newIndex);
            return newIndex;
        });
    }

    return (
        <>
        <div className="slideshow" id="slideshow1">
            <table id="slideshowtable" className="slideshowtable">
                <tbody>
                    <tr>
                        <td>
                            <img src={tokyo1} style={{height: "700px", width: "100vw"}}/>
                            <div className="message">東京ゲストハウス王子ミュージックラウンジへようこそ！<button onClick={goToBooking}>今すぐ予約！</button></div>

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={tokyo2} style={{height: "700px", width: "100vw"}}/>
                            <div className="message">私たちは東京の中心部に位置するホテルと音楽ラウンジです。<button onClick={goToBooking}>今すぐ予約！</button> </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={tokyo4} style={{height: "700px", width: "100vw"}}/>
                            <div className="message">今すぐご予約ください<button onClick={goToBooking}>今すぐ予約！</button></div>

                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
        </>
     );
}

export default Slideshow;
