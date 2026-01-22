import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Get API key from command line args
const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Please provide API key as argument");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateImage() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    
    const prompt = "A playful, cartoon-style hybrid animal that is a mix of a Lion, Penguin, and Crocodile. It has a Lion's mane and head, a Penguin's round tuxedo body, and a green scaly Crocodile tail. It is standing in a neon cyber-jungle environment. Bright colors, 3d render style, cute, kid-friendly.";

    console.log("Generating image with prompt:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log("Response candidates:", JSON.stringify(response.candidates, null, 2));

    if (response.candidates && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            const outputPath = path.resolve('src/assets/hybrid-animal.png');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Image saved to ${outputPath}`);
            return;
         }
       }
    }
    
    console.log("No image found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
  }
}

generateImage();
