import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Platform, Text } from "react-native";

import BasicChatbot from "../components/BasicChatbot";
import AlexisChatbot from "../components/AlexisChatbot";
import SabrinaChatbot from "../components/SabrinaChatbot";
import AlexChatbot from "../components/AlexChatbot";


// prettier-ignore
export const CHATBOTS = {
  "AlexChatbot": {
    index: 1,
    id: "AlexChatbot",
    name: "Snap Academy Trivia",
    developer: "Alex Nguyen",
    imageUrl: "https://img.magnific.com/premium-vector/cute-rubber-duck-yellow-duck-cartoon-vector-illustration_773815-284.jpg",
    component: AlexChatbot,
  },
  "SabrinaChatbot":{
    index: 2,
    id: "SabrinaChatbot",
    name: "Lord of the Rings Trivia",
    developer: "Sabrina Moore",
    imageUrl: "https://pbs.twimg.com/media/GTWL8NKW0AAOAE-.jpg",
    component: SabrinaChatbot,
  },
  "AlexisChatbot": {
    index: 3, 
    id: "AlexisChatbot",
    name: "Dog Trivia",
    developer: "Alexis Gonzalez",
    imageUrl: "https://img.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_138676-3143.jpg?w=150",
    component: AlexisChatbot,
  },
  "BasicChatbot": {
    index: 4, 
    id: "BasicChatbot",
    name: "React Native Chatbot",
    developer: "default",
    imageUrl: "https://loremflickr.com/140/140",
    component: BasicChatbot,
  },
};


export default function ChatScreen({ route }) {
  const { chatbotName } = route.params;

  const makeChatbotComponent = (chatbotName) => {
    if (CHATBOTS[chatbotName]) {
      const Chatbot = CHATBOTS[chatbotName].component;
      return <Chatbot />;
    } else {
      return <Text>No Chatbot Found with name '{chatbotName}'</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {makeChatbotComponent(chatbotName)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

