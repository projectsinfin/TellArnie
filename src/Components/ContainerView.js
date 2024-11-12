import React, { Children } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  ScrollView,
} from "react-native";
import Colors from "../Styles/Colors";

const ContainerView = ({ children, style }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ ...styles.container, ...style }}>
      {Platform.OS === "android" && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
      {Platform.OS === "ios" && (
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "100%",
    backgroundColor: Colors.white,
  },
});

export default ContainerView;
