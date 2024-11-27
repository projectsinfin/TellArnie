import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import Colors from "../../Styles/Colors";
import InputFields from "../../Components/InputFields";
import CustomDropdown from "../../Components/CustomDropdown";
import TextView from "../../Components/TextView";
import countryPhoneCodes from "../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import Button from "../../Components/Button";
import imagePath from "../../Constant/imagePath";
import DatePicker from "../../Components/DatePicker";
import { call_GetLocation_API } from "../../redux/action/KitInstallationAction";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { AdminRegisterUser } from "../../utils/Validation";
import {
  call_AdminRegisterUser_API,
  call_get_UserInfo,
} from "../../redux/action/AdminAction";
import DocumentPicker from "react-native-document-picker";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import Loading from "../../Components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import CustomAlert from "../../Components/CustomAlert";

const EditRegisterUser = ({
  setSelectedTab,
  setSwicthScreens,
  navigation,
  route,
}) => {
  // console.log("navigation-------", navigation);
  const isFocused = useIsFocused();
  const userDatas = useSelector(
    (state) => state?.editUserDetails?.editUserDetails?.data
  );
  console.log("----routes ", JSON.stringify(userDatas?.user_details));
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled5, setIsEnabled5] = useState(false);

  const [mentally, setmentally] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [allLocation, setAllLocation] = useState(null);
  const [dates, setDates] = useState("");
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoadings, setisLoadings] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const data = [
    {
      id: "1",
      label: "Super Admin",
    },
    {
      id: "2",
      label: "Admin",
    },
    {
      id: "3",
      label: "Staff",
    },
    {
      id: "4",
      label: "Approver",
    },

    // {
    //   id: "5",
    //   label: "Sales Representative",
    // },
  ];

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const requestHandler = async () => {
    const role = await AsyncStorage.getItem("role");
    setSwitches({
      Incidents_Via_Email: false,
      Access_Incidents: false,
    });
    setSwitche({
      Share_Incidents: false,
      Access_Kits: false,
    });
  };

  useEffect(() => {
    if (isFocused) {
      requestHandler();
    }
  }, [isFocused]);

  const [switches, setSwitches] = useState({
    Incidents_Via_Email: false,
    Access_Incidents: false,
  });

  const [switche, setSwitche] = useState({
    Share_Incidents:
      userDatas?.user_details?.permissions.includes("Share_Incidents"),
    // userDatas?.user_details?.permissions === "Share_Incidents" ? true : false,
    Access_Kits: false,
  });

  const toggleSwitchs = (key) => {
    setSwitches((prevSwitches) => ({
      ...prevSwitches,
      [key]: !prevSwitches[key],
    }));
  };

  const toggleSwitch = (key) => {
    setSwitche((prevSwitches) => ({
      ...prevSwitches,
      [key]: !prevSwitches[key],
    }));
  };

  useEffect(() => {
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      console.log("hksjadahsd", JSON.stringify(info));
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

  const handleSelect = (item) => {
    console.log("handleRole----", item);
    setSelectedItem(item);
  };

  const handleRole = (item) => {
    // console.log("handleRole----", item);
    setSelectedRole(item);
  };

  const handleDateChange = (selectedDate) => {
    console.log("Selected date:", selectedDate);
    setDates(selectedDate);
    // Do something with the selected date, such as updating state
  };

  // Function to format the switch name
  const formatSwitchName = (name) => {
    // Replace underscores with spaces
    return name.replace(/_/g, " ");
  };

  useEffect(() => {
    requestHandler();
    dispatch(call_GetLocation_API())
      .then((res) => {
        if (res.payload.status === 200) {
          setAllLocation(res.payload.locations);
        }
      })
      .catch((err) => console.log("get location err--", err));
  }, []);

  // call api edit register user
  const handleEditRegisterUser = (val) => {
    if (selectedItem == null) {
      return handleShowAlert("Please select location");
    }
    if (selectedRole == null) {
      return handleShowAlert("Please assign role");
    }
    const vals = Object.keys(switches).filter((key) => switches[key]);
    const select = Object.keys(switche).filter((key) => switche[key]);
    const mergedArray = [...vals, ...select];

    var datestr = new Date(dates).toUTCString();

    const payload = new FormData();

    payload.append("first_name", val.firstName);
    payload.append("last_name", val.lastName);
    payload.append("location_id", selectedItem?._id);
    payload.append("contact_number", val.phoneNumber);
    payload.append("country_code", country_Code);
    payload.append("employee_id", val.employeeid);

    payload.append("job_title", val.jobTitle);
    payload.append(
      "assigned_role",
      selectedRole.label == "Staff"
        ? "staff"
        : selectedRole.label?.replace(/\s+/g, "")?.toLowerCase()
    );
    payload.append("permissions", mergedArray);
    payload.append("is_firstaid_certified", isEnabled5);
    {
      dates !== "" && payload.append("firstaid_certificate_date", datestr);
    }

    payload.append("email", val.businessEmail);
    payload.append("is_mentally_fit", mentally);

    !pdfUri
      ? payload.append("firstaid_certificate", "")
      : payload.append("firstaid_certificate", {
          uri: pdfUri[0].uri,
          type: "application/pdf",
          name: pdfUri[0].name,
        });

    // console.log("FormData:---", JSON.stringify(payload));
    setisLoadings(true);
    // navigation.goBack();
    dispatch(call_AdminRegisterUser_API(payload))
      .then((res) => {
        // console.log(res.payload, "----res.payload");

        if (res.payload.status === 200) {
          handleShowAlert("User registered successfully.");
          setSelectedTab(1);
          setSwicthScreens("MANAGE_USERS");
          setisLoadings(false);
        } else {
          handleShowAlert(res?.payload?.message);
          setisLoadings(false);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("err.message---", err);
        // alert(err.message);
      });
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

  //functionality of upload pdf file
  const pickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log("---pdf-res-----", res);
      setPdfUri(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log("Error picking PDF:", err);
      } else {
        console.log("User canceled the picker");
      }
    }
  };

  const separateAndCapitalize = (str) => {
    const index = str.indexOf("admin");
    if (index !== -1) {
      const superSubstring = str.substring(0, index);
      const adminSubstring = str.substring(index);
      const capitalizeFirstLetter = (word) =>
        word.charAt(0).toUpperCase() + word.slice(1);
      return [
        capitalizeFirstLetter(superSubstring),
        " ",
        capitalizeFirstLetter(adminSubstring),
      ];
    } else {
      return [str];
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: userDatas?.user_details?.first_name,
        lastName: userDatas?.user_details?.last_name,
        businessEmail: userDatas?.user_details?.email,
        phoneNumber: userDatas?.user_details?.contact_number,
        jobTitle: userDatas?.user_details?.job_title,
        employeeid: userDatas?.user_details?.employee_id,
      }}
      validationSchema={AdminRegisterUser(countryName, country_Code)}
      onSubmit={(values) => handleEditRegisterUser(values)}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <Modal animated={true} transparent={true} visible={isLoadings}>
            <Loading />
          </Modal>
          <CustomAlert
            visible={showAlert}
            message={alertMessage} // Pass the dynamic message
            onClose={handleCloseAlert}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: Colors.black,
                  textAlign: "center",
                }}>
                Edit user information
              </Text>
              <InputFields
                placeholder="First Name"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
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
                autoCapitalize
                keyboardType="email-address"
                placeholder="Business Email"
                value={values.businessEmail}
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
              <CustomDropdown
                placeholder="Location"
                type="location"
                data={allLocation}
                onSelect={handleSelect}
              />
              {console.log("allLocation---", allLocation)}
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
                    <View>
                      <CountryPicker
                        {...{
                          countryCode: countryName,
                          withFilter: true,
                          withFlag: true,
                          withAlphaFilter: true,
                          // onSelect: (selected) => {
                          //   setCountryName(selected.cca2);
                          // },
                          onClose: handleCloseModal,
                          visible: modalVisible,
                          onSelect: (selected) => {
                            handleCountrySelect(selected);
                          },
                        }}
                        // visible={false}
                      />
                    </View>
                  </View>
                  <TextView textSty={{ fontSize: 14 }}>{country_Code}</TextView>
                  {/* <Image
                  source={imagePath.downArrow}
                  resizeMode="contain"
                  style={{ width: 10, height: 10, paddingLeft: 10 }}
                /> */}
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
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    handleBlurs={() => setFieldTouched("phoneNumber")}
                  />
                </View>
              </View>
              {touched.phoneNumber && errors.phoneNumber && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.phoneNumber}
                </TextView>
              )}
              <InputFields
                placeholder="Employee ID(Optional)"
                value={values.employeeid}
                onChangeText={handleChange("employeeid")}
              />
              {errors.employeeid && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.employeeid}
                </TextView>
              )}
              <InputFields
                placeholder="Job Title"
                value={values.jobTitle}
                onChangeText={handleChange("jobTitle")}
                handleBlurs={() => setFieldTouched("jobTitle")}
              />
              {touched.jobTitle && errors.jobTitle && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.jobTitle}
                </TextView>
              )}

              <CustomDropdown
                changeColor={{
                  color: Colors.black,
                }}
                type={"countryName"}
                placeholder={
                  userDatas?.user_details?.assigned_role
                    ? ([capitalizedSuper, capitalizedAdmin] =
                        separateAndCapitalize(
                          userDatas?.user_details?.assigned_role
                        ))
                    : "Assign Role"
                }
                data={data}
                onSelect={handleRole}
              />

              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: Colors.black,
                  }}>
                  Permissions
                </Text>

                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  {Object.keys(switches).map((key) => {
                    console.log("select -key -", key);
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          // justifyContent: "space-between",

                          width: "50%",
                        }}>
                        <View
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor:
                              switches[key] == false
                                ? Colors.white
                                : Colors.secondary,

                            // elevation: 0.01,
                            borderColor: Colors.lightgray,
                            borderWidth: 0.7,
                            borderRadius: 20,
                          }}>
                          <Switch
                            thumbColor={"#ffffff"}
                            trackColor={{
                              true: Colors.secondary,
                              false: Colors.white,
                            }}
                            value={switches[key]}
                            onValueChange={() => toggleSwitchs(key)}
                          />
                        </View>
                        <TextView textSty={{ marginLeft: 5 }}>
                          {formatSwitchName(key)}
                        </TextView>
                      </View>
                    );
                  })}
                </View>
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  {Object.keys(switche).map((key) => {
                    console.log("select -key -", key);
                    return (
                      // <View style={styles.switchContainer} key={key}>
                      //   <Switch
                      //     trackColor={{
                      //       true: Colors.secondary,
                      //       false: Colors.white,
                      //     }}
                      //     value={switche[key]}
                      //     onValueChange={() => toggleSwitch(key)}
                      //   />
                      //   <TextView textSty={{ marginLeft: 5 }}>
                      //     {formatSwitchName(key)}
                      //   </TextView>
                      // </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          // justifyContent: "space-between",

                          width: "50%",
                        }}>
                        <View
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor:
                              switche[key] == false
                                ? Colors.white
                                : Colors.secondary,

                            // elevation: 0.01,
                            borderColor: Colors.lightgray,
                            borderWidth: 0.7,
                            borderRadius: 20,
                          }}>
                          <Switch
                            thumbColor={"#ffffff"}
                            trackColor={{
                              true: Colors.secondary,
                              false: Colors.white,
                            }}
                            value={switche[key]}
                            onValueChange={() => toggleSwitch(key)}
                          />
                        </View>
                        <TextView textSty={{ marginLeft: 5 }}>
                          {formatSwitchName(key)}
                        </TextView>
                      </View>
                    );
                  })}
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: Colors.black,
                    }}>
                    First Aider Information
                  </Text>
                  <View style={[styles.flexRow, { marginTop: 10 }]}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor: isEnabled5
                            ? Colors.secondary
                            : Colors.white,

                          // elevation: 0.01,
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                        }}>
                        <Switch
                          trackColor={{
                            true: Colors.secondary,
                            false: Colors.white,
                          }}
                          thumbColor={isEnabled5 ? Colors.white : "#fff"}
                          onValueChange={() => setIsEnabled5(!isEnabled5)}
                          value={isEnabled5}
                          style={{
                            transform: [{ scaleX: 1 }, { scaleY: 1 }],
                          }}
                        />
                      </View>
                      <TextView textSty={{ marginLeft: 5 }}>
                        Certified First Aider
                      </TextView>
                    </View>
                  </View>
                  {/* <View
                    style={[styles.flexRow, { marginTop: 10, width: "100%" }]}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor: mentally
                            ? Colors.secondary
                            : Colors.white,

                          // elevation: 0.01,
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                        }}>
                        <Switch
                          trackColor={{
                            true: Colors.secondary,
                            false: Colors.white,
                          }}
                          thumbColor={Colors.white}
                          onValueChange={() => setmentally(!mentally)}
                          value={mentally}
                          style={{
                            transform: [{ scaleX: 1 }, { scaleY: 1 }],
                          }}
                        />
                      </View>
                      <TextView textSty={{ marginLeft: 5 }}>
                        This individual is mentally fit to perform these duties
                      </TextView>
                    </View>
                  </View> */}
                  {/* <InputFields placeholder="DD/MM/YYYY" /> */}
                  <DatePicker
                    onDateChange={handleDateChange}
                    disabled={!isEnabled5}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: moderateScaleVertical(20),
                      // height: moderateScale(60),
                    }}>
                    <View style={{ flex: 0.5 }}>
                      <Button
                        onClick={
                          () => {
                            pickPDF();
                          }
                          // navigation.navigate(navigationString.kitsInstallation)
                        }
                        allButtonSty={{
                          marginHorizontal: 0,
                        }}
                        buttonColor={Colors.black}
                        btnName="Add Certificate"
                      />
                    </View>
                    {pdfUri !== null && (
                      <View
                        style={{
                          flex: 0.5,
                          marginLeft: moderateScale(5),
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Image
                          source={imagePath.PDF_file_icon}
                          resizeMode="contain"
                          style={{
                            width: moderateScale(18),
                            height: moderateScale(18),
                          }}
                        />
                        <TextView>
                          {pdfUri !== null && pdfUri[0]?.name}
                        </TextView>
                      </View>
                    )}
                  </View>
                </View>
                <Button
                  onClick={handleSubmit}
                  allButtonSty={{ marginVertical: 25 }}
                  btnName="Edit User"
                  buttonColor={Colors.black}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default EditRegisterUser;

const styles = StyleSheet.create({
  flexWithGap: {
    display: "flex",
    gap: 25,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  flexRow: { flexDirection: "row", alignItems: "center", width: "40%" },
  switchLabel: {
    fontSize: 10,
    fontWeight: "400",
    color: Colors.black,
  },
  switchContainer: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
});
