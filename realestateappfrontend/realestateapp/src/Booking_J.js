import React from 'react';
import './Booking.css'; 
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataProvider';
import Navbar from './Custom_Navbar_J';
import Footer from './Custom_Footer_J';
import Dormitory from './tokyoguesthouse5.png';
import DoubleRoomShared from './tokyoguesthouse6.png';
import DoubleRoomPrivate from './tokyoguesthouse7.png';
import JapaneseTwinRoom from './tokyoguesthouse8.png';
import FourBedRoom from './tokyoguesthouse9.png';
import coffeeicon from './coffeeicon.png';
import lightsicon from './lighticon.png';
import microwaveicon from './microwaveicon.png';
import powericon from './powericon.png';
import shoesicon from './shoesicon.png';
import showericon from './showericon.png';
import smokingicon from './smokingicon.png';
import soapicon from './soapicon.png';
import toileticon from './toileticon.png';
import toothbrushicon from './toothbrushicon.png';
import towelicon from './towelicon.png';
import washericon from './washericon.png';
import wifiicon from './wifiicon.png';



const Booking = () => {

  const navigate = useNavigate();

  const goToCart = () => {
    navigate('/Cart');
  }

  const { addReservation, removeReservation, cartProducts } = useContext(DataContext);

  //Scroll to top of page on refresh
 useEffect(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  }, []);

  // Declare state variables for booking details
  const [displayIndex, setDisplayIndex] = useState(0);
  const [ people, setPeople ] = useState(0);
  const [ selectedButton, setSelectedButton ] = useState(null);
  const [ previouslySelectedButton, setPreviouslySelectedButton ] = useState(null);
  const [ roomTypeOption, setRoomTypeOption ] = useState('');
  const [selectedStartMonth, setSelectedStartMonth] = useState(new Date().getMonth()); // 0-based index
  const [selectedStartDay, setSelectedStartDay] = useState(null);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndMonth, setSelectedEndMonth] = useState(new Date().getMonth()); // 0-based index
  const [selectedEndDay, setSelectedEndDay] = useState(null);
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear());
  const [ reservationData, setReservationData ] = useState([]);
  const [ reservationConfirmed, setReservationConfirmed ] = useState(false);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //Room Option Variables
    const roomTypeOptionsArray = ['Dormitory', 'Double Room Shared Toilet & Shower', 'Double Room Private Toilet & Bath', 'Japanese Twin Room', '4 Bed Room']
    const dormitoryRooms = ['202A', '202B', '202C', '202D', '202E', '202F', '202G', '202H', '202I', '202K', '202L', '203A', '203B', '203C', '203D', '203E', '203F', '203G', '203H', '203I', '203K', '203L', '204A', '204B', '204C', '204D', '204E', '204F', '204G', '204H', '204I', '204K', '204L'];
    const doubleSharedRooms = ['201', '205'];
    const doubleRoomPrivate = ['206', '207'];
    const japaneseTwinRooms = ['301', '302', '303', '304', '305', '306', '307'];
    const fourbedRooms = ['401', '402', '403', '404', '405', '406'];


  //Reservation Conditional Logic Handling

  // Helper: Get room array by option
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

// Helper: Check if a room type is available for a date range (using date strings)
function isRoomTypeAvailable(roomOption, startDateStr, endDateStr) {
  if (!reservationData || !startDateStr || !endDateStr) return true;

  const roomArray = getRoomArray(roomOption);

  // Compare date strings directly — assumed format: 'YYYY-MM-DD'
  const overlapping = reservationData.filter(r =>
    r['Room Option'] === roomOption &&
    !(r['End Date'] <= startDateStr || r['Start Date'] >= endDateStr)
  );

  const bookedRooms = new Set(overlapping.map(r => r['Room Number']));

  return roomArray.some(room => !bookedRooms.has(room));
}



  //Get Reservation Data Function
  const getReservationData = async () => {


      //GET request
      try {
          const response = await fetch('http://localhost:5000/reservationdata',
              {
              method: 'GET', //POST Method for login
              headers: {
                  'Content-Type': 'application/json'
              },
              credentials: 'include', //This allows cookies to be sent and received
              }
          );


          const data = await response.json();

          //Valid response check
          if (response.ok) {
              setReservationData(data.data);
              console.log('Reservations Received');
          }
      } catch (error) {
          console.error("Error Retrieving Reservations:", error.response ? error.response.data : error.message);
      }
  };

  useEffect(() => {
      getReservationData();
  }, []);

  useEffect(() => {
      console.log("Reservation Data: ", reservationData);
  }, [reservationData]);





  //Log Display Index
  useEffect(() => {
    console.log("Current Step Index: ", displayIndex);
  }, [displayIndex]);

  const displayHandler = (displayIndex) => {
    return(
      <>
        <div className="displayhandler">
          {displayIndex === 0 && <PeopleSelection/>}
          {displayIndex === 1 && <RoomTypeSelection/>}
          {displayIndex === 2 && <BookingCalendarStartDate/>}
          {displayIndex === 3 && <BookingCalendarEndDate/>}
          {displayIndex === 4 && <ConfirmBooking/>}
        </div>
      </>
    );

  }

  //Style the selected people button
  useEffect(() => {
      if (previouslySelectedButton && previouslySelectedButton !== selectedButton) {
        previouslySelectedButton.style.backgroundColor = '';
        previouslySelectedButton.style.color = '';
      }
      if (selectedButton) {
        selectedButton.style.backgroundColor = 'grey'; // Green background
        selectedButton.style.color = 'white'; // White text
      }

      console.log("Selected Button:", selectedButton);

    }, [selectedButton, previouslySelectedButton]);

  const PeopleSelection = () => {

    const today = new Date();
    const startDate = selectedStartDay ? new Date(selectedStartYear, selectedStartMonth, selectedStartDay) : today;
    const endDate = selectedEndDay ? new Date(selectedEndYear, selectedEndMonth, selectedEndDay) : startDate;
    const peopleOptions = [1, 2, 3, 4];

    return (
      <>
      <h1>予約人数を選択してください</h1>
      <br/>
      <br/>
      <div className="peopleoptionsparent">
         {peopleOptions.map(count => (
          <button
              key={count}
              className={`peoplebutton${people === count ? ' selected' : ''}`}
              onClick={() => setPeople(count)}
            >{count === 4 ? '4+' : count}</button>
        ))}
      </div>
      </>
    );
  }

  const RoomTypeSelection = () => {

    const today = new Date();
    const startDate = selectedStartDay ? new Date(selectedStartYear, selectedStartMonth, selectedStartDay) : today;
    const endDate = selectedEndDay ? new Date(selectedEndYear, selectedEndMonth, selectedEndDay) : startDate;

    const roomDisplay = () => {
      setReservationConfirmed(false);
      if (people === 1) {
        return (
          <>
          <div className="roomtypeoption">
            <div className="roomdisplay">
              <img src={Dormitory} alt="Dormitory" />
              <div className="roomdetails">
                <div className="roomtitle">
                  <h1>寮</h1>
                </div>
                <br/>
                <p>プライバシーに配慮したオリジナル二段ベッドをご用意。各ベッドにはコンセントと読書灯を完備。同フロアに男女別のトイレとシャワーをご用意しております。
                </p>
                <br/>
                <span>有料アイテム</span><p>
                歯ブラシ（50円）、タオル交換（100円）、コンセントアダプター（350円）、コインランドリー（洗濯機200円、乾燥機100円）。
                </p>
                <br/>
                <div className="roomfeatures">
                  <h1>設備：</h1>
                  <br/>
                  <img src={wifiicon} alt="Wifi" />
                  <img src={towelicon} alt="Towel" />
                  <img src={shoesicon} alt="Shoes" />
                  <img src={powericon} alt="Power" />
                  <img src={lightsicon} alt="Light" />
                  <img src={smokingicon} alt="Smoking" />
                  <br/>
                  <br/>
                  <h1>共有:</h1>
                  <br/>
                  <img src={toileticon} alt="Toilet" />
                  <img src={showericon} alt="Shower" />
                  <img src={soapicon} alt="Soap" />
                  <img src={coffeeicon} alt="Coffee" />
                  <img src={microwaveicon} alt="Microwave" />
                  <br/>
                  <br/>
                  <h1>起訴された</h1>
                  <img src={toothbrushicon} alt="Toothbrush" />
                  <img src={washericon} alt="Washer" />
                </div>
              <br/>
              <div className="roomselectionbutton">
                <button
                  className="roomselection"
                  onClick={() => setRoomTypeOption('Dormitory')}
                > この部屋を選択 </button>
                <br/>
                {roomTypeOption === 'Dormitory' && (<div className="roomselectiondeclaration"><p>寮を選択しました</p></div>)}
              </div>
            </div>
          </div>
        </div>
        </>
        );
      }
      if (people === 2) {
        return (
          <>
          <div className="roomtypeoption">
            <div className="roomdisplay">
              <img src={DoubleRoomShared} alt="Double Room Shared" />
              <div className="roomdetails">
                <div className="roomtitle">
                  <h1>ダブルルーム 共用トイレ＆シャワー</h1>
                </div>
                <br/>
                <p>ダブルベッド（2000×1400）のお部屋で、最大2名様までご宿泊いただけます。
                バスルームとトイレは共用です。
                </p>
                <br/>
                <span>有料アイテム:</span><p>
                歯ブラシ（50円）、タオル交換（100円）、コンセントアダプター（350円）、コインランドリー（洗濯機200円、乾燥機100円）。
                </p>
                <br/>
                <div className="roomfeatures">
                  <h1>設備：</h1>
                  <br/>
                  <img src={wifiicon} alt="Wifi" />
                  <img src={towelicon} alt="Towel" />
                  <img src={shoesicon} alt="Shoes" />
                  <img src={powericon} alt="Power" />
                  <img src={lightsicon} alt="Light" />
                  <img src={smokingicon} alt="Smoking" />
                  <br/>
                  <br/>
                  <h1>共有:</h1>
                  <br/>
                  <img src={toileticon} alt="Toilet" />
                  <img src={showericon} alt="Shower" />
                  <img src={soapicon} alt="Soap" />
                  <img src={coffeeicon} alt="Coffee" />
                  <img src={microwaveicon} alt="Microwave" />
                  <br/>
                  <br/>
                  <h1>請求額:</h1>
                  <img src={toothbrushicon} alt="Toothbrush" />
                  <img src={washericon} alt="Washer" />
                </div>
              <br/>
              <div className="roomselectionbutton">
                <button
                  className="roomselection"
                  onClick={() => setRoomTypeOption('Double Room Shared Toilet & Shower')}
                >この部屋を選択 </button>
                <br/>
                {roomTypeOption === 'Double Room Shared Toilet & Shower' && (<div className="roomselectiondeclaration"><p>ダブルルーム（共用トイレ＆シャワー）を選択しました</p></div>)}
              </div>
            </div>
          </div>
        </div>
        </>
        );
      }
      if (people === 3) {
        return (
          <>
          <div className="roomtypeoption">
            <div className="roomdisplay">
              <img src={DoubleRoomPrivate} alt="Double Room Private" />
              <div className="roomdetails">
                <div className="roomtitle">
                  <h1>ダブルルーム 専用トイレ＆バス</h1>
                </div>
                <br/>
                <p>約20㎡のお部屋にダブルベッド（2000×1400）をご用意しております。
                  ソファベッドを追加して最大3名様までご宿泊いただけます。
                  事前にご連絡ください。
                </p>
                <br/>
                <span>有料アイテム:</span><p>歯ブラシ（50円）、変換プラグ（350円）、コインランドリー（洗濯機200円、乾燥機100円）。
                </p>
                <br/>
                <div className="roomfeatures">
                  <h1>設備:</h1>
                  <br/>
                  <img src={wifiicon} alt="Wifi" />
                  <img src={towelicon} alt="Towel" />
                  <img src={shoesicon} alt="Shoes" />
                  <img src={powericon} alt="Power" />
                  <img src={lightsicon} alt="Light" />
                  <img src={smokingicon} alt="Smoking" />
                  <img src={toothbrushicon} alt="Toothbrush" />
                  <img src={toileticon} alt="Toilet" />
                  <img src={showericon} alt="Shower" />
                  <img src={soapicon} alt="Soap" />
                  <img src={coffeeicon} alt="Coffee" />
                  <br/>
                  <br/>
                  <h1>共有:</h1>
                  <br/>
                  <img src={microwaveicon} alt="Microwave" />
                  <br/>
                  <br/>
                  <h1>起訴された:</h1>
                  <img src={washericon} alt="Washer" />
                </div>
              <br/>
              <div className="roomselectionbutton">
                <button
                  className="roomselection"
                  onClick={() => setRoomTypeOption('Double Room Private Toilet & Bath')}
                >この部屋を選択</button>
                <br/>
                {roomTypeOption === 'Double Room Private Toilet & Bath' && (<div className="roomselectiondeclaration"><p>ダブルルーム（専用トイレ＆バス）を選択しました</p></div>)}
              </div>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="roomtypeoption">
            <div className="roomdisplay">
              <img src={JapaneseTwinRoom} alt="Japanese Twin Room" />
              <div className="roomdetails">
                <div className="roomtitle">
                  <h1>和室ツインルーム</h1>
                </div>
                <br/>
                <p>畳敷きの和室です。布団をご用意しており、最大3名様までご宿泊いただけます。
                </p>
                <br/>
                <span>有料アイテム:</span><p>歯ブラシ（50円）、変換プラグ（350円）、コインランドリー（洗濯機200円、乾燥機100円）。
                </p>
                <br/>
                <div className="roomfeatures">
                  <h1>設備：</h1>
                  <br/>
                  <img src={wifiicon} alt="Wifi" />
                  <img src={towelicon} alt="Towel" />
                  <img src={shoesicon} alt="Shoes" />
                  <img src={powericon} alt="Power" />
                  <img src={lightsicon} alt="Light" />
                  <img src={smokingicon} alt="Smoking" />
                  <img src={toothbrushicon} alt="Toothbrush" />
                  <img src={toileticon} alt="Toilet" />
                  <img src={showericon} alt="Shower" />
                  <img src={soapicon} alt="Soap" />
                  <img src={coffeeicon} alt="Coffee" />
                  <br/>
                  <br/>
                  <h1>共有:</h1>
                  <br/>
                  <img src={microwaveicon} alt="Microwave" />
                  <br/>
                  <br/>
                  <h1>請求額:</h1>
                  <img src={washericon} alt="Washer" />
                </div>
              <br/>
              <div className="roomselectionbutton">
                <button
                  className="roomselection"
                  onClick={() => setRoomTypeOption('Japanese Twin Room')}
                >この部屋を選択</button>
                <br/>
                {roomTypeOption === 'Japanese Twin Room' && (<div className="roomselectiondeclaration"><p>和室ツインルームを選択しました</p></div>)}
              </div>
            </div>
          </div>
        </div>
        </>
        );
      }
      if (people === 4) {
        return(
          <>
          <div className="roomtypeoption">
            <div className="roomdisplay">
              <img src={FourBedRoom} alt="4 Bed Room" />
              <div className="roomdetails">
                <div className="roomtitle">
                  <h1>4ベッドルーム</h1>
                </div>
                <br/>
                <p>二段ベッドが2台備わったお部屋で、最大4名様までご宿泊いただけます。ご家族やグループでのご利用に最適です。
                </p>
                <br/>
                <span><p>有料アイテム：歯ブラシ（50円）、変換プラグ（350円）、コインランドリー（洗濯機200円、乾燥機100円）。
                </p></span>
                <br/>
                <div className="roomfeatures">
                  <h1>設備：</h1>
                  <br/>
                  <img src={wifiicon} alt="Wifi" />
                  <img src={towelicon} alt="Towel" />
                  <img src={shoesicon} alt="Shoes" />
                  <img src={powericon} alt="Power" />
                  <img src={lightsicon} alt="Light" />
                  <img src={smokingicon} alt="Smoking" />
                  <img src={toothbrushicon} alt="Toothbrush" />
                  <img src={toileticon} alt="Toilet" />
                  <img src={showericon} alt="Shower" />
                  <img src={soapicon} alt="Soap" />
                  <img src={coffeeicon} alt="Coffee" />
                  <br/>
                  <br/>
                  <h1>共有:</h1>
                  <br/>
                  <img src={microwaveicon} alt="Microwave" />
                  <br/>
                  <br/>
                  <h1>請求額:</h1>
                  <img src={washericon} alt="Washer" />
                </div>
              <br/>
              <div className="roomselectionbutton">
                <button
                  className="roomselection"
                  onClick={() => setRoomTypeOption('4 Bed Room')}
                >この部屋を選択</button>
                <br/>
                {roomTypeOption === '4 Bed Room' && (<div className="roomselectiondeclaration"><p>4ベッドルームを選択しました</p></div>)}
              </div>
            </div>
          </div>
        </div>
        </>
        );
      }
    }

    return (
      <>
      <div className="roomtypeselection">
        <br/>
        <br/>
        <h1>部屋タイプを選択</h1>
        <br/>
        <br/>
        <div className="roomtypeoptions">
         {roomDisplay()}
        </div>
      </div>
      </>
    );
  }

  //Calendar Generation Helper
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  };

const displayStartMonth = () => {
  const daysInMonth = getDaysInMonth(selectedStartMonth, selectedStartYear);
  const firstDay = new Date(selectedStartYear, selectedStartMonth, 1).getDay();
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper: Convert year/month/day to YYYY-MM-DD
  const formatDateStr = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Helper: Check if all rooms are booked for a given day using date string
  function isFullyBookedForDay(day) {
    if (!roomTypeOption) return false;
    const dateStr = formatDateStr(selectedStartYear, selectedStartMonth, day);
    const nextDateStr = formatDateStr(selectedStartYear, selectedStartMonth, day + 1);
    return !isRoomTypeAvailable(roomTypeOption, dateStr, nextDateStr);
  }

  const rows = [];
  let cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<td key={`empty-${i}`}></td>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(selectedStartYear, selectedStartMonth, day);
    const isPast = dateStr < todayStr;
    const isFullyBooked = isFullyBookedForDay(day);
    const nextDayFullyBooked = isFullyBookedForDay(day + 1);
    const isDisabled = isPast || isFullyBooked;

    console.log(day, isFullyBooked, nextDayFullyBooked)

    cells.push(
      <td
        key={dateStr}
        className={selectedStartDay === day ? "calendarselected" : ""}
        onClick={() => { if (!isDisabled) setSelectedStartDay(day); }}
        style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, backgroundColor: isDisabled ? "grey" : "" }}
      >
        {day}
        {selectedStartDay === day && (
          <div className="selecteddaymessage"><p>選択した開始日</p></div>
        )}
        {isFullyBooked && <div className='fullbooked'>満杯</div>}
      </td>
    );

    if ((cells.length) % 7 === 0) {
      rows.push(<tr key={`row-${day}`}>{cells}</tr>);
      cells = [];
    }
  }

  if (cells.length) {
    while (cells.length < 7) {
      cells.push(<td key={`empty-end-${cells.length}`}></td>);
    }
    rows.push(<tr key="row-last">{cells}</tr>);
  }

  return (
    <div className="calendarbody">
      <div className="calendarcontrols">
        <select
          value={selectedStartMonth}
          onChange={e => {
            setSelectedStartMonth(Number(e.target.value));
            setSelectedStartDay('');
          }}
        >
          {months.map((m, idx) => (
            <option key={m} value={idx}>{m}</option>
          ))}
        </select>
        <input
          className="yearselection"
          type="number"
          value={selectedStartYear}
          onChange={e => {
            setSelectedStartYear(Number(e.target.value));
            setSelectedStartDay('');
          }}
        />
      </div>
      <br /><br /><br />
      <div className="calendartablewrapper">
        <table className="calendartable">
          <thead>
            <tr>
              <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
            </tr>
          </thead>
          <br />
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
};


  const displayEndMonth = () => {
    const daysInMonth = getDaysInMonth(selectedEndMonth, selectedEndYear);
    const firstDay = new Date(selectedEndYear, selectedEndMonth, 1).getDay(); //0 = Sun
    const today = new Date();
    today.setHours(0,0,0,0); // Midnight for comparison

    function isFullyBookedForDay(year, month, day) {
       if (!roomTypeOption) return false;

      const formatDateStr = (y, m, d) => {
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
      };

      const dateStr = formatDateStr(year, month, day);
      const nextDateStr = formatDateStr(year, month, day + 1);
      return !isRoomTypeAvailable(roomTypeOption, dateStr, nextDateStr);
    }

    //Build calendar rows
    const rows = [];
    let cells = [];

    //Fill initial empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<td key={`empty-${i}`}></td>);
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(selectedEndYear, selectedEndMonth, day);
      thisDate.setHours(0,0,0,0);
      const minStart = selectedStartDay ? new Date(selectedStartYear, selectedStartMonth, selectedStartDay) : null;
      if (minStart) minStart.setHours(0,0,0,0);
      const isBeforeStart = minStart && thisDate <= minStart;
      const isFullyBooked = isFullyBookedForDay(selectedEndYear, selectedEndMonth, day);
      const prevDayFullyBooked = isFullyBookedForDay(selectedEndYear, selectedEndMonth, day - 1);
      const canSelect = !isFullyBooked || (isFullyBooked && !prevDayFullyBooked);

    // In the loop:
    let hasFullBetween = false;
    if (
      !isBeforeStart &&
      selectedStartDay &&
      (selectedStartYear !== selectedEndYear || selectedStartMonth !== selectedEndMonth)
    ) {
      let startDate = new Date(selectedStartYear, selectedStartMonth, selectedStartDay);
      let endDate = new Date(selectedEndYear, selectedEndMonth, day);
      let checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() + 1);
      while (checkDate < endDate) {
        if (isFullyBookedForDay(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate())) {
          hasFullBetween = true;
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }
    } else if (
      !isBeforeStart &&
      selectedStartDay &&
      selectedStartYear === selectedEndYear &&
      selectedStartMonth === selectedEndMonth &&
      day > selectedStartDay
    ) {
      for (let d = selectedStartDay + 1; d < day; d++) {
        if (isFullyBookedForDay(selectedEndYear, selectedEndMonth, d)) {
          hasFullBetween = true;
          break;
        }
      }
    }
      const isDisabled = isBeforeStart || !canSelect || hasFullBetween;
      cells.push(
        <td
          key={`${selectedEndYear}-${selectedEndMonth}-${day}`}
          className={selectedEndDay === day ? "calendarselected" : ""}
          onClick={() => { if (!isDisabled) setSelectedEndDay(day); }}
          style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, backgroundColor: isDisabled ? "grey" : "" }}
        >
          {day}
          {(isFullyBooked && prevDayFullyBooked) && <div className="fullbooked">満杯</div>}
          {selectedEndDay === day && (<div className="selecteddaymessage"><p>選択した終了日</p></div>)}
          {(hasFullBetween && !isFullyBooked) && (
            <div className="stopadjacentbooking">途中に満席の日がある場合は終了日を選択できません。</div>
          )}
        </td>
      );
      if ((cells.length) % 7 === 0) {
        rows.push(<tr key={`row-${day}`}>{cells}</tr>);
        cells = [];
      }
    }

    // Fill trailing empty cells
    if (cells.length) {
      while (cells.length < 7) {
        cells.push(<td key={`empty-end-${cells.length}`}></td>);
      }
      rows.push(<tr key="row-last">{cells}</tr>);
    }

    return (
      <>
      <div className="calendarbody">
        <div className="calendarcontrols">
          <select
            value={selectedEndMonth}
            onChange={e => {
              setSelectedEndMonth(Number(e.target.value));
              setSelectedEndDay('');
            }}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <input
            className="yearselection"
            type="number"
            value={selectedEndYear}
            onChange={e => {
              setSelectedEndYear(Number(e.target.value));
              setSelectedEndDay('');
            }}
          />
        </div>
        <br/>
        <br/>
        <br/>
        <div className="calendartablewrapper">
          <table className="calendartable">
            <thead>
              <tr>
                <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
              </tr>
            </thead>
            <br/>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
      </>
    );
  };


  const BookingCalendarStartDate = () => {
    useEffect(() => {
      console.log("Selected Start Day: ", selectedStartDay);
    }, [selectedStartDay])

    return (
      <>
      <div className="bookingcalendarwrapper">
        <div className="bookingtitle">
          <h1>予約開始日を選択</h1>
        </div>
        <br/>
        <br/>
        <div className="calendar">
          {displayStartMonth()}
        </div>
      </div>
      </>

    );
  }

  const BookingCalendarEndDate = () => {
    useEffect(() => {
      console.log("Selected End Day: ", selectedEndDay);
    }, [selectedStartDay])

    return (
      <>
      <div className="bookingcalendarwrapper">
        <div className="bookingtitle">
          <h1>予約終了日を選択</h1>
        </div>
        <br/>
        <br/>
        <div className="calendar">
          {displayEndMonth()}
        </div>
      </div>
      </>

    );
  }


  //Return User to Booking Start if they Delete the Cart
  useEffect(() => {
    if (cartProducts.length === 0) {
      setDisplayIndex(0);
      window.scrollTo(0, 0);
    }
  }, [cartProducts.length]);

  const ConfirmBooking = () => {
    // Function to handle booking confirmation logic
    return (
    <>
      <div className="reservationwrapper">
        {!reservationConfirmed &&

          (<>
            <div className = "confirmreservationwrapper">
              <div className="reservationtitle">
                <h1>ご予約の確認</h1>
              </div>
              <br/>
              <br/>
              <div className="reservationdetails">
                <ul>
                  <li>
                    <span>予約開始日（月/日/年）: </span>
                    <p>{selectedStartMonth + 1}/{selectedStartDay}/{selectedStartYear}</p>
                  </li>
                  <br/>
                  <li>
                    <span>予約終了日（月/日/年）:</span>
                    <p>{selectedEndMonth + 1}/{selectedEndDay}/{selectedEndYear}</p>
                  </li>
                  <br/>
                  <li>
                    <span>人数:</span>
                    <p>{people}</p>
                    <br/>
                    <span>選択した部屋のオプション:</span>
                    <p>{roomTypeOption}</p>
                  </li>
                </ul>
                <br/>
                <br/>
              <div className ="confirmreservationbuttons">
                <button className="confirmreservation" onClick={() => {
                    // Convert dates to ISO strings for comparison
                    const newReservation = {
                      reservationStartDate: new Date(selectedStartYear, selectedStartMonth, selectedStartDay),
                      reservationEndDate: new Date(selectedEndYear, selectedEndMonth, selectedEndDay),
                      roomOption: roomTypeOption,
                      people: people
                    };

                    // Overlap check: same room type, overlapping date range
                    const hasOverlap = cartProducts.some(reservation => {
                      if (reservation.roomOption !== newReservation.roomOption) return false;
                      const startA = new Date(reservation.reservationStartDate);
                      const endA = new Date(reservation.reservationEndDate);
                      const startB = newReservation.reservationStartDate;
                      const endB = newReservation.reservationEndDate;
                      // Overlap if not (endA < startB or endB < startA)
                      return !(endA < startB || endB < startA);
                    });

                    if (hasOverlap) {
                      alert("この部屋タイプは、カート内の選択した日付と重複する予約がすでに存在します。");                      
                      return;
                    }

                    // Existing duplicate check (same room type, dates, people)
                    const alreadyExists = cartProducts.some(reservation =>
                      String(new Date(reservation.reservationStartDate).toISOString()) === newReservation.reservationStartDate.toISOString() &&
                      String(new Date(reservation.reservationEndDate).toISOString()) === newReservation.reservationEndDate.toISOString() &&
                      reservation.roomOption === newReservation.roomOption &&
                      reservation.people === newReservation.people
                    );

                    if (alreadyExists) {
                      alert("この予約はすでにカートに入っています。");
                      return;
                    }

                    addReservation(newReservation);
                    setReservationConfirmed(true);
                    alert("予約確定");
                  }}>
                    予約の確認
                  </button>
              </div>
              </div>
              </div>
              </>
              )
              }
          <br/>
          <br/>
          <div className="currentreservations">
            <div className="currentreservationstitle">
              <h1>現在の予約</h1>
            </div>
            <br/>
            <br/>
               {cartProducts.length > 0 && (<button className="addreservation" onClick={() => {

                  setSelectedStartDay('');
                  setSelectedEndDay('');
                  setRoomTypeOption('');
                  setPeople('');
                  setDisplayIndex(0);
                  window.scrollTo(0,0);

                }}>別の予約を追加する</button>)}
            <div className="currentreservationsdetails">
                {cartProducts.map((reservation, idx) => (
                  <>
                  <ul key={idx}>
                    <li>
                      <span>予約開始日（月/日/年）:</span>
                      <p>
                        {reservation.reservationStartDate
                          ? `${new Date(reservation.reservationStartDate).getMonth() + 1}/` +
                            `${new Date(reservation.reservationStartDate).getDate()}/` +
                            `${new Date(reservation.reservationStartDate).getFullYear()}`
                          : ''}
                      </p>
                    </li>
                    <br/>
                    <li>
                      <span>予約終了日（月/日/年）:</span>
                      <p>{reservation.reservationStartDate
                          ? `${new Date(reservation.reservationEndDate).getMonth() + 1}/` +
                            `${new Date(reservation.reservationEndDate).getDate()}/` +
                            `${new Date(reservation.reservationEndDate).getFullYear()}`
                          : ''}
                        </p>
                    </li>
                    <br/>
                    <li>
                      <span>人数:</span>
                      <p>{reservation.people}</p>
                      <br/>
                      <span>選択した部屋のオプション:</span>
                      <p>{reservation.roomOption}</p>
                    </li>
                    <br/>
                    <br/>
                    <br/>
                    <li>
                      <button className="removereservationbutton" onClick={() => {
                        removeReservation(reservation);
                      }}>予約を削除</button>
                    </li>
                 </ul>
                 </>
                ))}
              </div>
          </div>
        </div>
    </>);
  }

  return (
  <>
   <Navbar/>
   <div className="bookingpagebody">
    <h2>予約</h2>
    <br/>
    <div className="bookingcontainer">
      <br/>
      <br/>
      {displayHandler(displayIndex)}
      <br/>
      <br/>
      <br/>
      {displayIndex !== 0 && (<button className="restartbookingbtn" onClick={() => {
          setPeople(0);
          setRoomTypeOption('');
          setSelectedStartDay('');
          setSelectedEndDay('');
          setDisplayIndex(0);
          window.scrollTo(0,0);
          }}>
          予約開始に戻る
      </button>)}
      <br/>
      <br/>
      <div className="navigationbuttons">
        <button className="previousselectionbutton" onClick={() => {
          setDisplayIndex(displayIndex - 1);
          window.scrollTo(0, 0); // Scroll to top
        }}>前の</button>
        {displayIndex === 4 ? (<button className="nextselectionbutton" onClick={() => {
          goToCart();
          window.scrollTo(0,0);

        }}>支払いに進む</button>)

        : (<button className="nextselectionbutton" onClick={() => {
          if (displayIndex === 0 && people || displayIndex === 1 && roomTypeOption || displayIndex === 2 && selectedStartDay || displayIndex === 3 && selectedEndDay) {
          setDisplayIndex(displayIndex + 1);
          window.scrollTo(0, 0); // Scroll to top
          }
          else {
            alert("選択してください。")
          }
        }}>次</button>)}
      </div>
    </div>
   </div>
   <Footer/>
  </>
  );
}

export default Booking;
