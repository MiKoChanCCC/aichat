import "./homePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homePage">
      <div className="left">
        <h1>Lama AI</h1>
        <h2>大幅提升您的工作效率和创造力</h2>
        <h3>嘿，合作伙伴！今天的首要任务是什么？</h3>
        <Link to="/dashboard" className="link">
          Dashboard
        </Link>
      </div>
      <div className="right">
        <img src="/bot.png" alt="bot" />
      </div>
    </div>
  );
};

export default HomePage;
