import "./dashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>LAMA AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt=" " />
            <span>创建一个新的聊天</span>
          </div>
          <div className="option">
            <img src="/image.png" alt=" " />
            <span>处理图像</span>
          </div>
          <div className="option">
            <img src="/code.png" alt=" " />
            <span>处理我的代码</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form>
          <input type="text" placeholder="给 LAMA AI 发送消息" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
