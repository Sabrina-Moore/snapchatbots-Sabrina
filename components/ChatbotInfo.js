import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Themes } from "../assets/Themes/index.js";
//import { millisToMinutesAndSeconds } from "../utils";
import { useNavigation } from "@react-navigation/native";


const ChatbotInfo = ({
  index,
  id, 
  name,
  developer,
  imageUrl,

}) => {
  const navigation = useNavigation();

  console.log({id, name, developer, imageUrl});

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ChatScreen", {
          // this is a "quick and dirty" hack for the moment, we'll want to rename our properties later
          chatbotName: id,
        })
      }
    >
      <View style={styles.chatbot}>
        <Text style={styles.index}>{index}</Text>
        <Image
          style={[styles.image]}
          source={{ uri: imageUrl }}
        />
        <View style={styles.chatContainer}>
          <Text style={[styles.name]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.developer]} numberOfLines={1}>
          {developer}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chatbot: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
  },
  index: {
    color: Themes.colors.gray,
    flex: 0.05,
    textAlign: "center",
    fontSize: 12,
    margin: 1,
  },
  image: {
    resizeMode: "contain",
    flex: 0.2,
    width: 50,
    height: 50,
  },
  chatContainer: {
    flex: 0.4,
    margin: 5,
  },
  name: {
    color: Themes.colors.white,
    fontSize: 12,
  },
  developer: {
    color: Themes.colors.gray,
    fontSize: 12,
  },
});

export default ChatbotInfo;
