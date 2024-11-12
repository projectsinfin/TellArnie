import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import ModalScreen from "../../Components/ModalScreen";
import CustomDropdown from "../../Components/CustomDropdown";
import { moderateScale } from "../../Styles/responsiveSize";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import InputFields from "../../Components/InputFields";
import { Formik } from "formik";
import { EnterLocationSchema } from "../../utils/Validation";
import { useDispatch } from "react-redux";
import {
  call_AddLocation_API,
  call_GetLocation_API,
} from "../../redux/action/KitInstallationAction";
import Toast from "react-native-simple-toast";
import { call_AddDetailIncident } from "../../redux/action/IncidentReport";
import ImageResizer from "react-native-image-resizer";
import ErrorMessage from "../../Components/ErrorMessage";
import Loading from "../../Components/Loading";
import CustomAlert from "../../Components/CustomAlert";

const EnterLocation = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { key } = route.params;
  console.log("----route value---", route.params);
  const [areas, setAreas] = useState({
    value: route.params?.area,
    err: "",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [showTakePhoto, setTakePhoto] = useState(false);
  const [allLocation, setAllLocation] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSelectPic = (option) => {
    if (option.label == "Take Photo") {
      takePicture();
    } else if (option.label == "Choose Photo") {
      choosePicture();
    } else if (option.label == "Emoji & Sticker") {
      setShowEmojiPicker(!showEmojiPicker);
      setTakePhoto(false);
    } else if (option.label == "Search Web") {
      alert("Search Web");
    }
  };

  const handleEmojiSelected = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const details = [
    { id: "1", label: AllStrings.TakePhoto, image: imagePath.camera },
    { id: "2", label: AllStrings.ChoosePhoto, image: imagePath.choosePhoto },
    // { id: "3", label: AllStrings.EmojiSticker, image: imagePath.folder },
    // { id: "4", label: AllStrings.SearchWeb, image: imagePath.globe },
    // { id: "5", label: AllStrings.ResetPicture, image: imagePath.delete },
  ];

  const handleSelect = (item) => {

    setSelectedItem(item);
  };

  const takePicture = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
    
      if (!response.didCancel) {
        setImageUri(response.assets[0].uri);
        setTakePhoto(false);
        // setCapturedImage(response.assets[0]);
      }
    });
  };

  const choosePicture = () => {
    launchImageLibrary({ mediaType: "fie" }, (response) => {
     
      if (!response.didCancel) {
        setImageUri(response.assets[0].uri);
        setTakePhoto(false);
        // setCapturedImage(response.assets[0]);
      }
    });
  };

  const showToastWithGravityAndOffset = () => {
    Toast.showWithGravity("Success, item updated", Toast.SHORT, Toast.CENTER, {
      textColor: Colors.primary,
      backgroundColor: Colors.white,
      tapToDismissEnabled: false,
    });
  };

  useEffect(() => {
    dispatch(call_GetLocation_API())
      .then((res) => {
        if (res.payload.status === 200) {
          setAllLocation(res.payload.locations);
        }
      })
      .catch((err) => console.log("get location err--", err));
  }, []);

  const handleContinue = async (val) => {

    if (key == "admin") {
      if (selectedItem === null) {
        handleShowAlert("Select location");
      } else if (areas.value == "") {
        setAreas({ value: "", err: validateArea(areas) });
        flag = false;
      }
      // else if (showCheckBox === false) {
      //   alert("select check box");
      // }
      else {
        const compressedImage = await ImageResizer.createResizedImage(
          imageUri ? imageUri : route.params?.pic,
          300, // Set the maximum width
          400, // Set the maximum height
          "JPEG", // Set the output format ('JPEG' or 'PNG')
          80 // Set the compression quality (0 - 100)
        );
        const payload = new FormData();

        payload.append("location_name", selectedItem.location_name);
        // payload.append("area", val.area);
        payload.append("area", areas.value);
        payload.append("kit_id", route.params?.kitId);
        payload.append("is_moving", showCheckBox);
        payload.append("location_id", selectedItem._id);
        (route.params?.pic !== "" || imageUri) &&
         
          payload.append("kit_location_pic", {
            uri: compressedImage.uri,
            name: "image.jpg",
            type: "image/jpeg",
          });

       
        setIsLoadings(true);
        dispatch(call_AddLocation_API(payload))
          .then((res) => {
           
            setIsLoadings(false);
            if (res.payload.status === 200) {
              showToastWithGravityAndOffset();
              navigation.goBack();
            }
          })
          .catch((err) => {
            setIsLoadings(false);
            console.log("err update location api status", err);
          });
        // console.log("----res update location--", payload);
      }
    } else {
      if (imageUri == null && selectedEmoji == null) {
        return handleShowAlert("Take a photo of your location");
      }

      // else if (showCheckBox === false) {
      //   alert("select check box");
      // }
      else if (selectedItem === null) {
        handleShowAlert("Select location");
      } else if (areas.value == undefined || areas.value == "") {
        return handleShowAlert("Please enter your area.");
      } else {
        const payload = {
          img: imageUri || selectedEmoji,
          isMoving: showCheckBox,
          location: selectedItem,
          area: areas.value,
          allPropduct: route.params,
        };
        console.log("payload------", payload);
        navigation.navigate(navigationString.summaryPage, { payload });
      }
    }
  };
  const validateArea = (area) => {
    // Implement your email validation logic
    if (area.value == "") return "Area is required";

    return null;
  };

  return (
    <Formik
      initialValues={{
        area: "",
      }}
      validationSchema={EnterLocationSchema}
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
            <Modal animated={true} transparent={true} visible={isLoadings}>
              <Loading />
            </Modal>
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
                  <View style={{ width: "80%", alignSelf: "center" }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        fontSize: 18,
                        lineHeight: 21,
                      }}>
                      {key == "admin"
                        ? "Update the kit Location?"
                        : AllStrings.Whereiskitinstalled}
                    </TextView>
                  </View>

                  <View
                    style={{
                      // alignSelf: "center",
                      marginTop: 25,
                    }}>
                    {/* <Image
                source={imagePath.takePhoto}
                resizeMode="contain"
                style={{ width: 120, height: 120, alignSelf: "center" }}
              /> */}

                    {/* route.params?.pic == "" ? imagePath.productImg */}
                    {key == "admin" ? (
                      <Image
                        source={
                          route.params?.pic == "" && imageUri == null
                            ? imagePath.NoIcon
                            : imageUri !== null
                            ? { uri: imageUri }
                            : { uri: route.params?.pic }
                        }
                        resizeMode="contain"
                        style={{
                          alignSelf: "center",
                          height: responsiveWidth(35),
                          width: responsiveWidth(30),
                        }}
                      />
                    ) : imageUri == null && selectedEmoji == null ? (
                      <Image
                        source={imagePath.takePhoto}
                        resizeMode="contain"
                        style={{ width: 120, height: 120, alignSelf: "center" }}
                      />
                    ) : selectedEmoji !== null ? (
                      <TextView
                        heading
                        headingTextSty={{
                          textAlign: "center",
                          fontSize: 50,
                          lineHeight: 55,
                        }}>
                        {selectedEmoji}
                        {/* {console.log("selectedEmoji---", selectedEmoji)} */}
                      </TextView>
                    ) : (
                      <Image
                        source={{ uri: imageUri }}
                        style={{
                          alignSelf: "center",
                          height: responsiveWidth(35),
                          width: responsiveWidth(30),
                        }}
                      />
                    )}
                    {/* 
                  {imageUri == null && selectedEmoji == null ? (
                    <Image
                      source={imagePath.takePhoto}
                      resizeMode="contain"
                      style={{ width: 120, height: 120, alignSelf: "center" }}
                    />
                  ) : selectedEmoji !== null ? (
                    <TextView
                      heading
                      headingTextSty={{
                        textAlign: "center",
                        fontSize: 50,
                        lineHeight: 55,
                      }}>
                      {selectedEmoji}
                      {/* {console.log("selectedEmoji---", selectedEmoji)} */}
                    {/* </TextView>
                  ) : (
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        alignSelf: "center",
                        height: responsiveWidth(35),
                        width: responsiveWidth(30),
                      }}
                    />
                  )} 
                  */}
                    {showEmojiPicker && (
                      <EmojiSelector
                        onEmojiSelected={handleEmojiSelected}
                        columns={8}
                        showSearchBar={false}
                        showHistory={true}
                        showSectionTitles={true}
                        category={Categories.symbols}
                      />
                    )}
                    <Button
                      onClick={() => {
                        // navigation.navigate(navigationString.addItems);
                        setTakePhoto(true);
                      }}
                      allButtonSty={{
                        borderRadius: 10,
                        marginTop: 15,
                        width: key == "admin" ? "65%" : "50%",
                        // marginLeft: 4,
                        alignSelf: "center",
                      }}
                      buttonColor={Colors.black}
                      btnName={key == "admin" ? "Update Photo" : "Take Photo"}
                    />
                  </View>

                  <View>
                    <CustomDropdown
                      // changeColor={{
                      //   color: key == "admin" && Colors.black,
                      // }}
                      placeholder={
                        route.params?.location
                          ? route.params?.location
                          : "Location"
                      }
                      type="location"
                      data={allLocation}
                      onSelect={handleSelect}
                    />

                    <InputFields
                      placeholder="Area"
                      // onChangeText={handleChange("area")}
                      // value={values.area || route.params?.area}
                      validate={validateArea(areas)}
                      onChangeText={(e) => setAreas({ value: e, err: "" })}
                      value={areas.value}
                    />

                    {areas.err && <ErrorMessage message={areas.err} />}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      // alignItems: "center",
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => setShowCheckBox(!showCheckBox)}>
                      <Image
                        source={
                          showCheckBox
                            ? imagePath.fullCheckBoxIcon
                            : imagePath.CheckBoxIcon
                        }
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>

                    <TextView
                      textSty={{
                        // marginLeft: 5,
                        // paddingHorizontal: moderateScale(10),
                        marginHorizontal: moderateScale(14),
                        fontSize: 14,
                        lineHeight: 21,
                      }}>
                      {AllStrings.installed_location_moving_delivery_van}
                    </TextView>
                  </View>

                  {/* code of cancel and Save Item Button */}
                  <View
                    style={{
                      // justifyContent: "center",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      marginVertical: 15,
                      marginTop: 40,
                    }}>
                    {key == "admin" && (
                      <View style={{ width: key == "admin" ? "40%" : "100%" }}>
                        <Button
                          onClick={() => {
                            navigation.goBack();
                          }}
                          allButtonSty={{
                            backgroundColor: "black",
                            borderRadius: 10,
                          }}
                          buttonColor={Colors.white}
                          btnColor="#fff"
                          btnName="Cancel"
                        />
                      </View>
                    )}
                    <View style={{ width: key == "admin" ? "60%" : "100%" }}>
                      <Button
                        onClick={
                          handleSubmit
                          // key == "admin" ? () => updateLocation() : handleSubmit
                        }
                        allButtonSty={{
                          borderRadius: 10,
                        }}
                        buttonColor={Colors.black}
                        btnName={key == "admin" ? "Update" : "Continue"}
                      />
                    </View>
                  </View>
                </ScrollView>
              
                {showTakePhoto && (
                  <ModalScreen
                    downPopUp
                    resetPic
                    selectPic={handleSelectPic}
                    showDownPopUp={showTakePhoto}
                    details={details}
                    closePopUp={() => setTakePhoto(false)}
                    removePic={() => {
                      setImageUri(null);
                      setSelectedEmoji(null);
                      setTakePhoto(false);
                    }}
                  />
                )}
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default EnterLocation;

const styles = StyleSheet.create({});
