import {
  Image,
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import ContainerView from "../../Components/ContainerView";
import imagePath from "../../Constant/imagePath";
import SignupStyle from "./SignupStyle";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import Button from "../../Components/Button";
import InputFields from "../../Components/InputFields";
import countryPhoneCodes from "../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import Colors from "../../Styles/Colors";
import navigationString from "../../Navigations/navigationString";
import { useDispatch, useSelector } from "react-redux";
import { saveUserData } from "../../redux/reducer/auth";
import {
  Call_RegisterApproval_Api,
  login,
} from "../../redux/action/AuthAction";
import { Formik } from "formik";
import { ApprovalsContactValidation } from "../../utils/Validation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApprovalsContact = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { isLoading, error, user } = useSelector((state) => state.auths);

  const onLogin = async () => {
    const AccessToken = route.params?.registerData.access_token;
    const ReffToken = route.params?.registerData.refresh_token;
    dispatch(saveUserData({ isLogin: true }));
    dispatch(login(AccessToken, ReffToken));
    await AsyncStorage.setItem("globalData", JSON.stringify(user));
    console.log("Data saved successfully.");
  };

  // handle  handleRegisterApprovel functionality
  const handleRegisterApprovel = (val) => {
    console.log("approval dynamic data", val);
    const payload = {
      // email: val.BusinessName?.toLowerCase(),
      email: val.BusinessName,
      first_name: val.first_name,
      last_name: val.last_name,
      contact_number: val.contact_number,
      employee_id: val.employee_id,
      job_title: val.job_title,
      country_code: country_Code,
      company_id: user.data.company_id,
      user_id: user?.data?.user_id,
    };
    dispatch(Call_RegisterApproval_Api(payload))
      .then(async (res) => {
        console.log(
          "Call_RegisterApprover_Api api response in Approvals screen--",
          JSON.stringify(res.payload)
        );
        if (res.payload.status === 200) {
          const AccessToken = res.payload.data.access_token;
          const ReffToken = res.payload.data.refresh_token;
          dispatch(saveUserData({ isLogin: true }));
          dispatch(login(AccessToken, ReffToken));
          await AsyncStorage.setItem("globalData", JSON.stringify(res.payload));
          console.log("Data saved successfully.");
          // alert(res.payload.message);
        } else {
          alert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  // console.log(country_Code, "country_Code");

  useEffect(() => {
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      console.log("hksjadahsd", JSON.stringify(info));
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

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

  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        BusinessName: "",
        country_code: "",
        contact_number: "",
        employee_id: "",
        job_title: "",
      }}
      validationSchema={ApprovalsContactValidation(countryName, country_Code)}
      onSubmit={(values) => handleRegisterApprovel(values)}>
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
          style={{ flex: 1, backgroundColor: Colors.white }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}>
              <View style={{ flex: 0.3 }}>
                <Image
                  source={imagePath.HearderImage}
                  resizeMode="stretch"
                  style={{ width: "100%", marginTop: -20 }}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={SignupStyle.inner}>
                  <TextView heading>{AllStrings.ApprovalsCon}</TextView>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      marginTop: 10,
                    }}>
                    {AllStrings.Purchasinginformation}
                  </TextView>
                  <View>
                    <InputFields
                      placeholder="First Name"
                      onChangeText={handleChange("first_name")}
                      value={values.first_name}
                      handleBlurs={() => setFieldTouched("first_name")}
                    />
                    {errors.first_name && touched.first_name && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.first_name}
                      </TextView>
                    )}
                    <InputFields
                      placeholder="Last Name"
                      onChangeText={handleChange("last_name")}
                      value={values.last_name}
                      handleBlurs={() => setFieldTouched("last_name")}
                    />
                    {errors.last_name && touched.last_name && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.last_name}
                      </TextView>
                    )}
                    <InputFields
                      autoCapitalize
                      keyboardType="email-address"
                      placeholder="Business Email"
                      onChangeText={handleChange("BusinessName")}
                      value={values.BusinessName}
                      handleBlurs={() => setFieldTouched("BusinessName")}
                      textContentType="emailAddress"
                      autoComplete="email"
                    />
                    {errors.BusinessName && touched.BusinessName && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.BusinessName}
                      </TextView>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "29%",
                          height: 40,
                          alignItems: "center",
                          alignSelf: "center",
                          marginTop: 20,
                          borderWidth: 1,
                          borderColor: Colors.dividerLight,
                          borderRadius: 5,
                          justifyContent: "space-evenly",
                        }}>
                        <View style={{ marginRight: -13 }}>
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
                              },
                            }}
                            // visible={false}
                          />
                        </View>
                        <TextView textSty={{ fontSize: 14 }}>
                          {country_Code}
                        </TextView>
                        <TouchableOpacity onPress={() => handleOpenModal()}>
                          <Image
                            source={imagePath.downArrow}
                            resizeMode="contain"
                            style={{ width: 10, height: 10, paddingLeft: 10 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: "70%" }}>
                        <InputFields
                          placeholder="Number"
                          keyboardType="phone-pad"
                          onChangeText={handleChange("contact_number")}
                          value={values.contact_number}
                          handleBlurs={() => setFieldTouched("contact_number")}
                        />
                      </View>
                    </View>
                    {errors.contact_number && touched.contact_number && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.contact_number}
                      </TextView>
                    )}
                    <InputFields
                      placeholder="Employee ID (optional)"
                      onChangeText={handleChange("employee_id")}
                      value={values.employee_id}
                    />

                    <InputFields
                      placeholder="Job Title"
                      onChangeText={handleChange("job_title")}
                      value={values.job_title}
                      handleBlurs={() => setFieldTouched("job_title")}
                    />
                    {errors.job_title && touched.job_title && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.job_title}
                      </TextView>
                    )}
                  </View>

                  <Button
                    onClick={handleSubmit}
                    allButtonSty={{
                      alignSelf: "center",
                      width: "100%",
                      marginTop: 25,
                    }}
                    btnName="Register Approvals Officer"
                    buttonColor={Colors.black}
                  />
                  <TextView
                    onPressText={() => onLogin()}
                    textSty={{
                      fontSize: 14,
                      color: Colors.black,
                      textAlign: "center",
                      margin: 10,
                    }}>
                    Set up later
                  </TextView>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default ApprovalsContact;
