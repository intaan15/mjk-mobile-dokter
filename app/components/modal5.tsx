import React, { useEffect } from "react";
import { View, StatusBar } from "react-native";
import RNModal from "react-native-modal";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export const Modal5 = ({ isOpen, children, ...rest }: ModalProps) => {
  return (
    <RNModal
      isVisible={isOpen}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.1}
      coverScreen={true}
      style={{ margin: 0 }}
      {...rest}
    >
      <StatusBar
        backgroundColor={isOpen ? "rgba(0, 0, 0, 0.55)" : "transparent"}
        barStyle={isOpen ? "light-content" : "dark-content"}
      />
      <View className="items-center justify-center flex-1 bg-black/50">
        {children}
      </View>
    </RNModal>
  );
};

