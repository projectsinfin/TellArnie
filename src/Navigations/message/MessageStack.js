import React from "react";
import * as Screens from "../../Screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../navigationString";
import AllStack from "../AllStack/AllStack";

const Stack = createNativeStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={navigationString.Notification}
      screenOptions={{
        headerShown: false,
      }}>
      {/* {AllStack(Stack)} */}
      <Stack.Screen
        name={navigationString.Notification}
        component={Screens.Notification}
      />
      <Stack.Screen
        name={navigationString.notificationDetails}
        component={Screens.NotificationDetails}
      />
      <Stack.Screen name={navigationString.Home} component={Screens.Home} />
    </Stack.Navigator>
  );
};
export default MessageStack;
