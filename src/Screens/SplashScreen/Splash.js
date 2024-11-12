import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";
import imagePath from "../../Constant/imagePath";
import navigationString from "../../Navigations/navigationString";

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(navigationString.LogIn);
    }, 1000);
  }, []);
  return (
    // <SafeAreaView>
    <ImageBackground
      source={imagePath.SplashImage} //@code import from constant/imagepath file
      // resizeMode="stretch"
      style={{ height: "100%" }}
    />
    // </SafeAreaView>
  );
};

export default Splash;
