import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Please provide API key");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const schema = {
  description: "List of 50 hybrid animals",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: { type: SchemaType.STRING, description: "Unique ID (e.g., hybrid_01)" },
      name: { type: SchemaType.STRING, description: "Funny scientific name (e.g., Lionguindile)" },
      components: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING, description: "Animal ID from: lion, penguin, crocodile, elephant, zebra, monkey, tiger, giraffe, hippo, parrot" },
        minItems: 3,
        maxItems: 3
      },
      imagePrompt: { type: SchemaType.STRING, description: "Detailed prompt for Nano Banana to generate a cute 3D render hybrid" },
      hotspots: {
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                id: { type: SchemaType.STRING },
                x: { type: SchemaType.STRING, description: "percentage string like 30%" },
                y: { type: SchemaType.STRING, description: "percentage string like 20%" },
                note: { type: SchemaType.STRING, description: "Scientist observation hint" }
            },
            required: ["id", "x", "y", "note"]
        }
      },
      fact: { type: SchemaType.STRING, description: "Fun fact about the hybrid or one of its parts" }
    },
    required: ["id", "name", "components", "imagePrompt", "hotspots", "fact"]
  }
};

async function generateMetadata() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `Generate a JSON dataset of 40 unique "glitched" hybrid animals for a kids' game.
  Each hybrid MUST consist of exactly 3 DISTINCT animals from this pool: 
  [lion, penguin, crocodile, elephant, zebra, monkey, tiger, giraffe, hippo, parrot].
  
  The 'imagePrompt' should be descriptive for an AI image generator (cute, 3d render, vibrant, cyber-jungle background).
  Include 3 hotspots per hybrid that give clues about the body parts.
  Make them funny and diverse. Start IDs from hybrid_11.`;

  console.log("Generating metadata for hybrids...");
  
  try {
    const result = await model.generateContent(prompt);
    const newData = JSON.parse(result.response.text());
    
    newData.forEach((item: any) => {
        item.components = item.components.map((c: string) => c.toLowerCase());
    });

    const outputPath = path.resolve('src/store/hybridsData.json');
    let existingData: any[] = [];
    if (fs.existsSync(outputPath)) {
        existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }
    
    let maxId = 10;
    newData.forEach((item: any, index: number) => {
        item.id = `hybrid_${maxId + index + 1}`;
    });

    const finalData = [...existingData, ...newData];
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
    console.log(`Saved ${finalData.length} hybrids to ${outputPath}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

generateMetadata();
