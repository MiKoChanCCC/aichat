import "./homePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homePage">
      <div className="left">
        <h1>Lama AI</h1>
        <h2>qwertyuiopasdfghjkl</h2>
        <h3>
          qwertyuiopasdfghjklzxcvbnmqwe,qwertyuiopasdfghjklzxcvbnm,rtyuiopasdfghjklzxcvbnm
        </h3>
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
