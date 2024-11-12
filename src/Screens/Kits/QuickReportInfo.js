import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import InputFields from "../../Components/InputFields";
import countryPhoneCodes from "../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import CustomDropdown from "../../Components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Button from "../../Components/Button";
import ModalScreen from "../../Components/ModalScreen";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { call_IncidentCategory_Api } from "../../redux/action/IncidentReport";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomAlert from "../../Components/CustomAlert";

const QuickReportInfo = ({ navigation }) => {
  const dispatch = useDispatch();

  const { isLoading, error, profileDetails } = useSelector(
    (state) => state.profileData
  );

  const { installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );

  const [categoryData, setCategoryData] = useState(null);
  const [classificationData, setClassificationData] = useState(null);
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedTime = moment(date).format("HH:mm");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const onChange = (date) => {
    console.log(date, "****************");
    setDate(date);
    setShow(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [selecteDescription, setSelecteDescription] = useState(null);

  const handleSelect = (item) => {
    console.log(item, "selected item");
    setSelectedItem(item);
    setClassificationData(item.description);
  };
  const handleSelects = (item) => {
    console.log(item, "selected item");
    setSelecteDescription(item);
    setClassificationData(item.description);
  };

  useEffect(() => {
    getIncidentCategory();
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      console.log("hksjadahsd", JSON.stringify(info));
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

  useEffect(() => {
    if (profileDetails?.data?.user_details?.country_code) {
      // If the user's country code is +91, set the country_Code to +91
      set_Country_Code(profileDetails?.data?.user_details?.country_code);
      // setCountryName("IN");
      const info = countryPhoneCodes.filter((el) => {
        return profileDetails?.data?.user_details?.country_code == el.dial_code
          ? el.code
          : null;
      });
      if (info.length > 0) {
        setCountryName(info[0].code);
      }
    } else {
      // Otherwise, set the country_Code to an empty string
      set_Country_Code("");
    }
  }, [profileDetails]);

  const getIncidentCategory = () => {
    dispatch(call_IncidentCategory_Api())
      .then((res) => {
        // console.log("----11---", JSON.stringify(res.payload.data));
        if (res.payload.status == 200) {
          setCategoryData(res.payload.data.Incidents);
        } else {
          handleShowAlert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleContinue = (val) => {
    // if (selectedItem == null) {
    //   return handleShowAlert("Select category of incident!");
    // }
    // if (selecteDescription == null) {
    //   return handleShowAlert("Select classification!");
    // }
    var datestr = new Date(date).toUTCString();
    const payload = {
      // categoryIncident: selectedItem.name,
      // classification: selecteDescription,
      categoryIncident: "",
      classification: "",
      date: datestr,
      time: formattedTime,
      brief: val.brief_summary?.trim(),
    };
    // console.log(payload, "type value s ofnkjfklsajdlasjd");
    navigation.navigate(navigationString.quickReportInfo2Nav, { payload });
  };

  console.log(
    installKitDetails?.data?.kit,
    "---profileDetails-----",
    profileDetails
  );

  return (
    <Formik
      // enableReinitialize
      initialValues={{
        brief_summary: "",
      }}
      // validationSchema={SignUpSchema}
      onSubmit={(values) => handleContinue(values)}>
      {({ handleChange, handleSubmit, values, errors }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "null"}
          style={{ flex: 1 }}>
          <SafeAreaView
            style={{ height: "100%", backgroundColor: Colors.primary }}>
            <Header
              back={() => navigation.navigate(navigationString.profile)}
              backIcon={imagePath.backArrow}
              editHeader={() => navigation.goBack()}
            />
            <CustomAlert
              visible={showAlert}
              message={alertMessage} // Pass the dynamic message
              onClose={handleCloseAlert}
            />
            <View style={kitsStyles.container}>
              <View
                style={{
                  ...kitsStyles.heading,
                  marginTop: 15,
                  marginHorizontal: 20,
                }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  automaticallyAdjustKeyboardInsets={true}>
                  <TextView
                    onPress={() =>
                      navigation.navigate(navigationString.quickReportInfoNav)
                    }
                    heading
                    headingTextSty={{
                      ...kitsStyles.headingText,
                      textAlign: "left",
                    }}>
                    {AllStrings.Pleaseprovideinformation}
                  </TextView>
                  <InputFields
                    editDisabled={false}
                    placeholder="First Name"
                    value={profileDetails?.data.user_details.first_name}
                  />
                  <InputFields
                    editDisabled={false}
                    placeholder="Last Name"
                    value={profileDetails?.data.user_details.last_name}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <View style={kitsStyles.countryContainer}>
                      <View style={kitsStyles.countryModal}>
                        <CountryPicker
                          hardwareAccelerated={false}
                          {...{
                            countryCode: countryName,
                            withFilter: true,
                            withFlag: true,
                            withAlphaFilter: true,
                            onSelect: (selected) => {
                              // setCountryName(selected.cca2);
                            },
                          }}
                          visible={false}
                        />
                      </View>
                      <View style={kitsStyles.countrytext}>
                        <TextView textSty={{ fontSize: 14 }}>
                          {country_Code || "+44"}
                        </TextView>
                        <Image
                          source={imagePath.downArrow}
                          resizeMode="contain"
                          style={{ ...kitsStyles.downArrow, marginLeft: 0 }}
                        />
                      </View>
                    </View>
                    <View style={{ width: "70%" }}>
                      <InputFields
                        editDisabled={false}
                        placeholder="Number"
                        keyboardType="phone-pad"
                        value={profileDetails?.data.user_details.contact_number}
                      />
                    </View>
                  </View>
                  <InputFields
                    editDisabled={false}
                    placeholder="Business Email"
                    keyboardType="email"
                    value={profileDetails?.data.user_details.email}
                  />
                  <TextView
                    onPress={() =>
                      navigation.navigate(navigationString.quickReportInfoNav)
                    }
                    heading
                    headingTextSty={{
                      ...kitsStyles.headingText,
                      textAlign: "left",
                    }}>
                    {AllStrings.provideSummaryIndecent}
                  </TextView>

                  <InputFields
                    editDisabled={false}
                    placeholder="Location Name"
                    value={installKitDetails?.data?.kit?.location_name}
                  />
                  <InputFields
                    editDisabled={false}
                    placeholder="Kit Name"
                    value={installKitDetails?.data?.kit?.area}
                  />
                  {/* <CustomDropdown
                    placeholder="Category of Incident"
                    type="category"
                    data={categoryData}
                    onSelect={handleSelect}
                  />
                  <CustomDropdown
                    placeholder="Classification"
                    type="classification"
                    data={classificationData}
                    onSelect={handleSelects}
                  /> */}

                  {/* <TextView onPressText={showTimepicker}>Show time picker!</TextView> */}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        showDatepicker();
                      }}
                      style={{
                        // backgroundColor: "red",
                        justifyContent: "space-around",
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: Colors.dividerLight,
                        padding: 7,
                        marginTop: 20,
                        borderRadius: 5,
                        width: "49%",
                      }}>
                      <View>
                        <TextView textSty={{ fontSize: 14 }}>
                          {formattedDate}
                        </TextView>
                      </View>
                      <View>
                        <View>
                          <Image
                            source={imagePath.datePickerIcon}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        showTimepicker();
                      }}
                      style={{
                        // backgroundColor: "red",
                        justifyContent: "space-around",
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: Colors.dividerLight,
                        padding: 10,
                        marginTop: 20,
                        borderRadius: 5,
                        width: "49%",
                      }}>
                      <View>
                        <TextView textSty={{ fontSize: 14 }}>
                          {formattedTime}
                        </TextView>
                      </View>

                      <View>
                        <View>
                          <Image
                            source={imagePath.timePickerIcon}
                            resizeMode="contain"
                            style={{ width: 17, height: 17 }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <InputFields
                    onChangeText={handleChange("brief_summary")}
                    value={values.brief_summary}
                    placeholder="Brief Summary"
                    multiline={true}
                    textInputFocused={{ height: 90 }}
                    textInput={{ height: 90 }}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}>
                    <Image
                      source={imagePath.firstIndicator}
                      style={{ width: "10%" }}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      marginVertical: 15,
                      marginTop: 35,
                    }}>
                    <Button
                      onClick={() => setShowModal(true)}
                      allButtonSty={{
                        backgroundColor: Colors.black,
                        borderRadius: 10,
                        width: "35%",
                        marginHorizontal: 0,
                      }}
                      buttonColor={Colors.white}
                      btnName="Cancel"
                    />
                    <Button
                      onClick={handleSubmit}
                      allButtonSty={{
                        alignSelf: "center",
                        width: "60%",
                        marginHorizontal: 0,
                        borderRadius: 10,
                      }}
                      btnName="Continue"
                    />
                  </View>

                  {/* {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )} */}
                  {show && (
                    <DateTimePickerModal
                      isVisible={show}
                      testID="dateTimePicker"
                      mode={mode}
                      onConfirm={onChange}
                      onCancel={() => setShow(false)}
                      maximumDate={new Date()}
                    />
                  )}
                  {showModal && (
                    <ModalScreen
                      visible={showModal}
                      modalheading={AllStrings.PleaseConfirm}
                      modalText={AllStrings.Wouldlikecancelreport}
                      btnName="No"
                      btnName1="Yes"
                      buttonColor={Colors.white}
                      btnStyle={{ backgroundColor: Colors.black }}
                      modalButton1={() => {
                        setShowModal(false);
                        navigation.navigate(navigationString.incidentNav);
                      }}
                      modalButton={
                        () => setShowModal(false)
                        // navigation.navigate(navigationString.Approvalcontact)
                      }
                    />
                  )}
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default QuickReportInfo;

const styles = StyleSheet.create({});
