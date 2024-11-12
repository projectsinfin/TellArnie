import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import imagePath from "../Constant/imagePath";
import TextView from "./TextView";

const Card = ({ title, imageSource, onPress, des, imageSrc, cardOnPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={cardOnPress}>
      <Image resizeMode="stretch" source={imageSrc} style={styles.image} />

      <TextView heading headingTextSty={{ fontSize: 12 }}>
        {title}
      </TextView>
      <TextView
        ellipsizeMode="tail"
        numberOfLines={4}
        textSty={{ fontSize: 12, marginTop: -10 }}>
        {des}
      </TextView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
});

export default Card;
