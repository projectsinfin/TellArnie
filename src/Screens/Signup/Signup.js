import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import imagePath from "../../Constant/imagePath";
import SignupStyle from "./SignupStyle";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import Button from "../../Components/Button";
import InputFields from "../../Components/InputFields";
import navigationString from "../../Navigations/navigationString";
import countryPhoneCodes from "../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import Colors from "../../Styles/Colors";
import { moderateScale } from "../../Styles/responsiveSize";
import { Formik, Field } from "formik";
import { SignUpSchema } from "../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { call_SignUp_Api } from "../../redux/action/AuthAction";
import Loading from "../../Components/Loading";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import CustomAlert from "../../Components/CustomAlert";

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();

  const { isLoading, error, user } = useSelector((state) => state.auths);

  const [check, setCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  console.log(country_Code, "country_Code");

  useEffect(() => {
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      console.log("hksjadahsd", JSON.stringify(info));
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

  // call Signup Api
  const handleSignUp = async (val) => {
    if (check === false) {
      return handleShowAlert("Please select terms and conditions.");
    }
    const payload = {
      // email: val.businessEmail.toLowerCase(),
      email: val.businessEmail,
      first_name: val.firstName,
      last_name: val.lastName,
      location: val.officeLocation,
      contact_number: val.phoneNumber,
      employee_id: val.employeeId,
      job_title: val.jobTitle,
      country_code: country_Code,
      fcm_token: global.fcmToken,
    };
    console.log(payload, "---signup-paylod");
    dispatch(call_SignUp_Api(payload))
      .then((res) => {
        console.log(
          "signup api response in login screen--",
          JSON.stringify(res.payload)
        );
        if (res.payload.status === 200) {
          navigation.navigate(navigationString.OPT, {
            key: "Signup",
          });
        } else {
          handleShowAlert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function to handle country selection from modal
  const handleCountrySelect = (selected) => {
    setCountryName(selected.cca2);
    setModalVisible(false); // Close the modal after selecting a country
  };

  // Function to handle opening of the modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  // Function to handle closing of the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        businessEmail: "",
        officeLocation: "",
        phoneNumber: "",
        jobTitle: "",
        employeeId: "",
      }}
      validationSchema={SignUpSchema(countryName, country_Code)}
      onSubmit={(values) => handleSignUp(values)}>
      {({
        handleChange,
        handleSubmit,
        touched,
        values,
        errors,
        isValid,
        setFieldTouched,
      }) => (
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "null"}
          style={{ flex: 1, backgroundColor: "#fff" }}>
          <SafeAreaView style={{ flex: 1 }}>
            <Modal animated={true} transparent={true} visible={isLoading}>
              <Loading />
            </Modal>
            <CustomAlert
              visible={showAlert}
              message={alertMessage} // Pass the dynamic message
              onClose={handleCloseAlert}
            />
            <ScrollView
              automaticallyAdjustKeyboardInsets={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled">
              <View style={{ flex: 0.3 }}>
                <Image
                  source={imagePath.HearderImage}
                  resizeMode="stretch"
                  style={{ width: "100%", marginTop: -20 }}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={{ ...SignupStyle.inner }}>
                  <TextView
                    heading
                    headingTextSty={{
                      marginTop: moderateScale(1),
                    }}>
                    {AllStrings.CreateAccount}
                  </TextView>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      marginTop: 10,
                    }}>
                    {AllStrings.Registerinformation}
                  </TextView>
                  <View>
                    <InputFields
                      placeholder="First Name"
                      onChangeText={handleChange("firstName")}
                      value={values.firstName}
                      handleBlurs={() => setFieldTouched("firstName")}
                    />
                    {touched.firstName && errors.firstName && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.firstName}
                      </TextView>
                    )}

                    <InputFields
                      placeholder="Last Name"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      handleBlurs={() => setFieldTouched("lastName")}
                    />

                    {touched.lastName && errors.lastName && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.lastName}
                      </TextView>
                    )}

                    <InputFields
                      placeholder="Business Email"
                      keyboardType="email-address"
                      autoCapitalize
                      value={values.businessEmail.toLowerCase()}
                      onChangeText={handleChange("businessEmail")}
                      handleBlurs={() => setFieldTouched("businessEmail")}
                      textContentType="emailAddress"
                      autoComplete="email"
                    />

                    {touched.businessEmail && errors.businessEmail && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.businessEmail}
                      </TextView>
                    )}
                    <InputFields
                      placeholder="Office Location"
                      value={values.officeLocation}
                      onChangeText={handleChange("officeLocation")}
                      handleBlurs={() => setFieldTouched("officeLocation")}
                    />
                    {errors.officeLocation && touched.officeLocation ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.officeLocation}
                      </TextView>
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <View
                        style={{
                          ...SignupStyle.countryContainer,
                        }}>
                        <View
                          style={{
                            ...SignupStyle.countryModal,
                            width: "0",
                          }}>
                          <CountryPicker
                            {...{
                              countryCode: countryName,
                              withFilter: true,
                              withFlag: true,
                              withAlphaFilter: true,
                              onClose: handleCloseModal,
                              visible: modalVisible,
                              onSelect: (selected) => {
                                handleCountrySelect(selected);
                                // setCountryName(selected.cca2);
                                // setModalVisible(false);
                              },
                            }}
                            // visible={false}
                          />
                        </View>
                        <View
                          style={{
                            ...SignupStyle.countrytext,
                            position: "relative",
                            marginLeft: 0,
                          }}>
                          <TextView textSty={{ fontSize: 14 }}>
                            {country_Code}
                          </TextView>
                          <TouchableOpacity onPress={() => handleOpenModal()}>
                            <Image
                              source={imagePath.downArrow}
                              resizeMode="contain"
                              style={{
                                ...SignupStyle.downArrow,
                                width: responsiveWidth(3),
                                height: responsiveHeight(3),
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={{ width: "70%" }}>
                        <InputFields
                          placeholder="Number"
                          keyboardType="phone-pad"
                          value={values.phoneNumber}
                          onChangeText={handleChange("phoneNumber")}
                          handleBlurs={() => setFieldTouched("phoneNumber")}
                        />
                      </View>
                    </View>
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.phoneNumber}
                      </TextView>
                    ) : null}
                    <InputFields
                      placeholder="Employee ID (Optional)"
                      value={values.employeeId}
                      onChangeText={handleChange("employeeId")}
                      handleBlurs={() => setFieldTouched("employeeId")}
                    />
                    <InputFields
                      placeholder="Job Title"
                      value={values.jobTitle}
                      onChangeText={handleChange("jobTitle")}
                      handleBlurs={() => setFieldTouched("jobTitle")}
                    />
                    {errors.jobTitle && touched.jobTitle ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.jobTitle}
                      </TextView>
                    ) : null}
                  </View>

                  {/* code of I agree to the terms and conditions*/}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 20,
                    }}>
                    <TouchableOpacity onPress={() => setCheck(!check)}>
                      <Image
                        source={
                          check
                            ? imagePath.fullCheckBoxIcon
                            : imagePath.CheckBoxIcon
                        }
                        resizeMode="contain"
                        style={{ width: 28, height: 28 }}
                      />
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", marginLeft: 5 }}>
                      <TextView>{AllStrings.Iagreetermsconditions}</TextView>
                      <TextView>{AllStrings.termsconditions}</TextView>
                    </View>
                  </View>

                  {/* code of receive product information and offers from this app (optional)*/}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                    }}>
                    <TouchableOpacity onPress={() => setShow(!show)}>
                      <Image
                        source={
                          show
                            ? imagePath.fullCheckBoxIcon
                            : imagePath.CheckBoxIcon
                        }
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    <TextView textSty={{ marginLeft: 5, width: "80%" }}>
                      {AllStrings.termsproductconditions}
                    </TextView>
                  </View>

                  <View style={SignupStyle.btnContainer}>
                    <Button
                      onClick={handleSubmit}
                      allButtonSty={{
                        alignSelf: "center",
                        width: "80%",
                        marginTop: 25,
                      }}
                      btnName="Sign Up"
                      buttonColor={Colors.black}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 25,
                      }}>
                      <TextView>{AllStrings.Alreadyaccount} </TextView>
                      <TextView
                        textSty={{
                          marginLeft: 2,
                          fontWeight: "900",
                          textDecorationLine: "underline",
                        }}
                        onPressText={() => {
                          navigation.navigate(navigationString.LogIn);
                        }}>
                        {AllStrings.SignIn}
                      </TextView>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default Signup;

const styles = StyleSheet.create({});
