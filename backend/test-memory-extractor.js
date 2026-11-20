require("dotenv").config();

const connectDB = require("./src/config/db");

const {
  extractMemories,
} = require("./src/services/memoryExtractor");

async function main() {
  await connectDB();

  const result = await extractMemories({
    userId: "user_001",
    conversationId: "conv_test",
    userMessage:
      "Mera naam Sonu hai aur main SHRA Technology chalata hoon.",
  });

  console.log(JSON.stringify(result, null, 2));

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});