import express, { text } from "express";
import ImageKit from "imagekit";
import cors from "cors";
import OpenAI from "openai";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text, answer } = req.body;
  let title = "";
  if (text.length > 15) {
    title = text.slice(0, 15) + "...";
  } else {
    title = text;
  }

  try {
    // 创建一个新的chat
    const newChat = new Chat({
      userId: userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
        ...(answer
          ? [{ role: "assistant", parts: [{ text: answer }] }]
          : []),
      ],
    });
    const savedChat = await newChat.save();

    // 检查该聊天id是否存在
    const userChats = await UserChats.find({ userId: userId });
    // 如果不存在，则创建一个新的userChats,并将该聊天信息添加到userChats数组中
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: title,
          },
        ],
      });

      await newUserChats.save();
    } else {
      // 如果存在，则将聊天信息推到userChats数组中
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              $each: [
                {
                  _id: savedChat._id,
                  title: title,
                },
              ],
              $position: 0,
            },
          },
        },
      );
    }

    res.status(201).send(newChat._id);
  } catch (error) {
    console.log(error);
    res.status(500).send("创建chat发生错误");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId: userId });

    if (userChats.length === 0) {
      return res.status(200).send([]);
    }
    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("获取userChats失败");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });

    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("获取chat失败");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { prompt, img, answer } = req.body;

  const newItem = [
    ...(prompt
      ? [{ role: "user", parts: [{ text: prompt }], ...(img && { img }) }]
      : []),
    { role: "assistant", parts: [{ text: answer }] },
  ];

  try {
    const updateChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItem,
          },
        },
      },
    );

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("添加对话错误");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("未认证身份");
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});
