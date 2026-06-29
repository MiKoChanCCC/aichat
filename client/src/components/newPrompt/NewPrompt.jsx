import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import completionsFetch from "../../lib/openai";
import Markdown from "react-markdown";

const NewPrompt = () => {
  // 提示词
  const [prompt, setPrompt] = useState("");
  // AI回答
  const [answer, setAnswer] = useState("");
  // 上传图片
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: "",
  });

  // openAI SDK的messages
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "你是一个有用的AI聊天助手",
    },
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [prompt, answer, img.dbData]);

  // 使用openai.js（流式打字机效果）
  const add = async (messages) => {
    setAnswer("");
    await completionsFetch(messages, (chunk) => {
      setAnswer(chunk);
    });
  };

  // 提交表单回调
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    let newMessages = [];
    if (!img.aiData) {
      newMessages = [...messages, { role: "user", content: text }];
    } else {
      newMessages = [
        ...messages,
        {
          role: "user",
          content: [
            { type: "text", text: text },
            {
              type: "image_url",
              image_url: {
                url: img.aiData,
              },
            },
          ],
        },
      ];
    }
    add(newMessages);
    setPrompt(text);
    setMessages(newMessages);
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
  };

  return (
    <>
      {/* 添加新的chat */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={380}
          transformation={[{ width: 300 }]}
          onLoad={() => endRef.current.scrollIntoView({ behavior: "smooth" })}
        />
      )}
      {prompt && <div className="user message">{prompt}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      {/* 底部div，用于页面自动跳转到底部 */}
      <div className="endChat" ref={endRef}></div>
      {/* prompt表单区 */}
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="给 LAMA AI 发送消息"
          autoComplete="off"
        />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
