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
  description: "List of brainrot names",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING },
      brainrotName: { type: SchemaType.STRING, description: "Gen Z/Alpha slang name (e.g. Skibidi Lion, Rizzler Penguin, Ohio Croc, Sigma Elephant)" },
    },
    required: ["id", "brainrotName"]
  }
};

async function applyBrainrot() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const sourceList = hybrids.map((h: any) => ({
      id: h.id,
      oldName: h.name,
      components: h.components
  }));

  const prompt = `Rename these hybrid animals using "brainrot" Gen Alpha slang.
  Use terms like: Skibidi, Rizzler, Ohio, Sigma, Fanum Tax, Gyatt (careful), Mewing, Grimace, Kai Cenat, Livvy Dunne, Baby Gronk, Glazing, Cooked, W, L, Ratio, Mogging.
  
  Make them funny and chaotic.
  Example: "Liozephant" -> "Sigma Lion Tax" or "Skibidi Trunk Rizzler".
  
  Data: ${JSON.stringify(sourceList)}`;

  console.log("Generating brainrot names...");
  
  try {
    const result = await model.generateContent(prompt);
    const newNames = JSON.parse(result.response.text());
    
    const updatedHybrids = hybrids.map((h: any) => {
        const match = newNames.find((n: any) => n.id === h.id);
        return match ? { ...h, name: match.brainrotName } : h;
    });
    
    fs.writeFileSync('src/store/hybridsData.json', JSON.stringify(updatedHybrids, null, 2));
    console.log("Updated hybridsData.json with brainrot names.");

    const frPath = 'src/store/hybridsData_fr.json';
    if (fs.existsSync(frPath)) {
        const hybridsFr = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
        const updatedFr = hybridsFr.map((h: any) => {
            const match = newNames.find((n: any) => n.id === h.id);
            return match ? { ...h, name: match.brainrotName } : h;
        });
        fs.writeFileSync(frPath, JSON.stringify(updatedFr, null, 2));
        console.log("Updated hybridsData_fr.json with brainrot names.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

applyBrainrot();
