import { Animated, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import applogo from "../assets/Images/applogo.png";

const CustomNotifications = ({ toastTrigger, message }) => {
  const animatedValue = useRef(new Animated.Value(-70)).current;
  const callToast = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => closeToast());
  };
  useEffect(() => {
    if (toastTrigger) callToast();
  }, []);

  const closeToast = () => {
    setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: -70,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }, 2000); // Close the toast after 2 seconds
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.toast, { transform: [{ translateY: animatedValue }] }]}>
        <Image
          source={require("../assets/Images/applogo.png")}
          style={{
            height: 60,
            width: 60,
            resizeMode: "contain",
            marginLeft: 10,
            marginTop: -10,
          }}
        />
        <Text style={styles.toastText}>Hello from Toast!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },

  toast: {
    height: 50,
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0,
    // justifyContent: "center",
    flexDirection: "row",
    zIndex: 9999999,
    gap: 5,
    top: 0, // Position the toast at the top
  },
  toastText: {
    marginLeft: 10,
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 15,
  },
});

export default CustomNotifications;
