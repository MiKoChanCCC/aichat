import { useAuth } from "@clerk/clerk-react";
import "./dashboardPage.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const { userId, getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;

    if (!text) return;

    const token = await getToken();
    await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, text }),
    });
  };

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
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default DashboardPage;
