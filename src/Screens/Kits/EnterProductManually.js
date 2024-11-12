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
  Switch,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import InputFields from "../../Components/InputFields";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { RNCamera } from "react-native-camera";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import { EnterAddProductSchema } from "../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { call_EnterManuallyKit } from "../../redux/action/KitInstallationAction";
import Loading from "../../Components/Loading";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addQRCode } from "../../redux/reducer/auth";
import Toast from "react-native-simple-toast";
import { launchCamera } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import CustomAlert from "../../Components/CustomAlert";
import MonthPicker from "react-native-month-year-picker";

const EnterProductManually = ({ navigation, route }) => {
  const addItemFromProduct = useSelector(
    (state) => state.auth.addItemFromProduct
  );
  console.log("addItemFromProduct---en", addItemFromProduct);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  // console.log(route.params?.kitId, "==fromm add item");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  // const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedDate = moment(date).endOf("month").format("MM/YYYY");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     const options = { quality: 0.2, base64: false };
  //     const data = await cameraRef.current.takePictureAsync(options);
  //     console.log(data.uri); // Picture path
  //     setCapturedImage(data.uri);
  //   }
  // };
  const takePicture = () => {
    launchCamera({ mediaType: "photo" }, async (response) => {
      console.log("pic reres", response);
      if (!response?.didCancel) {
        // setisLoadings(true);
        try {
          const compressedImage = await ImageResizer.createResizedImage(
            response.assets[0].uri,
            300, // Set the maximum width
            400, // Set the maximum height
            "JPEG", // Set the output format ('JPEG' or 'PNG')
            80 // Set the compression quality (0 - 100)
          );
          console.log("pic reres uri", compressedImage.uri);
          setCapturedImage(compressedImage.uri);
          settakeShowText(false);
        } catch (error) {
          console.error("Error compressing image:", error);
          // setisLoadings(false);
        }
      }
    });
  };

  const onChange = (date) => {
    console.log(date, "****************");
    setShowDate(true);
    setDate(date);
    setShow(false);
  };

  const onValueChange = useCallback(
    (event, newDate) => {
      console.log(event, "----event----", newDate);
      const selectedDate = newDate || date;
      setShow(false);
      setShowDate(true);
      setDate(selectedDate);
    },
    [date, show]
  );

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showToastWithGravityAndOffset = () => {
    Toast.showWithGravity(
      "Item successfully added",
      Toast.SHORT,
      Toast.CENTER,
      {
        textColor: Colors.primary,
        backgroundColor: Colors.white,
      }
    );
  };

  const showToastWithGravity = () => {
    Toast.showWithGravity(
      "Item was not saved. Please try again.",
      Toast.SHORT,
      Toast.BOTTOM,
      {
        textColor: "#FA0000",
        backgroundColor: Colors.white,
      }
    );
  };

  const handleSaveItem = (val) => {
    pattern = /^\d+$/; // Regular expression to match integer values

    if (isEnabled === false) {
      if (showDate === false) {
        // return alert("Expiry date required");
        return handleShowAlert("Expiry date required");
      }
    }

    // if (capturedImage == null) {
    //   return alert("Click piture.");
    // }
    if (isNaN(val.quantity) || !pattern.test(val.quantity)) {
      // return alert("Please enter a integer value.");
      return handleShowAlert("Please enter a integer value.");
    }
    // expiry_date:
    // isEnabled == false ? datestr : "Wed, 10 May 2034 14:49:13 GMT",
    const payload = new FormData();
    payload.append("kit_id", route.params?.kitId);
    payload.append("brand", val.brand);
    payload.append("product_code", val.product_code);
    payload.append("description", val.description);
    payload.append("quantity", val.quantity);
    payload.append("lot_number", val.lotNumber);
    payload.append("item_not_expire", isEnabled);
    var datestr = new Date(date).toUTCString();
    payload.append(
      "expiry_date",
      isEnabled == true ? "" : moment(date).endOf("month").toISOString()
    );
    {
      capturedImage !== null &&
        payload.append("product_picture", {
          uri: capturedImage,
          name: "image.jpg",
          type: "image/jpeg",
        });
    }
    console.log("add item ---", JSON.stringify(payload));
    setIsLoading(true);
    dispatch(call_EnterManuallyKit(payload))
      .then((res) => {
        console.log(
          payload,
          "add product manually --",
          JSON.stringify(res.payload)
        );
        if (res.payload.status === 200) {
          setIsLoading(false);
          showToastWithGravityAndOffset();
          dispatch(addQRCode(res?.payload?.data?.qr_code));
          setTimeout(() => {
            // navigation.navigate(navigationString.kitsFound);
            addItemFromProduct === "fromKitFound"
              ? navigation.navigate(navigationString.kitsFound)
              : navigation.navigate(navigationString.productFound);
          }, 1000);
        } else {
          setIsLoading(false);
          showToastWithGravity();
          handleShowAlert(res?.payload?.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  // console.log(showDate);
  return (
    <Formik
      initialValues={{
        brand: "",
        product_code: "",
        description: "",
        quantity: "",
        lotNumber: "",
        expDate: formattedDate,
      }}
      validationSchema={EnterAddProductSchema}
      onSubmit={(values) => handleSaveItem(values)}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <SafeAreaView
          style={{ height: "100%", backgroundColor: Colors.primary }}>
          <Modal animated={true} transparent={true} visible={isLoading}>
            <Loading />
          </Modal>
          <CustomAlert
            visible={showAlert}
            message={alertMessage} // Pass the dynamic message
            onClose={handleCloseAlert}
          />
          <Header
            back={() => navigation.navigate(navigationString.profile)}
            backIcon={imagePath.backArrow}
            editHeader={() => navigation.goBack()}
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
                    onPress={() => {}}
                    heading
                    headingTextSty={{
                      ...kitsStyles.headingText,
                      fontSize: 18,
                      lineHeight: 21,
                    }}>
                    {AllStrings.Pleaseenterdetails}
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
                  <View alignItems="center">
                    <Image
                      source={
                        capturedImage
                          ? { uri: capturedImage }
                          : imagePath.takePhoto
                      }
                      resizeMode="contain"
                      style={{
                        height: responsiveWidth(35),
                        width: responsiveWidth(30),
                        alignSelf: "center",
                      }}
                    />
                    {/* {!capturedImage ? (
                      <RNCamera
                        style={{
                          height: responsiveWidth(35),
                          width: responsiveWidth(30),
                        }}
                        type={RNCamera.Constants.Type.back} // or RNCamera.Constants.Type.front
                        captureAudio={false}
                        ref={cameraRef}
                      />
                    ) : (
                      <Image
                        source={{ uri: capturedImage }}
                        style={{
                          height: responsiveWidth(35),
                          width: responsiveWidth(30),
                        }}
                      />
                    )} */}
                  </View>

                  <Button
                    onClick={() => {
                      takePicture();
                      // navigation.navigate(navigationString.addItems);
                    }}
                    allButtonSty={{
                      width: "50%",
                      borderRadius: 10,
                      marginTop: 15,
                      // marginLeft: 4,
                      alignSelf: "center",
                    }}
                    buttonColor={Colors.black}
                    btnName="Take Photo"
                  />
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <View style={{ width: "49%" }}>
                      <InputFields
                        placeholder="Brand"
                        onChangeText={handleChange("brand")}
                        value={values.brand}
                        handleBlurs={() => setFieldTouched("brand")}
                      />
                      {touched.brand && errors.brand && (
                        <TextView textSty={{ color: Colors.danger }}>
                          {errors.brand}
                        </TextView>
                      )}
                    </View>
                    <View style={{ width: "49%" }}>
                      <InputFields
                        placeholder="Product Code"
                        onChangeText={handleChange("product_code")}
                        value={values?.product_code}
                        handleBlurs={() => setFieldTouched("product_code")}
                      />
                      {touched.product_code && errors.product_code && (
                        <TextView textSty={{ color: Colors.danger }}>
                          {errors.product_code}
                        </TextView>
                      )}
                    </View>
                  </View>

                  <InputFields
                    placeholder="Item Description"
                    onChangeText={handleChange("description")}
                    value={values.description}
                    handleBlurs={() => setFieldTouched("description")}
                  />
                  {touched.description && errors.description && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.description}
                    </TextView>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <View style={{ width: "49%" }}>
                      <InputFields
                        placeholder="Quantity"
                        onChangeText={handleChange("quantity")}
                        value={values.quantity}
                        keyboardType="numeric"
                        handleBlurs={() => setFieldTouched("quantity")}
                      />
                      {touched.quantity && errors.quantity && (
                        <TextView textSty={{ color: Colors.danger }}>
                          {errors.quantity}
                        </TextView>
                      )}
                    </View>
                    <View style={{ width: "49%" }}>
                      <InputFields
                        placeholder="Lot Number"
                        onChangeText={handleChange("lotNumber")}
                        value={values.lotNumber}
                        handleBlurs={() => setFieldTouched("lotNumber")}
                      />
                      {touched.lotNumber && errors.lotNumber && (
                        <TextView textSty={{ color: Colors.danger }}>
                          {errors.lotNumber}
                        </TextView>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      showDatepicker();
                    }}
                    style={{
                      // backgroundColor: "red",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: Colors.dividerLight,
                      padding: 8,
                      marginTop: 20,
                      borderRadius: 5,
                      // width: "49%",
                    }}>
                    <View>
                      <TextView
                        textSty={{
                          fontSize: 14,
                          color:
                            showDate === true ? Colors.black : Colors.lightgray,
                        }}>
                        {/* {showDate == false ? "Expiry Date" : formattedDate} */}
                        {isEnabled == true
                          ? "Expiry Date"
                          : showDate == false
                          ? "Expiry Date"
                          : formattedDate}
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

                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          // elevation: 0.01,
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                          backgroundColor:
                            isEnabled == false
                              ? Colors.white
                              : Colors.secondary,
                        }}>
                        <Switch
                          trackColor={{
                            true: Colors.secondary,
                            false: Colors.white,
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
                        Item does not expire
                      </TextView>
                    </View>
                  </View>
                </View>
                {/* code of cancel and Save Item Button */}
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginVertical: 15,
                    marginTop: 40,
                  }}>
                  <Button
                    allButtonSty={{
                      backgroundColor: Colors.black,
                      borderRadius: 10,
                      width: "35%",
                      marginHorizontal: 0,
                    }}
                    buttonColor={Colors.white}
                    btnName="Cancel"
                    onClick={() => {
                      addItemFromProduct === "fromKitFound"
                        ? navigation.navigate(navigationString.kitsFound)
                        : navigation.navigate(navigationString.productFound);
                      // navigation.navigate(navigationString.kitsFound);
                    }}
                  />
                  <Button
                    onClick={handleSubmit}
                    allButtonSty={{
                      alignSelf: "center",
                      width: "60%",
                      marginHorizontal: 0,
                      borderRadius: 10,
                    }}
                    buttonColor={Colors.black}
                    btnName="Save Item"
                  />
                </View>
              </ScrollView>
            </View>
            {show && (
              // <DateTimePickerModal
              //   isVisible={show}
              //   testID="dateTimePicker"
              //   mode={mode}
              //   onConfirm={onChange}
              //   onCancel={() => setShow(false)}
              // />
              <MonthPicker
                onChange={onValueChange}
                value={date}
                minimumDate={new Date()}
                // maximumDate={new Date(2025, 5)}
                locale="en"
              />
            )}
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default EnterProductManually;

const styles = StyleSheet.create({});
