import axios from 'axios';


// Define base URLs for API endpoints
//const API_URL = 'http://localhost:8080/api/authentication';
const API_URL = 'https://793c-49-47-141-180.ngrok-free.app/api/authentication';
const RELAYLOG_URL = 'https://793c-49-47-141-180.ngrok-free.app/api/s/relay/log';
const SENSOR_URL = 'https://793c-49-47-141-180.ngrok-free.app/api/s/sensors';
const STATE_URL = 'https://793c-49-47-141-180.ngrok-free.app/api/s/relay/toggle';

// Create an axios instance for each base URL
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

const relayLogClient = axios.create({
  baseURL: RELAYLOG_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

const sensorClient = axios.create({
  baseURL: SENSOR_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
});

const stateClient = axios.create({
  baseURL: STATE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('sessiontoken');
};

// Add token to headers for authenticated requests
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Apply interceptors to all clients
[authClient, relayLogClient, sensorClient, stateClient].forEach(addAuthInterceptor);

// API Calls
export const login = async (username, password) => {
  try {
    const response = await authClient.post('/login', { username, password });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const fetchSensorData = async () => {
  try {
    const response = await sensorClient.get('');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
};

export const fetchRelayLog = async () => {
  try {
    const response = await relayLogClient.get('');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching relay log:', error);
    throw error;
  }
};

export const updateRelayState = async (relayId, currentState) => {
  //const newState = currentState === 0 ? 1 : 0;
  try {
    const response = await stateClient.post('', { relayId: 1, state: currentState });
    console.log(response.data.state);
    return response.data.state;

  } catch (error) {
    console.error('Error updating relay state:', error);
    throw error;
  }
};

export default { authClient, relayLogClient, sensorClient, stateClient };