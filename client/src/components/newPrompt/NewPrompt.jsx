import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import completionsFetch from "../../lib/openai";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
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
    // {
    //   role: "system",
    //   content: "你是一个有用的AI聊天助手",
    // },
  ]);

  const endRef = useRef(null);
  const fromRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, prompt, answer, img.dbData]);

  const pdRef = useRef(false);
  // 从Dashboard跳转过来时，自动为第一条消息生成AI回答
  useEffect(() => {
    if (
      data?.history?.length === 1 &&
      data.history[0].role === "user" &&
      !pdRef.current
    ) {
      const userText = data.history[0].parts[0].text;
      // 不设置prompt，因为ChatPage已经从data.history渲染了用户消息
      add([{ role: "user", content: userText }]);
      pdRef.current = true;
    }
  }, []);

  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: prompt.length ? prompt : undefined,
            answer: answer,
            img: img.dbData?.filePath || undefined,
          }),
        },
      );
      return res.text();
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          setPrompt("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: "",
          });
        });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 使用openai.js 流式传输

  const add = async (newMessages) => {
    setAnswer("");

    try {
      const fullAnswer = await completionsFetch(newMessages, (chunk) => {
        setAnswer(chunk);
      });
      setMessages([...newMessages, { role: "assistant", content: fullAnswer }]);

      mutation.mutate();
    } catch (error) {}
  };

  // 提交表单回调
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    fromRef.current.reset();
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
      <form className="newForm" onSubmit={handleSubmit} ref={fromRef}>
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
