import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

function TabIcon({ focused, icon, title }: any) {
  return (
    <View className="flex items-center flex-1 mt-2">
      <FontAwesome5
        name={icon}
        size={22}
        color={focused ? "#C3E9FF" : "white"}
      />
      <Text
        className={`text-xs mt-1 w-full ${
          focused ? "text-skyLight font-bold" : "text-white"
        }`}
      >
        {title}
      </Text>
    </View>
  );
}

const TabsNavigasi = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#025F96",
          height: 62,
          position: "absolute",
          bottom: 0,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" title="Beranda" />
          ),
        }}
      />

      <Tabs.Screen
        name="jadwal"
        options={{
          title: "Jadwal",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="calendar-alt" title="Jadwal" />
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="user" title="Profil" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsNavigasi;
