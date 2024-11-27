import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import countryPhoneCodes from "../../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import ModalScreen from "../../../Components/ModalScreen";
import Button from "../../../Components/Button";
import CustomDropdown from "../../../Components/CustomDropdown";
import InputFields from "../../../Components/InputFields";
import kitsStyles from "../kitsStyles";
import navigationString from "../../../Navigations/navigationString";
import AllStrings from "../../../Constant/AllStrings";
import TextView from "../../../Components/TextView";
import Header from "../../../Components/Header";
import imagePath from "../../../Constant/imagePath";
import Colors from "../../../Styles/Colors";
import MiniCard from "../../../Components/MiniCard";
import { moderateScaleVertical } from "../../../Styles/responsiveSize";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { call_IncidentCategory_Api } from "../../../redux/action/IncidentReport";
import { useDispatch } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomAlert from "../../../Components/CustomAlert";

const DetailedReportPageSecond = ({ navigation }) => {
  const dispatch = useDispatch();
  const [categoryIncident, setCategoryData] = useState();
  const [brief, setBrief] = useState("");
  const [imageUris, setImageUris] = useState([]);
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

  const [areaIncident, setAreaIncident] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [classification, setClassification] = useState(null);
  const [locationIncident, setLocationIncident] = useState(null);
  const [classificationItem, setClassificationItem] = useState(null);

  const [location, setLocation] = useState([]);

  const handleCategory = (item) => {
    console.log("click on category ---", item);
    setSelectedCategory(item);
    setClassification(item?.description);
  };

  const handleClassification = (item) => {
    setClassificationItem(item);
    setClassification(item.description);
  };

  const handleLocationIncident = (item) => {
    setLocationIncident(item);
  };

  useEffect(() => {
    getIncidentCategory();
  }, []);
  console.log(categoryIncident, "-------categoryIncident------", location);
  const getIncidentCategory = () => {
    dispatch(call_IncidentCategory_Api())
      .then((res) => {
        console.log(
          "---  getIncidentCategory-11---",
          JSON.stringify(res.payload.data)
        );
        if (res.payload.status == 200) {
          setCategoryData(res.payload.data.Incidents);
          setLocation(res.payload.data.locations);
        } else {
          console.log("res.payload---", res.payload);
          handleShowAlert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const takePicture = () => {
    launchCamera({ mediaType: "photo", multiple: true }, (response) => {
      console.log("pic reres", response);
      if (!response.didCancel) {
        const newImageUris = response.assets.map((asset) => asset);
        setImageUris((prevImageUris) => [...prevImageUris, ...newImageUris]);
      }
    });
  };

  // Function to remove an image by index from the imageUris array
  const removeImage = (indexToRemove) => {
    setImageUris((prevImageUris) =>
      prevImageUris.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleContinue = () => {
    // if (selectedCategory == null) {
    //   return handleShowAlert("Plase select category!");
    // }
    // if (classificationItem == null) {
    //   return handleShowAlert("Plase select classification!");
    // }
    if (locationIncident == null) {
      return handleShowAlert("Plase select location!");
    }
    if (areaIncident === "") {
      return handleShowAlert("Plase enter area of Incedent!");
    }
    //  else if (brief == "") {
    //   alert("Plase enter brief summary!");
    //   return;
    // }
    // else if (imageUris.length == 0) {
    //   alert("Add photo!");
    //   return;
    // }
    const payload = {
      categoryIncident: selectedCategory?.name,
      classification: classificationItem,
      date: date,
      time: formattedTime,
      brief: brief?.trim(),
      pic: imageUris,
      areaIncident: areaIncident,
      locationOfIncident: locationIncident,
    };
    navigation.navigate(navigationString.detailedReportthree, { payload });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      style={{ flex: 1 }}>
      <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
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
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  marginBottom: -10,
                }}>
                {AllStrings.provideSummaryIndecent}
              </TextView>
              {/* <CustomDropdown
                placeholder="Category of Incident"
                type="category"
                data={categoryIncident}
                onSelect={handleCategory}
              /> */}

              {/* <CustomDropdown
                type="classification"
                placeholder="Classification"
                data={classification}
                onSelect={handleClassification}
              /> */}
              <CustomDropdown
                type="location"
                placeholder="Location of Incident"
                data={location}
                onSelect={handleLocationIncident}
              />
              <InputFields
                placeholder="Area of Incident"
                value={areaIncident}
                onChangeText={(text) => setAreaIncident(text)}
              />

              <InputFields
                placeholder="Brief Summary"
                value={brief}
                onChangeText={(text) => setBrief(text)}
                multiline={true}
                textInputFocused={{
                  height: 90,
                  // alignSelf: "center",
                }}
                textInput={{ height: 90 }}
              />

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
                    borderRadius: 5,
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.dividerLight,
                    padding: 7,
                    marginTop: 20,
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
                    borderRadius: 5,
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.dividerLight,
                    padding: 10,
                    marginTop: 20,
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

              <View>
                <View
                  style={{
                    backgroundColor: Colors.black,
                    position: "absolute",
                    padding: 7,
                    // top: 30,
                    top: "28.5%",
                    zIndex: 999,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}>
                  <Image
                    source={imagePath.Layer}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>

                <Button
                  // onClick={() => setShowModal(true)}
                  onClick={() => {
                    takePicture();
                  }}
                  allButtonSty={{
                    // backgroundColor: Colors.black,
                    marginVertical: moderateScaleVertical(30),
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.black}
                  btnName="Add Photos"
                />

                <FlatList
                  data={imageUris}
                  numColumns={3}
                  renderItem={({ item, index }) => {
                    console.log(item, "-----");
                    return (
                      <View
                        style={{
                          paddingHorizontal: 6,
                        }}>
                        <Image
                          source={{ uri: item?.uri }}
                          resizeMode="contain"
                          style={{
                            flexDirection: "row",
                            width: responsiveWidth(26),
                            height: responsiveHeight(20),
                          }}
                        />
                        <TextView
                          onPressText={() => {
                            removeImage(index);
                          }}
                          textSty={{
                            fontSize: 12,
                            color: Colors.danger,
                            textAlign: "center",
                          }}>
                          Remove
                        </TextView>
                      </View>
                    );
                  }}
                />
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                  padding: 10,
                }}>
                <Image
                  source={imagePath.PageIndicator32}
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
                  onClick={() => {
                    handleContinue();
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "60%",
                    marginHorizontal: 0,

                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>

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
  );
};

export default DetailedReportPageSecond;

const styles = StyleSheet.create({});
