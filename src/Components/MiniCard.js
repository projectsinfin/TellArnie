import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextView from "./TextView";
import Colors from "../Styles/Colors";
import { moderateScaleVertical } from "../Styles/responsiveSize";

const MiniCard = (props) => {
  const { heading, text } = props;
  return (
    <View style={styles.container}>
      <TextView heading headingTextSty={styles.headingSty}>
        {heading}
      </TextView>
      <TextView textSty={styles.textSty}>{text}</TextView>
    </View>
  );
};

export default MiniCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greenTint,
    paddingHorizontal: 10,
    paddingVertical: moderateScaleVertical(8),
    borderRadius: 5,
    width: "100%",
  },
  headingSty: {
    fontSize: 10,
    lineHeight: 15,
    color: Colors.white,
    textAlign: "center",
  },
  textSty: { color: Colors.white, textAlign: "center" },
});
