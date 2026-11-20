require("dotenv").config();

const connectDB = require("./src/config/db");

const {
  retrieveRelevantMemories,
} = require("./src/services/memoryService");

async function main() {
  await connectDB();

  const memories = await retrieveRelevantMemories({
    userId: "user_001",
    query: "Mera naam kya hai?",
    topic: "personal_information",
    entities: ["Sonu"],
    limit: 5,
  });

  console.log("\n🧠 Retrieved Memories:\n");
  console.log(JSON.stringify(memories, null, 2));

  await require("mongoose").disconnect();
}

main().catch((error) => {
  console.error("Retrieval test failed:", error.message);
  process.exitCode = 1;
});