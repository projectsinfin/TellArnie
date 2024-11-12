// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const NewsAndUpdate = () => {
//   return (
//     <View>
//       <Text>NewsAndUpdate</Text>
//     </View>
//   );
// };

// export default NewsAndUpdate;

// const styles = StyleSheet.create({});

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import WebView from "react-native-webview";
import { call_DetailsMessage_API } from "../../redux/action/MessagesAction";
import Loading from "../../Components/Loading";
import { useDispatch } from "react-redux";
import moment from "moment";
import navigationString from "../../Navigations/navigationString";
import AllStrings from "../../Constant/AllStrings";

const NewsAndUpdate = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { keyId } = route.params;

  const [isLoadings, setisLoadings] = useState(false);

  console.log(keyId, "======ahjagsdadahd");

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <Modal animated={true} transparent={true} visible={isLoadings}>
          <Loading />
        </Modal>

        <Header
          back={() => navigation.navigate(navigationString.profile)}
          backIcon={imagePath.backArrow}
          editHeader={() => navigation.goBack()}
        />

        <View style={{ flex: 1 }}>
          {/* <View style={{ flex: 1 }}> */}
          <TextView
            heading
            headingTextSty={{
              color: "#FFFFFF",
              marginVertical: 10,
              width: "90%",
              textAlign: "center",
              alignSelf: "center",
              marginHorizontal: 15,
              letterSpacing: -1,
            }}>
            News & Update
          </TextView>
          {/* <View style={{ marginBottom: 15, width: "80%", alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 21,
                letterSpacing: -0.011,
                textAlign: "center",
                color: "white",
              }}>
              The latest news, training and updates to keep your businesses safe
              and compliant.
            </Text>
          </View> */}
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flex: 1,
            }}>
            {/* <WebView
              source={{
                html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>

                  <p style="margin-top: 30px">${
                    data?.title === undefined ? "" : data?.title
                  }</p>
                  <p>${moment(data?.publish_on).format("DD MMM YYYY")}</p>
                  ${
                    data?.content === undefined ? "" : data?.content
                  }</body></html>`,
              }}
              style={{
                marginHorizontal: 13,
                // flex: 1,
              }}
              javaScriptEnabled={true}
              // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
              scalesPageToFit={true}
              originWhitelist={["*"]}
              // onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
            /> */}
            <View style={{ marginHorizontal: 15 }}>
              <TextView heading headingTextSty={{ marginTop: 5, fontSize: 14 }}>
                {"News and Updates"}
              </TextView>
              <Image
                resizeMode="stretch"
                source={{ uri: keyId?.featured_image }}
                style={styles.image}
              />

              <TextView heading headingTextSty={{ fontSize: 12 }}>
                {keyId?.title}
              </TextView>
              <TextView textSty={{ fontSize: 12, marginTop: -10 }}>
                {keyId?.sub_title}
              </TextView>
            </View>
          </View>
        </View>

        {/* <TabRoutes /> */}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  headingText: {
    fontFamily: "Open Sans",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 43,
    letterSpacing: -0.011,
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#047835",
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    // width: 333,
    // height: "auto",
    // paddingVertical: s20,
    paddingHorizontal: 0,
    // marginTop: 10,
    flexDirection: "column",
    alignItems: "flex-start", // Align items to the left
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  text: {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.011,
    textAlign: "left",
    marginLeft: 20,
    color: "#000000",
  },
  secondaryText: {
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 15,
    letterSpacing: -0.011,
    textAlign: "left",
    marginLeft: 20,
    color: "#000000",
  },
  regularText: {
    fontFamily: "Open Sans",
    // fontSize: 14,
    fontSize: responsiveFontSize(2),
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.011,
    textAlign: "left",
    color: "#000000",
    marginLeft: 20, // Adjust left margin for bullet points
  },
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
    // marginTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
});
export default NewsAndUpdate;
