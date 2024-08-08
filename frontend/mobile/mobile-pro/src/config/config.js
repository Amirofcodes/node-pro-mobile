import { Platform } from 'react-native';

const PROD_API_BASE_URL = 'https://your-production-api-url.com/api';
const DEV_API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
  web: 'http://localhost:3000/api',
});

// If you're testing on a physical device, replace 'localhost' with your computer's local IP address
const LOCAL_MACHINE_IP = '10.21.6.10'; // Replace with your actual IP
const PHYSICAL_DEVICE_API_BASE_URL = `http://${LOCAL_MACHINE_IP}:3000/api`;

const config = {
  API_BASE_URL: __DEV__
    ? Platform.OS === 'web'
      ? DEV_API_BASE_URL
      : PHYSICAL_DEVICE_API_BASE_URL
    : PROD_API_BASE_URL,
  WS_URL: __DEV__
    ? Platform.OS === 'web'
      ? 'ws://localhost:3000'
      : `ws://${LOCAL_MACHINE_IP}:3000`
    : 'wss://your-production-ws-url.com',
  DEBUG_MODE: __DEV__,
  OPENAI_API_KEY: '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', // Replace with your actual OpenAI API key
};

export default config;