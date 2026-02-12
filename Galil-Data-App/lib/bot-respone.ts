import {prisma} from "./prisma";
import {GoogleGenerativeAI, type EmbedContentRequest} from "@google/generative-ai";

// 1. Initialize Gemini Client once (Module Level)
// This is efficient and ensures the client is ready for all subsequent calls.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const EMBEDDING_DIMENSION = 768;

const BOT_CONFIG = {
  mission: `אתה העוזר הדיגיטלי הרשמי של "אשכול רשויות גליל מזרחי".`,
  persona: `טון הדיבור שלך מקצועי, שירותי, אדיב ומדויק.`,
  instructions: [
    "Use the attached data ONLY to answer questions about authorities.",
    "If information is missing, politely state that you don't have those specific details.",
    "For general greetings, reply warmly without database context.",
    "Format numbers clearly (e.g., 25,000).",
    "Keep responses concise unless asked for more detail.",
  ],
};

export async function getBotResponse(userMessage: string) {
  try {
    // 2. Initialize Models
    const embedModel = genAI.getGenerativeModel({model: "gemini-embedding-001"});
    const chatModel = genAI.getGenerativeModel({model: "gemini-2.5-flash-lite"});

    // --- STEP 1: VECTORIZE USER QUERY ---
    const embeddingRes = await embedModel.embedContent({
      content: {parts: [{text: userMessage}], role: "user"},
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: EMBEDDING_DIMENSION,
    } as unknown as EmbedContentRequest);
    const vectorSql = `[${embeddingRes.embedding.values.join(",")}]`;

    // --- STEP 2: OPTIMIZED SINGLE QUERY (JOIN) ---
    // We join the tables and explicitly exclude 'embedding' columns.
    // This reduces the data sent from the DB to your app and then to Gemini.
    const combinedData: any[] = await prisma.$queryRawUnsafe(
      `
      SELECT 
        g.id, g.name, g.symbol, g.district, g."municipalStatus", 
        g."establishedYear", g."distanceFromTelAviv", g.area,
        d."totalPopulation", d.density, d.men, d.women,
        d.age_0_4, d.age_5_9, d.age_10_14, d.age_15_19, 
        d.age_20_29, d.age_30_44, d.age_45_59, d.age_60_64, 
        d.age_65_plus, d."jewsPercent", d."arabsPercent"
      FROM "AuthorityGeneralInfo" g
      JOIN "AuthorityDemographics" d ON g.symbol = d.symbol
      ORDER BY g.embedding <=> $1::vector
      LIMIT 3
    `,
      vectorSql
    );

    // --- STEP 3: CONSTRUCT FINAL PROMPT ---
    const finalPrompt = `
${BOT_CONFIG.mission}
${BOT_CONFIG.persona}

Instructions:
${BOT_CONFIG.instructions.map((ins) => `- ${ins}`).join("\n")}

Authority Data (Context):
${JSON.stringify(combinedData, null, 2)}

User Question:
"${userMessage}"
    `.trim();

    // --- STEP 4: GENERATE AI RESPONSE ---
    const result = await chatModel.generateContent(finalPrompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Bot Response Error:", error.message);
    return "מצטער, חלה שגיאה בעיבוד המידע. אנא נסה שוב בעוד כמה רגעים.";
  }
}
