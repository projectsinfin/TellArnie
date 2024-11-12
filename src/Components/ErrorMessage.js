import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextView from "./TextView";

const ErrorMessage = ({ message }) => {
  return (
    <View>
      <TextView
        textSty={{
          color: "red",
          // marginHorizontal={15}
        }}>
        {message}
      </TextView>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({});
