
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MapComponent from './MapComponent';
// import dotenv from 'dotenv';
// dotenv.config();


const socket = io('https://backendlive-hpko.onrender.com');
// console.log(socket)

const App = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    socket.on('locationUpdate', (data) => {
      setLocations((prevLocations) => {
        const index = prevLocations.findIndex((location) => location.id === data.id);
        if (index !== -1) {
          const newLocations = [...prevLocations];
          newLocations[index] = data;
          console.log('admin view location',newLocations)
          return newLocations;
        } else {
          return [...prevLocations, data];
        }
      });
    });

    return () => {
      socket.off('locationUpdate');
    };
  }, []);

  return (
    <div>
      <h1>Delivery Boys Locations</h1>
      <MapComponent locations={locations} />
    </div>
  );
};

export default App;
