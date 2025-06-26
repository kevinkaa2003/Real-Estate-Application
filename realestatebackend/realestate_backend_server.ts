require('dotenv').config(); //.env file processing



const express = require('express'); //Import Express with parameters
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const axios = require('axios'); //Import axios
const router = express.Router(); //Express Router




//Paypal
const PAYPAL_API = 'https://api.sandbox.paypal.com';
const paypal = require('@paypal/checkout-server-sdk');

// Replace hardcoded credentials with environment variables
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID; // Move to .env
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET; // Move to .env
console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PAYPAL_CLIENT_SECRET:", process.env.PAYPAL_CLIENT_SECRET);

// Proper PayPal client setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);


//Web token
const jwt = require('jsonwebtoken'); //Web Token
const SECRET_KEY = process.env.JWT_SECRET || "Frambleton3!"; //Store secret key in .env file\
const cookieParser = require('cookie-parser'); //Needed to parse cookies


//Cross-Origin Requests
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.sandbox.paypal.com'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

//Needed for middleware
const bodyParser = require('body-parser');

//Encrypt data to send to Database
const bcrypt = require('bcrypt');

//Middleware to authenticate JWT tokens before allowing access to protected routes
/**
 * @typedef {Object} AuthenticatedRequest
 * @property {Object} user
 * @property {number} user.User_ID
 * @property {string} user.username
 */

//Encrypt data to send to Database
const app = express();
app.use(express.json({ limit: '1gb' })); //Increase JSON payload size
app.use(express.urlencoded({ extended: true, limit: '1gb' }));
const fs = require('fs'); //File system reader


//Middleware: Allow cross-origin requests from React Front-end
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser()); //Middleware that parses cookies

//Middleware to Authenticate token before allowing access to protected routes
const authenticateToken = (req, res, next) => {
    console.log("Request Headers: ", req.headers);
    console.log("Received Cookies: ", req.cookies);

    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]; //Get token from Bearer header.

    if(!token) {
        return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }

    //Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("JWT Verification failed: ", err.message);
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }

        console.log("Decoded User: ", user);

        //If token is valid, attach user data to request object
        req.authUser = user; //This is the decoded token payload
        next(); //Proceed to the next middleware or route handler
    })
};

//Connect to the database
const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Frambleton3!',
    database: process.env.DB_NAME || 'realestatedb',
    port: process.env.DB_PORT || 3306,
    timezone: 'Z',
    dateStrings: true
});

db.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.stack);
});

//Login Handling
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // MySQL query with correct syntax
        const [rows] = await db.query(
            'SELECT `User ID`, `Username`, `Password` FROM `userinformation` WHERE `Username` = ?',
            [username]
        );

        console.log("Query Result: ", rows);

        if (rows.length > 0) {
            const user = rows[0];
            console.log("User found: ", user);

            const enteredPassword = password.trim();
            const storedPasswordHash = user.Password.trim();

            if (user && user.Password) {
                const passwordMatch = await bcrypt.compare(enteredPassword, storedPasswordHash);
                console.log('Password match: ', passwordMatch);

                if (passwordMatch) {
                    console.log("User ID to be signed: ", user["User ID"]);

                    const token = jwt.sign(
                        {
                            User_ID: user["User ID"],
                            username: user.Username
                        },
                        SECRET_KEY,
                        {expiresIn: '24h'}
                    );

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
                        sameSite: 'Strict'
                    });

                    const decodedToken = jwt.decode(token);
                    console.log("Decoded Token: ", decodedToken);
                    res.status(200).json({
                        success: true,
                        message: 'Login Successful',
                        userID: user["User ID"]

                     });
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect Username or Password' });
                }
            } else {
                res.status(401).json({ success: false, message: "Password not found in database" });
            }
        } else {
            res.status(401).json({ success: false, message: 'Incorrect Username' });
        }
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//Sign Up Handling
app.post('/signup', async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password Required" });

    }

    //Trim submissions
    username = username.trim();
    password = password.trim();

    //Password Complexity (EXPAND FUNCTIONALITY)
    if(password.length < 5 ) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    try {
    // Check for existing users that match username input (NO DUPLICATES)
    const [userExists] = await db.query(
        'SELECT `Username` FROM `userinformation` WHERE `Username` = ?',
        [username]
    );

    if (userExists.length > 0) {
        return res.status(400).json({ success: false, message: "Username already exists." });
    }

    // Hash Password before sending to database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const [newUserResult] = await db.query(
        'INSERT INTO `userinformation` (`Username`, `Password`) VALUES (?, ?)',
        [username, hashedPassword]
    );
    const insertId = newUserResult.insertId;

    // Fetch the new user row
    const [userRows] = await db.query(
        'SELECT `User ID`, `Username` FROM `userinformation` WHERE `User ID` = ?',
        [insertId]
    );
    const user = userRows[0];

    // Generate JWT Token upon successful signup
    const token = jwt.sign(
        {
            User_ID: user["User ID"],
            username: user.Username
        },
        SECRET_KEY,
        { expiresIn: '24h' } // Token expires in 1 hour.
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true, // Cookie is inaccessible to Javascript
        secure: process.env.NODE_ENV === 'production', // Set secure flag during production
        maxAge: 3600000, // 1 hour
        sameSite: 'Strict' // Helps prevent CSRF
    });

    console.log("User Signed Up!");
    res.status(201).json({ success: true, message: "User signed up successfully" });
    } catch (error) {
        console.error("Error Signing up User: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//Profile Handling
app.post('/profile', authenticateToken, async (req, res) => {
    let { firstName, lastName, street, apartment, city, stateProvince, country, phone, email } = req.body; //Unpack request from frontend

    //Evaluate if any of the fields have an input and are not blank. If false, return an error.
    if (![firstName, lastName, street, apartment, city, stateProvince, country, phone, email].some(field => field && field.trim() !== "")) {
        return res.status(400).json({ success: false, message: "Please update at least one field within your peronal information" })
    }

    //Ensure User_ID exists
    if(!req.authUser?.User_ID) {
        return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" })
    }
    console.log("User ID from token: ", req.authUser.User_ID);

    try {
        //Trim submissions before sending to database
            firstName = typeof firstName === 'string' ? firstName.trim() : '';
            lastName = typeof lastName === 'string' ? lastName.trim() : '';
            street = typeof street === 'string' ? street.trim() : '';
            apartment = typeof apartment === 'string' ? apartment.trim() : '';
            city = typeof city === 'string' ? city.trim() : '';
            stateProvince = typeof stateProvince === 'string' ? stateProvince.trim() : '';
            country = typeof country === 'string' ? country.trim() : '';
            phone = typeof phone === 'string' ? phone.trim() : '';
            email = typeof email === 'string' ? email.trim() : '';


        //Insert Query for Profile Info
        const [result] = await db.query(
            'UPDATE `userinformation` SET `First Name` = ?, `Last Name` = ?, `Street` = ?, `Apartment` = ?, `City` = ?, `State/Province` = ?, `Country` = ?, `Phone` = ?, `Email` = ? WHERE `User ID` = ?',
            [firstName, lastName, street, apartment, city, stateProvince, country, phone, email, req.authUser.User_ID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(201).json({ success: true, message: "User Profile Update Successfully" });

            } catch (error) {
                console.error("Error updating profile information: ", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });


//Retrieve profile data from database
app.get('/profile', authenticateToken, async (req, res) => {
    const [response] = await db.query(
    'SELECT * FROM `userinformation` WHERE `User ID` = ?',
    [req.authUser.User_ID]
    );

    if (response.length > 0) {
        res.json({ success: true, message: "Profile Data Query Successful", data: response[0] });
        console.log("Profile Data Received: ", response[0]);
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
});


//Helper function to get PayPal access token
const getPayPalAccessToken = async () => {
    try {
        const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            }

        }
    );

    return response.data.access_token;

    } catch (error) {
        console.error('Error getting PayPal access token:', error.response.data);
        throw error;
    }
};

// Shift a YYYY-MM-DD string by `days` and return new YYYY-MM-DD
function shiftDate(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
}

// Generate list of YYYY-MM-DD strings from start to end (inclusive)
function getDateRange(start, end) {
    const range = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
        range.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return range;
}


// Create PayPal Order
app.post('/api/create-paypal-order', async (req, res) => {

  const { amount } = req.body; //Total amount of cart

  // Validate amount format (string representing a positive number)
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  else if (Number(amount) <=0) {
    return res.status(400).json({ error: 'Cart Empty' });
  }

  //Submit the create order request
  try {

    const request = new paypal.orders.OrdersCreateRequest(); //Declare request
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "JPY",
            value: amount,
          },
        },
      ],
     application_context: {
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING', //Hide Shipping Button
        // Add this to request phone number
        payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        }
    }
    });

    //Declare order and send to frontend
    const order = await client.execute(request);
    res.json({

        orderID: order.result.id,

     });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ success: 'false', message: "Failed to create PayPal order: ", error });
  }
});

//Room Option Variables
    const roomTypeOptionsArray = ['Dormitory', 'Double Room Shared Toilet & Shower', 'Double Room Private Toilet & Bath', 'Japanese Twin Room', '4 Bed Room']
    const dormitoryRooms = ['202A', '202B', '202C', '202D', '202E', '202F', '202G', '202H', '202I', '202K', '202L', '203A', '203B', '203C', '203D', '203E', '203F', '203G', '203H', '203I', '203K', '203L', '204A', '204B', '204C', '204D', '204E', '204F', '204G', '204H', '204I', '204K', '204L'];
    const doubleSharedRooms = ['201', '205'];
    const doubleRoomPrivate = ['206', '207'];
    const japaneseTwinRooms = ['301', '302', '303', '304', '305', '306', '307'];
    const fourbedRooms = ['401', '402', '403', '404', '405', '406'];

//Room Assingment Helper Function
function getRoomArray(roomOption) {
    switch (roomOption) {
        case 'Dormitory': return dormitoryRooms;
        case 'Double Room Shared Toilet & Shower': return doubleSharedRooms;
        case 'Double Room Private Toilet & Bath': return doubleRoomPrivate;
        case 'Japanese Twin Room': return japaneseTwinRooms;
        case '4 Bed Room': return fourbedRooms;
        default: return [];
    }
}




async function assignRoom(roomOption, startDate, endDate) {
    const roomArray = getRoomArray(roomOption);
    if (!roomArray.length) return null;

    // 1. Fetch all reservations for this room option
    const [reservations] = await db.query(
        'SELECT `Room Number`, `Start Date`, `End Date` FROM `reservationstable` WHERE `Room Option` = ?',
        [roomOption]
    );

    // 2. Build map of date => Set of booked rooms
    const dateRoomMap = {};
    for (const res of reservations) {
        const resDates = getDateRange(res['Start Date'], res['End Date']);
        for (const date of resDates) {
            if (!dateRoomMap[date]) dateRoomMap[date] = new Set();
            dateRoomMap[date].add(res['Room Number']);
        }
    }

    console.log("Date Room Map: ", dateRoomMap);

    // 3. Date utility functions
    const isFullyBooked = (date) =>
        dateRoomMap[date] && dateRoomMap[date].size >= roomArray.length;

    const isFirstDayOfFullyBookedRange = (date) => {
        if (!isFullyBooked(date)) return false;
        const prev = shiftDate(date, -1);
        return !isFullyBooked(prev);
    };

    const isLastDayOfFullyBookedRange = (date) => {
        if (!isFullyBooked(date)) return false;
        const next = shiftDate(date, 1);
        return !isFullyBooked(next);
    };

    for (const room of roomArray) {
        const roomReservations = reservations.filter(r => r['Room Number'] === room);

        const hasOverlap = roomReservations.some(r =>
            !(endDate <= r['Start Date'] || startDate >= r['End Date'])
        );
        if (!hasOverlap) return room;
        }


            return null; // no available room found
    }


// Capture PayPal Order
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderID, cartProducts } = req.body;

    if (!orderID || !cartProducts || !Array.isArray(cartProducts)) {
      return res.status(400).json({ success: false, message: 'Invalid request body.' });
    }

    // Capture PayPal order
    let response, result;
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});
      response = await client.execute(request);
      result = response.result;
    } catch (paypalErr) {
      console.error('PayPal API error:', paypalErr);
      return res.status(502).json({ success: false, message: 'PayPal capture failed.', details: paypalErr.message });
    }

    const payer = result.payer;

    const orderDetails = {
      paypalOrderId: result.id,
      status: result.status,
      payerEmail: payer?.email_address,
      payerName: `${payer?.name?.given_name || ''} ${payer?.name?.surname || ''}`.trim(),
      cartProducts: cartProducts,
    };

    const reservationQuery = `
      INSERT INTO \`reservationstable\`
      (\`Name\`, \`Start Date\`, \`End Date\`, \`People\`, \`Room Option\`, \`Room Number\`, \`Total\`, \`Email\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const product of cartProducts) {
      try {
        const startDate = product.reservationStartDate;
        const endDate = product.reservationEndDate;

        const assignedRoom = await assignRoom(product.roomOption, startDate, endDate);
        console.log("Room Request: ", product.reservationStartDate, product.reservationEndDate)
        console.log("Assigned Room: ", assignedRoom, startDate, endDate)
        if (!assignedRoom) {
          const msg = `No available room for ${product.roomOption} from ${startDate} to ${endDate}`;
          console.warn('Room assignment error:', msg);
          return res.status(409).json({ success: false, message: msg });
        }

        await db.query(reservationQuery, [
          orderDetails.payerName,
          startDate,
          endDate,
          product.people,
          product.roomOption,
          assignedRoom,
          product.total,
          orderDetails.payerEmail
        ]);
      } catch (reservationErr) {
        console.error('Reservation processing error:', reservationErr, product);
        return res.status(500).json({ success: false, message: 'Reservation failed.', details: reservationErr.message });
      }
    }

    // All reservations successful
    res.json({
      status: 'COMPLETED',
      details: result,
      orderDetails: orderDetails
    });

  } catch (err) {
    console.error('Unexpected capture error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.', details: err.message });
  }
});


//Delete Profile Processing
app.post('/deleteprofile', authenticateToken, async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid Token' });
    }

    const userId = decoded.User_ID;

    // MySQL delete query
    try {
        const [result] = await db.query(
            'DELETE FROM `userinformation` WHERE `User ID` = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: true });
        res.status(200).json({ success: true, message: 'Profile Deleted Successfully' });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/reservationdata', async (req, res) => {
    try {
        const [response] = await db.query(
            'SELECT * FROM reservationstable'
        );

       const formatted = response.map(row => ({
            ...row,
            'Start Date': row['Start Date'] || '',
            'End Date': row['End Date'] || ''
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error("Error Querying reservationstable", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/reservationdataupdate', async (req, res) => {
    try {
        // Expect reservation object in req.body
        const {
            Name,
            "Start Date": StartDate,
            "End Date": EndDate,
            People,
            "Room Option": RoomOption,
            "Room Number": RoomNumber,
            Total,
            Email,
            "Reservation ID": ReservationID,
            "Check In" : CheckIn,
            "Check Out" : CheckOut
        } = req.body;

        // Validate required fields
        if (!ReservationID || !Name || !StartDate || !EndDate || !People || !RoomOption || !RoomNumber || !Total  || !CheckIn || !CheckOut) {
            return res.status(400).json({ success: false, message: "Missing required reservation fields." });
        }

        // Update reservation in the database
        const updateQuery = `
            UPDATE \`reservationstable\`
            SET \`Name\` = ?, \`Start Date\` = ?, \`End Date\` = ?, \`People\` = ?, \`Room Option\` = ?, \`Room Number\` = ?, \`Total\` = ?, \`Email\` = ?, \`Check In\` = ?, \`Check Out\` = ?
            WHERE \`Reservation ID\` = ?
        `;
        const params = [
            Name,
            StartDate,
            EndDate,
            People,
            RoomOption,
            RoomNumber,
            Total,
            Email || '',
            CheckIn,
            CheckOut,
            ReservationID,

        ];
        const [result] = await db.query(updateQuery, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Reservation not found." });
        }

        res.status(200).json({ success: true, message: "Reservation updated successfully." });
    } catch (error) {
        console.error("Error updating reservationstable", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post('/reservationdelete', async (req, res) => {
    try {
        // Expect { reservationId } in req.body
        const { reservationId } = req.body;

        // Validate required fields
        if (!reservationId) {
            return res.status(400).json({ success: false, message: "Reservation ID not provided." });
        }

        // Delete reservation in the database
        const deleteQuery = `
           DELETE FROM \`reservationstable\` WHERE \`Reservation ID\` = ?
        `;
        const [result] = await db.query(deleteQuery, [reservationId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Reservation not found." });
        }

        res.status(200).json({ success: true, message: "Reservation deleted successfully." });
    } catch (error) {
        console.error("Error deleting reservationstable", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.get('/musicschedule', async (req, res) =>{

    try {
        const query = 'SELECT * FROM \`musicschedule\`'

        const [result] = await db.query(query);
        console.log("Music Schedule: ", result);
        res.status(200).json({ success: true, data: result, message: "Music Schedule Retrieved: " })


    } catch (error) {
        console.error("Error querying database: ", error)
        res.status(400).json({ success: false, message: error.message })
    }

});

app.post('/musicscheduleadd', async (req, res) => {

    try {
        
        //Unpack Request
        const request = req.body; 
        console.log("Request for Event Add", request);

        const artist = request.eventArtist;
        const date = request.eventDate;
        const time = request.eventTime;
        
        const query = 'INSERT INTO \`musicschedule\` (`Artist`, `Date`, `Time`) VALUES (?, ?, ?)'

        const [result] = await db.query(query, [artist, date, time])

        if (result.insertId) {
            console.log("Music Event Added: ", request)
            res.status(200).json({ success: true, message: "Music Schedule Updated Successfully."})
        } else {
            console.log("Music Event Could Not be Added.")
            res.status(400).json({ success: false, message: "Music Schedule Could Not be Updated."})
        }

    } catch(error) {
        console.error("Error Adding Music Event to Database: ", error)
    }

})

app.post('/musicscheduleupdate', async (req,res) => {

    //Attempt query
    try {
        
        //Unpack request
        const { eventArtist, eventDate, eventTime, concertID } = req.body

        console.log("Music Schedule Request Body:", req.body);

        //Query
        const query = `UPDATE \`musicschedule\` SET \`Artist\` = ?, \`Date\` = ?, \`Time\` = ? WHERE \`Concert ID\` = ?`;

        //Insert to Database
        const [result] = await db.query(query, [eventArtist, eventDate, eventTime, concertID])

        if (result.affectedRows > 0) {
            console.log("Music Schedule Update Successful!")
            res.status(200).json({ success: true, message: "Concert Updated."})
        } else {
            console.log("Error Updating Music Event");
            res.status(400).json({ success: false, message: "Concert Event Could not be Updated."})
        }

    } catch (error) {
        console.error("Error Updating Concert Schedule: ", error);

    }
})

app.post('/musicscheduledelete', async (req,res) => {

    const { concertID } = req.body;

    try {

        const query = `DELETE FROM \`musicschedule\` WHERE \`Concert ID\` = ?`;

        const [result] = await db.query(query, [concertID]);

        if (result.affectedRows > 0) {
            console.log("Row Deleted");
            res.status(200).json({ success: true, message: "Music Event Deleted." });
        } else {
            console.log("Music Event Could not be Deleted.");
        }

    } catch (error) {
        console.error("Error Deleting Event From Database: ", error);
        res.status(400).json({success: false, message: "Database Deletion Error."})
    }

});

//Declare port number
const PORT = process.env.PORT || 5000;
//Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
