// // import {
// //   FlatList,
// //   Image,
// //   SafeAreaView,
// //   ScrollView,
// //   View,
// //   Switch,
// //   TouchableOpacity,
// //   Modal,
// //   Platform,
// //   PermissionsAndroid,
// // } from "react-native";
// // import React, { useState, useEffect } from "react";
// // import imagePath from "../../Constant/imagePath";
// // import Colors from "../../Styles/Colors";
// // import Header from "../../Components/Header";
// // import TextView from "../../Components/TextView";
// // import AllStrings from "../../Constant/AllStrings";
// // import Button from "../../Components/Button";
// // import navigationString from "../../Navigations/navigationString";
// // import ProfileStyle from "./ProfileStyles";
// // import InputFields from "../../Components/InputFields";
// // import {
// //   moderateScale,
// //   moderateScaleVertical,
// // } from "../../Styles/responsiveSize";
// // import countryPhoneCodes from "../../Constant/country-phones.json";
// // import CountryPicker from "react-native-country-picker-modal";
// // import DatePicker from "../../Components/DatePicker";
// // import ModalScreen from "../../Components/ModalScreen";
// // import {
// //   call_DeleteProfilePic_API,
// //   call_Profile_Api,
// //   call_UpdateProfile_API,
// // } from "../../redux/action/ProfileAction";
// // import { useDispatch, useSelector } from "react-redux";
// // import { Formik, useFormik } from "formik";
// // import Loading from "../../Components/Loading";
// // import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// // import DocumentPicker from "react-native-document-picker";
// // import CustomDropdown from "../../Components/CustomDropdown";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { NewLocation, saveUserData } from "../../redux/reducer/auth";
// // import { useFocusEffect } from "@react-navigation/native";
// // import { EditProfileValidation } from "../../utils/Validation";
// // import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../Constant/dimensions";
// // import ImageResizer from "react-native-image-resizer";
// // import { logout } from "../../redux/action/AuthAction";

// // const Profile = ({ navigation }) => {
// //   const dispatch = useDispatch();
// //   const { isLoading, error, profileDetails } = useSelector(
// //     (state) => state.profileData
// //   );

// //   const data = [
// //     {
// //       id: "1",
// //       label: "Super Admin",
// //     },
// //     {
// //       id: "2",
// //       label: "Admin",
// //     },
// //     {
// //       id: "3",
// //       label: "user",
// //     },
// //   ];

// //   console.log("-Profile---routes ", JSON.stringify(profileDetails));

// //   const [isEnabled, setIsEnabled] = useState(
// //     profileDetails?.data?.user_details?.is_firstaid_certified
// //   );
// //   const [countryName, setCountryName] = useState("GB");
// //   const [country_Code, set_Country_Code] = useState("");
// //   const [editProfile, setEditProfile] = useState(false);
// //   const [dates, setDates] = useState(null);
// //   const [imageUri, setImageUri] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [pdfUri, setPdfUri] = useState(
// //     profileDetails?.data.user_details.firstaid_certificate || null
// //   );
// //   const [selectedRole, setSelectedRole] = useState(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [roleBase, setRoleBase] = useState(null);
// //   const [mentally, setmentally] = useState(
// //     profileDetails?.data?.user_details?.is_mentally_fit
// //   );
// //   const [isLoadings, setisLoadings] = useState(false);
// //   //  is_mentally_fit

// //   console.log(profileDetails, "imageUri------", imageUri);

// //   useFocusEffect(() => {
// //     requestHandler();
// //   });

// //   const requestHandler = async () => {
// //     const role = await AsyncStorage.getItem("role");
// //     setRoleBase(role);
// //     console.log("---accessToken-- ", role);
// //   };

// //   useEffect(() => {
// //     // setTimeout(() => {
// //     dispatch(call_Profile_Api());
// //     // }, 10);
// //   }, []);

// //   const handleDateChange = (selectedDate) => {
// //     console.log("Selected date:", selectedDate);
// //     setDates(selectedDate);
// //     // Do something with the selected date, such as updating state
// //   };

// //   useEffect(() => {
// //     const info = countryPhoneCodes.filter((el) => {
// //       return el.code === countryName;
// //     });
// //     if (info.length > 0) {
// //       console.log("hksjadahsd", JSON.stringify(info));
// //       set_Country_Code(info[0].dial_code);
// //     }
// //   }, [countryName]);

// //   useEffect(() => {
// //     if (profileDetails?.data?.user_details?.country_code) {
// //       // If the user's country code is +91, set the country_Code to +91
// //       set_Country_Code(profileDetails?.data?.user_details?.country_code);
// //       // setCountryName("IN");
// //       const info = countryPhoneCodes.filter((el) => {
// //         return profileDetails?.data?.user_details?.country_code == el.dial_code
// //           ? el.code
// //           : null;
// //       });
// //       if (info.length > 0) {
// //         setCountryName(info[0].code);
// //       }
// //     } else {
// //       // Otherwise, set the country_Code to an empty string
// //       set_Country_Code("");
// //     }
// //   }, [profileDetails]);

// //   const handleDelete = () => {
// //     dispatch(call_DeleteProfilePic_API())
// //       .then((res) => {
// //         console.log("delete profile image---", res);
// //         if (res.payload.status === 200) {
// //           // alert(res.payload.message);
// //           setEditProfile(false);
// //           navigation.goBack();
// //         }
// //       })
// //       .catch((err) => {
// //         console.log("errr delete profile image---", err);
// //       });
// //     // setImageUri(null);
// //     // setEditProfile(false);
// //   };

// //   const details = [
// //     { id: "1", label: AllStrings.TakePhoto, image: imagePath.camera },
// //     { id: "2", label: AllStrings.ChoosePhoto, image: imagePath.choosePhoto },
// //   ];
// //   console.log("pdfUripdfUripdfUripdfUri=", pdfUri);
// //   const handleUpdateProfile = (val) => {
// //     // if (roleBase !== "user") {
// //     //   if (selectedRole == null) {
// //     //     return alert("Please select role.");
// //     //   }
// //     // }
// //     const payload = new FormData();
// //     payload.append("first_name", val.first_name);
// //     payload.append("last_name", val.last_name);
// //     payload.append("location", val.company_name);
// //     payload.append("country_code", country_Code);
// //     payload.append("contact_number", val.contact_number);
// //     payload.append("employee_id", val.employee_id);
// //     payload.append("job_title", val.job_title);
// //     {
// //       roleBase !== "user" &&
// //         payload.append(
// //           "assigned_role",
// //           selectedRole == null
// //             ? profileDetails?.data?.user_details?.assigned_role
// //             : selectedRole.label?.replace(/\s+/g, "").toLowerCase()
// //         );
// //     }
// //     payload.append("is_firstaid_certified", isEnabled);

// //     var datestr = new Date(dates).toUTCString();
// //     {
// //       dates !== null && payload.append("firstaid_certificate_date", datestr);
// //     }
// //     payload.append("is_mentally_fit", mentally);
// //     {
// //       imageUri !== null &&
// //         payload.append("profile_pic", {
// //           uri: imageUri,
// //           name: "image.jpg",
// //           type: "image/jpeg",
// //         });
// //     }

// //     {
// //       pdfUri !== null &&
// //         pdfUri[0].uri &&
// //         payload.append("firstaid_certificate", {
// //           uri: pdfUri[0].uri,
// //           type: "application/pdf",
// //           name: pdfUri[0].name,
// //         });
// //     }
// //     console.log("payload---", JSON.stringify(payload));

// //     setisLoadings(true);
// //     dispatch(call_UpdateProfile_API(payload))
// //       .then((res) => {
// //         console.log("update profie----", res.payload);
// //         if (res.payload.status === 200) {
// //           setisLoadings(false);
// //           navigation.goBack();
// //         } else {
// //           setisLoadings(false);
// //           // alert(res.payload.message);
// //         }
// //       })
// //       .catch((res) => {
// //         setisLoadings(false);
// //         console.log(res);
// //       });
// //   };

// //   const requestCameraPermission = async () => {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.CAMERA,
// //         {
// //           title: "Camera Permission",
// //           message: "App needs access to your camera.",
// //           buttonPositive: "OK",
// //         }
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         console.log("Camera permission granted");
// //         takePicture();
// //         // Proceed with your functionality that requires camera access
// //       } else {
// //         console.log("Camera permission denied");
// //         // Handle the case where the user denied camera access
// //       }
// //     } catch (err) {
// //       console.warn(err);
// //     }
// //   };

// //   const handleSelectPic = async (option) => {
// //     console.log("option-----", option);
// //     if (option.label == "Take Photo") {
// //       if (Platform.OS === "android") {
// //         const granted = await PermissionsAndroid.check(
// //           PermissionsAndroid.PERMISSIONS.CAMERA
// //         );
// //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //           console.log("Camera permission is granted");
// //           takePicture();
// //         } else {
// //           requestCameraPermission();
// //           console.log("Camera permission is not granted");
// //         }
// //       } else {
// //         takePicture();
// //       }
// //     } else if (option.label == "Choose Photo") {
// //       choosePicture();
// //     }
// //   };

// //   //functionality of upload image
// //   // const takePicture = () => {
// //   //   launchCamera({ mediaType: "photo" }, (response) => {
// //   //     console.log("pic reres", response);
// //   //     if (!response?.didCancel) {
// //   //       setImageUri(response?.assets[0]?.uri);
// //   //       setEditProfile(false);
// //   //       // setCapturedImage(response.assets[0]);
// //   //     }
// //   //   });
// //   // };
// //   const takePicture = () => {
// //     launchCamera({ mediaType: "photo" }, async (response) => {
// //       console.log("pic reres", response);
// //       if (!response?.didCancel) {
// //         setisLoadings(true);
// //         try {
// //           const compressedImage = await ImageResizer.createResizedImage(
// //             response.assets[0].uri,
// //             300, // Set the maximum width
// //             400, // Set the maximum height
// //             "JPEG", // Set the output format ('JPEG' or 'PNG')
// //             80 // Set the compression quality (0 - 100)
// //           );
// //           setImageUri(compressedImage.uri);
// //           setEditProfile(false);
// //           setisLoadings(false);
// //         } catch (error) {
// //           console.error("Error compressing image:", error);
// //           setisLoadings(false);
// //         }
// //       }
// //     });
// //   };

// //   //functionality of Choose Picture from gallery
// //   // const choosePicture = () => {
// //   //   launchImageLibrary({ mediaType: "fie" }, (response) => {
// //   //     console.log("pic reres", response);
// //   //     if (!response?.didCancel) {
// //   //       setImageUri(response.assets[0].uri);
// //   //       setEditProfile(false);
// //   //       // setCapturedImage(response.assets[0]);
// //   //     }
// //   //   });
// //   // };
// //   const choosePicture = () => {
// //     launchImageLibrary({ mediaType: "photo" }, async (response) => {
// //       console.log("pic reres", response);
// //       if (!response?.didCancel) {
// //         try {
// //           const compressedImage = await ImageResizer.createResizedImage(
// //             response.assets[0].uri,
// //             300, // Set the maximum width
// //             400, // Set the maximum height
// //             "JPEG", // Set the output format ('JPEG' or 'PNG')
// //             80 // Set the compression quality (0 - 100)
// //           );
// //           setImageUri(compressedImage.uri);
// //           setEditProfile(false);
// //         } catch (error) {
// //           console.error("Error compressing image:", error);
// //         }
// //       }
// //     });
// //   };

// //   //functionality of upload pdf file
// //   const pickPDF = async () => {
// //     try {
// //       const res = await DocumentPicker.pick({
// //         type: [DocumentPicker.types.pdf],
// //       });
// //       console.log("----res-----", res);
// //       setPdfUri(res);
// //     } catch (err) {
// //       if (!DocumentPicker.isCancel(err)) {
// //         console.log("Error picking PDF:", err);
// //       } else {
// //         console.log("User canceled the picker");
// //       }
// //     }
// //   };

// //   const handleRole = (item) => {
// //     // console.log("handleRole----", item);
// //     setSelectedRole(item);
// //   };

// //   console.log("----pdf uri-----", pdfUri);

// //   const handleLogout = async () => {
// //     try {
// //       AsyncStorage.clear().then(() => console.log("Cleared"));

// //       console.log("AsyncStorage cleared successfully.");
// //       dispatch(saveUserData({}));
// //       dispatch(NewLocation({}));
// //       dispatch(logout());
// //     } catch (error) {
// //       console.error("Error clearing AsyncStorage:", error);
// //     }
// //   };

// //   // Function to handle country selection from modal
// //   const handleCountrySelect = (selected) => {
// //     setCountryName(selected.cca2);
// //     setModalVisible(false); // Close the modal after selecting a country
// //   };

// //   // Function to handle opening of the modal
// //   const handleOpenModal = () => {
// //     setModalVisible(true);
// //   };

// //   // Function to handle closing of the modal
// //   const handleCloseModal = () => {
// //     setModalVisible(false);
// //   };

// //   const separateAndCapitalize = (str) => {
// //     const index = str.indexOf("admin");
// //     if (index !== -1) {
// //       const superSubstring = str.substring(0, index);
// //       const adminSubstring = str.substring(index);
// //       const capitalizeFirstLetter = (word) =>
// //         word.charAt(0).toUpperCase() + word.slice(1);
// //       return [
// //         capitalizeFirstLetter(superSubstring),
// //         " ",
// //         capitalizeFirstLetter(adminSubstring),
// //       ];
// //     } else {
// //       return [str];
// //     }
// //   };

// //   return (
// //     <Formik
// //       enableReinitialize
// //       initialValues={{
// //         first_name: profileDetails?.data.user_details.first_name,
// //         last_name: profileDetails?.data.user_details.last_name,
// //         email: profileDetails?.data.user_details.email || "",
// //         contact_number: profileDetails?.data.user_details.contact_number,
// //         country_code: profileDetails?.data.user_details.country_Code,
// //         profile_pic: "",
// //         verified: true,
// //         job_title: profileDetails?.data.user_details.job_title,
// //         employee_id: profileDetails?.data.user_details.employee_id,
// //         assigned_role: "",
// //         company_name: profileDetails?.data.user_details.company_name,
// //       }}
// //       validationSchema={EditProfileValidation(countryName, country_Code)}
// //       onSubmit={(values) => handleUpdateProfile(values)}>
// //       {({
// //         handleChange,
// //         handleSubmit,
// //         values,
// //         errors,
// //         touched,
// //         setFieldTouched,
// //         resetForm,
// //       }) => (
// //         <SafeAreaView
// //           style={{ height: "100%", backgroundColor: Colors.primary }}>
// //           <Modal animated={true} transparent={true} visible={isLoadings}>
// //             <Loading />
// //           </Modal>

// //           <Header
// //             iconName={
// //               // profileDetails?.data?.user_details?.profile_pic
// //               imageUri
// //                 ? { uri: imageUri }
// //                 : profileDetails?.data?.user_details?.profile_pic == ""
// //                 ? profileDetails?.data?.user_details?.profile_pic
// //                 : {
// //                     uri: profileDetails?.data?.user_details?.profile_pic,
// //                   }
// //             }
// //             back={() => setEditProfile(true)}
// //             backIcon={imagePath.backArrow}
// //             editHeader={() => navigation.goBack()}
// //           />
// //           {/* <View> */}
// //           {/*
// //           <TextView
// //             heading
// //             headingTextSty={ProfileStyle.editStyle}
// //             onPress={() => setEditProfile(true)}>
// //             Edit
// //           </TextView> */}
// //           {/* </View> */}

// //           <View style={{ flex: 1 }}>
// //             {/* Green section */}
// //             <TextView heading headingTextSty={ProfileStyle.headingContainer}>
// //               {AllStrings.User_Profile}
// //             </TextView>

// //             {/* Rest of the content */}
// //             <View style={ProfileStyle.buttonContainer}>
// //               <ScrollView
// //                 automaticallyAdjustKeyboardInsets={true}
// //                 showsVerticalScrollIndicator={false}>
// //                 <View
// //                   style={{
// //                     marginTop: 20,
// //                     marginHorizontal: moderateScale(20),
// //                   }}>
// //                   <InputFields
// //                     // placeholderTextColor
// //                     placeholder={
// //                       profileDetails?.data.user_details.first_name == null
// //                         ? "First name"
// //                         : "First name"
// //                     }
// //                     onChangeText={handleChange(
// //                       "first_name" ||
// //                         profileDetails?.data.user_details.first_name
// //                     )}
// //                     handleBlurs={() => setFieldTouched("first_name")}
// //                     value={values.first_name}
// //                   />
// //                   {touched.first_name && errors.first_name && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.first_name}
// //                     </TextView>
// //                   )}
// //                   <InputFields
// //                     // placeholderTextColor
// //                     placeholder={
// //                       profileDetails?.data.user_details.last_name == null
// //                         ? "Last name"
// //                         : "Last name"
// //                     }
// //                     onChangeText={handleChange(
// //                       "last_name" || profileDetails?.data.user_details.last_name
// //                     )}
// //                     value={values.last_name}
// //                     handleBlurs={() => setFieldTouched("last_name")}
// //                   />
// //                   {touched.last_name && errors.last_name && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.last_name}
// //                     </TextView>
// //                   )}
// //                   <InputFields
// //                     // placeholderTextColor
// //                     autoCapitalize
// //                     keyboardType="email-address"
// //                     placeholder={"Email"}
// //                     onChangeText={
// //                       handleChange("email") ||
// //                       profileDetails?.data.user_details.email
// //                     }
// //                     value={values.email}
// //                     editDisabled={roleBase !== "user" && true}
// //                     handleBlurs={() => setFieldTouched("email")}
// //                   />
// //                   {touched.email && errors.email && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.email}
// //                     </TextView>
// //                   )}
// //                   <InputFields
// //                     // placeholderTextColor
// //                     placeholder={"Company name"}
// //                     onChangeText={
// //                       handleChange("company_name") ||
// //                       profileDetails?.data.user_details.company_name
// //                     }
// //                     value={values.company_name}
// //                     handleBlurs={() => setFieldTouched("company_name")}
// //                   />
// //                   {touched.company_name && errors.company_name && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.company_name}
// //                     </TextView>
// //                   )}
// //                   <View
// //                     style={{
// //                       flexDirection: "row",
// //                       justifyContent: "space-between",
// //                     }}>
// //                     <View
// //                       style={{
// //                         flexDirection: "row",
// //                         width: "29%",
// //                         height: 40,
// //                         alignItems: "center",
// //                         alignSelf: "center",
// //                         marginTop: 20,
// //                         borderWidth: 1,
// //                         borderColor: Colors.dividerLight,
// //                         borderRadius: 5,
// //                         justifyContent: "space-evenly",
// //                       }}>
// //                       <View style={{ marginRight: -13 }}>
// //                         {console.log(
// //                           profileDetails?.data.user_details.country_Code,
// //                           "countryName+++++",
// //                           countryName
// //                         )}
// //                         <View>
// //                           <CountryPicker
// //                             {...{
// //                               countryCode: countryName,
// //                               withFilter: true,
// //                               withFlag: true,
// //                               withAlphaFilter: true,
// //                               // onSelect: (selected) => {
// //                               //   setCountryName(selected.cca2);
// //                               // },
// //                               onClose: handleCloseModal,
// //                               visible: modalVisible,
// //                               onSelect: (selected) => {
// //                                 handleCountrySelect(selected);
// //                               },
// //                             }}
// //                             // visible={false}
// //                           />
// //                         </View>
// //                       </View>

// //                       <TextView textSty={{ fontSize: 14 }}>
// //                         {country_Code ? country_Code : "+44"}
// //                       </TextView>
// //                       {/* <Image
// //                       source={imagePath.downArrow}
// //                       resizeMode="contain"
// //                       style={{ width: 10, height: 10, paddingLeft: 10 }}
// //                      /> */}
// //                       <TouchableOpacity onPress={() => handleOpenModal()}>
// //                         <Image
// //                           source={imagePath.downArrow}
// //                           resizeMode="contain"
// //                           style={{
// //                             width: 10,
// //                             height: 10,
// //                             paddingLeft: 10,
// //                           }}
// //                         />
// //                       </TouchableOpacity>
// //                     </View>
// //                     <View style={{ width: "70%" }}>
// //                       <InputFields
// //                         // placeholderTextColor
// //                         placeholder={"Number"}
// //                         keyboardType="phone-pad"
// //                         onChangeText={
// //                           handleChange("contact_number") ||
// //                           profileDetails?.data.user_details.contact_number
// //                         }
// //                         value={values.contact_number}
// //                         handleBlurs={() => setFieldTouched("contact_number")}
// //                       />
// //                     </View>
// //                   </View>
// //                   {touched.contact_number && errors.contact_number && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.contact_number}
// //                     </TextView>
// //                   )}

// //                   <InputFields
// //                     placeholder={
// //                       profileDetails?.data.user_details.employee_id == null
// //                         ? "Employee ID"
// //                         : "Employee ID (optional)"
// //                     }
// //                     onChangeText={
// //                       handleChange("employee_id") ||
// //                       profileDetails?.data.user_details.employee_id
// //                     }
// //                     value={values.employee_id}
// //                   />

// //                   <InputFields
// //                     // placeholderTextColor
// //                     placeholder={
// //                       profileDetails?.data.user_details.job_title == null
// //                         ? "job_title"
// //                         : "job_title"
// //                     }
// //                     onChangeText={
// //                       handleChange("job_title") ||
// //                       profileDetails?.data.user_details.job_title
// //                     }
// //                     value={values.job_title}
// //                     handleBlurs={() => setFieldTouched("job_title")}
// //                   />
// //                   {touched.job_title && errors.job_title && (
// //                     <TextView textSty={{ color: Colors.danger }}>
// //                       {errors.job_title}
// //                     </TextView>
// //                   )}

// //                   {roleBase !== "user" ? (
// //                     <CustomDropdown
// //                       changeColor={{
// //                         color: Colors.black,
// //                       }}
// //                       type={"countryName"}
// //                       placeholder={
// //                         profileDetails?.data?.user_details?.assigned_role
// //                           ? ([capitalizedSuper, capitalizedAdmin] =
// //                               separateAndCapitalize(
// //                                 profileDetails?.data?.user_details
// //                                   ?.assigned_role
// //                               ))
// //                           : "Assign Role"
// //                       }
// //                       data={data}
// //                       onSelect={handleRole}
// //                     />
// //                   ) : (
// //                     <InputFields
// //                       placeholderTextColor
// //                       placeholder={
// //                         profileDetails?.data?.user_details?.assigned_role ==
// //                         "user"
// //                           ? "User"
// //                           : null
// //                       }
// //                       editDisabled={false}
// //                     />
// //                   )}
// //                   <TextView heading headingTextSty={ProfileStyle.textStyles}>
// //                     {AllStrings.User_Profile}
// //                   </TextView>
// //                   <View
// //                     style={{
// //                       flexDirection: "row",
// //                       alignItems: "center",
// //                       justifyContent: "space-between",
// //                     }}>
// //                     <View
// //                       style={{ flexDirection: "row", alignItems: "center" }}>
// //                       <View
// //                         style={{
// //                           ...ProfileStyle.switchSty,
// //                           backgroundColor:
// //                             isEnabled == false
// //                               ? Colors.white
// //                               : Colors.secondary,
// //                         }}>
// //                         <Switch
// //                           trackColor={{
// //                             true: Colors.secondary,
// //                             false: Colors.white,
// //                           }}
// //                           thumbColor={Colors.white}
// //                           onValueChange={() => setIsEnabled(!isEnabled)}
// //                           value={isEnabled}
// //                           style={{
// //                             transform: [{ scaleX: 1 }, { scaleY: 1 }],
// //                           }}
// //                         />
// //                       </View>
// //                       <TextView textSty={{ marginLeft: 5 }}>
// //                         {AllStrings.Certified_First_Aider}
// //                       </TextView>
// //                     </View>
// //                   </View>

// //                   {/* I certify that I’m mentally fit to perform the duties of this role */}
// //                   <View
// //                     style={{
// //                       flexDirection: "row",
// //                       alignItems: "center",
// //                       marginTop: 15,
// //                       flex: 1,
// //                     }}>
// //                     <View
// //                       style={{
// //                         // flex: 0.1,
// //                         alignSelf: "flex-start",
// //                         borderColor: Colors.lightgray,
// //                         borderWidth: 0.7,
// //                         borderRadius: 20,
// //                         backgroundColor:
// //                           mentally == false ? Colors.white : Colors.secondary,
// //                       }}>
// //                       <Switch
// //                         trackColor={{
// //                           false: Colors.white,
// //                           true: Colors.secondary,
// //                         }}
// //                         thumbColor={Colors.white}
// //                         onValueChange={() => setmentally(!mentally)}
// //                         value={mentally}
// //                         style={{
// //                           transform: [{ scaleX: 1 }, { scaleY: 1 }],
// //                         }}
// //                       />
// //                     </View>
// //                     <View flex={1}>
// //                       <TextView
// //                         textSty={{
// //                           marginLeft: 5,
// //                           // width: "95%",
// //                         }}>
// //                         I certify that I’m mentally fit to perform the duties of
// //                         this role
// //                       </TextView>
// //                     </View>
// //                   </View>
// //                   {console.log(
// //                     "profileDetails?.data.user_details.firstaid_certificate_date",
// //                     profileDetails?.data.user_details.firstaid_certificate_date
// //                   )}
// //                   <DatePicker
// //                     showDates={
// //                       profileDetails?.data.user_details
// //                         ?.firstaid_certificate_date
// //                     }
// //                     onDateChange={handleDateChange}
// //                     profile
// //                   />
// //                   <View
// //                     style={{
// //                       flexDirection: "row",
// //                       alignItems: "center",
// //                       marginTop: moderateScaleVertical(20),
// //                       // height: moderateScale(60),
// //                       flex: 1,
// //                     }}>
// //                     <View style={{ flex: 0.5 }}>
// //                       <Button
// //                         onClick={
// //                           () => {
// //                             pickPDF();
// //                           }
// //                           // navigation.navigate(navigationString.kitsInstallation)
// //                         }
// //                         allButtonSty={{
// //                           marginHorizontal: 0,
// //                         }}
// //                         buttonColor={Colors.black}
// //                         btnName="Add Certificate"
// //                       />
// //                     </View>
// //                     {pdfUri !== null && (
// //                       <View
// //                         style={{
// //                           flex: 0.35,
// //                           marginLeft: moderateScale(5),
// //                           flexDirection: "row",
// //                           alignItems: "center",
// //                         }}>
// //                         <Image
// //                           source={imagePath.PDF_file_icon}
// //                           resizeMode="contain"
// //                           style={{
// //                             width: moderateScale(18),
// //                             height: moderateScale(18),
// //                           }}
// //                         />
// //                         <TextView>
// //                           {(pdfUri !== null && pdfUri[0]?.name) ||
// //                             pdfUri?.substring(pdfUri.lastIndexOf("/") + 1)}
// //                         </TextView>
// //                       </View>
// //                     )}
// //                   </View>
// //                   <View
// //                     style={{
// //                       flexDirection: "row",
// //                       marginVertical: moderateScaleVertical(35),
// //                       width: "95%",
// //                     }}>
// //                     <View style={{ width: "35%" }}>
// //                       <Button
// //                         onClick={() => {
// //                           // navigation?.goBack();
// //                           setShowModal(true);
// //                         }}
// //                         allButtonSty={{
// //                           backgroundColor: "black",
// //                           borderRadius: 10,
// //                           // width: "29%",
// //                           marginHorizontal: 0,
// //                         }}
// //                         buttonColor={Colors.white}
// //                         btnColor="#fff"
// //                         btnName="Cancel"
// //                       />
// //                     </View>
// //                     <View style={{ width: "75%" }}>
// //                       <Button
// //                         onClick={handleSubmit}
// //                         // allButtonSty={{
// //                         //   marginVertical: moderateScaleVertical(35),
// //                         // }}
// //                         buttonColor={Colors.black}
// //                         btnName="Update"
// //                       />
// //                     </View>
// //                   </View>

// //                   <Button
// //                     logout
// //                     onClick={() => handleLogout()}
// //                     allButtonSty={{
// //                       marginBottom: 20,
// //                       marginTop: 0,
// //                       fontSize: 5,
// //                       backgroundColor: Colors.white,
// //                     }}
// //                     buttonColor={Colors.black}
// //                     btnName="Log Out"
// //                   />
// //                 </View>
// //               </ScrollView>
// //               <ModalScreen
// //                 visible={showModal}
// //                 modalheading={"Discard changes?"}
// //                 modalText={
// //                   "The updates you made were not saved, do you want to discard changes?"
// //                 }
// //                 btnName="Yes"
// //                 btnName1="No"
// //                 buttonColor={Colors.black}
// //                 ModalBtn1={{ width: "49%" }}
// //                 ModalBtn={{ width: "49%" }}
// //                 modalButton1={() => {
// //                   resetForm(values);
// //                   setShowModal(false);
// //                 }}
// //                 modalButton={() => {
// //                   navigation?.navigate(navigationString.Home);
// //                 }}
// //               />
// //               {editProfile && (
// //                 <ModalScreen
// //                   img
// //                   downPopUp
// //                   imageURL={
// //                     profileDetails?.data?.user_details?.profile_pic == ""
// //                       ? imagePath.ProfilePic
// //                       : {
// //                           uri: profileDetails?.data?.user_details?.profile_pic,
// //                         }
// //                     //   {
// //                     //   uri: profileDetails?.data?.user_details?.profile_pic,
// //                     // }
// //                   }
// //                   selectPic={handleSelectPic}
// //                   showDownPopUp={editProfile}
// //                   details={details}
// //                   closePopUp={() => {
// //                     setEditProfile(false);
// //                   }}
// //                   removePic={() => handleDelete()}
// //                 />
// //               )}
// //             </View>
// //           </View>
// //         </SafeAreaView>
// //       )}
// //     </Formik>
// //   );
// // };

// // export default Profile;

// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   View,
//   Switch,
//   TouchableOpacity,
//   Modal,
//   Platform,
//   PermissionsAndroid,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import imagePath from "../../Constant/imagePath";
// import Colors from "../../Styles/Colors";
// import Header from "../../Components/Header";
// import TextView from "../../Components/TextView";
// import AllStrings from "../../Constant/AllStrings";
// import Button from "../../Components/Button";
// import navigationString from "../../Navigations/navigationString";
// import ProfileStyle from "./ProfileStyles";
// import InputFields from "../../Components/InputFields";
// import {
//   moderateScale,
//   moderateScaleVertical,
// } from "../../Styles/responsiveSize";
// import countryPhoneCodes from "../../Constant/country-phones.json";
// import CountryPicker from "react-native-country-picker-modal";
// import DatePicker from "../../Components/DatePicker";
// import ModalScreen from "../../Components/ModalScreen";
// import {
//   call_DeleteProfilePic_API,
//   call_Profile_Api,
//   call_UpdateProfile_API,
// } from "../../redux/action/ProfileAction";
// import { useDispatch, useSelector } from "react-redux";
// import { Formik, useFormik } from "formik";
// import Loading from "../../Components/Loading";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import DocumentPicker from "react-native-document-picker";
// import CustomDropdown from "../../Components/CustomDropdown";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { NewLocation, saveUserData } from "../../redux/reducer/auth";
// import { useFocusEffect } from "@react-navigation/native";
// import { EditProfileValidation } from "../../utils/Validation";
// import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../Constant/dimensions";
// import ImageResizer from "react-native-image-resizer";
// import { logout } from "../../redux/action/AuthAction";

// const Profile = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { isLoading, error, profileDetails } = useSelector(
//     (state) => state.profileData
//   );

//   const data = [
//     {
//       id: "1",
//       label: "Super Admin",
//     },
//     {
//       id: "2",
//       label: "Admin",
//     },
//     {
//       id: "3",
//       label: "Staff",
//     },
//   ];

//   console.log("-Profile---routes ", JSON.stringify(profileDetails));

//   const [isEnabled, setIsEnabled] = useState(
//     profileDetails?.data?.user_details?.is_firstaid_certified
//   );
//   const [countryName, setCountryName] = useState("GB");
//   const [country_Code, set_Country_Code] = useState("");
//   const [editProfile, setEditProfile] = useState(false);
//   const [dates, setDates] = useState(null);
//   const [imageUri, setImageUri] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [pdfUri, setPdfUri] = useState(
//     profileDetails?.data.user_details.firstaid_certificate || null
//   );
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [roleBase, setRoleBase] = useState(null);
//   const [mentally, setmentally] = useState(
//     profileDetails?.data?.user_details?.is_mentally_fit
//   );
//   const [isLoadings, setisLoadings] = useState(false);
//   //  is_mentally_fit

//   console.log(profileDetails, "imageUri------", imageUri);

//   useFocusEffect(() => {
//     requestHandler();
//   });

//   const requestHandler = async () => {
//     const role = await AsyncStorage.getItem("role");
//     setRoleBase(role);
//     console.log("---accessToken-- ", role);
//   };

//   useEffect(() => {
//     // setTimeout(() => {
//     dispatch(call_Profile_Api());
//     // }, 10);
//   }, []);

//   const handleDateChange = (selectedDate) => {
//     console.log("Selected date:", selectedDate);
//     setDates(selectedDate);
//     // Do something with the selected date, such as updating state
//   };

//   useEffect(() => {
//     const info = countryPhoneCodes.filter((el) => {
//       return el.code === countryName;
//     });
//     if (info.length > 0) {
//       console.log("hksjadahsd", JSON.stringify(info));
//       set_Country_Code(info[0].dial_code);
//     }
//   }, [countryName]);

//   useEffect(() => {
//     if (profileDetails?.data?.user_details?.country_code) {
//       // If the user's country code is +91, set the country_Code to +91
//       set_Country_Code(profileDetails?.data?.user_details?.country_code);
//       // setCountryName("IN");
//       const info = countryPhoneCodes.filter((el) => {
//         return profileDetails?.data?.user_details?.country_code == el.dial_code
//           ? el.code
//           : null;
//       });
//       if (info.length > 0) {
//         setCountryName(info[0].code);
//       }
//     } else {
//       // Otherwise, set the country_Code to an empty string
//       set_Country_Code("");
//     }
//   }, [profileDetails]);

//   const handleDelete = () => {
//     dispatch(call_DeleteProfilePic_API())
//       .then((res) => {
//         console.log("delete profile image---", res);
//         if (res.payload.status === 200) {
//           // alert(res.payload.message);
//           setEditProfile(false);
//           navigation.goBack();
//         }
//       })
//       .catch((err) => {
//         console.log("errr delete profile image---", err);
//       });
//     // setImageUri(null);
//     // setEditProfile(false);
//   };

//   const details = [
//     { id: "1", label: AllStrings.TakePhoto, image: imagePath.camera },
//     { id: "2", label: AllStrings.ChoosePhoto, image: imagePath.choosePhoto },
//   ];
//   console.log("pdfUripdfUripdfUripdfUri=", pdfUri);
//   const handleUpdateProfile = (val) => {
//     // if (roleBase !== "user") {
//     //   if (selectedRole == null) {
//     //     return alert("Please select role.");
//     //   }
//     // }
//     const payload = new FormData();
//     payload.append("first_name", val.first_name);
//     payload.append("last_name", val.last_name);
//     // payload.append("location", val.company_name);
//     payload.append("location", val.company_name);
//     payload.append("country_code", country_Code);
//     payload.append("contact_number", val.contact_number);
//     payload.append("employee_id", val.employee_id);
//     payload.append("job_title", val.job_title);
//     payload.append("email", val.email);
//     {
//       roleBase !== "user" &&
//         payload.append(
//           "assigned_role",
//           selectedRole == null
//             ? profileDetails?.data?.user_details?.assigned_role
//             : selectedRole.label?.replace(/\s+/g, "").toLowerCase()
//         );
//     }
//     payload.append("is_firstaid_certified", isEnabled);

//     var datestr = new Date(dates).toUTCString();
//     {
//       dates !== null && payload.append("firstaid_certificate_date", datestr);
//     }
//     payload.append("is_mentally_fit", mentally);
//     {
//       imageUri !== null &&
//         payload.append("profile_pic", {
//           uri: imageUri,
//           name: "image.jpg",
//           type: "image/jpeg",
//         });
//     }

//     {
//       pdfUri !== null &&
//         pdfUri[0].uri &&
//         payload.append("firstaid_certificate", {
//           uri: pdfUri[0].uri,
//           type: "application/pdf",
//           name: pdfUri[0].name,
//         });
//     }
//     console.log("payload---", JSON.stringify(payload));

//     setisLoadings(true);
//     dispatch(call_UpdateProfile_API(payload))
//       .then((res) => {
//         console.log("update profie----", res.payload);
//         setisLoadings(false);
//         if (res.payload.status === 200) {
//           setisLoadings(false);
//           navigation.goBack();
//         } else {
//           setisLoadings(false);
//           // alert(res.payload.message);
//         }
//       })
//       .catch((error) => {
//         setisLoadings(false);
//         console.log(error, "----update profile---");
//       });
//   };

//   const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: "Camera Permission",
//           message: "App needs access to your camera.",
//           buttonPositive: "OK",
//         }
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("Camera permission granted");
//         takePicture();
//         // Proceed with your functionality that requires camera access
//       } else {
//         console.log("Camera permission denied");
//         // Handle the case where the user denied camera access
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const handleSelectPic = async (option) => {
//     console.log("option-----", option);
//     if (option.label == "Take Photo") {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("Camera permission is granted");
//           takePicture();
//         } else {
//           requestCameraPermission();
//           console.log("Camera permission is not granted");
//         }
//       } else {
//         takePicture();
//       }
//     } else if (option.label == "Choose Photo") {
//       choosePicture();
//     }
//   };

//   //functionality of upload image
//   // const takePicture = () => {
//   //   launchCamera({ mediaType: "photo" }, (response) => {
//   //     console.log("pic reres", response);
//   //     if (!response?.didCancel) {
//   //       setImageUri(response?.assets[0]?.uri);
//   //       setEditProfile(false);
//   //       // setCapturedImage(response.assets[0]);
//   //     }
//   //   });
//   // };
//   const takePicture = () => {
//     launchCamera({ mediaType: "photo" }, async (response) => {
//       console.log("pic reres", response);
//       if (!response?.didCancel) {
//         setisLoadings(true);
//         try {
//           const compressedImage = await ImageResizer.createResizedImage(
//             response.assets[0].uri,
//             300, // Set the maximum width
//             400, // Set the maximum height
//             "JPEG", // Set the output format ('JPEG' or 'PNG')
//             80 // Set the compression quality (0 - 100)
//           );
//           setImageUri(compressedImage.uri);
//           setEditProfile(false);
//           setisLoadings(false);
//         } catch (error) {
//           console.error("Error compressing image:", error);
//           setisLoadings(false);
//         }
//       }
//     });
//   };

//   //functionality of Choose Picture from gallery
//   // const choosePicture = () => {
//   //   launchImageLibrary({ mediaType: "fie" }, (response) => {
//   //     console.log("pic reres", response);
//   //     if (!response?.didCancel) {
//   //       setImageUri(response.assets[0].uri);
//   //       setEditProfile(false);
//   //       // setCapturedImage(response.assets[0]);
//   //     }
//   //   });
//   // };
//   const choosePicture = () => {
//     launchImageLibrary({ mediaType: "photo" }, async (response) => {
//       console.log("pic reres", response);
//       if (!response?.didCancel) {
//         try {
//           const compressedImage = await ImageResizer.createResizedImage(
//             response.assets[0].uri,
//             300, // Set the maximum width
//             400, // Set the maximum height
//             "JPEG", // Set the output format ('JPEG' or 'PNG')
//             80 // Set the compression quality (0 - 100)
//           );
//           setImageUri(compressedImage.uri);
//           setEditProfile(false);
//         } catch (error) {
//           console.error("Error compressing image:", error);
//         }
//       }
//     });
//   };

//   //functionality of upload pdf file
//   const pickPDF = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.pdf],
//       });
//       console.log("----res-----", res);
//       setPdfUri(res);
//     } catch (err) {
//       if (!DocumentPicker.isCancel(err)) {
//         console.log("Error picking PDF:", err);
//       } else {
//         console.log("User canceled the picker");
//       }
//     }
//   };

//   const handleRole = (item) => {
//     console.log("handleRole----", item);
//     setSelectedRole(item);
//   };

//   console.log("----pdf uri-----", pdfUri);

//   const handleLogout = async () => {
//     try {
//       // AsyncStorage.clear().then(() => console.log("Cleared"));
//       await AsyncStorage.removeItem("globalData");
//       console.log("AsyncStorage cleared successfully.");
//       dispatch(saveUserData({}));
//       dispatch(NewLocation({}));
//       dispatch(logout());
//     } catch (error) {
//       console.error("Error clearing AsyncStorage:", error);
//     }
//   };

//   // Function to handle country selection from modal
//   const handleCountrySelect = (selected) => {
//     setCountryName(selected.cca2);
//     setModalVisible(false); // Close the modal after selecting a country
//   };

//   // Function to handle opening of the modal
//   const handleOpenModal = () => {
//     setModalVisible(true);
//   };

//   // Function to handle closing of the modal
//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };

//   const separateAndCapitalize = (str) => {
//     const index = str.indexOf("admin");
//     if (index !== -1) {
//       const superSubstring = str.substring(0, index);
//       const adminSubstring = str.substring(index);
//       const capitalizeFirstLetter = (word) =>
//         word.charAt(0).toUpperCase() + word.slice(1);
//       return [
//         capitalizeFirstLetter(superSubstring),
//         " ",
//         capitalizeFirstLetter(adminSubstring),
//       ];
//     } else {
//       return [str];
//     }
//   };

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{
//         first_name: profileDetails?.data.user_details.first_name,
//         last_name: profileDetails?.data.user_details.last_name,
//         email: profileDetails?.data.user_details.email || "",
//         contact_number: profileDetails?.data.user_details.contact_number,
//         country_code: profileDetails?.data.user_details.country_Code,
//         profile_pic: "",
//         verified: true,
//         job_title: profileDetails?.data.user_details.job_title,
//         employee_id: profileDetails?.data.user_details.employee_id,
//         assigned_role: "",
//         company_name: profileDetails?.data.user_details.company_name,
//       }}
//       validationSchema={EditProfileValidation(countryName, country_Code)}
//       onSubmit={(values) => handleUpdateProfile(values)}>
//       {({
//         handleChange,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//         setFieldTouched,
//         resetForm,
//       }) => (
//         <SafeAreaView
//           style={{ height: "100%", backgroundColor: Colors.primary }}>
//           <Modal animated={true} transparent={true} visible={isLoadings}>
//             <Loading />
//           </Modal>

//           <Header
//             iconName={
//               // profileDetails?.data?.user_details?.profile_pic
//               imageUri
//                 ? { uri: imageUri }
//                 : profileDetails?.data?.user_details?.profile_pic == ""
//                 ? profileDetails?.data?.user_details?.profile_pic
//                 : {
//                     uri: profileDetails?.data?.user_details?.profile_pic,
//                   }
//             }
//             back={() => setEditProfile(true)}
//             backIcon={imagePath.backArrow}
//             editHeader={() => navigation.goBack()}
//           />
//           <View
//             style={{
//               // backgroundColor: "red",
//               // position: "absolute",

//               // marginTop: Platform.OS === "ios" ? 28 : 30,
//               marginTop: -20,

//               alignSelf: "flex-start",
//               left: Platform.OS === "ios" ? 30 : 35,
//             }}>
//             {/* <TextView
//             heading
//             headingTextSty={{
//               ...ProfileStyle.editStyle,
//               marginLeft: 2,
//               fontSize: 11,
//               width: "40%",
//             }}
//             onPress={() => setEditProfile(true)}>
//             Edit Profile Picture
//           </TextView> */}
//             <TouchableOpacity
//               activeOpacity={0.7}
//               onPress={() => setEditProfile(true)}>
//               <Image
//                 source={imagePath.edit_Icon}
//                 style={{ height: 25, width: 25 }}
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={{ flex: 1 }}>
//             {/* Green section */}
//             <TextView heading headingTextSty={ProfileStyle.headingContainer}>
//               {AllStrings.User_Profile}
//             </TextView>

//             {/* Rest of the content */}
//             <View style={ProfileStyle.buttonContainer}>
//               <ScrollView
//                 automaticallyAdjustKeyboardInsets={true}
//                 showsVerticalScrollIndicator={false}>
//                 <View
//                   style={{
//                     marginTop: 20,
//                     marginHorizontal: moderateScale(20),
//                   }}>
//                   <InputFields
//                     // placeholderTextColor
//                     placeholder={
//                       profileDetails?.data.user_details.first_name == null
//                         ? "First name"
//                         : "First name"
//                     }
//                     onChangeText={handleChange(
//                       "first_name" ||
//                         profileDetails?.data.user_details.first_name
//                     )}
//                     handleBlurs={() => setFieldTouched("first_name")}
//                     value={values.first_name}
//                   />
//                   {touched.first_name && errors.first_name && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.first_name}
//                     </TextView>
//                   )}
//                   <InputFields
//                     // placeholderTextColor
//                     placeholder={
//                       profileDetails?.data.user_details.last_name == null
//                         ? "Last name"
//                         : "Last name"
//                     }
//                     onChangeText={handleChange(
//                       "last_name" || profileDetails?.data.user_details.last_name
//                     )}
//                     value={values.last_name}
//                     handleBlurs={() => setFieldTouched("last_name")}
//                   />
//                   {touched.last_name && errors.last_name && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.last_name}
//                     </TextView>
//                   )}
//                   <InputFields
//                     // placeholderTextColor
//                     autoCapitalize
//                     keyboardType="email-address"
//                     placeholder={"Email"}
//                     onChangeText={
//                       handleChange("email") ||
//                       profileDetails?.data?.user_details?.email
//                     }
//                     value={values.email}
//                     editDisabled={roleBase !== "user" && true}
//                     handleBlurs={() => setFieldTouched("email")}
//                     textContentType="emailAddress"
//                     autoComplete="email"
//                   />
//                   {touched.email && errors.email && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.email}
//                     </TextView>
//                   )}
//                   <InputFields
//                     // editDisabled={false}
//                     // placeholderTextColor
//                     placeholder={"Company name"}
//                     onChangeText={
//                       handleChange("company_name") ||
//                       profileDetails?.data.user_details.company_name
//                     }
//                     value={values.company_name}
//                     handleBlurs={() => setFieldTouched("company_name")}
//                   />
//                   {touched.company_name && errors.company_name && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.company_name}
//                     </TextView>
//                   )}
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                     }}>
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         width: "29%",
//                         height: 40,
//                         alignItems: "center",
//                         alignSelf: "center",
//                         marginTop: 20,
//                         borderWidth: 1,
//                         borderColor: Colors.dividerLight,
//                         borderRadius: 5,
//                         justifyContent: "space-evenly",
//                       }}>
//                       <View style={{ marginRight: -13 }}>
//                         {console.log(
//                           profileDetails?.data.user_details.country_Code,
//                           "countryName+++++",
//                           countryName
//                         )}
//                         <View>
//                           <CountryPicker
//                             {...{
//                               countryCode: countryName,
//                               withFilter: true,
//                               withFlag: true,
//                               withAlphaFilter: true,
//                               // onSelect: (selected) => {
//                               //   setCountryName(selected.cca2);
//                               // },
//                               onClose: handleCloseModal,
//                               visible: modalVisible,
//                               onSelect: (selected) => {
//                                 handleCountrySelect(selected);
//                               },
//                             }}
//                             // visible={false}
//                           />
//                         </View>
//                       </View>

//                       <TextView textSty={{ fontSize: 14 }}>
//                         {country_Code ? country_Code : "+44"}
//                       </TextView>
//                       {/* <Image
//                       source={imagePath.downArrow}
//                       resizeMode="contain"
//                       style={{ width: 10, height: 10, paddingLeft: 10 }}
//                      /> */}
//                       <TouchableOpacity onPress={() => handleOpenModal()}>
//                         <Image
//                           source={imagePath.downArrow}
//                           resizeMode="contain"
//                           style={{
//                             width: 10,
//                             height: 10,
//                             paddingLeft: 10,
//                           }}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                     <View style={{ width: "70%" }}>
//                       <InputFields
//                         // placeholderTextColor
//                         placeholder={"Number"}
//                         keyboardType="phone-pad"
//                         onChangeText={
//                           handleChange("contact_number") ||
//                           profileDetails?.data.user_details.contact_number
//                         }
//                         value={values.contact_number}
//                         handleBlurs={() => setFieldTouched("contact_number")}
//                       />
//                     </View>
//                   </View>
//                   {touched.contact_number && errors.contact_number && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.contact_number}
//                     </TextView>
//                   )}

//                   <InputFields
//                     placeholder={
//                       profileDetails?.data.user_details.employee_id == null
//                         ? "Employee ID"
//                         : "Employee ID (optional)"
//                     }
//                     onChangeText={
//                       handleChange("employee_id") ||
//                       profileDetails?.data.user_details.employee_id
//                     }
//                     value={values.employee_id}
//                   />

//                   <InputFields
//                     // placeholderTextColor
//                     placeholder={
//                       profileDetails?.data.user_details.job_title == null
//                         ? "job_title"
//                         : "job_title"
//                     }
//                     onChangeText={
//                       handleChange("job_title") ||
//                       profileDetails?.data.user_details.job_title
//                     }
//                     value={values.job_title}
//                     handleBlurs={() => setFieldTouched("job_title")}
//                   />
//                   {touched.job_title && errors.job_title && (
//                     <TextView textSty={{ color: Colors.danger }}>
//                       {errors.job_title}
//                     </TextView>
//                   )}
//                   {console.log("9873824234", roleBase)}
//                   {roleBase !== "user" ? (
//                     <CustomDropdown
//                       changeColor={{
//                         color: Colors.black,
//                       }}
//                       type={"countryName"}
//                       placeholder={
//                         profileDetails?.data?.user_details?.assigned_role
//                           ? ([capitalizedSuper, capitalizedAdmin] =
//                               separateAndCapitalize(
//                                 profileDetails?.data?.user_details
//                                   ?.assigned_role
//                               ))
//                           : "Assign Role"
//                       }
//                       data={data}
//                       onSelect={handleRole}
//                     />
//                   ) : (
//                     <InputFields
//                       placeholderTextColor
//                       placeholder={
//                         profileDetails?.data?.user_details?.assigned_role ==
//                         "user"
//                           ? "Staff"
//                           : null
//                       }
//                       editDisabled={false}
//                     />
//                   )}
//                 </View>
//                 <View
//                   style={{
//                     backgroundColor: "rgba(23, 23, 23, 0.05)",
//                     paddingVertical: 20,
//                     marginTop: 15,
//                   }}>
//                   <View
//                     style={{
//                       marginHorizontal: moderateScale(20),
//                       marginTop: -15,
//                     }}>
//                     <TextView heading headingTextSty={ProfileStyle.textStyles}>
//                       {/* {AllStrings.User_Profile} */}
//                       First Aider Certification Information
//                     </TextView>
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}>
//                       <View
//                         style={{ flexDirection: "row", alignItems: "center" }}>
//                         <View
//                           style={{
//                             ...ProfileStyle.switchSty,
//                             backgroundColor:
//                               isEnabled == false
//                                 ? Colors.white
//                                 : Colors.secondary,
//                           }}>
//                           <Switch
//                             trackColor={{
//                               true: Colors.secondary,
//                               false: Colors.white,
//                             }}
//                             thumbColor={Colors.white}
//                             onValueChange={() => setIsEnabled(!isEnabled)}
//                             value={isEnabled}
//                             style={{
//                               transform: [{ scaleX: 1 }, { scaleY: 1 }],
//                             }}
//                           />
//                         </View>
//                         <TextView textSty={{ marginLeft: 5 }}>
//                           {AllStrings.Certified_First_Aider}
//                         </TextView>
//                       </View>
//                     </View>
//                     {/* I certify that I’m mentally fit to perform the duties of this role */}
//                     {/* <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginTop: 15,
//                         flex: 1,
//                       }}>
//                       <View
//                         style={{
//                           // flex: 0.1,
//                           alignSelf: "flex-start",
//                           borderColor: Colors.lightgray,
//                           borderWidth: 0.7,
//                           borderRadius: 20,
//                           backgroundColor:
//                             mentally == false ? Colors.white : Colors.secondary,
//                         }}>
//                         <Switch
//                           trackColor={{
//                             false: Colors.white,
//                             true: Colors.secondary,
//                           }}
//                           thumbColor={Colors.white}
//                           onValueChange={() => setmentally(!mentally)}
//                           value={mentally}
//                           style={{
//                             transform: [{ scaleX: 1 }, { scaleY: 1 }],
//                           }}
//                         />
//                       </View>
//                       <View flex={1}>
//                         <TextView
//                           textSty={{
//                             marginLeft: 5,
//                             // width: "95%",
//                           }}>
//                           I certify that I’m mentally fit to perform the duties
//                           of this role
//                         </TextView>
//                       </View>
//                     </View> */}

//                     <TextView
//                       heading
//                       headingTextSty={{
//                         ...ProfileStyle.textStyles,
//                         marginBottom: -10,
//                       }}>
//                       {/* {AllStrings.User_Profile} */}
//                       Certificate expiry date
//                     </TextView>
//                     <DatePicker
//                       showDates={
//                         profileDetails?.data.user_details
//                           ?.firstaid_certificate_date
//                       }
//                       onDateChange={handleDateChange}
//                       profile
//                     />
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginTop: moderateScaleVertical(20),
//                         // height: moderateScale(60),
//                         flex: 1,
//                       }}>
//                       <View style={{ flex: 0.5 }}>
//                         <Button
//                           onClick={
//                             () => {
//                               pickPDF();
//                             }
//                             // navigation.navigate(navigationString.kitsInstallation)
//                           }
//                           allButtonSty={{
//                             marginHorizontal: 0,
//                           }}
//                           buttonColor={Colors.black}
//                           btnName="Add Certificate"
//                         />
//                       </View>
//                       {pdfUri !== null && (
//                         <View
//                           style={{
//                             flex: 0.35,
//                             marginLeft: moderateScale(5),
//                             flexDirection: "row",
//                             alignItems: "center",
//                           }}>
//                           <Image
//                             source={imagePath.PDF_file_icon}
//                             resizeMode="contain"
//                             style={{
//                               width: moderateScale(18),
//                               height: moderateScale(18),
//                             }}
//                           />
//                           <TextView>
//                             {(pdfUri !== null && pdfUri[0]?.name) ||
//                               pdfUri?.substring(pdfUri.lastIndexOf("/") + 1)}
//                           </TextView>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     marginTop: 10,
//                     marginHorizontal: moderateScale(20),
//                   }}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       marginVertical: moderateScaleVertical(35),
//                       width: "95%",
//                     }}>
//                     <View style={{ width: "35%" }}>
//                       <Button
//                         onClick={() => {
//                           // navigation?.goBack();
//                           setShowModal(true);
//                         }}
//                         allButtonSty={{
//                           backgroundColor: "black",
//                           borderRadius: 10,
//                           // width: "29%",
//                           marginHorizontal: 0,
//                         }}
//                         buttonColor={Colors.white}
//                         btnColor="#fff"
//                         btnName="Cancel"
//                       />
//                     </View>
//                     <View style={{ width: "75%" }}>
//                       <Button
//                         onClick={handleSubmit}
//                         // allButtonSty={{
//                         //   marginVertical: moderateScaleVertical(35),
//                         // }}
//                         buttonColor={Colors.black}
//                         btnName="Update"
//                       />
//                     </View>
//                   </View>

//                   <Button
//                     logout
//                     onClick={() => handleLogout()}
//                     allButtonSty={{
//                       marginBottom: 20,
//                       marginTop: 0,
//                       fontSize: 5,
//                       backgroundColor: Colors.white,
//                     }}
//                     buttonColor={Colors.black}
//                     btnName="Log Out"
//                   />
//                 </View>
//               </ScrollView>
//               <ModalScreen
//                 visible={showModal}
//                 modalheading={"Discard changes?"}
//                 modalText={
//                   "The updates you made were not saved, do you want to discard changes?"
//                 }
//                 btnName="Yes"
//                 btnName1="No"
//                 buttonColor={Colors.black}
//                 ModalBtn1={{ width: "49%" }}
//                 ModalBtn={{ width: "49%" }}
//                 modalButton1={() => {
//                   resetForm(values);
//                   setShowModal(false);
//                 }}
//                 modalButton={() => {
//                   setShowModal(false);
//                   navigation?.navigate(navigationString.Home);
//                 }}
//               />
//               {editProfile && (
//                 <ModalScreen
//                   img
//                   downPopUp
//                   imageURL={
//                     profileDetails?.data?.user_details?.profile_pic == ""
//                       ? imagePath.ProfilePic
//                       : {
//                           uri: profileDetails?.data?.user_details?.profile_pic,
//                         }
//                     //   {
//                     //   uri: profileDetails?.data?.user_details?.profile_pic,
//                     // }
//                   }
//                   selectPic={handleSelectPic}
//                   showDownPopUp={editProfile}
//                   details={details}
//                   closePopUp={() => {
//                     setEditProfile(false);
//                   }}
//                   removePic={() => handleDelete()}
//                 />
//               )}
//             </View>
//           </View>
//         </SafeAreaView>
//       )}
//     </Formik>
//   );
// };

// export default Profile;

import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  View,
  Switch,
  TouchableOpacity,
  Modal,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import imagePath from "../../Constant/imagePath";
import Colors from "../../Styles/Colors";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import ProfileStyle from "./ProfileStyles";
import InputFields from "../../Components/InputFields";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import countryPhoneCodes from "../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import DatePicker from "../../Components/DatePicker";
import ModalScreen from "../../Components/ModalScreen";
import {
  call_DeleteProfilePic_API,
  call_Profile_Api,
  call_UpdateProfile_API,
} from "../../redux/action/ProfileAction";
import { useDispatch, useSelector } from "react-redux";
import { Formik, useFormik } from "formik";
import Loading from "../../Components/Loading";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import CustomDropdown from "../../Components/CustomDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewLocation, saveUserData } from "../../redux/reducer/auth";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { EditProfileValidation } from "../../utils/Validation";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../Constant/dimensions";
import ImageResizer from "react-native-image-resizer";
import { logout } from "../../redux/action/AuthAction";
import { call_EditUser_API } from "../../redux/action/AdminAction";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { isLoading, error, profileDetails } = useSelector(
    (state) => state.profileData
  );

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
  ];

  console.log("-Profile---routes ", JSON.stringify(profileDetails));

  const [isEnabled, setIsEnabled] = useState(
    profileDetails?.data?.user_details?.is_firstaid_certified
  );
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [dates, setDates] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfUri, setPdfUri] = useState(
    profileDetails?.data.user_details.firstaid_certificate || null
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const [roleBase, setRoleBase] = useState(null);
  const [mentally, setmentally] = useState(
    profileDetails?.data?.user_details?.is_mentally_fit
  );
  const [isLoadings, setisLoadings] = useState(false);
  //  is_mentally_fit

  console.log(profileDetails, "imageUri------", imageUri);

  useEffect(() => {
    if (isFocused) {
      requestHandler();
    }
  }, [isFocused]);

  const requestHandler = async () => {
    const role = await AsyncStorage.getItem("role");
    setRoleBase(role);
    // console.log("---accessToken-- ", role);
  };

  useEffect(() => {
    // setTimeout(() => {
    dispatch(call_Profile_Api());
    // }, 10);
  }, []);

  const handleDateChange = (selectedDate) => {
    console.log("Selected date:", selectedDate);
    setDates(selectedDate);
    // Do something with the selected date, such as updating state
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

  const handleDelete = () => {
    dispatch(call_DeleteProfilePic_API())
      .then((res) => {
        console.log("delete profile image---", res);
        if (res.payload.status === 200) {
          // alert(res.payload.message);
          setEditProfile(false);
          navigation.goBack();
        }
      })
      .catch((err) => {
        console.log("errr delete profile image---", err);
      });
    // setImageUri(null);
    // setEditProfile(false);
  };

  const details = [
    { id: "1", label: AllStrings.TakePhoto, image: imagePath.camera },
    { id: "2", label: AllStrings.ChoosePhoto, image: imagePath.choosePhoto },
  ];
  console.log("pdfUripdfUripdfUripdfUri=", pdfUri);
  const handleUpdateProfile = (val) => {
    // if (roleBase !== "user") {
    //   if (selectedRole == null) {
    //     return alert("Please select role.");
    //   }
    // }
    const payload = new FormData();
    payload.append("first_name", val.first_name);
    payload.append("last_name", val.last_name);
    // payload.append("location", val.company_name);
    payload.append("location", val.company_name);
    payload.append("country_code", country_Code);
    payload.append("contact_number", val.contact_number);
    payload.append("employee_id", val.employee_id);
    payload.append("job_title", val.job_title);
    payload.append("email", val.email);
    {
      // roleBase !== "user" &&
      payload.append(
        "assigned_role",
        selectedRole == null
          ? profileDetails?.data?.user_details?.assigned_role
          : selectedRole.label?.replace(/\s+/g, "").toLowerCase()
      );
    }
    payload.append("is_firstaid_certified", isEnabled);

    var datestr = new Date(dates).toUTCString();
    {
      dates !== null && payload.append("firstaid_certificate_date", datestr);
    }
    payload.append("is_mentally_fit", mentally);
    {
      imageUri !== null &&
        payload.append("profile_pic", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
    }

    {
      pdfUri !== null &&
        pdfUri[0].uri &&
        payload.append("firstaid_certificate", {
          uri: pdfUri[0].uri,
          type: "application/pdf",
          name: pdfUri[0].name,
        });
    }
    console.log("payload---", JSON.stringify(payload));

    setisLoadings(true);
    dispatch(call_UpdateProfile_API(payload))
      .then((res) => {
        console.log("update profie----", res.payload);
        setisLoadings(false);
        if (res.payload.status === 200) {
          setisLoadings(false);
          navigation.goBack();
        } else {
          setisLoadings(false);
          // alert(res.payload.message);
        }
      })
      .catch((error) => {
        setisLoadings(false);
        console.log(error, "----update profile---");
      });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera.",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission granted");
        takePicture();
        // Proceed with your functionality that requires camera access
      } else {
        console.log("Camera permission denied");
        // Handle the case where the user denied camera access
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSelectPic = async (option) => {
    console.log("option-----", option);
    if (option.label == "Take Photo") {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission is granted");
          takePicture();
        } else {
          requestCameraPermission();
          console.log("Camera permission is not granted");
        }
      } else {
        takePicture();
      }
    } else if (option.label == "Choose Photo") {
      choosePicture();
    }
  };

  //functionality of upload image
  // const takePicture = () => {
  //   launchCamera({ mediaType: "photo" }, (response) => {
  //     console.log("pic reres", response);
  //     if (!response?.didCancel) {
  //       setImageUri(response?.assets[0]?.uri);
  //       setEditProfile(false);
  //       // setCapturedImage(response.assets[0]);
  //     }
  //   });
  // };
  const takePicture = () => {
    launchCamera({ mediaType: "photo" }, async (response) => {
      console.log("pic reres", response);
      if (!response?.didCancel) {
        setisLoadings(true);
        try {
          const compressedImage = await ImageResizer.createResizedImage(
            response.assets[0].uri,
            300, // Set the maximum width
            400, // Set the maximum height
            "JPEG", // Set the output format ('JPEG' or 'PNG')
            80 // Set the compression quality (0 - 100)
          );
          setImageUri(compressedImage.uri);
          setEditProfile(false);
          setisLoadings(false);
        } catch (error) {
          console.error("Error compressing image:", error);
          setisLoadings(false);
        }
      }
    });
  };

  //functionality of Choose Picture from gallery
  // const choosePicture = () => {
  //   launchImageLibrary({ mediaType: "fie" }, (response) => {
  //     console.log("pic reres", response);
  //     if (!response?.didCancel) {
  //       setImageUri(response.assets[0].uri);
  //       setEditProfile(false);
  //       // setCapturedImage(response.assets[0]);
  //     }
  //   });
  // };
  const choosePicture = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      console.log("pic reres", response);
      if (!response?.didCancel) {
        try {
          const compressedImage = await ImageResizer.createResizedImage(
            response.assets[0].uri,
            300, // Set the maximum width
            400, // Set the maximum height
            "JPEG", // Set the output format ('JPEG' or 'PNG')
            80 // Set the compression quality (0 - 100)
          );
          setImageUri(compressedImage.uri);
          setEditProfile(false);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
    });
  };

  //functionality of upload pdf file
  const pickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setPdfUri(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log("Error picking PDF:", err);
      } else {
        console.log("User canceled the picker");
      }
    }
  };

  const handleRole = (item) => {
    console.log("handleRole----", item);
    setSelectedRole(item);
  };

  console.log("----pdf uri-----", pdfUri);

  const handleLogout = async () => {
    try {
      // AsyncStorage.clear().then(() => console.log("Cleared"));
      await AsyncStorage.removeItem("globalData");
      console.log("AsyncStorage cleared successfully.");
      dispatch(saveUserData({}));
      dispatch(NewLocation({}));
      dispatch(logout());
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
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

  const handleAccountDelete = () => {
    // handleLogout();
    dispatch(call_EditUser_API(profileDetails?.data?.user_details?._id))
      .then(async (res) => {
        console.log("Acount deletion", res);
        // completeDelete(x._id);
        // if (res.payload.status === 200) {
        //   // handleLogout();
        //   await AsyncStorage.removeItem("globalData");
        //   dispatch(saveUserData({ isLogin: false }));
        // }
        await AsyncStorage.removeItem("globalData");
        dispatch(saveUserData({ isLogin: false }));
        setDeleteModal(false);
        // navigation?.navigate(navigationString.Home);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        first_name: profileDetails?.data.user_details.first_name,
        last_name: profileDetails?.data.user_details.last_name,
        email: profileDetails?.data.user_details.email || "",
        contact_number: profileDetails?.data.user_details.contact_number,
        country_code: profileDetails?.data.user_details.country_Code,
        profile_pic: "",
        verified: true,
        job_title: profileDetails?.data.user_details.job_title,
        employee_id: profileDetails?.data.user_details.employee_id,
        assigned_role: "",
        company_name: profileDetails?.data.user_details.company_name,
      }}
      validationSchema={EditProfileValidation(countryName, country_Code)}
      onSubmit={(values) => handleUpdateProfile(values)}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
        resetForm,
      }) => (
        <SafeAreaView
          style={{ height: "100%", backgroundColor: Colors.primary }}>
          <Modal animated={true} transparent={true} visible={isLoadings}>
            <Loading />
          </Modal>

          <Header
            iconName={
              // profileDetails?.data?.user_details?.profile_pic
              imageUri
                ? { uri: imageUri }
                : profileDetails?.data?.user_details?.profile_pic == ""
                ? profileDetails?.data?.user_details?.profile_pic
                : {
                    uri: profileDetails?.data?.user_details?.profile_pic,
                  }
            }
            back={() => setEditProfile(true)}
            backIcon={imagePath.backArrow}
            editHeader={() => navigation.goBack()}
          />
          <View
            style={{
              // backgroundColor: "red",
              // position: "absolute",

              // marginTop: Platform.OS === "ios" ? 28 : 30,
              marginTop: -20,

              alignSelf: "flex-start",
              left: Platform.OS === "ios" ? 30 : 35,
            }}>
            {/* <TextView
            heading
            headingTextSty={{
              ...ProfileStyle.editStyle,
              marginLeft: 2,
              fontSize: 11,
              width: "40%",
            }}
            onPress={() => setEditProfile(true)}>
            Edit Profile Picture
          </TextView> */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setEditProfile(true)}>
              <Image
                source={imagePath.edit_Icon}
                style={{ height: 25, width: 25 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {/* Green section */}
            <TextView heading headingTextSty={ProfileStyle.headingContainer}>
              {AllStrings.User_Profile}
            </TextView>

            {/* Rest of the content */}
            <View style={ProfileStyle.buttonContainer}>
              <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    marginTop: 20,
                    marginHorizontal: moderateScale(20),
                  }}>
                  <InputFields
                    // placeholderTextColor
                    placeholder={
                      profileDetails?.data.user_details.first_name == null
                        ? "First name"
                        : "First name"
                    }
                    onChangeText={handleChange(
                      "first_name" ||
                        profileDetails?.data.user_details.first_name
                    )}
                    handleBlurs={() => setFieldTouched("first_name")}
                    value={values.first_name}
                  />
                  {touched.first_name && errors.first_name && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.first_name}
                    </TextView>
                  )}
                  <InputFields
                    // placeholderTextColor
                    placeholder={
                      profileDetails?.data.user_details.last_name == null
                        ? "Last name"
                        : "Last name"
                    }
                    onChangeText={handleChange(
                      "last_name" || profileDetails?.data.user_details.last_name
                    )}
                    value={values.last_name}
                    handleBlurs={() => setFieldTouched("last_name")}
                  />
                  {touched.last_name && errors.last_name && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.last_name}
                    </TextView>
                  )}
                  <InputFields
                    // placeholderTextColor
                    autoCapitalize
                    keyboardType="email-address"
                    placeholder={"Email"}
                    onChangeText={
                      handleChange("email") ||
                      profileDetails?.data?.user_details?.email
                    }
                    value={values.email}
                    editDisabled={roleBase !== "user" && true}
                    handleBlurs={() => setFieldTouched("email")}
                    textContentType="emailAddress"
                    autoComplete="email"
                  />
                  {touched.email && errors.email && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.email}
                    </TextView>
                  )}
                  <InputFields
                    // editDisabled={false}
                    // placeholderTextColor
                    placeholder={"Company name"}
                    onChangeText={
                      handleChange("company_name") ||
                      profileDetails?.data.user_details.company_name
                    }
                    value={values.company_name}
                    handleBlurs={() => setFieldTouched("company_name")}
                  />
                  {touched.company_name && errors.company_name && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.company_name}
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

                      <TextView textSty={{ fontSize: 14 }}>
                        {country_Code ? country_Code : "+44"}
                      </TextView>
                      {/* <Image
                      source={imagePath.downArrow}
                      resizeMode="contain"
                      style={{ width: 10, height: 10, paddingLeft: 10 }}
                     /> */}
                      <TouchableOpacity onPress={() => handleOpenModal()}>
                        <Image
                          source={imagePath.downArrow}
                          resizeMode="contain"
                          style={{
                            width: 10,
                            height: 10,
                            paddingLeft: 10,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "70%" }}>
                      <InputFields
                        // placeholderTextColor
                        placeholder={"Number"}
                        keyboardType="phone-pad"
                        onChangeText={
                          handleChange("contact_number") ||
                          profileDetails?.data.user_details.contact_number
                        }
                        value={values.contact_number}
                        handleBlurs={() => setFieldTouched("contact_number")}
                      />
                    </View>
                  </View>
                  {touched.contact_number && errors.contact_number && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.contact_number}
                    </TextView>
                  )}

                  <InputFields
                    placeholder={
                      profileDetails?.data.user_details.employee_id == null
                        ? "Employee ID"
                        : "Employee ID (optional)"
                    }
                    onChangeText={
                      handleChange("employee_id") ||
                      profileDetails?.data.user_details.employee_id
                    }
                    value={values.employee_id}
                  />

                  <InputFields
                    // placeholderTextColor
                    placeholder={
                      profileDetails?.data.user_details.job_title == null
                        ? "job_title"
                        : "job_title"
                    }
                    onChangeText={
                      handleChange("job_title") ||
                      profileDetails?.data.user_details.job_title
                    }
                    value={values.job_title}
                    handleBlurs={() => setFieldTouched("job_title")}
                  />
                  {touched.job_title && errors.job_title && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.job_title}
                    </TextView>
                  )}

                  {
                    // roleBase !== "user"
                    profileDetails?.data?.user_details?.assigned_role !==
                    "staff" ? (
                      <CustomDropdown
                        changeColor={{
                          color: Colors.black,
                        }}
                        type={"countryName"}
                        placeholder={
                          profileDetails?.data?.user_details?.assigned_role
                            ? ([capitalizedSuper, capitalizedAdmin] =
                                separateAndCapitalize(
                                  profileDetails?.data?.user_details
                                    ?.assigned_role
                                ))
                            : "Assign Role"
                        }
                        data={data}
                        onSelect={handleRole}
                      />
                    ) : (
                      <InputFields
                        placeholderTextColor
                        placeholder={
                          profileDetails?.data?.user_details?.assigned_role
                            ?.charAt(0)
                            .toUpperCase() +
                          profileDetails?.data?.user_details?.assigned_role?.slice(
                            1
                          )
                          // ==
                          // "user"
                          //   ? "Staff"
                          //   : null
                        }
                        editDisabled={false}
                      />
                    )
                  }
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(23, 23, 23, 0.05)",
                    paddingVertical: 20,
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      marginHorizontal: moderateScale(20),
                      marginTop: -15,
                    }}>
                    <TextView heading headingTextSty={ProfileStyle.textStyles}>
                      {/* {AllStrings.User_Profile} */}
                      First Aider Certification Information
                    </TextView>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                          style={{
                            ...ProfileStyle.switchSty,
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
                          {AllStrings.Certified_First_Aider}
                        </TextView>
                      </View>
                    </View>
                    {/* I certify that I’m mentally fit to perform the duties of this role */}
                    {/* <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 15,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          // flex: 0.1,
                          alignSelf: "flex-start",
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                          backgroundColor:
                            mentally == false ? Colors.white : Colors.secondary,
                        }}>
                        <Switch
                          trackColor={{
                            false: Colors.white,
                            true: Colors.secondary,
                          }}
                          thumbColor={Colors.white}
                          onValueChange={() => setmentally(!mentally)}
                          value={mentally}
                          style={{
                            transform: [{ scaleX: 1 }, { scaleY: 1 }],
                          }}
                        />
                      </View>
                      <View flex={1}>
                        <TextView
                          textSty={{
                            marginLeft: 5,
                            // width: "95%",
                          }}>
                          I certify that I’m mentally fit to perform the duties
                          of this role
                        </TextView>
                      </View>
                    </View> */}

                    <TextView
                      heading
                      headingTextSty={{
                        ...ProfileStyle.textStyles,
                        marginBottom: -10,
                      }}>
                      {/* {AllStrings.User_Profile} */}
                      Certificate expiry date
                    </TextView>
                    <DatePicker
                      showDates={
                        profileDetails?.data.user_details
                          ?.firstaid_certificate_date
                      }
                      onDateChange={handleDateChange}
                      profile
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: moderateScaleVertical(20),
                        // height: moderateScale(60),
                        flex: 1,
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
                            flex: 0.35,
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
                            {(pdfUri !== null && pdfUri[0]?.name) ||
                              pdfUri?.substring(pdfUri.lastIndexOf("/") + 1)}
                          </TextView>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    marginHorizontal: moderateScale(20),
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: moderateScaleVertical(35),
                      width: "95%",
                    }}>
                    <View style={{ width: "35%" }}>
                      <Button
                        onClick={() => {
                          // navigation?.goBack();
                          setShowModal(true);
                        }}
                        allButtonSty={{
                          backgroundColor: "black",
                          borderRadius: 10,
                          // width: "29%",
                          marginHorizontal: 0,
                        }}
                        buttonColor={Colors.white}
                        btnColor="#fff"
                        btnName="Cancel"
                      />
                    </View>
                    <View style={{ width: "75%" }}>
                      <Button
                        onClick={handleSubmit}
                        // allButtonSty={{
                        //   marginVertical: moderateScaleVertical(35),
                        // }}
                        buttonColor={Colors.black}
                        btnName="Update"
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <Button
                      logout
                      onClick={() => handleLogout()}
                      allButtonSty={{
                        marginBottom: 20,
                        marginTop: 0,
                        fontSize: 5,
                        backgroundColor: Colors.white,
                      }}
                      buttonColor={Colors.black}
                      btnName="Log Out"
                    />

                    <Button
                      logout
                      onClick={() => {
                        setDeleteModal(true);
                      }}
                      allButtonSty={{
                        marginBottom: 20,
                        marginTop: 0,
                        fontSize: 5,
                        backgroundColor: Colors.white,
                      }}
                      buttonColor={Colors.black}
                      btnName="Request Account Deletion"
                    />
                  </View>
                </View>
              </ScrollView>
              <ModalScreen
                visible={showModal}
                modalheading={"Discard changes?"}
                modalText={
                  "The updates you made were not saved, do you want to discard changes?"
                }
                btnName="Yes"
                btnName1="No"
                buttonColor={Colors.black}
                ModalBtn1={{ width: "49%" }}
                ModalBtn={{ width: "49%" }}
                modalButton1={() => {
                  resetForm(values);
                  setShowModal(false);
                }}
                modalButton={() => {
                  setShowModal(false);
                  navigation?.navigate(navigationString.Home);
                }}
              />

              <ModalScreen
                visible={deleteModal}
                modalheading={"Account Deletion?"}
                modalText={"Are you sure you want to delete your account?"}
                btnName="Yes"
                btnName1="No"
                buttonColor={Colors.black}
                ModalBtn1={{ width: "49%" }}
                ModalBtn={{ width: "49%" }}
                modalButton1={() => {
                  setDeleteModal(false);
                }}
                modalButton={() => {
                  handleAccountDelete();
                }}
              />

              {editProfile && (
                <ModalScreen
                  img
                  downPopUp
                  imageURL={
                    profileDetails?.data?.user_details?.profile_pic == ""
                      ? imagePath.ProfilePic
                      : {
                          uri: profileDetails?.data?.user_details?.profile_pic,
                        }
                    //   {
                    //   uri: profileDetails?.data?.user_details?.profile_pic,
                    // }
                  }
                  selectPic={handleSelectPic}
                  showDownPopUp={editProfile}
                  details={details}
                  closePopUp={() => {
                    setEditProfile(false);
                  }}
                  removePic={() => handleDelete()}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default Profile;
