import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import OpenAI from "openai";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

// 注册express中间件解析json请求体
app.use(express.json());

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// openAI SDK
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-flash-260425",
      messages,
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server running on 3000");
});
