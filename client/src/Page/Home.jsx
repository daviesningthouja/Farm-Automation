// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Navbar from '../Component/Navbar';
import Button from '../Component/Button';
import Weather from '../Component/Weather';
import { fetchSensorData, updateRelayState, fetchRelayLog } from '../utility/ApiCall';

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  const chartRef = useRef(null); // Ref to store chart instance
  const [sensorData, setSensorData] = useState([]);
  const [relayLog, setRelayLog] = useState([]);
  const [relayState, setRelayState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const sensorDataResult = await fetchSensorData();
        setSensorData(sensorDataResult)
        //setSensorData(Array.isArray(sensorDataResult) ? sensorDataResult : []);
        const relayLogResult = await fetchRelayLog();
        //setRelayLog(Array.isArray(relayLogResult) ? relayLogResult : []);
        setRelayLog(relayLogResult)
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Check backend connection.');
        setSensorData([]);
        setRelayLog([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
    return () => {
      clearInterval(interval);
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy chart on unmount
      }
    };
  }, []);

  // const handleToggleRelay = async () => {
  //   try {
  //     const newState = await updateRelayState(relayState);
  //     setRelayState(newState);
  //     console.log(newState);
  //     const relayLogResult = await fetchRelayLog();
  //     setRelayLog(Array.isArray(relayLogResult) ? relayLogResult : []);
  //   } catch (error) {
  //     console.error('Failed to toggle relay:', error);
  //   }
  // };
  const handleToggleRelay = async () => {
    try {
      const currentState = relayState; // Capture current state
      const newState = currentState === 0 ? 1 : 0; // Toggle state
      console.log('Toggling relay from', currentState, 'to', newState);

      // Send request to backend
      const response = await updateRelayState(1,newState); // Pass newState directly
      console.log('Backend response:', response);

      // Update state with the new value from the response or the toggled value
      setRelayState(response); // Use response from backend if it returns the state
      console.log('Updated relayState:', relayState); // Log after state update (note: this might show old state due to async)

      // Refresh relay log
      const relayLogResult = await fetchRelayLog();
      setRelayLog(Array.isArray(relayLogResult) ? relayLogResult : []);
    } catch (error) {
      console.error('Failed to toggle relay:', error);
      setError('Failed to toggle relay. Check backend connection.');
    }
  };

  // Prepare data for Chart.js with two senders
  const chartData = {
    labels: sensorData.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature Sender 1 (°C)',
        data: sensorData.filter(entry => entry.id === 1).map(entry => entry.temp),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Soil Moisture Sender 1 (%)',
        data: sensorData.filter(entry => entry.id === 1).map(entry => entry.soil),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
      {
        label: 'Temperature Sender 2 (°C)',
        data: sensorData.filter(entry => entry.id === 2).map(entry => entry.temp),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Soil Moisture Sender 2 (%)',
        data: sensorData.filter(entry => entry.id === 2).map(entry => entry.soil),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' }, beginAtZero: true },
    },
    maintainAspectRatio: false, // Allow custom sizing
  };

  return (
    <div className="home">
      <Navbar />
      <div className="main">
        <div className="box-1">
          <div>
            <h3>Latest Sensor Data</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : sensorData.length > 0 ? (
              <>
                <h4>Sender 1 (ID: 1)</h4>
                <p>Temperature: {sensorData.find(entry => entry.id === 1)?.temp || 'N/A'}°C</p>
                <p>Soil Moisture: {sensorData.find(entry => entry.id === 1)?.soil || 'N/A'}%</p>
                <h4>Sender 2 (ID: 2)</h4>
                <p>Temperature: {sensorData.find(entry => entry.id === 2)?.temp || 'N/A'}°C</p>
                <p>Soil Moisture: {sensorData.find(entry => entry.id === 2)?.soil || 'N/A'}%</p>
              </>
            ) : (
              <p>No sensor data available.</p>
            )}
          </div>
          <div>
            <h3>Relay Control</h3>
            <button onClick={handleToggleRelay}>Toggle Relay ({relayState ? 'On' : 'Off'})</button>
          </div>
          <div>
            <h3>Relay Log</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : Array.isArray(relayLog) && relayLog.length > 0 ? (
              <ul>
                {relayLog.map((log, index) => (
                  <li key={index}>
                    Relay set to {log.state ? 'ON' : 'OFF'} at {new Date(log.timestamp).toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No relay log available.</p>
            )}
          </div>
        </div>
        <div className="box-2">
          <h3>Time-Series Data</h3>
          <div style={{ width: '800px', height: '400px' }}>
            <Line
              ref={chartRef}
              data={chartData}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;