import React, { useEffect, useState, useRef } from 'react';
import './Food_Slideshow.css';
import food1 from './food1.jpg';
import food2 from './food2.jpg';
import food3 from './food3.jpg';
import food4 from './food4.jpg';
import food5 from './food5.jpg';
import { useNavigate }from 'react-router-dom';

//Slideshow component
const FoodSlideshow = () => {

    //Declare variables
    const [currentRow, setCurrentRow] = useState(0);
    const rowsRef = useRef([]);

    //Slideshow effect
    useEffect(() => {
        rowsRef.current = document.querySelectorAll("#foodslideshowtable tr");
        showRow(0);
        const interval = setInterval (() => nextRow(), 10000); //Change slide every 10 seconds
        return () => clearInterval(interval); //Cleanup on unmount
    }, []);


    //Show row function
    function showRow(index) {
        rowsRef.current.forEach((row, i) => {

            if (row) {
                row.style.display = i === index ? "table-row" : "none";
                row.classList.toggle("fade-in", i === index);
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
        <div className="foodslideshow" id="foodslideshow">
            <table id="foodslideshowtable" className="foodslideshowtable">
                <tbody>
                    <tr>
                        <td>
                            <img src={food1} style={{height: "700px", width: "100vw"}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={food2} style={{height: "700px", width: "100vw"}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={food3} style={{height: "700px", width: "100vw"}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={food4} style={{height: "700px", width: "100vw"}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={food5} style={{height: "700px", width: "100vw"}}/>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
        </>
     );
}

export default FoodSlideshow;
