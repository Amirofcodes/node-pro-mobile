import axios from 'axios';
import config from '../config/config';

const OLLAMA_API_URL = `${config.OLLAMA_BASE_URL}/api/generate`;

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 300000; // 5 minutes
const MAX_TIMEOUT = 900000; // 15 minutes

const ollamaAxios = axios.create({
  timeout: INITIAL_TIMEOUT,
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const processOllamaResponse = async (imageUri) => {
  let retries = 0;
  let currentTimeout = INITIAL_TIMEOUT;

  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retries + 1}: Sending request to Ollama API with timeout ${currentTimeout}ms...`);
      const startTime = Date.now();
      
      const base64Image = await getBase64FromUri(imageUri);

      const prompt = "Analyze this image and provide the following information about the article: 1. Name 2. A unique article code starting with OLL- followed by 6 alphanumeric characters 3. A brief description 4. An estimated price (as an integer) 5. An estimated quantity (as an integer). Format your response as a JSON object with the following keys: name, description, price, quantity, code.";

      const response = await ollamaAxios.post(OLLAMA_API_URL, {
        model: "llava",
        prompt: prompt,
        images: [base64Image],
        stream: false
      }, {
        timeout: currentTimeout
      });

      const endTime = Date.now();
      console.log(`Ollama API responded in ${endTime - startTime}ms`);
      console.log("Full Ollama API response:", JSON.stringify(response.data, null, 2));

      let ollamaResponse;
      const content = response.data.response;

      console.log("Ollama generated content:", content);

      try {
        ollamaResponse = JSON.parse(content);
        console.log("Parsed Ollama response:", ollamaResponse);
      } catch (parseError) {
        console.log("Failed to parse JSON, using raw text response");
        ollamaResponse = extractInfoFromText(content);
        console.log("Extracted info from text:", ollamaResponse);
      }

      if (
        !ollamaResponse.code ||
        !ollamaResponse.code.startsWith("OLL-") ||
        ollamaResponse.code.length !== 10
      ) {
        ollamaResponse.code =
          "OLL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log("Generated new code:", ollamaResponse.code);
      }

      return ollamaResponse;
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error.message);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        retries++;
        if (retries < MAX_RETRIES) {
          console.log(`Retrying in 5 seconds...`);
          await wait(5000);
          currentTimeout = Math.min(currentTimeout * 2, MAX_TIMEOUT);
        } else {
          console.error("Max retries reached. Giving up.");
          throw new Error("Failed to get a response from Ollama after multiple attempts.");
        }
      } else {
        throw error;
      }
    }
  }
};

const getBase64FromUri = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

const extractInfoFromText = (text) => {
  const result = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    code: "",
  };

  const lines = text.split("\n");
  lines.forEach((line) => {
    if (line.toLowerCase().includes('"name":')) {
      result.name = line.split(":")[1].trim().replace(/[",]/g, "");
    } else if (line.toLowerCase().includes('"description":')) {
      result.description = line.split(":")[1].trim().replace(/[",]/g, "");
    } else if (line.toLowerCase().includes('"price":')) {
      result.price = parseInt(line.split(":")[1].trim()) || 0;
    } else if (line.toLowerCase().includes('"quantity":')) {
      result.quantity = parseInt(line.split(":")[1].trim()) || 0;
    } else if (line.toLowerCase().includes('"code":')) {
      result.code = line.split(":")[1].trim().replace(/[",]/g, "");
    }
  });

  return result;
};