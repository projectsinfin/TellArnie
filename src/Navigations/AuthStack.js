import React from "react";
import * as Screens from "../Screens";
import navigationString from "./navigationString";

export default function (Stack, isFirstTime) {
  console.log(Stack, "auth stack", isFirstTime);
  return (
    <>
      <Stack.Screen
        name={navigationString.Initial_Screen}
        component={Screens.Splash}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.LogIn}
        component={Screens.Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.SignUp}
        component={Screens.Signup}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.OPT}
        component={Screens.Otp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.SignUpBusiness}
        component={Screens.SignupBusiness}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.forgotPass}
        component={Screens.forgotPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.Approvalcontact}
        component={Screens.ApprovalsContact}
        options={{ headerShown: false }}
      />
    </>
  );
}
