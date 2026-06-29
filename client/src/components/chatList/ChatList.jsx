import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const ChatList = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="">创建一个新的聊天</Link>
      <Link to="">退出</Link>
      <Link to="">联系人</Link>
      <hr />
      <span className="title">React Chat</span>
      <div className="links">
        {isPending
          ? "Loading"
          : error
            ? "出现错误"
            : data?.map((chat) => {
                return (
                  <Link to={`/chats/${chat._id}`} key={chat._id}>
                    {chat.title}
                  </Link>
                );
              })}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>升级到Pro版</span>
          <span>可无限制使用全部功能</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
