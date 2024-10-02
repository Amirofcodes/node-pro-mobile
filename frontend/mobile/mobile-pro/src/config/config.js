import { Platform } from "react-native";
import env from './env';

const PROD_API_BASE_URL = "https://your-production-api-url.com/api";
const DEV_API_BASE_URL = Platform.select({
  ios: "http://localhost:3000/api",
  android: "http://10.0.2.2:3000/api",
  web: "http://localhost:3000/api",
});

// If you're testing on a physical device, replace 'localhost' with your computer's local IP address
const LOCAL_MACHINE_IP = "192.168.1.59"; // Replace with your actual IP
const PHYSICAL_DEVICE_API_BASE_URL = `http://${LOCAL_MACHINE_IP}:3000/api`;

const config = {
  API_BASE_URL: __DEV__
    ? Platform.OS === "web"
      ? DEV_API_BASE_URL
      : PHYSICAL_DEVICE_API_BASE_URL
    : PROD_API_BASE_URL,
  WS_URL: __DEV__
    ? Platform.OS === "web"
      ? "ws://localhost:3000"
      : `ws://${LOCAL_MACHINE_IP}:3000`
    : "wss://your-production-ws-url.com",
  DEBUG_MODE: __DEV__,
  OPENAI_API_KEY: env.OPENAI_API_KEY,
  OLLAMA_BASE_URL: __DEV__
    ? Platform.OS === 'android'
      ? 'http://10.0.2.2:11434'
      : `http://${LOCAL_MACHINE_IP}:11434`
    : 'http://your-production-ollama-url.com',
};

export default config;