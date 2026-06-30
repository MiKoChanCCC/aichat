import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { IKImage } from "imagekitio-react";
import React from "react";
import { Fragment } from "react";

const ChaPage = () => {
  // 获取params参数  :id
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });

  return (
    <div className="chaPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
              ? "发生错误"
              : data?.history.map((message, index) => {
                  return (
                    <Fragment key={index}>
                      {message.img && (
                        <IKImage
                          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                          path={message.img}
                          height="300"
                          width="400"
                          transformation={[{ height: 300, width: 400 }]}
                          loading="lazy"
                          lqip={{ active: true, quality: 20 }}
                        />
                      )}
                      <div
                        className={
                          message.role === "user" ? "message user" : "message"
                        }
                        key={index}
                      >
                        <Markdown>{message.parts[0].text}</Markdown>
                      </div>
                    </Fragment>
                  );
                })}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChaPage;
