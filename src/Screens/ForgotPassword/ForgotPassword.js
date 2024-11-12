import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import ContainerView from "../../Components/ContainerView";
import imagePath from "../../Constant/imagePath";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import InputFields from "../../Components/InputFields";
import OtpStyles from "../Otp/OtpStyles";
import Button from "../../Components/Button";
import Colors from "../../Styles/Colors";
import { Formik } from "formik";
import navigationString from "../../Navigations/navigationString";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { ForgotPasswordSchema } from "../../utils/Validation";
import { useDispatch } from "react-redux";
import { call_ForgetPassword_API } from "../../redux/action/AuthAction";

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleForgot = (value) => {
    const payload = {
      // email: value.email?.toLowerCase(),
      email: value.email,
    };
    dispatch(call_ForgetPassword_API(payload))
      .then((res) => {
        console.log("forgot pass api res----", res.payload);
        if (res.payload.status === 200) {
          navigation.navigate(navigationString.OPT, {
            key: "forgotPassword",
            id: res.payload?.data?.user_id,
          });
        } else {
          alert(res.payload.message);
        }
      })
      .catch((err) => console.log("forgot error ---", err));
  };
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={(values) => handleForgot(values)}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        // <ContainerView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "null"}
          style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}>
            <SafeAreaView>
              <View style={{ flex: 0.3 }}>
                <Image
                  source={imagePath.HearderImage}
                  resizeMode="stretch"
                  style={{ width: "100%", marginTop: -20 }}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.goBack()}
                  style={{
                    alignItems: "flex-end",
                    alignSelf: "flex-end",
                    position: "absolute",
                    // right: 5,
                  }}>
                  <Image
                    tintColor={Colors.white}
                    source={imagePath.backArrow}
                    style={styles.backIconSty}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={OtpStyles.inner}>
                  <TextView heading>Forgot Password</TextView>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      marginTop: 10,
                    }}>
                    Enter your registered email address
                  </TextView>

                  <View style={{ marginTop: 20 }}>
                    <InputFields
                      autoCapitalize
                      placeholder="Business Email"
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      value={values.email}
                      handleBlurs={() => setFieldTouched("email")}
                      textContentType="emailAddress"
                      autoComplete="email"
                    />
                    {touched.email && errors.email && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.email}
                      </TextView>
                    )}
                  </View>

                  <View style={OtpStyles.btnContainer}>
                    <Button
                      onClick={handleSubmit}
                      buttonColor={Colors.black}
                      allButtonSty={{
                        alignSelf: "center",
                        width: "80%",
                        marginTop: 35,
                      }}
                      btnName={"Reset Password"}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 15,
                      }}>
                      <TextView>{AllStrings.DonAccount}</TextView>
                      <TextView
                        textSty={{
                          marginLeft: 2,
                          fontWeight: "900",
                          textDecorationLine: "underline",
                        }}
                        onPressText={() => {
                          navigation.navigate(navigationString.SignUp);
                        }}>
                        {AllStrings.Signup}
                      </TextView>
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
        // </ContainerView>
      )}
    </Formik>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  backIconSty: {
    width: responsiveWidth(12),
    height: responsiveHeight(7),
    right: 15,
  },
});
