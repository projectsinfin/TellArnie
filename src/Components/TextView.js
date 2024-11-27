import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../Styles/Colors";

const TextView = (props) => {
  if (props.heading) {
    return (
      <View>
        <Text
          onPress={props.onPress}
          style={{ ...styles.headingTextSty, ...props.headingTextSty }}>
          {props.children}
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        <Text
          numberOfLines={props.numberOfLines}
          ellipsizeMode={props.ellipsizeMode}
          onPress={props.onPressText}
          style={{ ...styles.textSty, ...props.textSty }}>
          {props.children}
        </Text>
      </View>
    );
  }
};

export default TextView;

const styles = StyleSheet.create({
  headingTextSty: {
    fontWeight: "700",
    fontSize: 36,
    lineHeight: 43.2,
    fontFamily: "OpenSans-Bold",
    color: Colors.black,
  },
  textSty: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 15,
    color: Colors.black,
  },
});
