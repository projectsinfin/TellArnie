import { Platform, StyleSheet } from "react-native";

import Colors from "../../Styles/Colors";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../Constant/dimensions";

export default ProfileStyles = StyleSheet.create({
  headingContainer: {
    color: Colors.white,
    width: "85%",
    textAlign: "center",
    alignSelf: "center",
    marginVertical: moderateScaleVertical(15),
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },

  editStyle: {
    marginLeft: SCREEN_WIDTH < 393 ? 20 : 25,
    color: Colors.white,
    fontSize: 9,
    marginTop: -18,
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
  textStyles: {
    fontSize: 10,
    lineHeight: 15,
    marginVertical: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(20),
  },
  switchSty: {
    alignSelf: "flex-start",

    // elevation: 0.01,
    borderColor: Colors.lightgray,
    borderWidth: 0.7,
    borderRadius: 20,
  },
});
