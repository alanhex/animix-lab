import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Get API key from command line args
const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Please provide API key");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const hybrids = JSON.parse(fs.readFileSync('src/store/hybridsData.json', 'utf-8'));

async function generateImageForHybrid(hybrid: any, index: number) {
  try {
    const outputPath = path.resolve(`src/assets/${hybrid.id}.png`);
    if (fs.existsSync(outputPath)) {
        console.log(`[${index + 1}/${hybrids.length}] Skipping ${hybrid.name} (exists)`);
        return;
    }

    console.log(`[${index + 1}/${hybrids.length}] Generating ${hybrid.name}...`);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    const result = await model.generateContent(hybrid.imagePrompt);
    const response = await result.response;

    if (response.candidates && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            const outputPath = path.resolve(`src/assets/${hybrid.id}.png`);
            fs.writeFileSync(outputPath, buffer);
            console.log(`Saved: ${outputPath}`);
            return;
         }
       }
    }
    
    console.error(`Failed to generate image for ${hybrid.name} (No image data found)`);

  } catch (error) {
    console.error(`Error generating ${hybrid.name}:`, error);
  }
}

async function batchGenerate() {
    for (let i = 0; i < hybrids.length; i++) {
        await generateImageForHybrid(hybrids[i], i);
        await new Promise(r => setTimeout(r, 2000));
    }
}

batchGenerate();
