import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Themes } from "../assets/Themes";
import ChatbotInfo from "./ChatbotInfo";
import { useNavigation } from "@react-navigation/native";
import { CHATBOTS } from "../screens/ChatScreen";

const chatbots = Object.values(CHATBOTS);

const renderChatbot = ({ item, index }) => (
  <ChatbotInfo
    index={index}
    id={item.id}
    name={item.name}
    developer={item.developer}
    imageUrl={item.imageUrl}
  />
);

const ChatbotList = ({ chat }) => {
 console.log("developer", chatbots);
  return (
    <View style={styles.container}>
      <FlatList
        data={chatbots}
        renderItem={renderChatbot}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    marginTop: 20,
    marginLeft: 5,
    marginBottom: 20,
  },
  text: {
    color: Themes.colors.gray,
  },
});

export default ChatbotList;
