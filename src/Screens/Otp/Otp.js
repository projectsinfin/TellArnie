// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   Modal,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import React, { useState } from "react";
// import ContainerView from "../../Components/ContainerView";
// import imagePath from "../../Constant/imagePath";
// import AllStrings from "../../Constant/AllStrings";
// import TextView from "../../Components/TextView";
// import InputFields from "../../Components/InputFields";
// import OtpStyles from "./OtpStyles";
// import Button from "../../Components/Button";
// import navigationString from "../../Navigations/navigationString";
// import {
//   CodeField,
//   Cursor,
//   useBlurOnFulfill,
//   useClearByFocusCell,
// } from "react-native-confirmation-code-field";
// import Colors from "../../Styles/Colors";
// import { useDispatch, useSelector } from "react-redux";
// import { Formik } from "formik";
// import { OtpSchema } from "../../utils/Validation";
// import {
//   call_Otp_Api,
//   call_ResetPassword_API,
//   login,
// } from "../../redux/action/AuthAction";
// import Loading from "../../Components/Loading";
// import { saveUserData } from "../../redux/reducer/auth";
// import ModalScreen from "../../Components/ModalScreen";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomAlert from "../../Components/CustomAlert";

// const Otp = ({ navigation, route }) => {
//   const dispatch = useDispatch();
//   const [popUpStatus, setPopUPStatus] = useState(true);
//   const { isLoading, error, user } = useSelector((state) => state.auths);

//   const [value, setValue] = useState();

//   const [password, setPassword] = useState("");
//   const [ConfirmPassword, setConfirmPassword] = useState("");
//   const [isLoadings, setIsLoadings] = useState(false);

//   const [showPass, setShowPass] = useState(true);
//   const [showConfirmPass, setConfirmShowPass] = useState(true);
//   const [props, getCellOnLayoutHandler] = useClearByFocusCell({
//     value,
//     setValue,
//   });
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   const handleShowAlert = (message) => {
//     setAlertMessage(message); // Set the dynamic message
//     setShowAlert(true);
//   };

//   const handleCloseAlert = () => {
//     setShowAlert(false);
//     navigation.navigate(navigationString.LogIn);
//   };
//   const CELL_COUNT = 6;
//   const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

//   console.log(value, "--otp val", user);
//   const handleOtp = (val) => {
//     setIsLoadings(true);
//     const payload = {
//       user_id: user?.data?.user_id,
//       otp: parseInt(value),
//       password: val.password,
//     };
//     dispatch(call_Otp_Api(payload))
//       .then(async (res) => {
//         console.log(
//           "OTP api response in OTP screen--",
//           JSON.stringify(res.payload)
//         );
//         if (res.payload.status == 200) {
//           setIsLoadings(false);
//           if (res.payload.data.is_register_company === false) {
//             navigation.navigate(navigationString.SignUpBusiness);
//           } else {
//             if (res.payload.data.is_approved === false) {
//               return handleShowAlert(
//                 "Your account has been created and an email has been sent to the superadmin. It is now awaiting approval. Thank you for your patience."
//                 // "Your account has been created and is awaiting approval from the superadmin. Thank you for your patience."
//               );
//             }
//             const AccessToken = res.payload.data.access_token;
//             const ReffToken = res.payload.data.refresh_token;
//             const role = res.payload.data.role;
//             dispatch(saveUserData({ isLogin: true }));
//             dispatch(login(AccessToken, ReffToken, role));
//             await AsyncStorage.setItem(
//               "globalData",
//               JSON.stringify(res.payload)
//             );
//           }
//         } else {
//           setIsLoadings(false);
//           alert(res.payload.message);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleSaveBtn = () => {
//     // alert("111");
//     if (password !== ConfirmPassword) {
//       return alert("Confirm password must be matched!");
//     }
//     setIsLoadings(true);
//     const payload = {
//       otp: parseInt(value),
//       password: password,
//       confirm_password: ConfirmPassword,
//       user_id: route.params?.id,
//     };
//     dispatch(call_ResetPassword_API(payload))
//       .then((res) => {
//         if (res.payload.status == 200) {
//           setIsLoadings(false);
//           console.log("Reset successfully screen--", res.payload.data);
//           const AccessToken = res.payload.data.access_token;
//           const ReffToken = res.payload.data.refresh_token;
//           dispatch(saveUserData({ isLogin: true }));
//           dispatch(login(AccessToken, ReffToken));
//         } else {
//           setIsLoadings(false);
//           alert(res.payload.message);
//         }
//       })
//       .catch((err) => {
//         setIsLoadings(false);
//         console.log(err);
//       });
//   };

//   return (
//     <Formik
//       initialValues={{ password: "" }}
//       validationSchema={OtpSchema}
//       onSubmit={(values) => handleOtp(values)}>
//       {({
//         handleChange,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//         setFieldTouched,
//       }) => (
//         // <ContainerView style={{ flex: 1 }}>
//         <KeyboardAvoidingView
//           // behavior={Platform.OS === "ios" ? "padding" : "null"}
//           style={{ flex: 1, backgroundColor: "#fff" }}>
//           <ScrollView
//             style={{ flex: 1 }}
//             automaticallyAdjustKeyboardInsets={true}
//             showsVerticalScrollIndicator={false}>
//             <SafeAreaView>
//               <Modal animated={true} transparent={true} visible={isLoadings}>
//                 <Loading />
//               </Modal>
//               <View style={{ flex: 0.3 }}>
//                 <Image
//                   source={imagePath.HearderImage}
//                   resizeMode="stretch"
//                   style={{ width: "100%", marginTop: -20 }}
//                 />
//               </View>
//               <View style={{ flex: 0.7 }}>
//                 <View style={OtpStyles.inner}>
//                   <TextView heading>{AllStrings.EnterOTP}</TextView>
//                   <TextView
//                     textSty={{ fontSize: 14, lineHeight: 21, marginTop: 10 }}>
//                     {AllStrings.OtpSendMess}
//                   </TextView>
//                   <View style={{ width: "100%" }}>
//                     <CodeField
//                       ref={ref}
//                       {...props}
//                       // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
//                       value={value}
//                       onChangeText={setValue}
//                       cellCount={CELL_COUNT}
//                       rootStyle={OtpStyles.codeFieldRoot}
//                       keyboardType="number-pad"
//                       textContentType="oneTimeCode"
//                       renderCell={({ index, symbol, isFocused }) => (
//                         <Text
//                           key={index}
//                           style={[
//                             OtpStyles.cell,
//                             isFocused && OtpStyles.focusCell,
//                           ]}
//                           onLayout={getCellOnLayoutHandler(index)}>
//                           {symbol || (isFocused ? <Cursor /> : null)}
//                         </Text>
//                       )}
//                     />
//                   </View>
//                   <View style={{ marginTop: "10%" }}>
//                     <TextView
//                       heading
//                       headingTextSty={{
//                         fontSize: 14,
//                         color: "#000000",
//                         marginBottom: -20,
//                       }}>
//                       {AllStrings.ChoosePassword}
//                     </TextView>

//                     <InputFields
//                       value={
//                         route.params?.key == "forgotPassword"
//                           ? password
//                           : values.password
//                       }
//                       onChangeText={
//                         route.params?.key == "forgotPassword"
//                           ? (text) => setPassword(text)
//                           : handleChange("password")
//                       }
//                       isChecked
//                       placeholder={
//                         route.params?.key == "forgotPassword"
//                           ? "New Password"
//                           : "Password"
//                       }
//                       SecureTextEntrys={showPass}
//                       source={
//                         showPass
//                           ? imagePath.OpenEyeIcon
//                           : imagePath.ClosedEyeIcon
//                       }
//                       iconPress={() => setShowPass(!showPass)}
//                       handleBlurs={() => setFieldTouched("password")}
//                     />
//                     {route.params?.key !== "forgotPassword" &&
//                       touched.password &&
//                       errors.password && (
//                         <TextView textSty={{ color: Colors.danger }}>
//                           {errors.password}
//                         </TextView>
//                       )}
//                     {route.params?.key == "forgotPassword" && (
//                       <>
//                         <InputFields
//                           value={ConfirmPassword}
//                           onChangeText={(e) => setConfirmPassword(e)}
//                           isChecked
//                           placeholder="Confirm New Password"
//                           SecureTextEntrys={showConfirmPass}
//                           source={
//                             showConfirmPass
//                               ? imagePath.OpenEyeIcon
//                               : imagePath.ClosedEyeIcon
//                           }
//                           iconPress={() => setConfirmShowPass(!showConfirmPass)}
//                         />
//                         {/* {errors.password && (
//                           <TextView textSty={{ color: Colors.danger }}>
//                             {errors.password}
//                           </TextView>
//                         )} */}
//                       </>
//                     )}
//                   </View>

//                   <View style={OtpStyles.btnContainer}>
//                     <Button
//                       onClick={
//                         route.params?.key == "forgotPassword"
//                           ? () => handleSaveBtn()
//                           : handleSubmit
//                       }
//                       buttonColor={Colors.black}
//                       allButtonSty={{
//                         alignSelf: "center",
//                         width: "80%",
//                         marginTop: 35,
//                         marginBottom: 20,
//                       }}
//                       btnName={
//                         route.params?.key == "forgotPassword"
//                           ? "Save"
//                           : AllStrings.CompleteSignUp
//                       }
//                     />
//                   </View>
//                 </View>
//               </View>
//               {popUpStatus && (
//                 <ModalScreen
//                   success
//                   successText
//                   visible={popUpStatus}
//                   // modalheading={AllStrings.KeepUpdated}
//                   modalText={
//                     route.params?.key == "forgotPassword"
//                       ? "Email send successfully"
//                       : user?.data?.message
//                     // "OTP has been sent to your email. Please check your spam/junk folder."
//                   }
//                   btnName1="Ok"
//                   buttonColor={Colors.black}
//                   modalButton1={() => {
//                     // navigation.navigate(navigationString.kitsFound, {
//                     //   qrCode: route?.params?.qrCode,
//                     // });
//                     setPopUPStatus(false);
//                   }}
//                 />
//               )}
//               <CustomAlert
//                 visible={showAlert}
//                 message={alertMessage} // Pass the dynamic message
//                 onClose={handleCloseAlert}
//               />
//             </SafeAreaView>
//           </ScrollView>
//         </KeyboardAvoidingView>
//         // </ContainerView>
//       )}
//     </Formik>
//   );
// };

// export default Otp;

// const styles = StyleSheet.create({});

import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup"; // Import Yup for validation schema
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ContainerView from "../../Components/ContainerView";
import imagePath from "../../Constant/imagePath";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import InputFields from "../../Components/InputFields";
import OtpStyles from "./OtpStyles";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import {
  call_Otp_Api,
  call_ResetPassword_API,
  login,
} from "../../redux/action/AuthAction";
import Loading from "../../Components/Loading";
import { saveUserData } from "../../redux/reducer/auth";
import ModalScreen from "../../Components/ModalScreen";
import CustomAlert from "../../Components/CustomAlert";
import Colors from "../../Styles/Colors";

const Otp = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [showConfirmPass, setConfirmShowPass] = useState(true);
  const [isLoadings, setIsLoadings] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { user, isLoading, error } = useSelector((state) => state.auths);

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigation.navigate(navigationString.LogIn);
  };

  // Debug: Check route.params
  console.log("Route Params:", route.params);

  const handleOtp = (val) => {
    setIsLoadings(true);
    const payload = {
      user_id: user?.data?.user_id,
      otp: parseInt(value),
      password: val.password,
    };
    console.log("sign up otp =================>", payload);
    dispatch(call_Otp_Api(payload))
      .then(async (res) => {
        if (res.payload.status == 200) {
          console.log("sign up otp =================>", payload);
          setIsLoadings(false);
          if (res.payload?.data?.is_register_company === false) {
            navigation.navigate(navigationString.SignUpBusiness);
          } else {
            if (res.payload.data.is_approved === false) {
              return handleShowAlert(
                "Your account has been created and an email has been sent to the superadmin. It is now awaiting approval. Thank you for your patience."
              );
            }
            const AccessToken = res.payload.data.access_token;
            const ReffToken = res.payload.data.refresh_token;
            const role = res.payload.data.role;
            dispatch(saveUserData({ isLogin: true }));
            dispatch(login(AccessToken, ReffToken, role));
            await AsyncStorage.setItem(
              "globalData",
              JSON.stringify(res.payload)
            );
          }
        } else {
          setIsLoadings(false);
          alert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSaveBtn = (values) => {
    setIsLoadings(true);
    const payload = {
      otp: parseInt(value),
      // password: password,
      // confirm_password: ConfirmPassword,
      password: values?.password,
      confirm_password: values?.confirmPassword,
      user_id: route.params?.id,
    };

    dispatch(call_ResetPassword_API(payload))
      .then((res) => {
        if (res.payload.status == 200) {
          setIsLoadings(false);
          const AccessToken = res.payload.data.access_token;
          const ReffToken = res.payload.data.refresh_token;
          dispatch(saveUserData({ isLogin: true }));
          dispatch(login(AccessToken, ReffToken));
        } else {
          setIsLoadings(false);
          alert(res.payload.message);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log(err);
      });
  };

  // Create validation schema dynamically
  const getValidationSchema = () => {
    if (route.params?.key === "forgotPassword") {
      return Yup.object().shape({
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      });
    }
    return Yup.object().shape({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }} // Add confirmPassword for forgotPassword case
      validationSchema={getValidationSchema()} // Dynamically set validation schema
      onSubmit={(values) => {
        console.log("Form Values:", values); // Debug: Check form values on submission
        if (route.params?.key === "forgotPassword") {
          handleSaveBtn(values);
        } else {
          handleOtp(values);
        }
      }}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}>
            <SafeAreaView>
              <Modal animated={true} transparent={true} visible={isLoadings}>
                <Loading />
              </Modal>
              <View style={{ flex: 0.3 }}>
                <Image
                  source={imagePath.HearderImage}
                  resizeMode="stretch"
                  style={{ width: "100%", marginTop: -20 }}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={OtpStyles.inner}>
                  <TextView heading>{AllStrings.EnterOTP}</TextView>
                  <TextView
                    textSty={{ fontSize: 14, lineHeight: 21, marginTop: 10 }}>
                    {AllStrings.OtpSendMess}
                  </TextView>
                  <View style={{ width: "100%" }}>
                    <CodeField
                      ref={ref}
                      {...props}
                      value={value}
                      onChangeText={setValue}
                      cellCount={CELL_COUNT}
                      rootStyle={OtpStyles.codeFieldRoot}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      renderCell={({ index, symbol, isFocused }) => (
                        <Text
                          key={index}
                          style={[
                            OtpStyles.cell,
                            isFocused && OtpStyles.focusCell,
                          ]}
                          onLayout={getCellOnLayoutHandler(index)}>
                          {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                      )}
                    />
                  </View>
                  <View style={{ marginTop: "10%" }}>
                    <TextView
                      heading
                      headingTextSty={{
                        fontSize: 14,
                        color: "#000000",
                        marginBottom: -20,
                      }}>
                      {AllStrings.ChoosePassword}
                    </TextView>

                    <InputFields
                      value={values.password}
                      onChangeText={handleChange("password")}
                      isChecked
                      placeholder={
                        route.params?.key == "forgotPassword"
                          ? "New Password"
                          : "Password"
                      }
                      SecureTextEntrys={showPass}
                      source={
                        showPass
                          ? imagePath.OpenEyeIcon
                          : imagePath.ClosedEyeIcon
                      }
                      iconPress={() => setShowPass(!showPass)}
                      handleBlurs={() => setFieldTouched("password")}
                    />
                    {touched.password && errors.password && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.password}
                      </TextView>
                    )}
                    {route.params?.key == "forgotPassword" && (
                      <>
                        <InputFields
                          value={values.confirmPassword}
                          onChangeText={handleChange("confirmPassword")}
                          isChecked
                          placeholder="Confirm Password"
                          SecureTextEntrys={showConfirmPass}
                          source={
                            showConfirmPass
                              ? imagePath.OpenEyeIcon
                              : imagePath.ClosedEyeIcon
                          }
                          iconPress={() => setConfirmShowPass(!showConfirmPass)}
                          handleBlurs={() => setFieldTouched("confirmPassword")}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                          <TextView textSty={{ color: Colors.danger }}>
                            {errors.confirmPassword}
                          </TextView>
                        )}
                      </>
                    )}
                  </View>

                  {/* <View style={{ marginTop: "15%" }}>
                    <Button onPress={handleSubmit}>
                      {route.params?.key == "forgotPassword"
                        ? "Save"
                        : AllStrings.CompleteSignUp}
                    </Button>
                  </View> */}

                  <View style={OtpStyles.btnContainer}>
                    <Button
                      onClick={handleSubmit}
                      buttonColor={Colors.black}
                      allButtonSty={{
                        alignSelf: "center",
                        width: "80%",
                        marginTop: 35,
                        marginBottom: 20,
                      }}
                      btnName={
                        route.params?.key == "forgotPassword"
                          ? "Save"
                          : AllStrings.CompleteSignUp
                      }
                    />
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default Otp;
