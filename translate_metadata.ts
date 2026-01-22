import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Please provide API key");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const hybrids = JSON.parse(fs.readFileSync('src/store/hybridsData.json', 'utf-8'));

const schema = {
  description: "List of translated hybrids",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING },
      name: { type: SchemaType.STRING, description: "French name (e.g. Liozèbrephant)" },
      hotspots: {
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                id: { type: SchemaType.STRING },
                note: { type: SchemaType.STRING, description: "Translated note in French" }
            },
            required: ["id", "note"]
        }
      },
      fact: { type: SchemaType.STRING, description: "Translated fun fact in French" }
    },
    required: ["id", "name", "hotspots", "fact"]
  }
};

async function translateMetadata() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const sourceText = JSON.stringify(hybrids.map((h: any) => ({
      id: h.id,
      name: h.name,
      hotspots: h.hotspots,
      fact: h.fact
  })));

  const prompt = `Translate the following JSON data to French for a kids' game.
  Keep the 'id' exact.
  Translate 'name' creatively to sound like a hybrid animal in French.
  Translate 'note' and 'fact' to be fun and kid-friendly in French.
  
  Data: ${sourceText}`;

  console.log("Translating metadata to French...");
  
  try {
    const result = await model.generateContent(prompt);
    const translatedData = JSON.parse(result.response.text());
    
    const outputPath = path.resolve('src/store/hybridsData_fr.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
    console.log(`Saved translations to ${outputPath}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

translateMetadata();
