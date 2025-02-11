
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_URL;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Generate a unique Avengers-themed fake superhero. Each response must be completely different from the previous ones.
    Ensure the following:
    - A creative and unique superhero name that has never been used before.
    - Do NOT include the hero's name in the aboutStory.
    - The origin story must be between 50 and 70 words.
    - Use a mix of cosmic, magical, mutant, or technological themes.
    - Format the response as JSON:
    {
      "fakeName": "Generated Name",
      "aboutStory": "Generated Story"
    }
    Ensure randomness in every request, introducing unexpected origins (e.g., celestial events, ancient artifacts, lost experiments, mythical influences).
    `;
    
    
    const result = await model.generateContent(prompt);
    const output = result.response.text();
    
    let data;
    // Attempt to extract the JSON substring from the output:
    const startIndex = output.indexOf("{");
    const endIndex = output.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonStr = output.slice(startIndex, endIndex + 1);
      try {
        data = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("Error parsing JSON substring:", parseError);
        data = {
          fakeName: "Unknown Hero",
          aboutStory: output,
        };
      }
    } else {
      data = {
        fakeName: "Unknown Hero",
        aboutStory: output,
      };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating hero:", error);
    return NextResponse.json({ error: "Failed to generate hero" }, { status: 500 });
  }
}
