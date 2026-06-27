import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";

const ChaPage = () => {
  return (
    <div className="chaPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">ceshi ai</div>
          <div className="message user">
            ceshi user Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Non, autem nemo praesentium nihil dolore sunt eius et, omnis amet
            temporibus culpa tenetur reprehenderit perspiciatis delectus quos
            debitis incidunt nam sed.
          </div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <div className="message">ceshi ai</div>
          <div className="message user">ceshi user</div>
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChaPage;
