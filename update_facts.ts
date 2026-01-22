import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Please provide API key");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const hybridsPath = 'src/store/hybridsData.json';
const hybridsFrPath = 'src/store/hybridsData_fr.json';

const hybrids = JSON.parse(fs.readFileSync(hybridsPath, 'utf-8'));
let hybridsFr = [];
if (fs.existsSync(hybridsFrPath)) {
    hybridsFr = JSON.parse(fs.readFileSync(hybridsFrPath, 'utf-8'));
}

const schema = {
  description: "List of real animal facts",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING },
      factEn: { type: SchemaType.STRING, description: "Real scientific fact in English about one of the component animals" },
      factFr: { type: SchemaType.STRING, description: "Real scientific fact in French about one of the component animals" },
    },
    required: ["id", "factEn", "factFr"]
  }
};

async function updateFacts() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const sourceList = hybrids.map((h: any) => ({
      id: h.id,
      components: h.components
  }));

  const chunkSize = 20;
  let allUpdates: any[] = [];

  for (let i = 0; i < sourceList.length; i += chunkSize) {
      const chunk = sourceList.slice(i, i + chunkSize);
      
      const prompt = `For each hybrid, look at its 'components' (list of real animals).
      Generate a TRUE, REAL scientific fact about ONE of those animals.
      Do NOT invent fake facts about the hybrid.
      Provide the fact in English (factEn) and French (factFr).
      Keep it kid-friendly but educational.
      
      Data: ${JSON.stringify(chunk)}`;

      console.log(`Generating real facts for items ${i + 1} to ${Math.min(i + chunkSize, sourceList.length)}...`);
      
      try {
        const result = await model.generateContent(prompt);
        const chunkUpdates = JSON.parse(result.response.text());
        allUpdates = [...allUpdates, ...chunkUpdates];
      } catch (error) {
        console.error("Error generating chunk:", error);
      }
  }

  const updatedHybrids = hybrids.map((h: any) => {
      const match = allUpdates.find((u: any) => u.id === h.id);
      return match ? { ...h, fact: match.factEn } : h;
  });
  
  fs.writeFileSync(hybridsPath, JSON.stringify(updatedHybrids, null, 2));
  console.log("Updated hybridsData.json with real facts.");

  if (hybridsFr.length > 0) {
      const updatedHybridsFr = hybridsFr.map((h: any) => {
          const match = allUpdates.find((u: any) => u.id === h.id);
          return match ? { ...h, fact: match.factFr } : h;
      });
      fs.writeFileSync(hybridsFrPath, JSON.stringify(updatedHybridsFr, null, 2));
      console.log("Updated hybridsData_fr.json with real facts.");
  }
}

updateFacts();
