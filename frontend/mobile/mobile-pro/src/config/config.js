import { Platform } from 'react-native';

const PROD_API_BASE_URL = 'http://your-production-api-url.com/api';
const DEV_API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
});

// If you're testing on a physical device, replace 'localhost' with your computer's local IP address
const LOCAL_MACHINE_IP = '192.168.1.16'; // Replace with your actual IP
const PHYSICAL_DEVICE_API_BASE_URL = `http://${LOCAL_MACHINE_IP}:3000/api`;

const config = {
  API_BASE_URL: __DEV__ 
    ? (Platform.OS === 'web' 
        ? DEV_API_BASE_URL 
        : PHYSICAL_DEVICE_API_BASE_URL)
    : PROD_API_BASE_URL,
  WS_URL: __DEV__
    ? (Platform.OS === 'web'
        ? 'ws://localhost:3000'
        : `ws://${LOCAL_MACHINE_IP}:3000`)
    : 'wss://your-production-ws-url.com',
  DEBUG_MODE: __DEV__,
};

export default config;