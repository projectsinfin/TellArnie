import { Platform, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constant/dimensions";
import Colors from "../../Styles/Colors";
import { moderateScale } from "../../Styles/responsiveSize";

export default HomeStyle = StyleSheet.create({
  heading: {
    color: Colors.white,
    marginVertical: 10,
    marginBottom: 35,
    // width: "85%",
    width: "75%",
    textAlign: "center",
    alignSelf: "center",
    marginHorizontal: 15,
    // marginTop: ,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  reportBtn: {
    alignSelf: "center",
    width: "75%",
    borderRadius: 10,
    top: -20, // Adjusted to -40
  },
  registerBtn: {
    alignSelf: "center",
    width: "75%",
    // width: moderateScale(250),
    backgroundColor: "black",
    borderRadius: 10,
  },
});
