import React from "react";
import * as Screens from "../../Screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../navigationString";
import AllStack from "../AllStack/AllStack";

const Stack = createNativeStackNavigator();

const KitsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={navigationString.kitsName}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationString.kitsName}
        component={Screens.kitsScreen}
      />

      <Stack.Screen
        name={navigationString.summaryPage}
        component={Screens.SummaryPage}
      />

      <Stack.Screen
        name={navigationString.incidentNav}
        component={Screens.incidentReport}
      />
      <Stack.Screen
        name={navigationString.quickReportNav}
        component={Screens.quickReport}
      />
      <Stack.Screen
        name={navigationString.quickReportInfoNav}
        component={Screens.quickReportInfo}
      />
      <Stack.Screen
        name={navigationString.quickReportInfo2Nav}
        component={Screens.quickReportInfo2}
      />

      <Stack.Screen
        name={navigationString.kitsInstallation}
        component={Screens.KitsInstallation}
      />
      <Stack.Screen
        name={navigationString.kitsFound}
        component={Screens.KitsFound}
      />
      <Stack.Screen
        name={navigationString.addItems}
        component={Screens.AddItems}
      />
      <Stack.Screen
        name={navigationString.addProductManually}
        component={Screens.AddProductManually}
      />
      <Stack.Screen
        name={navigationString.enterLocation}
        component={Screens.EnterLocation}
      />
      <Stack.Screen
        name={navigationString.kitNotFound}
        component={Screens.KitNotFound}
      />

      <Stack.Screen name={navigationString.admin} component={Screens.admin} />
      <Stack.Screen
        name={navigationString.Notification}
        component={Screens.Notification}
      />
      <Stack.Screen
        name={navigationString.notificationDetails}
        component={Screens.NotificationDetails}
      />

      <Stack.Screen
        name={navigationString.productFound}
        component={Screens.ProductFound}
      />
      <Stack.Screen
        name={navigationString.quickSummary}
        component={Screens.QuickReportSummary}
      />

      <Stack.Screen
        name={navigationString.detailedReportFirst}
        component={Screens.DetailedIncidentReportFirst}
      />

      <Stack.Screen
        name={navigationString.detailedRepSecond}
        component={Screens.DetailedIncidentReportSecond}
      />
      <Stack.Screen
        name={navigationString.detailedReportthree}
        component={Screens.DetailedReportthree}
      />
      <Stack.Screen
        name={navigationString.detailedReportFour}
        component={Screens.DetailedReportFour}
      />
      <Stack.Screen
        name={navigationString.profile}
        component={Screens.Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationString.incident}
        component={Screens.Incident}
      />
    </Stack.Navigator>
  );
};
export default KitsStack;
