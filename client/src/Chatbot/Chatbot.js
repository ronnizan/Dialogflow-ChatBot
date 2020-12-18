import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import Message from "./Sections/Message";
import { List, Icon, Avatar } from "antd";
import Card from "./Sections/Card";
function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);
  const [message, setMessage] = useState("");
  const refContainer = useRef(null);
  useEffect(() => {
    eventQuery("WelcomeToMySite");
    // eventQuery("WelcomeToMySite");
  }, []);

  const textQuery = async (text) => {
    //  First  Need to  take care of the message I sent
    let conversation = {
      who: "user",
      content: {
        text: {
          text: text,
        },
      },
    };

    dispatch(saveMessage(conversation));
    // console.log('text I sent', conversation)

    // We need to take care of the message Chatbot sent
    const textQueryVariables = {
      text,
    };
    try {
      //I will send request to the textQuery ROUTE
      const response = await Axios.post(
        "https://chat-bot-ron.herokuapp.com/api/dialogflow/textQuery",
        // "http://localhost:5000/api/dialogflow/textQuery",
        textQueryVariables
      );

      for (let content of response.data.fulfillmentMessages) {
        conversation = {
          who: "bot",
          content: content,
        };
        dispatch(saveMessage(conversation));
        refContainer.current.scrollIntoView(false);

      }
    } catch (error) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };

      dispatch(saveMessage(conversation));
    }
  };

  const eventQuery = async (event) => {
    // We need to take care of the message Chatbot sent
    const eventQueryVariables = {
      event,
    };
    try {
      //I will send request to the textQuery ROUTE
      const response = await Axios.post(
        "https://chat-bot-ron.herokuapp.com/api/dialogflow/eventQuery",
        // "http://localhost:5000/api/dialogflow/eventQuery",
        eventQueryVariables 
      );
      for (let content of response.data.fulfillmentMessages) {
        let conversation = {
          who: "bot",
          content: content,
        };
        refContainer.current.scrollIntoView(false);

        dispatch(saveMessage(conversation));
      }
    } catch (error) {
      let conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };
      dispatch(saveMessage(conversation));
    }
  };

  const keyPressHanlder = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        return alert("you need to type somthing first");
      }

      //we will send request to text query route
      textQuery(e.target.value);

      e.target.value = "";
      setMessage("");
      // refContainer.current.scrollIntoView(false);
    }
  };
  const onClick = (e) => {
    if (!message) {
      return alert("you need to type somthing first");
    }

    //we will send request to text query route
    textQuery(message);

    setMessage("");
    // console.log(refContainer)
    refContainer.current.scrollIntoView(false);
  };

  const renderCards = (cards) => {
    return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
  };

  const renderOneMessage = (message, i) => {
    // console.log("message", message);

    // we need to give some condition here to separate message kinds

    // template for normal text
    if (message.content && message.content.text && message.content.text.text) {
      refContainer.current.scrollIntoView(false);

      return (
        <Message key={i} who={message.who} text={message.content.text.text} />
      );
      
    } else if (message.content && message.content.payload.fields.card) {
      const AvatarSrc =
        message.who === "bot" ? <Icon type='robot' /> : <Icon type='smile' />;
        // refContainer.current.scrollIntoView(false);

      return (
        
        <div style={{ display: "flex", flexDirection: "row" }} key={i}>
          <List.Item style={{ padding: "1rem" }}>
            <List.Item.Meta
              avatar={<Avatar icon={AvatarSrc} />}
              title={message.who}
              description={renderCards(
                message.content.payload.fields.card.listValue.values
              )}
            />
          </List.Item>
        </div>

      );
      
    }

    // template for card message
  };

  const renderMessage = (returnedMessages) => {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  };

  return (
    <>
      <div
        style={{
          height: "35rem",
          width: "80%",
          border: "3px solid black",
          borderRadius: "7px",
          overflow: "auto",
        }}
      >
        <div
          ref={refContainer}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          {renderMessage(messagesFromRedux)}
        </div>
      </div>
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <input
          style={{
            margin: 0,
            // width: "80%",
            flex: 1,
            height: 50,
            borderRadius: "4px",
            padding: "5px",
            fontSize: "1rem",
          }}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Send a message...'
          onKeyPress={keyPressHanlder}
          type='text'
        />
        <button style={{ cursor: "pointer" }} onClick={onClick}>
          Send Message
        </button>
      </div>
    </>
  );
}

export default Chatbot;
