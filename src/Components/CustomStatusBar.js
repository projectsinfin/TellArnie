import * as React from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export const CustomStatusBar = ({
  backgroundColor,
  barStyle = "dark-content",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: insets.top, backgroundColor }}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={"light-content"}
      />
    </View>
  );
};
