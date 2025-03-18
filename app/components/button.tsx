import { Pressable, Text } from "react-native";
import React from "react";

export default function Button({ text, onPress, className, variant }) {
  return (
    <Pressable
      className={`bg-blue-950 w-full px-4 py-4 rounded-md ${className}`}
      onPress={onPress}
    >
      <Text className="text-white text-center font-bold">{text}</Text>
    </Pressable>
  );
}
