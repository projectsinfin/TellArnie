import { Platform, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constant/dimensions";
import Colors from "../../Styles/Colors";
import { moderateScale } from "../../Styles/responsiveSize";

export default SignupStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 25,
    borderWidth: 0.1,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: Colors.greenTint,
    borderWidth: 1,
    marginBottom: 36,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  countryContainer: {
    flexDirection: "row",
    width: "29%",
    height: 40,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.dividerLight,
    borderRadius: 5,
    justifyContent: "space-evenly",
  },
  countryModal: {
    marginRight: -13,
    width: "100%",

    position: "relative",
  },
  countrytext: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    marginLeft: 33,
  },
  downArrow: {
    width: moderateScale(12),
    height: moderateScale(12),
    marginLeft: moderateScale(10),
  },
});
