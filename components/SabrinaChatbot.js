import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Lord of the Rings Trivia",
  avatar: "https://pbs.twimg.com/media/GTWL8NKW0AAOAE-.jpg",
};

//--------------------------------------------------------------------

export default function SabrinaChatbot() {
  const [messages, setMessages] = useState([]);

  const [guess, setGuess] = useState(""); //state for validating user guess

  const [valid, setValid] = useState(false); //guess verification

  const [gameActive, setGameActive] = useState(false); //state to capture user message if trivia game is running

  const [questionIndex, setQuestionIndex] = useState(0);


  const triviaQuestions = [
      { 
        question: "What is the creature that attacks the fellowship in the Mines of Moria, leading to the famous line, 'You shall not pass!'?",
        answer: "Balrog"},
      {
        question: "How many members are in the Fellowship of the Ring? Write number as a word.",
        answer: "Nine"},
      {
        question: "What is the name of the dark lord who created the One Ring?",
        answer: "Sauron"},
    ];


  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!",
      );
    }
  }, []);

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      //console.log("PREVIOUS MESSAGES:", previousMessages);
      //console.log("NEW MESSAGE:", newMessages);
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

//--------------------------------------------------------------------
//--------------------------------------------------------------------

  //round 0 - game start
  const respondToUser = (userMessages) => {
    console.log("Inside respondToUser.");
    console.log("Recent user msg:", userMessages[0].text);
    let message = userMessages[0].text;

    // PRE GAME STATUS
   
      if(!gameActive){ //round 0
      if (message !== "Yes") {
        setGameActive(false);
        addBotMessage("Please enter 'Yes' to start.");
      } else if (message == "Yes"){
        setGameActive(true);
        addBotMessage("Let's play a Lord of The Rings trivia game!");
        addBotMessage("Write each answer as a word and do not include punctuation.");
        addBotMessage(triviaQuestions[questionIndex].question); //first question
      }
    } 
    
      if(gameActive){    //if inside game - run rounds
        console.log("run game");

        const isCorrect = message.toLowerCase().trim() === triviaQuestions[questionIndex].answer.toLowerCase();
        
        setValid(isCorrect);
        console.log("User guess: ", message);
      

      if(isCorrect){
        console.log("I'm in valid check.");
        addBotMessage("Correct!");
      }
      else {
        console.log("I'm in invalid check.");
        addBotMessage("Incorrect.");
      }
      //increment to next question
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);

      if (nextIndex < 3){ 
        addBotMessage(triviaQuestions[nextIndex].question); //prompt next trivia question
      } else {
        addBotMessage("Game over. Thank you for playing.");
        setGameActive(false);
        resetGame(); //run's resetGame function
      }
    }
  };
    
//to reset the game
  const resetGame = () => {
  setGameActive(false);
  setQuestionIndex(0);
  setValid(false);
  addBotMessage("Game has been reset. Type 'Yes' to start a new game.");
};

//--------------------------------------------------------------------
//--------------------------------------------------------------------


  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => {
            onSend(messages);
            // Wait a sec before responding
            setTimeout(() => respondToUser(messages), 1000);
          }}
          user={{
            _id: 1,
            name: "Idiot",
          }}
          renderUsernameOnMessage={true}
        />
      </SafeAreaView> 
    </SafeAreaProvider>
  );
}


// Workaround to hide an unnecessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};