import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import OpenAI from "openai";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("成功连接到Mongo DB");
  } catch (error) {
    console.log(error);
  }
};

// 注册express中间件解析json请求体
app.use(express.json({ limit: "50mb" }));

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
    const stream = await client.chat.completions.create({
      model: "doubao-seed-2-1-pro-260628",
      stream: true,
      messages,
    });

    // SSE流式传输
    // 告诉浏览器这不是普通JSON，而是事件流，不要一次性接收，要持续读取
    res.setHeader("Content-Type", "text/event-stream");

    // 禁止缓存，每次都要实时获取最新数据
    res.setHeader("Cache-Control", "no-cache");

    // 保持连接不断开，数据会持续推送
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      // delta.content为这次新生成的文字
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        // 按SSE格式写入：data: {...}\n\n
        // \n\n是SSE协议要求的分隔符，表示一条消息结束
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // 发送结束标记，告诉客户端流式传输完成
    res.write("data: [DONE]\n\n");

    // 关闭连接
    res.end();

    // 不使用SSE流式传输
    // res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});
