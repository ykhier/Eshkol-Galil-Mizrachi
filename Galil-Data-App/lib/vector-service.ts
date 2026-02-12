import {GoogleGenerativeAI, type EmbedContentRequest} from "@google/generative-ai";
import {PrismaClient} from "@/lib/generated/prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embedModel = genAI.getGenerativeModel({model: "gemini-embedding-001"});
const EMBEDDING_DIMENSION = 768;

export async function createAndSaveEmbedding(
  prisma: PrismaClient,
  tableName: string, // Changed to string for flexibility
  item: any
) {
  let description = "";

  if (tableName === "AuthorityGeneralInfo") {
    description = `
      Official Name: ${item.name}. 
      Authority Symbol: ${item.symbol}. 
      District: ${item.district}. 
      Municipal Status: ${item.municipalStatus}. 
      Distance from Tel Aviv: ${item.distanceFromTelAviv} km. 
      Established Year: ${item.establishedYear}. 
      Coastal Status: ${item.coastalStatus ? "Located on the coast" : "Inland"}. 
      Council Members: ${item.councilMembersCount}. 
      Planning Committee: ${item.planningCommitteeName} (ID: ${item.planningCommitteeId}). 
      Total Area: ${item.area} square kilometers.
    `.trim();
  } else if (tableName === "AuthorityDemographics") {
    description = `
      Demographic Profile for: ${item.name} (Symbol: ${item.symbol}). 
      Total Population: ${item.totalPopulation}. 
      Population Density: ${item.density} people per sq km. 
      Total Israeli Citizens: ${item.totalIsraelis}. 
      Gender Distribution: ${item.men} men and ${item.women} women. 
      Religion and Ethnicity: 
      Jews and Others: ${item.jewsAndOthersPercent}%, 
      Jewish: ${item.jewsPercent}%, 
      Arab: ${item.arabsPercent}%, 
      Muslim: ${item.muslimsPercent}%, 
      Christian: ${item.christiansPercent}%, 
      Druze: ${item.druzePercent}%. 
      Age Breakdown: 
      Ages 0-4: ${item.age_0_4}%, 
      Ages 5-9: ${item.age_5_9}%, 
      Ages 10-14: ${item.age_10_14}%, 
      Ages 15-19: ${item.age_15_19}%, 
      Minors 0-17: ${item.age_0_17}%, 
      Ages 20-29: ${item.age_20_29}%, 
      Ages 30-44: ${item.age_30_44}%, 
      Ages 45-59: ${item.age_45_59}%, 
      Ages 60-64: ${item.age_60_64}%, 
      Seniors 65+: ${item.age_65_plus}%, 
      Seniors 75+: ${item.age_75_plus}%.
    `.trim();
  } else if (tableName === "population_data") {
    description = `
      Population Data for: ${item.authority}. 
      Year: ${item.year}. 
      Population: ${item.population}.
    `.trim();
  } else {
    // Fallback for future tables
    console.warn(`⚠️ Table ${tableName} is not yet configured for custom descriptions.`);
    return null;
  }

  // Generate Vector
  const result = await embedModel.embedContent({
    content: {parts: [{text: description}], role: "user"},
    taskType: "RETRIEVAL_DOCUMENT",
    outputDimensionality: EMBEDDING_DIMENSION,
  } as unknown as EmbedContentRequest);
  const vector = result.embedding.values;
  const vectorString = `[${vector.join(",")}]`;

  // Save to DB
  const idField = tableName === "population_data" ? "id" : "symbol";
  await prisma.$executeRawUnsafe(
    `UPDATE "${tableName}" SET embedding = $1::vector WHERE ${idField} = $2`,
    vectorString,
    tableName === "population_data" ? item.id : item.symbol
  );

  return vector;
}
