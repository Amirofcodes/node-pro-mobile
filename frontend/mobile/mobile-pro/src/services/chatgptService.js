import axios from "axios";
import config from "../config/config";
import * as FileSystem from "expo-file-system";

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";

export const processChatGPTResponse = async (imageUri) => {
  try {
    console.log('API Key being used:', config.OPENAI_API_KEY);
    
    // Convert the image to base64
    const base64Image = await getBase64FromUri(imageUri);

    const prompt = `Analyze this image and provide the following information about the article:
    1. Name
    2. A unique article code starting with GPT- followed by 6 alphanumeric characters
    3. A brief description
    4. An estimated price (as an integer)
    5. An estimated quantity (as an integer)
    
    Format your response as a JSON object with the following keys: name, description, price, quantity, code.`;

    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        },
      }
    );

    console.log("Full ChatGPT response:", JSON.stringify(response.data, null, 2));
    console.log("ChatGPT content:", response.data.choices[0].message.content);

    let chatGPTResponse;
    const content = response.data.choices[0].message.content;

    try {
      chatGPTResponse = JSON.parse(content);
    } catch (parseError) {
      console.log("Failed to parse JSON, using raw text response");
      chatGPTResponse = extractInfoFromText(content);
    }

    console.log("Processed ChatGPT response:", chatGPTResponse);

    // Ensure the code starts with GPT- and has 6 alphanumeric characters
    if (
      !chatGPTResponse.code ||
      !chatGPTResponse.code.startsWith("GPT-") ||
      chatGPTResponse.code.length !== 10
    ) {
      chatGPTResponse.code =
        "GPT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    return chatGPTResponse;
  } catch (error) {
    console.error("Error processing ChatGPT response:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    throw error;
  }
};

const extractInfoFromText = (text) => {
  const result = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    code: ''
  };

  const lines = text.split('\n');
  lines.forEach(line => {
    if (line.toLowerCase().includes('"name":')) {
      result.name = line.split(':')[1].trim().replace(/[",]/g, '');
    } else if (line.toLowerCase().includes('"description":')) {
      result.description = line.split(':')[1].trim().replace(/[",]/g, '');
    } else if (line.toLowerCase().includes('"price":')) {
      result.price = parseInt(line.split(':')[1].trim()) || 0;
    } else if (line.toLowerCase().includes('"quantity":')) {
      result.quantity = parseInt(line.split(':')[1].trim()) || 0;
    } else if (line.toLowerCase().includes('"code":')) {
      result.code = line.split(':')[1].trim().replace(/[",]/g, '');
    }
  });

  return result;
};

const getBase64FromUri = async (uri) => {
  try {
    const content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return content;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};