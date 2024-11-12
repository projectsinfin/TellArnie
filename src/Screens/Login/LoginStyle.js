import { Platform, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constant/dimensions";
import Colors from "../../Styles/Colors";
import { moderateScale } from "../../Styles/responsiveSize";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 0.8,
    paddingHorizontal: moderateScale(25),
    borderWidth: 0.1,
    backgroundColor: Colors.white,
    // borderTopLeftRadius: moderateScale(20),
    // borderTopRightRadius: moderateScale(20),
    // backgroundColor: "red",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },

  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  loginBtn: {
    alignSelf: "center",
    // width: "80%",
    width: responsiveWidth(70),
    marginTop: 25,
  },
  switchSty: {
    alignSelf: "flex-start",
    borderColor: Colors.lightgray,
    borderWidth: 0.7,
    borderRadius: 20,
  },
  signUpext: {
    marginLeft: 2,
    fontWeight: "900",
    textDecorationLine: "underline",
  },
  dontaccount: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  rememberView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
});
