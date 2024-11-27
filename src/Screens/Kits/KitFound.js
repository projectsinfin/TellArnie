//working code build 78
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   RefreshControl,
// } from "react-native";
// import React, { useState, useEffect, useCallback } from "react";
// import Colors from "../../Styles/Colors";
// import imagePath from "../../Constant/imagePath";
// import Header from "../../Components/Header";
// import TextView from "../../Components/TextView";
// import AllStrings from "../../Constant/AllStrings";
// import navigationString from "../../Navigations/navigationString";
// import kitsStyles from "./kitsStyles";
// import Button from "../../Components/Button";
// import MiniCard from "../../Components/MiniCard";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from "react-native-responsive-dimensions";
// import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
// import { useIsFocused } from "@react-navigation/native";
// import { addItemFromProductFound } from "../../redux/reducer/auth";
// import {
//   moderateScale,
//   moderateScaleVertical,
// } from "../../Styles/responsiveSize";
// import MonthPicker from "react-native-month-year-picker";

// const KitFound = ({ navigation, route }) => {
//   const isFocused = useIsFocused();
//   const storeQrCode = useSelector((state) => state?.auth?.QRCode);
//   console.log("kit found storeQrCode---", storeQrCode);
//   const dispatch = useDispatch();
//   const [refreshing, setRefreshing] = useState(false);
//   const [listData, setData] = useState(
//     installKitDetails?.data?.relatedProducts
//   );

//   const { isLoading, error, installKitDetails } = useSelector(
//     (state) => state.InstallKitsSliceDetail
//   );
//   console.log(listData, "installKitDetails screen show data ", route?.params);
//   const [date, setDate] = useState(new Date());
//   const [showDate, setShowDate] = useState(false);
//   const [show, setShow] = useState(false);

//   const expiryDate = installKitDetails?.data?.kit?.expiry_date;
//   const formattedDate = moment(expiryDate).format("MMM YYYY");
//   const minDate = "";

//   useEffect(() => {
//     // fetchData();
//     setData(installKitDetails?.data?.relatedProducts);
//   }, [installKitDetails]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (isFocused) {
//       fetchData();
//     }
//   }, [isFocused]);

//   console.log(
//     JSON.stringify(installKitDetails),
//     "route?.params?.qrCode==--=",
//     route?.params
//   );

//   const onValueChange = useCallback(
//     (event, newDate) => {
//       const selectedDate = newDate || date;
//       setShow(false);
//       setShowDate(true);
//       setDate(selectedDate);
//     },
//     [date, show]
//   );

//   const fetchData = () => {
//     const data = {
//       qr_code: route?.params?.qrCode || storeQrCode,
//     };
//     dispatch(call_InstallKitDetails(data))
//       .then((res) => {
//         console.log("======res=======", JSON.stringify(res));
//         if (res.payload.status === 200) {
//           // navigation.navigate(navigationString.kitsFound, {
//           //   qrCode: scannedData.rawData,
//           // });

//           console.log(res, "----response------ 123 ");
//           setData(installKitDetails?.data?.relatedProducts);
//           setRefreshing(false);
//         } else {
//           setRefreshing(false);
//           alert(res?.payload?.message);
//         }
//       })
//       .catch((err) => {
//         setRefreshing(false);
//         console.log(err, "--------errror ----------123");
//       });
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = () => {
//     setRefreshing(true); // Set refreshing to true to show the spinner
//     fetchData(); // Call the function to fetch new data
//   };

//   const renderItem = ({ item, index }) => {
//     // console.log(item, "---index", index);
//     const formattedItemDate = item.expiry_date
//       ? moment(item.expiry_date).format("MMM YYYY")
//       : "";
//     return (
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingVertical: 14,
//           paddingHorizontal: 5,
//           backgroundColor: index % 2 == 0 ? null : Colors.greenLightTint,
//         }}>
//         <View style={{ flex: 0.5 }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "left",
//             }}>
//             {item?.product_code} - {item?.description}
//           </TextView>
//         </View>
//         <View style={{ flex: 0.25 }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "center",
//             }}>
//             {item?.current_quantity}
//           </TextView>
//         </View>
//         <View
//           style={{
//             flex: 0.25,
//           }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "center",
//             }}>
//             {item?.expiry_date === null || !item?.expiry_date
//               ? ""
//               : moment(item?.expiry_date).format("MMM YYYY")}
//           </TextView>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
//       <Header
//         back={() => navigation.navigate(navigationString.profile)}
//         backIcon={imagePath.backArrow}
//         editHeader={() => navigation.goBack()}
//       />

//       <View style={kitsStyles.container}>
//         <View
//           style={{
//             ...kitsStyles.heading,
//             marginTop: 15,
//             marginHorizontal: 20,
//           }}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={["#9Bd35A", "#689F38"]}
//                 // tintColor="#689F38" // Android only
//                 // title="Pull to refresh" // iOS only
//               />
//             }>
//             <View style={{ alignSelf: "center", marginVertical: 20 }}>
//               <Image
//                 source={
//                   installKitDetails?.data.kit?.kit_picture !== ""
//                     ? { uri: installKitDetails?.data.kit?.kit_picture }
//                     : imagePath.NoIcon
//                   // imagePath.NoIcon
//                 }
//                 resizeMode="contain"
//                 style={{
//                   width: responsiveWidth(80),
//                   height: responsiveHeight(25),
//                 }}
//               />
//             </View>
//             <View style={{ width: "80%", alignSelf: "center" }}>
//               <TextView
//                 onPress={() => {}}
//                 heading
//                 headingTextSty={{
//                   ...kitsStyles.headingText,
//                   textAlign: "center",
//                   lineHeight: 21,
//                   marginTop: 10,
//                 }}>
//                 {/* {AllStrings.RelianceMedicalMediumWorkplace} */}
//                 {(installKitDetails?.data?.kit?.brand == "false"
//                   ? ""
//                   : installKitDetails?.data?.kit?.brand) +
//                   " " +
//                   (installKitDetails?.data?.kit?.model_number == "false"
//                     ? ""
//                     : installKitDetails?.data?.kit?.model_number) +
//                   " " +
//                   installKitDetails?.data?.kit?.product_name}
//               </TextView>
//             </View>

//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginTop: 20,
//                 gap: 2,
//               }}>
//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.BatchNumber}
//                   text={
//                     installKitDetails?.data.kit?.product_code == "false"
//                       ? null
//                       : installKitDetails?.data.kit?.product_code
//                   }
//                 />
//               </View>
//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.LOTNumber}
//                   text={
//                     route.params?.payload?.lotNumber
//                       ? route.params?.payload?.lotNumber
//                       : installKitDetails?.data?.kit?.lot_number == "false"
//                       ? null
//                       : installKitDetails?.data?.kit?.lot_number
//                   }
//                 />
//               </View>

//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.ExpiryDate}
//                   text={
//                     installKitDetails?.data?.kit?.expiry_date
//                       ? formattedDate
//                       : minDate
//                   }
//                 />
//               </View>
//             </View>

//             <View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   backgroundColor: Colors.greenTint,
//                   paddingHorizontal: moderateScale(10),
//                   paddingVertical: moderateScaleVertical(12),
//                   marginTop: moderateScaleVertical(15),
//                 }}>
//                 <View style={{ flex: 0.5 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                     }}>
//                     {AllStrings.KitContents}
//                   </TextView>
//                 </View>
//                 <View style={{ flex: 0.25 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       textAlign: "center",
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                     }}>
//                     {AllStrings.Quantity}
//                   </TextView>
//                 </View>
//                 <View style={{ flex: 0.25 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                       textAlign: "center",
//                     }}>
//                     {AllStrings.Expire_Date}
//                   </TextView>
//                 </View>
//               </View>
//               <View>
//                 <FlatList
//                   data={listData}
//                   renderItem={renderItem}
//                   keyExtractor={(item) => item.key}
//                   style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
//                 />
//               </View>
//             </View>
//             {route?.params?.key === "scanStandardReport" ||
//             route?.params?.key === "scanQuickReport" ? (
//               <View
//                 style={{
//                   // justifyContent: "center",
//                   width: "100%",
//                   marginVertical: 15,
//                   marginTop: 30,
//                 }}>
//                 <Button
//                   onClick={() => {
//                     // navigation.navigate(navigationString.enterLocation, {
//                     //   key: "user",
//                     // });
//                     route?.params?.key == "scanStandardReport"
//                       ? navigation.navigate(
//                           navigationString.detailedReportFirst
//                         )
//                       : navigation.navigate(
//                           navigationString.quickReportInfoNav
//                         );
//                   }}
//                   allButtonSty={{
//                     alignSelf: "center",
//                     width: "80%",
//                     borderRadius: 10,
//                   }}
//                   buttonColor={Colors.black}
//                   btnName="Continue"
//                 />
//               </View>
//             ) : (
//               <View
//                 style={{
//                   // justifyContent: "center",
//                   width: "100%",
//                   alignItems: "center",
//                   flexDirection: "row",
//                   marginVertical: 15,
//                   marginTop: 30,
//                 }}>
//                 <Button
//                   onClick={() => {
//                     dispatch(addItemFromProductFound("fromKitFound"));
//                     navigation.navigate(navigationString.addItems, {
//                       kitId: installKitDetails?.data?.kit?._id,
//                     });
//                   }}
//                   allButtonSty={{
//                     backgroundColor: Colors.black,
//                     borderRadius: 10,
//                     width: "40%",
//                   }}
//                   buttonColor={Colors.white}
//                   btnName="Add Item"
//                 />

//                 <Button
//                   onClick={() => {
//                     navigation.navigate(navigationString.enterLocation, {
//                       key: "user",
//                     });
//                   }}
//                   allButtonSty={{
//                     alignSelf: "center",
//                     width: "40%",
//                     borderRadius: 10,
//                   }}
//                   buttonColor={Colors.black}
//                   btnName="Continue"
//                 />
//               </View>
//             )}
//           </ScrollView>
//         </View>

//         {show && (
//           <MonthPicker
//             onChange={onValueChange}
//             value={date}
//             minimumDate={new Date()}
//             // maximumDate={new Date(2025, 5)}
//             locale="en"
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default KitFound;

// const styles = StyleSheet.create({});
// //working code build 79
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   RefreshControl,
// } from "react-native";
// import React, { useState, useEffect, useCallback } from "react";
// import Colors from "../../Styles/Colors";
// import imagePath from "../../Constant/imagePath";
// import Header from "../../Components/Header";
// import TextView from "../../Components/TextView";
// import AllStrings from "../../Constant/AllStrings";
// import navigationString from "../../Navigations/navigationString";
// import kitsStyles from "./kitsStyles";
// import Button from "../../Components/Button";
// import MiniCard from "../../Components/MiniCard";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from "react-native-responsive-dimensions";
// import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
// import { useIsFocused } from "@react-navigation/native";
// import { addItemFromProductFound } from "../../redux/reducer/auth";
// import {
//   moderateScale,
//   moderateScaleVertical,
// } from "../../Styles/responsiveSize";
// import MonthPicker from "react-native-month-year-picker";

// const KitFound = ({ navigation, route }) => {
//   const isFocused = useIsFocused();
//   const storeQrCode = useSelector((state) => state?.auth?.QRCode);
//   console.log("kit found storeQrCode---", storeQrCode);
//   const dispatch = useDispatch();
//   const [refreshing, setRefreshing] = useState(false);
//   const [mainExpiryDate, setMainExpiryDate] = useState(new Date());
//   const [show, setShow] = useState(false);
//   const [listData, setData] = useState(
//     installKitDetails?.data?.relatedProducts
//   );

//   const { isLoading, error, installKitDetails } = useSelector(
//     (state) => state.InstallKitsSliceDetail
//   );
//   // console.log(listData, "installKitDetails screen show data ", route?.params);

//   const expiryDate = installKitDetails?.data?.kit?.expiry_date;
//   const formattedDate = moment(expiryDate).format("MMM YYYY");
//   const minDate = "";

//   useEffect(() => {
//     // fetchData();
//     setData(installKitDetails?.data?.relatedProducts);
//   }, [installKitDetails]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (isFocused) {
//       fetchData();
//     }
//   }, [isFocused]);

//   console.log(
//     JSON.stringify(installKitDetails),
//     "route?.params?.qrCode==--=",
//     route?.params
//   );

//   const fetchData = () => {
//     const data = {
//       qr_code: route?.params?.qrCode || storeQrCode,
//     };
//     dispatch(call_InstallKitDetails(data))
//       .then((res) => {
//         console.log("======res=======", JSON.stringify(res));
//         if (res.payload.status === 200) {
//           const relatedProducts = res.payload.data.relatedProducts.map(
//             (product) => ({
//               ...product,
//               expiry_date: product.expiry_date
//                 ? new Date(product.expiry_date)
//                 : null,
//             })
//           );
//           setData(relatedProducts);
//           updateMainExpiryDate(relatedProducts);
//           setRefreshing(false);

//           // console.log(res, "----response------ 123 ");
//           // setData(installKitDetails?.data?.relatedProducts);
//         } else {
//           setRefreshing(false);
//           alert(res?.payload?.message);
//         }
//       })
//       .catch((err) => {
//         setRefreshing(false);
//         console.log(err, "--------errror ----------123");
//       });
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = () => {
//     setRefreshing(true); // Set refreshing to true to show the spinner
//     fetchData(); // Call the function to fetch new data
//   };

//   const updateMainExpiryDate = (data) => {
//     const validDates = data
//       .map((item) => item.expiry_date)
//       .filter((date) => date !== null);
//     if (validDates.length > 0) {
//       const minDate = new Date(
//         Math.min.apply(
//           null,
//           validDates.map((date) => date.getTime())
//         )
//       );
//       setMainExpiryDate(minDate);
//     }
//   };

//   const handleItemDateChange = (index, newDate) => {
//     const updatedList = [...listData];
//     updatedList[index].expiry_date = newDate;
//     setData(updatedList);
//     updateMainExpiryDate(updatedList);
//   };

//   const renderItem = ({ item, index }) => {
//     // console.log(item, "---index", index);
//     // const formattedItemDate = item.expiry_date
//     //   ? moment(item.expiry_date).format("MMM YYYY")
//     //   : "";
//     const formattedItemDate = item.expiry_date
//       ? moment(item.expiry_date).format("MMM YYYY")
//       : "";

//     return (
//       <TouchableOpacity
//         onPress={() => setShow(index)}
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingVertical: 14,
//           paddingHorizontal: 5,
//           backgroundColor: index % 2 == 0 ? null : Colors.greenLightTint,
//         }}>
//         <View style={{ flex: 0.5 }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "left",
//             }}>
//             {item?.product_code} - {item?.description}
//           </TextView>
//         </View>
//         <View style={{ flex: 0.25 }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "center",
//             }}>
//             {item?.current_quantity}
//           </TextView>
//         </View>
//         <View
//           style={{
//             flex: 0.25,
//           }}>
//           <TextView
//             textSty={{
//               fontSize: 12,
//               textAlign: "center",
//             }}>
//             {formattedItemDate}
//             {/* {item?.expiry_date === null || !item?.expiry_date
//               ? ""
//               : moment(item?.expiry_date).format("MMM YYYY")} */}
//           </TextView>
//         </View>
//         {show === index && (
//           <MonthPicker
//             onChange={(event, newDate) => {
//               setShow(false);
//               if (newDate) {
//                 handleItemDateChange(index, newDate);
//               }
//             }}
//             value={item.expiry_date || new Date()}
//             minimumDate={new Date()}
//             locale="en"
//           />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
//       <Header
//         back={() => navigation.navigate(navigationString.profile)}
//         backIcon={imagePath.backArrow}
//         editHeader={() => navigation.goBack()}
//       />

//       <View style={kitsStyles.container}>
//         <View
//           style={{
//             ...kitsStyles.heading,
//             marginTop: 15,
//             marginHorizontal: 20,
//           }}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={["#9Bd35A", "#689F38"]}
//                 // tintColor="#689F38" // Android only
//                 // title="Pull to refresh" // iOS only
//               />
//             }>
//             <View style={{ alignSelf: "center", marginVertical: 20 }}>
//               <Image
//                 source={
//                   installKitDetails?.data.kit?.kit_picture !== ""
//                     ? { uri: installKitDetails?.data.kit?.kit_picture }
//                     : imagePath.NoIcon
//                   // imagePath.NoIcon
//                 }
//                 resizeMode="contain"
//                 style={{
//                   width: responsiveWidth(80),
//                   height: responsiveHeight(25),
//                 }}
//               />
//             </View>
//             <View style={{ width: "80%", alignSelf: "center" }}>
//               <TextView
//                 onPress={() => {}}
//                 heading
//                 headingTextSty={{
//                   ...kitsStyles.headingText,
//                   textAlign: "center",
//                   lineHeight: 21,
//                   marginTop: 10,
//                 }}>
//                 {/* {AllStrings.RelianceMedicalMediumWorkplace} */}
//                 {(installKitDetails?.data?.kit?.brand == "false"
//                   ? ""
//                   : installKitDetails?.data?.kit?.brand) +
//                   " " +
//                   (installKitDetails?.data?.kit?.model_number == "false"
//                     ? ""
//                     : installKitDetails?.data?.kit?.model_number) +
//                   " " +
//                   installKitDetails?.data?.kit?.product_name}
//               </TextView>
//             </View>

//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginTop: 20,
//                 gap: 2,
//               }}>
//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.BatchNumber}
//                   text={
//                     installKitDetails?.data.kit?.product_code == "false"
//                       ? null
//                       : installKitDetails?.data.kit?.product_code
//                   }
//                 />
//               </View>
//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.LOTNumber}
//                   text={
//                     route.params?.payload?.lotNumber
//                       ? route.params?.payload?.lotNumber
//                       : installKitDetails?.data?.kit?.lot_number == "false"
//                       ? null
//                       : installKitDetails?.data?.kit?.lot_number
//                   }
//                 />
//               </View>

//               <View style={{ flex: 4 }}>
//                 <MiniCard
//                   heading={AllStrings.ExpiryDate}
//                   text={moment(mainExpiryDate).format("MMM YYYY")}
//                   // text={
//                   //   installKitDetails?.data?.kit?.expiry_date
//                   //     ? formattedDate
//                   //     : minDate
//                   // }
//                 />
//               </View>
//             </View>

//             <View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   backgroundColor: Colors.greenTint,
//                   paddingHorizontal: moderateScale(10),
//                   paddingVertical: moderateScaleVertical(12),
//                   marginTop: moderateScaleVertical(15),
//                 }}>
//                 <View style={{ flex: 0.5 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                     }}>
//                     {AllStrings.KitContents}
//                   </TextView>
//                 </View>
//                 <View style={{ flex: 0.25 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       textAlign: "center",
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                     }}>
//                     {AllStrings.Quantity}
//                   </TextView>
//                 </View>
//                 <View style={{ flex: 0.25 }}>
//                   <TextView
//                     heading
//                     headingTextSty={{
//                       lineHeight: 15,
//                       fontSize: 10,
//                       color: Colors.white,
//                       textAlign: "center",
//                     }}>
//                     {AllStrings.Expire_Date}
//                   </TextView>
//                 </View>
//               </View>
//               <View>
//                 <FlatList
//                   data={listData}
//                   renderItem={renderItem}
//                   keyExtractor={(item) => item.key}
//                   style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
//                 />
//               </View>
//             </View>
//             {route?.params?.key === "scanStandardReport" ||
//             route?.params?.key === "scanQuickReport" ? (
//               <View
//                 style={{
//                   // justifyContent: "center",
//                   width: "100%",
//                   marginVertical: 15,
//                   marginTop: 30,
//                 }}>
//                 <Button
//                   onClick={() => {
//                     // navigation.navigate(navigationString.enterLocation, {
//                     //   key: "user",
//                     // });
//                     route?.params?.key == "scanStandardReport"
//                       ? navigation.navigate(
//                           navigationString.detailedReportFirst
//                         )
//                       : navigation.navigate(
//                           navigationString.quickReportInfoNav
//                         );
//                   }}
//                   allButtonSty={{
//                     alignSelf: "center",
//                     width: "80%",
//                     borderRadius: 10,
//                   }}
//                   buttonColor={Colors.black}
//                   btnName="Continue"
//                 />
//               </View>
//             ) : (
//               <View
//                 style={{
//                   // justifyContent: "center",
//                   width: "100%",
//                   alignItems: "center",
//                   flexDirection: "row",
//                   marginVertical: 15,
//                   marginTop: 30,
//                 }}>
//                 <Button
//                   onClick={() => {
//                     dispatch(addItemFromProductFound("fromKitFound"));
//                     navigation.navigate(navigationString.addItems, {
//                       kitId: installKitDetails?.data?.kit?._id,
//                     });
//                   }}
//                   allButtonSty={{
//                     backgroundColor: Colors.black,
//                     borderRadius: 10,
//                     width: "40%",
//                   }}
//                   buttonColor={Colors.white}
//                   btnName="Add Item"
//                 />

//                 <Button
//                   onClick={() => {
//                     // navigation.navigate(navigationString.enterLocation, {
//                     //   key: "user",
//                     // });

//                     navigation.navigate(navigationString.enterLocation, {
//                       key: "user",
//                       lotNumber: route.params?.payload?.lotNumber,
//                       is_Empty_QrCode: route.params,
//                       mainExpiryDate: mainExpiryDate,
//                       listData: listData,
//                     });
//                   }}
//                   allButtonSty={{
//                     alignSelf: "center",
//                     width: "40%",
//                     borderRadius: 10,
//                   }}
//                   buttonColor={Colors.black}
//                   btnName="Continue"
//                 />
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default KitFound;

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
  RefreshControl,
  Platform,
  Modal,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import MiniCard from "../../Components/MiniCard";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
import { useIsFocused } from "@react-navigation/native";
import { addItemFromProductFound } from "../../redux/reducer/auth";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import MonthPicker from "react-native-month-year-picker";

const KitFound = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const storeQrCode = useSelector((state) => state?.auth?.QRCode);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [listData, setData] = useState([]);
  const { installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );

  const [mainExpiryDate, setMainExpiryDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // console.log(route.params, "-==--=777=--=");

  const fetchData = () => {
    const data = {
      qr_code: route?.params?.qrCode || storeQrCode,
    };
    dispatch(call_InstallKitDetails(data))
      .then((res) => {
        if (res.payload.status === 200) {
          const relatedProducts = res.payload.data.relatedProducts.map(
            (product) => ({
              ...product,
              expiry_date: product.expiry_date
                ? new Date(product.expiry_date)
                : null,
            })
          );
          setData(relatedProducts);
          updateMainExpiryDate(relatedProducts);
          setRefreshing(false);
        } else {
          setRefreshing(false);
          alert(res?.payload?.message);
        }
      })
      .catch((err) => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const updateMainExpiryDate = (data) => {
    const validDates = data
      .map((item) => item.expiry_date)
      .filter((date) => date !== null);
    if (validDates.length > 0) {
      const minDate = new Date(
        Math.min.apply(
          null,
          validDates.map((date) => date.getTime())
        )
      );
      setMainExpiryDate(minDate);
    }
  };

  const handleItemDateChange = (index, newDate) => {
    const updatedList = [...listData];
    updatedList[index].expiry_date = newDate;
    setData(updatedList);
    updateMainExpiryDate(updatedList);
  };

  const renderItem = ({ item, index }) => {
    const formattedItemDate = item.expiry_date
      ? moment(item.expiry_date).format("MMM YYYY")
      : "";

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            setShow(index);
          }}
          disabled={route.params?.key == "BarcodeScanKit" ? false : true}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 5,
            backgroundColor: index % 2 === 0 ? null : Colors.greenLightTint,
          }}>
          <View style={{ flex: 0.5 }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "left",
              }}>
              {item?.product_code} - {item?.description}
            </TextView>
          </View>
          <View style={{ flex: 0.25 }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "center",
              }}>
              {item?.current_quantity}
            </TextView>
          </View>
          <View style={{ flex: 0.25 }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "center",
              }}>
              {formattedItemDate}
            </TextView>
          </View>
        </TouchableOpacity>
        {show === index && (
          <View>
            {Platform.OS === "ios" ? (
              <Modal
                animationType="slide" // You can customize the animation type
                transparent={true}>
                {/* <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    // backgroundColor: '#1F043B',
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}>
                  <View
                    style={{
                      // backgroundColor: "#D3D3D3",
                      padding: 20,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      elevation: 5, // Android shadow
                      width: "100%",
                    }}> */}
                <MonthPicker
                  onChange={(event, newDate) => {
                    setShow(false);
                    if (newDate) {
                      handleItemDateChange(index, newDate);
                    }
                  }}
                  value={item.expiry_date || new Date()}
                  minimumDate={new Date()}
                  locale="en"
                />
                {/* </View>
                </View> */}
              </Modal>
            ) : (
              <MonthPicker
                onChange={(event, newDate) => {
                  setShow(false);
                  if (newDate) {
                    handleItemDateChange(index, newDate);
                  }
                }}
                value={item.expiry_date || new Date()}
                minimumDate={new Date()}
                locale="en"
              />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#9Bd35A", "#689F38"]}
              />
            }>
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                source={
                  installKitDetails?.data.kit?.kit_picture !== ""
                    ? { uri: installKitDetails?.data.kit?.kit_picture }
                    : imagePath.NoIcon
                }
                resizeMode="contain"
                style={{
                  width: responsiveWidth(80),
                  height: responsiveHeight(25),
                }}
              />
            </View>
            <View style={{ width: "80%", alignSelf: "center" }}>
              <TextView
                onPress={() => {}}
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "center",
                  lineHeight: 21,
                  marginTop: 10,
                }}>
                {(installKitDetails?.data?.kit?.brand == "false"
                  ? ""
                  : installKitDetails?.data?.kit?.brand) +
                  " " +
                  (installKitDetails?.data?.kit?.model_number == "false"
                    ? ""
                    : installKitDetails?.data?.kit?.model_number) +
                  " " +
                  installKitDetails?.data?.kit?.product_name}
              </TextView>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                gap: 2,
              }}>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.BatchNumber}
                  text={
                    installKitDetails?.data.kit?.product_code == "false"
                      ? null
                      : installKitDetails?.data.kit?.product_code
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.LOTNumber}
                  text={
                    route.params?.payload?.lotNumber
                      ? route.params?.payload?.lotNumber
                      : installKitDetails?.data?.kit?.lot_number == "false"
                      ? null
                      : installKitDetails?.data?.kit?.lot_number
                  }
                />
              </View>

              <View style={{ flex: 4 }}>
                {/* {console.log("mainExpiryDate=-==", mainExpiryDate)} */}
                <MiniCard
                  heading={AllStrings.ExpiryDate}
                  text={moment(mainExpiryDate).format("MMM YYYY")}
                  onPress={() => setShow(true)}
                />
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Colors.greenTint,
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(15),
                }}>
                <View style={{ flex: 0.5 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    {AllStrings.KitContents}
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      textAlign: "center",
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    {AllStrings.Quantity}
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      textAlign: "center",
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    {AllStrings.ExpiryDate}
                  </TextView>
                </View>
              </View>

              <FlatList
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                // contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </View>

            {installKitDetails?.data?.kit?.is_manual ? (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 15,
                  marginTop: 30,
                }}>
                <Button
                  onClick={() => {
                    dispatch(addItemFromProductFound("fromKitFound"));
                    navigation.navigate(navigationString.addItems, {
                      kitId: installKitDetails?.data?.kit?._id,
                    });
                  }}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    borderRadius: 10,
                    width: "40%",
                  }}
                  buttonColor={Colors.white}
                  btnName="Add Item"
                />

                <Button
                  onClick={() => {
                    navigation.navigate(navigationString.enterLocation, {
                      key: "user",
                      lotNumber: route.params?.payload?.lotNumber,
                      is_Empty_QrCode: route.params,
                      mainExpiryDate: mainExpiryDate,
                      listData: listData,
                    });
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "40%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>
            ) : installKitDetails?.data?.kit?.productFound === true ? (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginVertical: 15,
                }}>
                <Button
                  onClick={() => {
                    route?.params?.key == "scanStandardReport"
                      ? navigation.navigate(
                          navigationString.detailedReportFirst
                        )
                      : navigation.navigate(
                          navigationString.quickReportInfoNav
                        );
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "80%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 15,
                  marginTop: 30,
                }}>
                <Button
                  onClick={() => {
                    dispatch(addItemFromProductFound("fromKitFound"));
                    navigation.navigate(navigationString.addItems, {
                      kitId: installKitDetails?.data?.kit?._id,
                    });
                  }}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    borderRadius: 10,
                    width: "40%",
                  }}
                  buttonColor={Colors.white}
                  btnName="Add Item"
                />

                <Button
                  onClick={() => {
                    navigation.navigate(navigationString.enterLocation, {
                      key: "user",
                      lotNumber: route.params?.payload?.lotNumber,
                      is_Empty_QrCode: route.params,
                      mainExpiryDate: mainExpiryDate,
                      listData: listData,
                    });
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "40%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KitFound;

const styles = StyleSheet.create({});
