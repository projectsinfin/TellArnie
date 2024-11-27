//this is working code for beta testing
import {
  View,
  SafeAreaView,
  Image,
  Switch,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import ContainerView from "../../Components/ContainerView";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import InputFields from "../../Components/InputFields";
import Button from "../../Components/Button";
import LoginStyle from "./LoginStyle";
import navigationString from "../../Navigations/navigationString";
import Colors from "../../Styles/Colors";
import { useDispatch, useSelector } from "react-redux";
import { addDistributerId, saveUserData } from "../../redux/reducer/auth";
import { height, moderateScale } from "../../Styles/responsiveSize";
import { Formik } from "formik";
import { call_Login_Api, login } from "../../redux/action/AuthAction";
import Loading from "../../Components/Loading";
import {
  LoginSchema,
  emailPattern,
  passwordPattern,
} from "../../utils/Validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMessage from "../../Components/ErrorMessage";
import CustomAlert from "../../Components/CustomAlert";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState({
    value: "",
    err: "",
  });

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    // handles deep link when app is already open
    Linking.addEventListener("url", (evt) => {
      console.log("Linking add event----", evt.url);

      console.log("email ---==-", splitUrl);
    });

    // handles deep link when app is not already open
    Linking.getInitialURL()
      .then((url) => {
        console.log("Initial URL:", url);
        // const splitUrl = url?.split("email:");
        const emailMatch = url.match(/\/email:([^\/]*)/);
        const nameMatch = url.match(/\/name:([^\/]*)/);

        const email = emailMatch ? decodeURIComponent(emailMatch[1]) : null;
        const name = nameMatch
          ? decodeURIComponent(nameMatch[1].replace(/%20/g, " "))
          : null;

        console.log("975894375987345", email, "----", name);
        if (email && name) {
          dispatch(addDistributerId({ email, name }));
          navigation.navigate(navigationString.SignUp);
          // navigation.navigate(navigationString.SignUpBusiness);
        }
      })
      .catch((err) => console.error("Error getting initial URL:", err));

    return () => {
      // clears listener when component unmounts
      Linking.removeAllListeners("remove url");
    };
  }, []);

  // useEffect(() => {
  //   // handles deep link when app is already open
  //   Linking.addEventListener("url", (evt) => {
  //     console.log("Linking add event----", evt.url);

  //     console.log("email ---==-", splitUrl);
  //   });

  //   // handles deep link when app is not already open
  //   Linking.getInitialURL()
  //     .then((url) => {
  //       alert(url);
  //       console.log("Initial URL:", url);
  //       const splitUrl = url?.split("email:");
  //       // if (splitUrl[1]) {
  //       //   // console.log("7438954395", splitUrl[1]);
  //       //   dispatch(addDistributerId(splitUrl[1]));
  //       //   navigation.navigate(navigationString.SignUp);
  //       //   // navigation.navigate(navigationString.SignUpBusiness);
  //       // }
  //     })
  //     .catch((err) => alert(JSON.stringify(err)));

  //   return () => {
  //     // clears listener when component unmounts
  //     Linking.removeAllListeners("remove url");
  //   };
  // }, []);

  useEffect(() => {
    // Check if the "Remember Me" option is set in AsyncStorage
    AsyncStorage.getItem("rememberMe").then((rememberMe) => {
      if (rememberMe === "true") {
        // Retrieve and set the stored email and password
        AsyncStorage.getItem("userEmail").then((email) => {
          setEmail({ value: email, err: "" });
        });
        AsyncStorage.getItem("userPassword").then((password) => {
          setPassword({ value: password, err: "" });
        });
        setIsEnabled(true); // Set the "Remember Me" checkbox as checked
      }
    });
  }, []);

  const validateEmail = (email) => {
    // Implement your email validation logic
    if (email.value == "") return "Email is required";
    if (!emailPattern.test(email.value)) return "Invalid email";
    return null;
  };

  const validatePassword = (password) => {
    // Implement your password validation logic
    if (password.value == "") return "Password is required";
    if (password.value?.length <= 6)
      return "Password must be at least 6 characters";
    // if (!passwordPattern.test(password.value))
    //   return "Enter at least 1 capital letter, 1 special character, 1 small letter and minimum 8 characters!";
    return null;
  };

  const [password, setPassword] = useState({ value: "", err: "" });

  const { isLoading, error, user } = useSelector((state) => state.auths);

  console.log("email----", email, "----pass--", password);
  //  Handle login button functionality
  const handleLogin = async (val) => {
    if (email.value == "") {
      setEmail({ value: "", err: validateEmail(email) });
      flag = false;
    } else if (!email.value.match(emailPattern)) {
      setEmail({ value: email.value, err: validateEmail(email) });
      flag = false;
    } else if (password.value == "") {
      setPassword({ value: "", err: validatePassword(password) });
      flag = false;
    } else if (password.value?.length < 6) {
      setPassword({ value: password.value, err: validatePassword(password) });
      flag = false;
    } else {
      const payload = {
        // email: email.value.toLowerCase(),
        email: email.value,
        password: password.value,
        fcm_token: global.fcmToken,
      };
      // console.log("befor login payload value---", payload);
      dispatch(call_Login_Api(payload))
        .then(async (res) => {
          if (res.payload.status === 200) {
            if (res.payload?.data?.is_approved === false) {
              handleShowAlert(
                "This account is currently not approved. Please await confirmation from the superadmin before accessing this account. Thank you for your patience."
              );
            } else {
              const AccessToken = res.payload.data.access_token;
              const ReffToken = res.payload.data.refresh_token;
              const role = res.payload.data.role;
              dispatch(saveUserData({ isLogin: true }));
              dispatch(login(AccessToken, ReffToken, role));
              await AsyncStorage.setItem(
                "globalData",
                JSON.stringify(res.payload)
              );

              if (isEnabled) {
                // Store email and password in AsyncStorage if "Remember Me" is enabled
                try {
                  await AsyncStorage.setItem("userEmail", email.value);
                  await AsyncStorage.setItem("userPassword", password.value);
                  await AsyncStorage.setItem("rememberMe", "true");
                } catch (error) {
                  console.error("Error saving data:", error);
                }
              } else {
                setEmail({ value: "", err: "" });
                setPassword({ value: "", err: "" });
                await AsyncStorage.setItem("rememberMe", "false");
                // await AsyncStorage.setItem("rememberMe", "fal");
              }
            }
          } else {
            handleShowAlert(res?.payload?.message);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "null"}
      style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }} automaticallyAdjustKeyboardInsets={true}>
        <SafeAreaView>
          <Modal animated={true} transparent={true} visible={isLoading}>
            <Loading />
          </Modal>

          <View style={{ flex: 0.3 }}>
            <Image
              source={imagePath.HearderImage}
              resizeMode="stretch"
              style={{ width: "100%", marginTop: -20 }}
            />
          </View>
          <View
            style={{
              flex: 0.7,
            }}>
            <View style={LoginStyle.inner}>
              <TextView
                heading
                headingTextSty={{
                  marginTop: moderateScale(1),
                }}>
                {AllStrings.welcome}
              </TextView>
              <TextView
                heading
                headingTextSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 10,
                }}>
                {AllStrings.signinContinune}
              </TextView>

              {/* code of Input Fields  */}
              <View>
                <InputFields
                  keyboardType="email-address"
                  placeholder="Business Email"
                  autoCapitalize
                  value={email.value}
                  onChangeText={(e) => setEmail({ value: e, err: "" })}
                  validate={validateEmail(email)}
                  textContentType="oneTimeCode"
                  autoComplete="email"
                />
                {email.err && <ErrorMessage message={email.err} />}
                <InputFields
                  value={password.value}
                  onChangeText={(e) => setPassword({ value: e, err: "" })}
                  validate={validatePassword(email)}
                  isChecked
                  placeholder="Password"
                  SecureTextEntrys={showPass}
                  source={
                    showPass === false
                      ? imagePath.OpenEyeIcon
                      : imagePath.ClosedEyeIcon
                  }
                  iconPress={() => setShowPass(!showPass)}
                />
                {password.err && <ErrorMessage message={password.err} />}
              </View>

              <View style={LoginStyle.rememberView}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      ...LoginStyle.switchSty,
                      backgroundColor:
                        isEnabled == false ? Colors.white : Colors.secondary,
                    }}>
                    <Switch
                      trackColor={{
                        false: Colors.white,
                        true: Colors.secondary,
                      }}
                      thumbColor={Colors.white}
                      onValueChange={() => setIsEnabled(!isEnabled)}
                      value={isEnabled}
                      style={{
                        transform: [{ scaleX: 1 }, { scaleY: 1 }],
                      }}
                    />
                  </View>
                  <TextView textSty={{ marginLeft: 5 }}>
                    {AllStrings.Remember}
                  </TextView>
                </View>
                <View>
                  <TextView
                    onPressText={() =>
                      navigation.navigate(navigationString.forgotPass)
                    }
                    textSty={{
                      textDecorationLine: "underline",
                    }}>
                    {AllStrings.Forgot}
                  </TextView>
                </View>
              </View>
              <View style={LoginStyle.btnContainer}>
                <Button
                  onClick={() => handleLogin()}
                  allButtonSty={LoginStyle.loginBtn}
                  btnName="Sign In"
                  buttonColor={Colors.black}
                />
                <View style={LoginStyle.dontaccount}>
                  <TextView>{AllStrings.DonAccount}</TextView>
                  <TextView
                    textSty={LoginStyle.signUpext}
                    onPressText={() => {
                      navigation.navigate(navigationString.SignUp);
                      // navigation.navigate(navigationString.SignUpBusiness);
                    }}>
                    {AllStrings.Signup}
                  </TextView>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
        <CustomAlert
          visible={showAlert}
          message={alertMessage} // Pass the dynamic message
          onClose={handleCloseAlert}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
