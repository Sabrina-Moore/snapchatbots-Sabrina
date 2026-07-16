import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform } from "react-native";

import { getChat } from "../utils/getChatGPT";
import { gamePrompt } from "./gamePrompt"; 

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};


export default function BasicChatbot() {

  const [chatHistory, setChatHistory] = useState([]);

  //moved gamePrompt to individual component

  async function fetchInitialMessage() {
  const response = await getChat(gamePrompt);
  if (response.error) {
    console.log("RESPONSE ERROR", response);
  } else {
    const message = response.choices[0].message;
    console.log("message: ", message);
    const content = response.choices[0].message.content;
    console.log("content: ", content);

   addBotMessage(content);
  }
}

  useEffect(() => {
    fetchInitialMessage();

  }, []);

  //appending new messages to the chat history
  const addNewMessage = (newMessages) => {
    setChatHistory((previousMessages) => {
      return GiftedChat.append(previousMessages, newMessages);
    });
  };


  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

//for API, need to send that message to chatGPT, get its response and send it to the chat interface
//test cases:
//Are all the messages in the right order when we send them to ChatGPT?
//When sending requests after the initial request, are we giving ChatGPT all the information it needs?
  // chatGPT doesn't receive the initial prompt

  const respondToUser = async (userMessages) => { //rename userMessages
    console.log("User message text:", userMessages[0].text);

    
    //original idea, but had to separate because of the reverse method
    //new array for API using map() to get the API message 
    /*const apiMessages = userMessages.map((message) => ({
      role: message.user._id === 1 ? "user": "assistant", //roles either user or assistant
      content: message.text, //messages to content 
    })); 

    const response = await getChat([...prompt, ...apiMessages.reverse(), userMessages[0].text); 
    */

    const formattedMessage = chatHistory.map((message) => ({
      role: message.user._id === 1 ? "user": "assistant", //roles either user or assistant
      content: message.text //messages to content 
    }));

    const apiMessages = [
      ...gamePrompt, ...formattedMessage.reverse(), 
      {role: "user", content: userMessages[0].text}
    ];

    console.log(apiMessages);

    //call getChat() with the array
    const response = await getChat(apiMessages); 


    if(!response.error){ //if no errors, bot replies
      const reply = response.choices[0].message.content;
       addBotMessage(reply);
    }
    else {
      addBotMessage("Unexpected error.");
    }

  };

  const onSend = useCallback((chatHistory = []) => {
    addNewMessage(chatHistory);
  }, []);

  return (
    <GiftedChat
      messages={chatHistory}
      onSend={(newMessages) => {
        onSend(newMessages);
        setTimeout(() => respondToUser(newMessages), 1000);
      }}
      user={{
        _id: 1,
        name: "Baker",
      }}
      renderUsernameOnMessage={true}
    />
  );
}
