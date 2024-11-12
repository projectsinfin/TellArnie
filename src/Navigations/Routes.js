import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const userDatas = useSelector((state) => state.auth.userData);

  const [token, setTokens] = React.useState("");

  React.useEffect(() => {
    getToken();
  }, [userDatas]);

  const getToken = async () => {
    const accessGlobalData = await AsyncStorage.getItem("globalData");
    const jsonValue = JSON.parse(accessGlobalData);
    setTokens(jsonValue);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
     
        {!!userDatas.isLogin || token ? (
          <>{MainStack(Stack)}</>
        ) : (
          <>{AuthStack(Stack)}</>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
