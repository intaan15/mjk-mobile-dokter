import { View, Text, TextInput, Button, FlatList } from "react-native";
import React, { useState } from "react";

export default function ChatScreen({ route, navigation }) {
  const { user } = route.params;

  const [messages, setMessages] = useState([
    { id: 1, text: "Halo, ada yang bisa saya bantu?", sender: "dokter" },
    { id: 2, text: "Selamat pagi dokter", sender: user },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    setMessages([
      ...messages,
      { id: messages.length + 1, text: inputMessage, sender: user },
    ]);
    setInputMessage("");
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Chat dengan {user}</Text>

      {/* Daftar Pesan */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`p-3 my-2 rounded-lg max-w-[75%] ${
              item.sender === user
                ? "self-end bg-blue-200"
                : "self-start bg-gray-200"
            }`}
          >
            <Text className="text-black">{item.text}</Text>
          </View>
        )}
      />

      {/* Input Pesan */}
      <View className="flex-row items-center border-t p-2">
        <TextInput
          className="flex-1 border rounded-lg p-2"
          placeholder="Ketik pesan..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </View>
  );
}
