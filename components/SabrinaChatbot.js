import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Lord of the Rings Trivia",
  avatar: "https://pbs.twimg.com/media/GTWL8NKW0AAOAE-.jpg",
};

//--------------------------------------------------------------------

//TO DO: Define better naming conventions - more comments 
//for states and variables


export default function SabrinaChatbot() {
  const [messages, setMessages] = useState([]);

  const [guess, setGuess] = useState(""); //state for validating user guess

  const [valid, setValid] = useState(false); //guess verification

  const [gameActive, setGameActive] = useState(false); //state to capture user message if trivia game is running

  const [questionIndex, setQuestionIndex] = useState(0);

  const [attempt, setAttempt] = useState(0); //number of attempts to guess if incorrect

  const [score, setScore] = useState(0); //for point tracking


  const triviaQuestions = [
      { 
        question: "What is the largest planet in our solar system??",
        answer: "Jupiter"},
      {
        question: "How many planets are in our solar system?",
        answer: "Eight"},
      {
        question: "What planet do we think formerly had a ring system?",
        answer: "Earth"},
      {
        question: "Which planet rotates on its side?",
        answer: "Uranus"},
      {
        question: "What is the edge of the solar system called, where the Sun's magnetic field ends? Voyager 2 crossed this threshold in 2018.",
        answer: "Heliosphere"},
      {
        question: "What planets rotate in the opposite direction? List one.",
        answer: ["Venus", "Uranus"]},
      {
        question: "On which planet is its day longer than its year?",
        answer: "Mercury"},
      {
        question: "What protects earth from the sun's radiation?",
        answer: ["Magnetosphere", "Atmosphere"]},
        {
        question: "What four planets have rings? List one.",
        answer: ["Jupiter", "Saturn", "Uranus", "Neptune"]},

    ];


  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to 'Space Trivia'! Say 'Yes' when you're ready to play!",
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
      if (message.toLowerCase() !== "yes") {
        setGameActive(false);
        addBotMessage("Please enter 'Yes' to start.");
      } else if (message.toLowerCase() == "yes"){
        setGameActive(true);
        addBotMessage("Let's play! Answer these trivia questions about the planets and the solar system. Numbers and symbols are invalid.");
        addBotMessage(triviaQuestions[questionIndex].question); //first question
      }
    } 
    
      if(gameActive){    //if inside game - run rounds
        console.log("run game");

        const MAX_ATTEMPTS = 3;
        const currentAnswer = triviaQuestions[questionIndex].answer; //variable to hold the answer to the question

        // to allow array of answers for multiple choices
        const acceptedAnswers = Array.isArray(currentAnswer)
          ? currentAnswer : [currentAnswer];

        const userGuess = message.toLowerCase().trim();

        // const isCorrect = message.toLowerCase().trim() === currentAnswer.toLowerCase();


        const isCorrect = acceptedAnswers.some(
          (ans) => ans.toLowerCase().trim() === userGuess
        );

        setValid(isCorrect);
        console.log("User guess: ", message);

        //moving from question to question and resetting states
        const advanceToNextQuestion = () => {

        //increment to next question
        const nextIndex = questionIndex + 1;
        setQuestionIndex(nextIndex);
    
        setAttempt(0); // reset attempts for the new question

        if (nextIndex < triviaQuestions.length){ 
            addBotMessage(triviaQuestions[nextIndex].question); //prompt next trivia question
          } else {
            addBotMessage(`Game over. Thank you for playing. You earned ${score} points!`);
            setGameActive(false);
            resetGame(); //run's resetGame function
          }
        }

      
      if (!isCorrect) {
        console.log("I'm in invalid check.");
        const guessesAttempted = attempt +1;
        setAttempt(guessesAttempted);

        if(guessesAttempted >= MAX_ATTEMPTS){
          const revealAnswer = acceptedAnswers.join(" and ");
          addBotMessage(`Incorrect. Out of tries. The answer was ${revealAnswer}.`);
          advanceToNextQuestion();
        } else {
          const remaining = MAX_ATTEMPTS - guessesAttempted;
          addBotMessage(`Incorrect. You have ${remaining} ${remaining === 1 ? "try" : "tries"} left.`);
        }
      } else if (isCorrect){
          //do I need a conditional here including the rest of the code? 
          console.log("I'm in valid check.");
          const pointsEarned = 5;
          setScore((prevScore) => prevScore + pointsEarned);
          const revealAnswer = acceptedAnswers.join(" and ");
          addBotMessage(`Correct! The answer was ${revealAnswer}.`);
          addBotMessage(`+ ${pointsEarned} points.`);
          advanceToNextQuestion();
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