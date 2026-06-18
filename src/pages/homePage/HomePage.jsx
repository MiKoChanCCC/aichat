import "./homePage.css";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const HomePage = () => {
  const [typeStatus, setTypeStatus] = useState("human1");

  return (
    <div className="homePage">
      <img src="/orbital.png" alt="orbital" className="orbital" />
      <div className="left">
        <h1>Lama AI</h1>
        <h2>提升您的工作效率和创造力</h2>
        <h3>嘿，合作伙伴！今天的首要任务是什么？</h3>
        <Link to="/dashboard" className="link">
          Dashboard
        </Link>
      </div>

      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="bot" className="bot" />
          <div className="chat">
            <img
              src={
                typeStatus === "human1"
                  ? "/human1.jpeg"
                  : typeStatus === "human2"
                    ? "/human2.jpeg"
                    : "/bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human1:We produce food for Mice",
                1000,
                () => {
                  setTypeStatus("bot");
                },

                "bot:We produce food for Hamsters",
                1000,
                () => {
                  setTypeStatus("human2");
                },

                "Human2:We produce food for Guinea Pigs",
                1000,
                () => {
                  setTypeStatus("bot");
                },

                "bot:We produce food for Chinchillas",
                1000,
                () => {
                  setTypeStatus("human1");
                },
              ]}
              wrapper="span"
              speed={40}
              cursor={true}
              repeat={Infinity}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
