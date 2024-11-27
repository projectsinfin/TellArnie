import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";
import React, { useEffect } from "react";
import Routes from "./Navigations/Routes";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { CustomStatusBar } from "./Components/CustomStatusBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "./Styles/Colors";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      requestNotificationPermission();
    }
    requestUserPermission();
    notificationListener();
  }, []);

  const notificationListener = async () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });
    messaging().onMessage(async (remoteMessage) => {
      console.log("Message handled in the frontend !", remoteMessage);
      // EventRegister.emit("MessageUpdate", "");
      // PushNotification.localNotification({
      //   channelId: "your-channel-id",
      //   id: remoteMessage.messageId,
      //   title: remoteMessage.data.title,
      //   message: remoteMessage.data.meaage,
      //   soundName: "default",
      //   vibrate: true,
      //   playSound: true,
      // });
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("Authorization status:", authStatus);
      getToken();
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();

    const device_token = await AsyncStorage.setItem("fcmToken", token);
    console.log("FCM token: ", token);
    global.fcmToken = token;
  };

  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "Allow this app to post notifications.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={Colors.primary} />
      <Provider store={store}>
        <Routes />
      </Provider>
    </SafeAreaProvider>
  );
};

export default index;

const styles = StyleSheet.create({});
