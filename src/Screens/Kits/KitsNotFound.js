// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   Alert,
// } from "react-native";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Colors from "../../Styles/Colors";
// import imagePath from "../../Constant/imagePath";
// import Header from "../../Components/Header";
// import TextView from "../../Components/TextView";
// import AllStrings from "../../Constant/AllStrings";
// import navigationString from "../../Navigations/navigationString";
// import kitsStyles from "./kitsStyles";
// import Button from "../../Components/Button";
// import MiniCard from "../../Components/MiniCard";
// import InputFields from "../../Components/InputFields";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import moment from "moment";
// import ModalScreen from "../../Components/ModalScreen";
// import { Formik } from "formik";
// import { EnterKitNotFoundSchema } from "../../utils/Validation";
// import { RNCamera } from "react-native-camera";
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from "react-native-responsive-dimensions";
// import { useDispatch } from "react-redux";
// import { call_NotFoundKit_API } from "../../redux/action/KitInstallationAction";
// import Loading from "../../Components/Loading";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { addQRCode } from "../../redux/reducer/auth";
// import Toast from "react-native-simple-toast";
// import { launchCamera } from "react-native-image-picker";
// import ImageResizer from "react-native-image-resizer";
// import CustomAlert from "../../Components/CustomAlert";

// const KitsNotFound = ({ navigation, route }) => {
//   const cameraRef = useRef(null);
//   const dispatch = useDispatch();
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [mode, setMode] = useState("date");
//   const [show, setShow] = useState(false);
//   const [showDate, setShowDate] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const formattedDate = moment(date).format("DD-MM-YYYY");
//   const [isLoading, setIsLoading] = useState(false);
//   const [takeShowText, settakeShowText] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);

//   console.log("formattedDate----", formattedDate);
//   const handleShowAlert = () => {
//     setShowAlert(true);
//   };

//   const handleCloseAlert = () => {
//     setShowAlert(false);
//   };

//   const onChange = (date) => {
//     console.log(date, "****************");
//     setShowDate(true);
//     setDate(date);
//     setShow(false);
//   };

//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode("date");
//   };

//   const showToastWithGravityAndOffset = () => {
//     Toast.showWithGravity("Success, item saved.", Toast.SHORT, Toast.CENTER, {
//       textColor: Colors.primary,
//       backgroundColor: Colors.white,
//     });
//   };

//   const showToastWithGravity = () => {
//     Toast.showWithGravity(
//       "Item was not saved. Please try again.",
//       Toast.SHORT,
//       Toast.BOTTOM,
//       {
//         textColor: "#FA0000",
//         backgroundColor: Colors.white,
//       }
//     );
//   };

//   const handleSaveItem = (val) => {
//     if (showDate === false) {
//       // return alert("Expiry date required");
//       return handleShowAlert();
//     }
//     const payload = new FormData();
//     // payload.append("qr_code", route?.params?.qrCode);
//     payload.append("brand", val.brand);
//     payload.append("model_number", val.modelNumber);
//     payload.append("product_code", val.batchNumber);
//     payload.append("product_name", val.productName);
//     payload.append("lot_number", val.lotNumber);
//     var datestr = new Date(date).toUTCString();
//     payload.append("expiry_date", datestr);
//     {
//       capturedImage !== null &&
//         payload.append("kit_picture", {
//           uri: capturedImage,
//           name: "image.jpg",
//           type: "image/jpeg",
//         });
//     }
//     console.log("payload screen--", JSON.stringify(payload));
//     setIsLoading(true);
//     dispatch(call_NotFoundKit_API(payload))
//       .then((res) => {
//         console.log("not found kit screen--", JSON.stringify(res));
//         if (res.payload.status === 200) {
//           showToastWithGravityAndOffset();
//           setIsLoading(false);
//           dispatch(addQRCode(res.payload.data?.qr_code));
//           setTimeout(() => {
//             navigation.navigate(navigationString.kitsFound, {
//               qrCode: res.payload.data?.qr_code,
//             });
//           }, 1000);
//         } else {
//           setIsLoading(false);
//           showToastWithGravity();
//           alert(res?.payload?.message);
//         }
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         console.log(err);
//       });
//   };

//   // const takePicture = async () => {
//   //   if (cameraRef.current) {
//   //     const options = { quality: 0.2, base64: false };
//   //     const data = await cameraRef.current.takePictureAsync(options);
//   //     console.log("Picture path", data); // Picture path
//   //     setCapturedImage(data.uri);
//   //     settakeShowText(false);
//   //   }
//   // };

//   const takePicture = () => {
//     launchCamera({ mediaType: "photo" }, async (response) => {
//       console.log("pic reres", response);
//       if (!response?.didCancel) {
//         // setisLoadings(true);
//         try {
//           const compressedImage = await ImageResizer.createResizedImage(
//             response.assets[0].uri,
//             300, // Set the maximum width
//             400, // Set the maximum height
//             "JPEG", // Set the output format ('JPEG' or 'PNG')
//             80 // Set the compression quality (0 - 100)
//           );
//           console.log("pic reres uri", compressedImage.uri);
//           setCapturedImage(compressedImage.uri);
//           settakeShowText(false);
//         } catch (error) {
//           console.error("Error compressing image:", error);
//           settakeShowText(false);
//           // setisLoadings(false);
//         }
//       }
//       settakeShowText(false);
//     });
//   };
//   console.log("capturedImage--", capturedImage);
//   return (
//     <Formik
//       initialValues={{
//         brand: "",
//         modelNumber: "",
//         productName: "",
//         lotNumber: "",
//         batchNumber: "",
//         expDate: formattedDate,
//       }}
//       validationSchema={EnterKitNotFoundSchema}
//       onSubmit={(values) => handleSaveItem(values)}>
//       {({
//         handleChange,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//         setFieldTouched,
//       }) => (
//         <SafeAreaView
//           style={{ height: "100%", backgroundColor: Colors.primary }}>
//           <Modal animated={true} transparent={true} visible={isLoading}>
//             <Loading />
//           </Modal>
//           <CustomAlert
//             visible={showAlert}
//             message="Expiry date required"
//             onClose={handleCloseAlert}
//           />
//           <Header
//             back={() => navigation.navigate(navigationString.profile)}
//             backIcon={imagePath.backArrow}
//             editHeader={() => {
//               navigation.goBack();
//             }}
//           />

//           <View style={kitsStyles.container}>
//             <View
//               style={{
//                 ...kitsStyles.heading,
//                 marginTop: 15,
//                 marginHorizontal: 20,
//               }}>
//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 automaticallyAdjustKeyboardInsets={true}>
//                 <View style={{ width: "80%", alignSelf: "center" }}>
//                   <TextView
//                     onPress={() => {}}
//                     heading
//                     headingTextSty={{
//                       ...kitsStyles.headingText,
//                       fontSize: 18,
//                       lineHeight: 21,
//                     }}>
//                     {AllStrings.enterkitdetails}
//                   </TextView>
//                 </View>

//                 <View
//                   style={{
//                     // alignSelf: "center",
//                     marginTop: 25,
//                   }}>
//                   {/* <Image
//                     source={imagePath.takePhoto}
//                     resizeMode="contain"
//                     style={{ width: 120, height: 120, alignSelf: "center" }}
//                   /> */}
//                   <View alignItems="center">
//                     <Image
//                       source={
//                         capturedImage
//                           ? { uri: capturedImage }
//                           : imagePath.takePhoto
//                       }
//                       resizeMode="contain"
//                       style={{
//                         height: responsiveWidth(35),
//                         width: responsiveWidth(30),
//                         alignSelf: "center",
//                       }}
//                     />
//                   </View>

//                   <Button
//                     onClick={() => {
//                       settakeShowText(true);
//                       setTimeout(() => {
//                         takePicture();
//                       }, 1000);

//                       // navigation.navigate(navigationString.addItems);
//                     }}
//                     allButtonSty={{
//                       width: "50%",
//                       borderRadius: 10,
//                       marginTop: 15,
//                       // marginLeft: 4,
//                       alignSelf: "center",
//                     }}
//                     buttonColor={Colors.black}
//                     btnName="Take Photo"
//                   />
//                 </View>
//                 {takeShowText == true && (
//                   <TextView
//                     textSty={{
//                       textAlign: "center",
//                       marginTop: 10,
//                       fontSize: 13,
//                     }}>
//                     Please wait, uploading
//                   </TextView>
//                 )}
//                 <View>
//                   <InputFields
//                     placeholder="Brand"
//                     onChangeText={handleChange("brand")}
//                     value={values.brand}
//                     handleBlurs={() => setFieldTouched("brand")}
//                   />
//                   {touched.brand && errors.brand && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.brand}
//                     </TextView>
//                   )}
//                   <InputFields
//                     placeholder="Model Number"
//                     onChangeText={handleChange("modelNumber")}
//                     value={values.modelNumber}
//                     handleBlurs={() => setFieldTouched("modelNumber")}
//                   />
//                   {touched.modelNumber && errors.modelNumber && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.modelNumber}
//                     </TextView>
//                   )}
//                   <InputFields
//                     placeholder="Product Name"
//                     onChangeText={handleChange("productName")}
//                     value={values.productName}
//                     handleBlurs={() => setFieldTouched("productName")}
//                   />
//                   {touched.productName && errors.productName && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.productName}
//                     </TextView>
//                   )}

//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                     }}>
//                     <View style={{ width: "49%" }}>
//                       <InputFields
//                         placeholder="Lot Number"
//                         onChangeText={handleChange("lotNumber")}
//                         value={values.lotNumber}
//                         handleBlurs={() => setFieldTouched("lotNumber")}
//                       />
//                       {touched.lotNumber && errors.lotNumber && (
//                         <TextView textSty={{ color: Colors.danger }}>
//                           {errors.lotNumber}
//                         </TextView>
//                       )}
//                     </View>
//                     <View style={{ width: "49%" }}>
//                       <InputFields
//                         placeholder="Product code"
//                         onChangeText={handleChange("batchNumber")}
//                         value={values.batchNumber}
//                         handleBlurs={() => setFieldTouched("batchNumber")}
//                       />
//                       {touched.batchNumber && errors.batchNumber && (
//                         <TextView textSty={{ color: Colors.danger }}>
//                           {errors.batchNumber}
//                         </TextView>
//                       )}
//                     </View>
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => {
//                       showDatepicker();
//                     }}
//                     style={{
//                       // backgroundColor: "red",
//                       justifyContent: "space-between",
//                       flexDirection: "row",
//                       alignItems: "center",
//                       borderWidth: 1,
//                       borderColor: Colors.dividerLight,
//                       padding: 8,
//                       marginTop: 20,
//                       borderRadius: 5,
//                       // width: "49%",
//                     }}>
//                     <View>
//                       <TextView
//                         textSty={{
//                           fontSize: 14,
//                           color:
//                             showDate === true ? Colors.black : Colors.lightgray,
//                         }}>
//                         {/* {showDate ? formattedDate : "Expiry Date"} */}
//                         {showDate == false ? "Expiry Date" : formattedDate}
//                       </TextView>
//                     </View>
//                     <View>
//                       <View>
//                         <Image
//                           source={imagePath.datePickerIcon}
//                           resizeMode="contain"
//                         />
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 </View>

//                 {/* code of cancel and Save Item Button */}
//                 <View
//                   style={{
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     flexDirection: "row",
//                     marginVertical: 15,
//                     marginTop: 60,
//                   }}>
//                   <Button
//                     allButtonSty={{
//                       backgroundColor: Colors.black,
//                       borderRadius: 10,
//                       width: "35%",
//                       marginHorizontal: 0,
//                     }}
//                     buttonColor={Colors.white}
//                     btnName="Cancel"
//                     onClick={() => {
//                       setShowModal(true);
//                     }}
//                   />
//                   <Button
//                     onClick={handleSubmit}
//                     allButtonSty={{
//                       alignSelf: "center",
//                       width: "60%",
//                       marginHorizontal: 0,
//                       borderRadius: 10,
//                     }}
//                     buttonColor={Colors.black}
//                     btnName="Save Item"
//                   />
//                 </View>
//               </ScrollView>

//               <ModalScreen
//                 visible={showModal}
//                 modalheading={AllStrings.CancelKitInstallation}
//                 modalText={AllStrings.cancelinstallationkit}
//                 btnName="No"
//                 btnName1="Yes,Cancel"
//                 buttonColor={Colors.white}
//                 btnStyle={{ backgroundColor: Colors.black }}
//                 modalButton1={() => {
//                   navigation.navigate(navigationString.Home);
//                 }}
//                 modalButton={() => setShowModal(false)}
//               />

//               {/* {showModal && (
//                 <ModalScreen
//                   visible={showModal}
//                   modalheading={AllStrings.KeepUpdated}
//                   modalText={AllStrings.updateproductavailable}
//                   btnName="Yes"
//                   ModalBtn={{ width: "38%" }}
//                   ModalBtn1={{ width: "65%" }}
//                   buttonColor={Colors.black}
//                   buttonColor1={Colors.black}
//                   btnName1="No thanks"
//                   modalButton1={() => {
//                     navigation.navigate(navigationString.kitsFound, {
//                       qrCode: route?.params?.qrCode,
//                     });
//                   }}
//                   modalButton={() => {
//                     setStatus(true);
//                     setShowModal(false);
//                   }}
//                 />
//               )} */}
//               {status && (
//                 <ModalScreen
//                   success
//                   successText
//                   visible={status}
//                   modalheading={AllStrings.KeepUpdated}
//                   modalText={AllStrings.notificationsentproductinventory}
//                   btnName1="Close"
//                   buttonColor={Colors.black}
//                   modalButton1={() => {
//                     navigation.navigate(navigationString.kitsFound, {
//                       qrCode: route?.params?.qrCode,
//                     });
//                     setStatus(false);
//                   }}
//                 />
//               )}
//             </View>
//             {show && (
//               <DateTimePickerModal
//                 isVisible={show}
//                 testID="dateTimePicker"
//                 mode={mode}
//                 onConfirm={onChange}
//                 onCancel={() => setShow(false)}
//               />
//             )}
//           </View>
//         </SafeAreaView>
//       )}
//     </Formik>
//   );
// };

// export default KitsNotFound;

// const styles = StyleSheet.create({});

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
  Alert,
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
import MiniCard from "../../Components/MiniCard";
import InputFields from "../../Components/InputFields";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import ModalScreen from "../../Components/ModalScreen";
import { Formik } from "formik";
import { EnterKitNotFoundSchema } from "../../utils/Validation";
import { RNCamera } from "react-native-camera";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";
import { call_NotFoundKit_API } from "../../redux/action/KitInstallationAction";
import Loading from "../../Components/Loading";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addQRCode } from "../../redux/reducer/auth";
import Toast from "react-native-simple-toast";
import { launchCamera } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import CustomAlert from "../../Components/CustomAlert";
import MonthPicker from "react-native-month-year-picker";

const KitsNotFound = ({ navigation, route }) => {
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  // const formattedDate = moment(date).format("DD-MM-YYYY");
  const formattedDate = moment(date).endOf("month").format("MM-YYYY");
  const [isLoading, setIsLoading] = useState(false);
  const [takeShowText, settakeShowText] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  console.log("formattedDate----", formattedDate);
  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showToastWithGravityAndOffset = () => {
    Toast.showWithGravity("Success, item saved.", Toast.SHORT, Toast.CENTER, {
      textColor: Colors.primary,
      backgroundColor: Colors.white,
    });
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
    if (showDate === false) {
      // return alert("Expiry date required");
      return handleShowAlert();
    }
    const payload = new FormData();
    // payload.append("qr_code", route?.params?.qrCode);
    payload.append("brand", val.brand);
    // payload.append("model_number", val.modelNumber);
    payload.append("product_code", val.batchNumber);
    payload.append("product_name", val.productName);
    payload.append("lot_number", val.lotNumber);
    var datestr = new Date(date).toUTCString();
    payload.append("expiry_date", moment(date).endOf("month").toISOString());
    {
      capturedImage !== null &&
        payload.append("kit_picture", {
          uri: capturedImage,
          name: "image.jpg",
          type: "image/jpeg",
        });
    }
    console.log("payload screen--", JSON.stringify(payload));
    setIsLoading(true);
    dispatch(call_NotFoundKit_API(payload))
      .then((res) => {
        console.log("not found kit screen--", JSON.stringify(res));
        if (res.payload.status === 200) {
          showToastWithGravityAndOffset();
          setIsLoading(false);
          dispatch(addQRCode(res.payload.data?.qr_code));
          setTimeout(() => {
            navigation.navigate(navigationString.kitsFound, {
              qrCode: res.payload.data?.qr_code,
            });
          }, 1000);
        } else {
          setIsLoading(false);
          showToastWithGravity();
          alert(res?.payload?.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     const options = { quality: 0.2, base64: false };
  //     const data = await cameraRef.current.takePictureAsync(options);
  //     console.log("Picture path", data); // Picture path
  //     setCapturedImage(data.uri);
  //     settakeShowText(false);
  //   }
  // };

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
          settakeShowText(false);
          // setisLoadings(false);
        }
      }
      settakeShowText(false);
    });
  };
  console.log("capturedImage--", capturedImage);
  return (
    <Formik
      initialValues={{
        brand: "",
        // modelNumber: "",
        productName: "",
        lotNumber: "",
        batchNumber: "",
        expDate: formattedDate,
      }}
      validationSchema={EnterKitNotFoundSchema}
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
            message="Expiry date required"
            onClose={handleCloseAlert}
          />
          <Header
            back={() => navigation.navigate(navigationString.profile)}
            backIcon={imagePath.backArrow}
            editHeader={() => {
              navigation.goBack();
            }}
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
                    {AllStrings.enterkitdetails}
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
                  </View>

                  <Button
                    onClick={() => {
                      settakeShowText(true);
                      setTimeout(() => {
                        takePicture();
                      }, 1000);

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
                {takeShowText == true && (
                  <TextView
                    textSty={{
                      textAlign: "center",
                      marginTop: 10,
                      fontSize: 13,
                    }}>
                    Please wait, uploading
                  </TextView>
                )}
                <View>
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
                  {/* <InputFields
                    placeholder="Model Number"
                    onChangeText={handleChange("modelNumber")}
                    value={values.modelNumber}
                    handleBlurs={() => setFieldTouched("modelNumber")}
                  /> */}
                  {touched.modelNumber && errors.modelNumber && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.modelNumber}
                    </TextView>
                  )}
                  <InputFields
                    placeholder="Product Name"
                    onChangeText={handleChange("productName")}
                    value={values.productName}
                    handleBlurs={() => setFieldTouched("productName")}
                  />
                  {touched.productName && errors.productName && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.productName}
                    </TextView>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
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
                    <View style={{ width: "49%" }}>
                      <InputFields
                        placeholder="Product code"
                        onChangeText={handleChange("batchNumber")}
                        value={values.batchNumber}
                        handleBlurs={() => setFieldTouched("batchNumber")}
                      />
                      {touched.batchNumber && errors.batchNumber && (
                        <TextView textSty={{ color: Colors.danger }}>
                          {errors.batchNumber}
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
                        {/* {showDate ? formattedDate : "Expiry Date"} */}
                        {showDate == false ? "Expiry Date" : formattedDate}
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
                </View>

                {/* code of cancel and Save Item Button */}
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginVertical: 15,
                    marginTop: 60,
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
                      setShowModal(true);
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

              <ModalScreen
                visible={showModal}
                modalheading={AllStrings.CancelKitInstallation}
                modalText={AllStrings.cancelinstallationkit}
                btnName="No"
                btnName1="Yes,Cancel"
                ModalBtn={{ width: "35%" }}
                ModalBtn1={{ width: "65%" }}
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  navigation.navigate(navigationString.Home);
                }}
                modalButton={() => setShowModal(false)}
              />

              {/* {showModal && (
                <ModalScreen
                  visible={showModal}
                  modalheading={AllStrings.KeepUpdated}
                  modalText={AllStrings.updateproductavailable}
                  btnName="Yes"
                  ModalBtn={{ width: "38%" }}
                  ModalBtn1={{ width: "65%" }}
                  buttonColor={Colors.black}
                  buttonColor1={Colors.black}
                  btnName1="No thanks"
                  modalButton1={() => {
                    navigation.navigate(navigationString.kitsFound, {
                      qrCode: route?.params?.qrCode,
                    });
                  }}
                  modalButton={() => {
                    setStatus(true);
                    setShowModal(false);
                  }}
                />
              )} */}
              {status && (
                <ModalScreen
                  success
                  successText
                  visible={status}
                  modalheading={AllStrings.KeepUpdated}
                  modalText={AllStrings.notificationsentproductinventory}
                  btnName1="Close"
                  buttonColor={Colors.black}
                  modalButton1={() => {
                    navigation.navigate(navigationString.kitsFound, {
                      qrCode: route?.params?.qrCode,
                    });
                    setStatus(false);
                  }}
                />
              )}
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

export default KitsNotFound;

const styles = StyleSheet.create({});
