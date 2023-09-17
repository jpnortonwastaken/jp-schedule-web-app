import React, { useState, useEffect } from 'react';
import './style.css';
import moment from 'moment';
import jpicon from './images/jp-icon.png';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { doc, onSnapshot } from "firebase/firestore";

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCIClkGYxTlil-PDlbth4KBmc_2q2z-LzA",
  authDomain: "schedulewebapp-aa44b.firebaseapp.com",
  projectId: "schedulewebapp-aa44b",
  storageBucket: "schedulewebapp-aa44b.appspot.com",
  messagingSenderId: "772596182480",
  appId: "1:772596182480:web:84bd93961bbb8345f0ddd5",
  measurementId: "G-9W2P4ZG665"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function ScheduleItem({ length, isBookable, time, event }) {
  return (
    <li className={`li-${length} ${isBookable ? 'empty' : ''} ${(event.length === 0) && (!isBookable) ? 'no-data' : ''}`}>
      {time} {event} {isBookable && <div className="book-btn">Book time</div>}
    </li>
  );
}

function Schedule({ selectedDate }) {
  const schedulesRef = firestore.collection('schedule');
  const query = schedulesRef.orderBy('endTime');

  const [schedules] = useCollectionData(query, {idField: 'id'});

  console.log(schedules);

  return (
    <ul>
      {schedules && schedules.filter(item => item.day === selectedDate).length > 0 ? (
        <>

        {/* {schedule.map((item) => (
          <ScheduleItem key={item.key} length={item.length} isBookable={item.isBookable} time={item.time} event={item.event} />
        ))} */}

        {schedules && schedules.map(s => <SchedulesFunctionThing key={s.id} schedule={s} selectedDate={"03-06-2023"}/>)}
        
        </>
      ) : (
        <ScheduleItem key={'empty'} length={'allday'} isBookable={false} time={'No data for this day yet.'} event={''} />
      )}
    </ul>
  );
}

function SchedulesFunctionThing(props) {
  const { event, uid, startTime, endTime, bookable, day } = props.schedule;

  return (
    (day === props.selectedDate) ? (
      // <li>{day} {startTime} {endTime} {event} {bookable.toString()}</li>
      <li className={`li-${getLength(startTime, endTime)} ${bookable ? 'empty' : ''} ${(event.length === 0) && (!bookable) ? 'no-data' : ''}`}>
        {startTime + " - " + endTime + ": "} {event} {bookable && <div className="book-btn">Book time</div>}
      </li>
    ) : (
      null
    )
  )
}

function getLength(startTime, endTime) {
  const start = moment(startTime, 'h:mma');
  const end = moment(endTime, 'h:mma');
  const duration = moment.duration(end.diff(start)).asMinutes();

  if (duration > 0 && duration <= 15) {
    return "zero-15";
  } else if (duration > 15 && duration <= 30) {
    return "15-30";
  } else if (duration > 30 && duration <= 60) {
    return "30-60";
  } else if (duration > 60 && duration <= 120) {
    return "60-120";
  } else if (duration > 120 && duration <= 180) {
    return "120-180";
  } else {
    return "180plus";
  }
}


function App() {
  const now = moment();

  const [selectedDate, setSelectedDateFunc] = useState(now);

  const handleDateChange = (increment) => {
    setSelectedDateFunc((prevDate) => prevDate.clone().add(increment, 'day'));
  };

  const dayofWeek = selectedDate.format('dddd');
  const shortDate = selectedDate.format('MMM D');

  const schedules = {
    '03-05-2023': [
      { key: '1', length: 'zero-30', isBookable: false, time: '9:00am - 9:30am:', event: 'Work' },
      { key: '2', length: '30-60', isBookable: false, time: '9:30am - 10:30am:', event: 'Meeting' },
      { key: '3', length: '60-120', isBookable: true, time: '10:30am - 12:30pm:', event: '' },
      { key: '4', length: '120-180', isBookable: false, time: '12:30pm - 3:30pm:', event: 'Doctor\'s appointment' },
      { key: '5', length: '180plus', isBookable: true, time: '3:30pm - 7:30pm:', event: '' },
      { key: '6', length: '60-120', isBookable: false, time: '7:30pm - 9:30pm:', event: 'Dinner with family' },
      { key: '7', length: '30-60', isBookable: false, time: '9:30pm - 10:00pm:', event: 'Homework' },
      { key: '8', length: 'zero-30', isBookable: true, time: '10:00pm -10:30pm:', event: '' },
    ],
    '03-07-2023': [
      { key: '9', length: 'zero-30', isBookable: false, time: '9:00am - 9:30am:', event: 'Meeting' },
      { key: '10', length: 'zero-30', isBookable: true, time: '10:00pm - 10:30pm:', event: '' },
      { key: '11', length: '30-60', isBookable: true, time: '11:00pm - 11:30pm:', event: '' },
    ],
  };

  const [user] = useAuthState(auth);

  return (
    <>
      <div id="container">
        <div id="center-div-1">
          <div id="container-2">
            <div id="box">
              <h1>JP'S SCHEDULE</h1>
              <div id="top">
                <div id="date-container">
                  <div><h2>{dayofWeek}</h2></div>
                  <div><h3>{shortDate}</h3></div>
                </div>
                <div id="buttons-container">
                  <div className="button" onClick={() => handleDateChange(-1)}>&lt;</div>
                  <div className="button" onClick={() => handleDateChange(1)}>&gt;</div>
                </div>
              </div>
              <div id="ul-container">
                <Schedule selectedDate={selectedDate.format("MM-DD-YYYY")} />
              </div>
              <div id="switch-btn-container">
                <div id="switch-button">Send message</div>
              </div>
            </div>
            <div id="center-div-2">
              <div id="box2">
                <div id="user-box">
                  <div id="name-icon-container">
                    <div id="user-icon">
                      <img src={jpicon} alt="Icon" />
                    </div>
                    <div id="user-name">JP Norton</div>
                  </div>
                  <Status />
                </div>
                <div id="admin-container">
                  <div id="admin-title">Admin Controls</div>
                  {(user && user.uid === "wuKILByNIoVAOzEoR6v12VDSP913") ? <AdminControls /> : <SignIn />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*
      TO DO:
      - Make it so any empty times auto generate schedule items that are empty
      - Make admin controls for adding new schedule items to database
      */}
    </>
  );
}

function Status() {
  const statusRef = firestore.collection("status").doc("J0NbeHJS9YZ2sR4YRRbU");
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    const unsubscribe = statusRef.onSnapshot(doc => {
      setCurrentStatus(doc.exists ? doc.data().currentStatus : "");
    });
    return () => unsubscribe();
  }, [statusRef]);

  return (
    <div id="user-status">Status: {currentStatus}</div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle} class="sign-inout-button">Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()} class="sign-inout-button">Sign Out</button>
  )
}

function AdminControls() {
  const [textBoxValue, setTextBoxValue] = useState("");

  const handleStatusChange = () => {
    firestore.collection("status").doc('J0NbeHJS9YZ2sR4YRRbU').set({ currentStatus: textBoxValue });
  };

  return (
    <>
      <SignOut />
      <div id="admin-showhide-container">
        <div id="admin-profile-container">
          <div id="admin-profile-title">Profile status</div>
          <form onSubmit={(e) => {
              e.preventDefault();
              handleStatusChange();
            }}>
            <div id="profile-status-textbox">
              <input type="text" name="profile-textbox" id="profile-textbox" placeholder="Enter status here" maxLength={100} value={textBoxValue} onChange={(e) => setTextBoxValue(e.target.value)}/>
              <button type="submit" id="profile-status-submit">Update</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default App;
