import { Link } from "react-router-dom";
import "./chatList.css";

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="">创建一个新的聊天</Link>
      <Link to="">退出</Link>
      <Link to="">联系人</Link>
      <hr />
      <span className="title">React Chat</span>
      <div className="links">
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
        <Link to="">我的聊天标题</Link>
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
