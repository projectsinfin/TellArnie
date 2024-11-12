import { Platform, StyleSheet } from "react-native";

import Colors from "../../Styles/Colors";
import { moderateScale } from "../../Styles/responsiveSize";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { SCREEN_WIDTH } from "../../Constant/dimensions";

export default AdminStyle = StyleSheet.create({
  tabView: {
    justifyContent: "center",
    gap: 5,
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 20,
  },
  largeview: {
    width: "50%",
    backgroundColor: Colors.primary,
    padding: 10,
    paddingVertical: 20,
  },
  headingContainer: {
    color: Colors.white,
    width: "85%",
    textAlign: "center",
    alignSelf: "center",
    marginHorizontal: 15,
    marginTop: 10,
  },
  circleText: {
    fontSize: 30,
    lineHeight: 36,
    color: Colors.white,
    textAlign: "center",
    letterSpacing: 1,
  },
  circleView: {
    borderColor: Colors.white,
    borderWidth: 8,
    // marginLeft: SCREEN_WIDTH < 393 ? 20 : 25,/
    width:
      Platform.OS === "android"
        ? SCREEN_WIDTH < 360
          ? responsiveHeight(15)
          : responsiveHeight(13)
        : SCREEN_WIDTH < 393
        ? responsiveHeight(15)
        : responsiveHeight(12),
    height:
      Platform.OS === "android"
        ? SCREEN_WIDTH < 360
          ? responsiveHeight(15)
          : responsiveHeight(13)
        : SCREEN_WIDTH < 393
        ? responsiveHeight(15)
        : responsiveHeight(12),
    borderRadius:
      Platform.OS === "android"
        ? SCREEN_WIDTH < 360
          ? responsiveHeight(7.5)
          : responsiveHeight(6.5)
        : SCREEN_WIDTH < 393
        ? responsiveHeight(7.5)
        : responsiveHeight(6),
    padding: 8,
    backgroundColor: Colors.primary,
    // flex: 0.3,
    justifyContent: "center",
  },
  circleContainer: {
    backgroundColor: "#B6DEC8",
    // display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    // marginTop: 20,

    alignSelf: "center",
    width: "100%",
    height: 140,
    gap: 5,

    paddingVertical: 15,
  },
  text29: {
    fontSize: 85,
    lineHeight: 97,
    color: Colors.white,
    textAlign: "center",
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
    width: "60%",
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

  generateQuote: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginVertical: 15,
  },
  followingText: {
    fontSize: 10,
    lineHeight: 15,
  },
  switchcontainer: {
    alignSelf: "flex-start",
    borderColor: Colors.lightgray,
    borderWidth: 0.7,
    borderRadius: 20,
  },
  quantityStyle: {
    width: "49%",
  },
  quantityContainerText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
  },
  AddedItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: Colors.lightgray1,
    borderWidth: 0.5,
    flex: 1,
  },
  AddedItemInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.9,
  },
  quoteButton: {
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,

    marginBottom: 30,
    width: "80%",
  },
  startButton: {
    width: 75,
    height: 31,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    justifyContent: "center",
  },
});
