import { StyleSheet, Text, View } from "react-native";
import React from "react";
import navigationString from "../../Navigations/navigationString";
import { saveUserData } from "../../redux/reducer/auth";
import { useDispatch } from "react-redux";

const InitialScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const onLogin = () => {
    dispatch(saveUserData({ isLogin: true }));
  };
  return (
    <View>
      <Text onPress={() => navigation.navigate(navigationString.LogIn)}>
        InitialScreen
      </Text>

      <Text onPress={() => onLogin()}>LOGIN</Text>
    </View>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({});
