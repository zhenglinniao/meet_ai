const OpenAI = require("openai").default;
const { config } = require("dotenv");

config();

const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/+$/, "");
const headers = {};

if (process.env.OPENAI_DEFAULT_HEADERS) {
  process.env.OPENAI_DEFAULT_HEADERS.split(";").forEach((pair) => {
    const [key, value] = pair.split("=").map((part) => part.trim());
    if (key && value) {
      headers[key] = value;
    }
  });
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for the test.");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: baseUrl,
    defaultHeaders: headers,
  });

  console.log("Testing OpenAI connectivity against", baseUrl);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: "Ping from local webhook testing tool. Respond with OK.",
      },
    ],
    temperature: 0,
  });

  console.log("Response:", completion.choices?.[0]?.message?.content ?? completion.status);
}

main().catch((error) => {
  console.error("OpenAI test failed:", error);
  process.exit(1);
});
