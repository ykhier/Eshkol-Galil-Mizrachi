import {prisma} from "./prisma";
import {GoogleGenerativeAI, type EmbedContentRequest} from "@google/generative-ai";
import {ChatMessage} from "@/types/chat";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const chatModel = genAI.getGenerativeModel({model: "gemini-2.5-flash-lite"});
const embedModel = genAI.getGenerativeModel({model: "gemini-embedding-001"});
const EMBEDDING_DIMENSION = 768;

export async function getAuthorityInfo(userMessage: string, history: ChatMessage[]) {
  try {
    // 2. NAME EXTRACTION (Focusing on the most important feature)
    const rawWords = userMessage.replace(/[?.,!]/g, "").split(/\s+/);
    const cleanSearchTerms = rawWords
      .map((word) => word.replace(/^[בלמהו]+/, ""))
      .filter((w) => w.length > 1);

    const finalSearchTerms = Array.from(new Set([...rawWords, ...cleanSearchTerms]));

    // 3. VECTORIZE (Using the global embedModel)
    const embeddingRes = await embedModel.embedContent({
      content: {parts: [{text: userMessage}], role: "user"},
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: EMBEDDING_DIMENSION,
    } as unknown as EmbedContentRequest);
    const vectorSql = `[${embeddingRes.embedding.values.join(",")}]`;

    // 4. HYBRID WEIGHTED QUERY
    const queryTemplate = (table: string) => `
      SELECT *,
        (CASE 
          WHEN name = ANY($2) THEN 100 
          WHEN name LIKE ANY(SELECT '%' || unnest($2::text[]) || '%') THEN 50
          ELSE 0 
        END) as name_score
      FROM "${table}"
      WHERE name = ANY($2) 
         OR name LIKE ANY(SELECT '%' || unnest($2::text[]) || '%')
         OR (embedding <=> $1::vector < 0.6)
      ORDER BY name_score DESC, (embedding <=> $1::vector) ASC
      LIMIT 10
    `;

    const [demoData, generalData] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        queryTemplate("AuthorityDemographics"),
        vectorSql,
        finalSearchTerms
      ),
      prisma.$queryRawUnsafe<any[]>(
        queryTemplate("AuthorityGeneralInfo"),
        vectorSql,
        finalSearchTerms
      ),
    ]);

    const foundNames = Array.from(new Set(demoData.map((d) => d.name)));
    const context = {
      demographics: demoData.map(({embedding, ...rest}) => rest),
      general: generalData.map(({embedding, ...rest}) => rest),
    };

    // 5. FINAL PROMPT
    const finalPrompt = `
You are the official data assistant for the Eastern Galilee Cluster.
DATABASE CONTEXT: ${JSON.stringify(context, null, 2)}

USER MESSAGE: "${userMessage}"

STRICT INSTRUCTIONS:
- Use the provided context to answer accurately.
- Priority City: ${foundNames.join(", ")}.
- Answer in Hebrew.
    `.trim();

    // 6. GENERATE (Using the global chatModel)
    const result = await chatModel.generateContent(finalPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Service Error:", error);
    return "מצטער, חלה שגיאה במשיכת הנתונים.";
  }
}
