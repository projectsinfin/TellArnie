import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import React from "react";
import { SCREEN_HEIGHT } from "../Constant/dimensions";
import { DeleteImg } from "../Assets";
import Colors from "../Styles/Colors";
import TextView from "./TextView";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const Button = (props) => {
  const {
    btnName,
    logout,
    onClick = () => {},
    onClickSplash,
    showDeleteIcon,
    disabled,
    buttonColor,
  } = props;

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.7}
      style={{ ...styles.allButtonSty, ...props.allButtonSty }}
      disabled={disabled}
      {...props}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onClick}
        style={{ flexDirection: "row", justifyContent: "center" }}
        disabled={disabled}>
        <TextView
          heading
          headingTextSty={{
            // fontSize: 18,
            fontSize: logout ? 10 : responsiveFontSize(2.2),
            color: buttonColor,
            // textTransform: "uppercase",
          }}>
          {btnName}
        </TextView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  allButtonSty: {
    backgroundColor: Colors.secondary,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    marginHorizontal: 15,
  },
});
