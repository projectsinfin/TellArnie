import { Platform, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constant/dimensions";
import Colors from "../../Styles/Colors";
import { moderateScaleVertical } from "../../Styles/responsiveSize";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
export default kitsStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    flex: 1,
  },
  heading: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 40,
  },
  headingText: {
    textAlign: "center",
    fontSize: 14,
    // fontSize: responsiveFontSize(1.5),
    marginTop: 25,
    lineHeight: 21,
  },
  cardView: {
    backgroundColor: Colors.secondary,
    // padding: 10,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: moderateScaleVertical(40),
    paddingVertical: moderateScaleVertical(30),
  },
  cardTeadingText: { fontSize: 18, marginTop: 14 },
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
    width: responsiveWidth(3),
    height: responsiveHeight(3),
    marginLeft: 12,
  },

  headingContainer: {
    color: Colors.white,
    width: "85%",
    textAlign: "center",
    alignSelf: "center",
    marginHorizontal: 15,
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 15,
    flex: 1,
  },
  LeicesterHeading: { fontSize: 14, lineHeight: 21 },
  LeicesterText: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 21,
  },
  statusViewSty: {
    flex: 0.5,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  LocationView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // height: 45,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  Monitorsafetyproducts: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "center",
    marginVertical: 20,
  },
  buttonStyle: {
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
    width: "65%",
    marginBottom: 30,
  },
});
