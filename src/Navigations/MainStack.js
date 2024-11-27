import React from "react";
import * as Screens from "../Screens";
import navigationString from "./navigationString";
import TabRoutes from "./tabRoutes";

export default function (Stack, isFirstTime) {
  console.log("auth stack", isFirstTime);
  return (
    <>
      <Stack.Screen
        name={navigationString.TAB_ROUTES}
        component={TabRoutes}
        options={{ headerShown: false }}
      />
    </>
  );
}
