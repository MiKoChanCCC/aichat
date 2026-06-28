import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: prompt,
    });
    res.json({ text: interaction.output_text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server running on 3000");
});
