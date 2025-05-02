import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ProblemRequest {
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "array" | "string";
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { difficulty, type } = (await request.json()) as ProblemRequest;

    // Generate prompt
    const prompt = generatePrompt(type, difficulty);

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Clean up the response text to handle markdown formatting
      const cleanedText = cleanJsonResponse(text);
      const problemData = JSON.parse(cleanedText);
      return NextResponse.json({ problem: problemData });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw response:", text);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Cleans up the JSON response from Gemini AI by removing markdown code blocks
 */
function cleanJsonResponse(text: string): string {
  // Remove markdown code block markers
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*$/g, "");

  // Sometimes the AI might include other text before or after the JSON
  const jsonStartIndex = cleaned.indexOf("{");
  const jsonEndIndex = cleaned.lastIndexOf("}");

  if (jsonStartIndex >= 0 && jsonEndIndex >= 0) {
    cleaned = cleaned.substring(jsonStartIndex, jsonEndIndex + 1);
  }

  return cleaned;
}

function generatePrompt(
  type: ProblemRequest["type"],
  difficulty: ProblemRequest["difficulty"]
): string {
  const difficultyDescriptions = {
    beginner:
      "very simple, suitable for beginners with basic programming knowledge",
    intermediate:
      "moderate difficulty requiring good understanding of algorithms",
    advanced: "challenging problem requiring advanced algorithmic knowledge",
  } as const;

  const typeDescriptions = {
    array: "array manipulation",
    string: "string manipulation",
  } as const;

  return `Generate a ${difficultyDescriptions[difficulty]} coding problem about ${typeDescriptions[type]}. 
  
  Important: Return ONLY a JSON object without any markdown formatting or code blocks.
  
  The JSON object should have this structure:
  {
    "title": "Problem title",
    "description": "Detailed problem description",
    "example": "Example input",
    "expectedOutput": "Expected output for the example",
    "explanation": "Simple explanation of what needs to be solved in very simple language"
  }
  
  Make sure the explanation is concise and in simple language that a ${difficulty} programmer would understand.
  For the example and expected output, provide clear and relevant examples that demonstrate the problem.`;
}
