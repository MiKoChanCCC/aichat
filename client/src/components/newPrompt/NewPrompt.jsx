import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import completionsFetch from "../../lib/openai";

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
    endRef.current.scrollIntoView();
  }, []);

  // 使用openai.js
  const add = async (messages) => {
    const ans = await completionsFetch(messages);
    setAnswer(ans);
    console.log("ans:", ans);
  };

  // 提交表单回调
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    const newMessages = [...messages, { role: "user", content: text }];
    add(newMessages);
    setPrompt(text);
    setMessages(newMessages);
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
      {answer && <div className="message">{answer}</div>}
      {/* 底部div，用于页面自动跳转到底部 */}
      <div className="endChat" ref={endRef}></div>
      {/* prompt表单区 */}
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="给 LAMA AI 发送消息" />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
