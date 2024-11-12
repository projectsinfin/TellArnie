import {
  StyleSheet,
  Text,
  Modal,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Switch,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import InputFields from "../../Components/InputFields";
import moment from "moment";
import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { call_UpdateProduct_API } from "../../redux/action/ManageKits";
import Loading from "../../Components/Loading";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomAlert from "../../Components/CustomAlert";
import { addItemFromProductFound, addQRCode } from "../../redux/reducer/auth";
import { SwipeListView } from "react-native-swipe-list-view";
import { call_delete_kit } from "../../redux/action/AdminAction";
import MonthPicker from "react-native-month-year-picker";

const ProductFound = ({ navigation, route }) => {
  const storeQrCode = useSelector((state) => state?.auth?.QRCode);
  console.log("storeQrCode====", storeQrCode);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setquantity] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [locationUpdate, setLocationUpdate] = useState(false);
  const [locationList, setLocationList] = useState(0);
  const [listData, setData] = useState([]);
  const [kitDetails, setkitDetails] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setshowDate] = useState(false);
  // const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedDate = moment(date).endOf("month").format("MM/YYYY");
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
    setDate(date);
    setShow(false);
    setshowDate(true);
  };

  const onValueChange = useCallback(
    (event, newDate) => {
      console.log(event, "----event----", newDate);
      const selectedDate = newDate || date;
      setShow(false);
      setshowDate(true);
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

  const validateQuantity = () => {
    pattern = /^\d+$/; // Regular expression to match integer values

    if (isNaN(quantity) || !pattern.test(quantity)) {
      setquantity(quantity);
      handleShowAlert("Please enter a integer value.");
    } else {
      // Value is a valid integer, perform desired action
      // For example, you can proceed with further processing
      console.log("Input value:", parseInt(quantity));
    }
  };

  useEffect(() => {
    fetchData();
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      console.log("Screen is focused storeQrCode", storeQrCode);
      dispatch(addQRCode(storeQrCode));
      fetchData();
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  const fetchData = () => {
    const data = {
      qr_code: route?.params?.qrCode || storeQrCode,
    };
    setIsLoading(true);
    dispatch(call_InstallKitDetails(data))
      .then((res) => {
        if (res.payload.status === 200) {
          setkitDetails(res?.payload?.data?.kit);
          setData(res?.payload?.data.relatedProducts);
          // setRefreshing(false);
          setIsLoading(false);
          console.log("product dound ---", JSON.stringify(res.payload));
        } else {
          // setRefreshing(false);
          setIsLoading(false);
          handleShowAlert(res?.payload?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(listData, "index-------", kitDetails);
  const renderItem = ({ item, index }) => {
    // console.log("index-------", item);

    const handleUpdateItem = (id) => {
      pattern = /^\d+$/; // Regular expression to match integer values
      if (lotNumber === "") {
        return handleShowAlert("Please enter lotNumber.");
      }
      if (quantity === "") {
        return handleShowAlert("Please enter quantity.");
      }
      if (isNaN(quantity) || !pattern.test(quantity)) {
        setquantity(quantity);
        return handleShowAlert("Please enter a integer value.");
      }
      if (isEnabled == false && showDate == false) {
        return handleShowAlert("Expiry date required.");
      }
      // setLocationUpdate(false);
      const payload = {
        kit_id: kitDetails?._id,
        id: id,
        quantity: parseInt(quantity),
        lot_number: lotNumber,
        // expiry_date: date,
        expiry_date:
          isEnabled == false ? moment(date).endOf("month").toISOString() : "",
        item_not_expire: isEnabled,
      };
      console.log(id, "--update Item-", payload);
      setIsLoading(true);
      dispatch(call_UpdateProduct_API(payload))
        .then((res) => {
          console.log(
            "response of update product item ---",
            JSON.stringify(res.payload)
          );
          setquantity("");
          setLotNumber("");
          setLocationUpdate(false);
          setIsLoading(false);
          fetchData();
          setIsEnabled(false);
          showDate(false);
        })
        .catch((err) => {
          console.log("update product item err---", err);
          setIsLoading(false);
        });
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setLocationUpdate(!locationUpdate);
            setLocationList(index);
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 5,
            backgroundColor:
              index % 2 == 0 ? Colors.white : Colors.greenLightTint,
          }}>
          <View style={{ flex: 0.5 }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "left",
              }}>
              {item?.product_code} - {item.description}
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

          <View
            style={{
              flex: 0.25,
            }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "center",
              }}>
              {item?.expiry_date === null
                ? ""
                : moment(item?.expiry_date).format("MMM YYYY")}
            </TextView>
          </View>
        </TouchableOpacity>
        {locationUpdate && locationList === index && (
          <View
            style={{
              //   backgroundColor: Colors.greenLightTint,
              marginVertical: moderateScale(10),
            }}>
            <TextView heading headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
              {AllStrings?.Bandages_Conforming}
            </TextView>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: moderateScaleVertical(15),
                }}>
                <TextView>{AllStrings.LOTNumber}</TextView>
                <TextView>{AllStrings.Quantity}</TextView>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: moderateScale(-12),
                }}>
                <View style={{ width: "69%" }}>
                  <InputFields
                    placeholder="Lot Number"
                    value={lotNumber}
                    onChangeText={(e) => setLotNumber(e)}
                  />
                </View>
                <View style={{ width: "30%" }}>
                  <InputFields
                    placeholder="Quantity"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={(e) => setquantity(e)}
                    validate={validateQuantity}
                  />
                </View>
              </View>

              <View>
                <View style={{ marginTop: moderateScaleVertical(15) }}>
                  <TextView>{AllStrings?.Expire_Date}</TextView>
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
                    marginTop: 5,
                    // width: "49%",
                  }}>
                  <View>
                    {/* <TextView textSty={{ fontSize: 14 }}>
                      {formattedDate}
                    </TextView> */}
                    <TextView
                      textSty={{
                        fontSize: 14,
                        color:
                          showDate === true ? Colors.black : Colors.lightgray,
                      }}>
                      {isEnabled == true
                        ? "DD/MM/YYYY"
                        : showDate == false
                        ? "DD/MM/YYYY"
                        : formattedDate}
                    </TextView>
                  </View>
                  <View>
                    <View>
                      <Image
                        source={imagePath?.datePickerIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        // elevation: 0.01,
                        borderColor: Colors.lightgray,
                        borderWidth: 0.7,
                        borderRadius: 20,
                        backgroundColor:
                          isEnabled == false ? Colors.white : Colors.secondary,
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
            </View>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: 20,
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
                  setLocationUpdate(false);
                }}
              />
              <Button
                onClick={() => {
                  handleUpdateItem(item?._id);
                }}
                allButtonSty={{
                  alignSelf: "center",
                  width: "60%",
                  marginHorizontal: 0,
                  borderRadius: 10,
                }}
                buttonColor={Colors.black}
                btnName="Update Item"
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderHiddenItem = ({ item, index }) => (
    // <View style={styles.rowBack}>
    <TouchableOpacity
      style={[styles.backRightBtn, styles.backRightBtnRight]}
      onPress={() => {
        setIsLoading(true);
        dispatch(call_delete_kit(item?._id))
          .then((res) => {
            console.log(res.payload);
            // fetchData();

            const prevIndex = listData.filter((x) => x._id != item._id);
            // console.log(prevIndex, "----PrevIndex");
            setData(prevIndex);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log("err product delete--", err);
          });
      }}>
      <Image
        source={imagePath.deleteIcon}
        tintColor={Colors.black}
        resizeMode="contain"
      />
    </TouchableOpacity>
    // </View>
  );

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoading}>
        <Loading />
      </Modal>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath?.backArrow}
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
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                // source={
                //   kitDetails?.kit_picture == ""
                //     ? imagePath?.productImg
                //     : { uri: kitDetails?.kit_picture }
                // }
                source={
                  kitDetails?.kit_picture !== ""
                    ? { uri: kitDetails?.kit_picture }
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
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "center",
                  lineHeight: 21,
                }}>
                {/* {console.log("===kitDetails===", kitDetails)} */}
                {`${
                  kitDetails?.brand == "false" || kitDetails?.brand == undefined
                    ? ""
                    : kitDetails?.brand
                } ${
                  kitDetails?.model_number == "false" ||
                  kitDetails?.model_number == undefined
                    ? ""
                    : kitDetails?.model_number
                } ${
                  kitDetails?.product_name == "false" ||
                  kitDetails?.product_name == undefined
                    ? ""
                    : kitDetails?.product_name
                }`}
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
                  // text={kitDetails?.batch_number}
                  text={
                    kitDetails?.product_code == "false"
                      ? null
                      : kitDetails?.product_code
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.LOTNumber}
                  // text={kitDetails?.lot_number}
                  text={
                    kitDetails?.lot_number == "false"
                      ? null
                      : kitDetails?.lot_number
                  }
                />
              </View>

              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.ExpiryDate}
                  text={
                    kitDetails?.expiry_date === null
                      ? ""
                      : moment(kitDetails?.expiry_date).format("MMM YYYY")
                  }
                />
              </View>
            </View>

            {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(navigationString.enterLocation, {
                  key: "admin",
                  pic: kitDetails?.kit_location_pic,
                  kitId: kitDetails?._id,
                  location: kitDetails?.location_name,
                  area: kitDetails?.area,
                })
              }
              style={{
                marginVertical: moderateScaleVertical(20),
              }}> */}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(event) =>
                navigation.navigate(navigationString.enterLocation, {
                  key: "admin",
                  pic: kitDetails?.kit_location_pic,
                  kitId: kitDetails?._id,
                  location: kitDetails?.location_name,
                  area: kitDetails?.area,
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}>
              {kitDetails?.latitude && kitDetails?.longitude && (
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  loadingEnabled={true}
                  onPress={(event) =>
                    navigation.navigate(navigationString.enterLocation, {
                      key: "admin",
                      pic: kitDetails?.kit_location_pic,
                      kitId: kitDetails?._id,
                      location: kitDetails?.location_name,
                      area: kitDetails?.area,
                    })
                  }
                  style={{
                    height: responsiveHeight(22),
                    width: responsiveWidth(45),
                    // flexGrow: 1,
                  }}
                  initialRegion={{
                    latitude:
                      Platform.OS === "ios"
                        ? parseFloat(kitDetails?.latitude)
                        : parseFloat(kitDetails?.latitude),
                    longitude:
                      Platform.OS === "ios"
                        ? parseFloat(kitDetails?.longitude)
                        : parseFloat(kitDetails?.longitude),
                    // latitude: parseFloat(28.535517),
                    // longitude: parseFloat(77.391029),
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker
                    coordinate={{
                      latitude:
                        Platform.OS === "ios"
                          ? parseFloat(kitDetails?.latitude)
                          : parseFloat(kitDetails?.latitude),
                      longitude:
                        Platform.OS === "ios"
                          ? parseFloat(kitDetails?.longitude)
                          : parseFloat(kitDetails?.longitude),
                      // latitude: parseFloat(28.535517),
                      // longitude: parseFloat(77.391029),
                    }}
                    // title={kitDetails?.location_name}
                    // description={"Your Marker Description"}
                  />
                </MapView>
              )}

              <View style={{ flex: 1, marginLeft: 15 }}>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 18,
                    fontSize: 12,
                    fontWeight: "400",
                    marginTop: 0,
                  }}>
                  Location
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 18,

                    marginTop: 0,
                  }}>
                  {kitDetails?.location_name}
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 18,
                    fontSize: 12,
                    fontWeight: "400",
                    marginTop: 5,
                  }}>
                  Area
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 18,

                    marginTop: 0,
                  }}>
                  {kitDetails?.area}
                </TextView>
              </View>
            </TouchableOpacity>

            {/* ===========location , area name and picture====== */}
            {/* <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Colors.greenTint,
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(15),
                }}>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      textAlign: "center",
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    Location
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                      textAlign: "center",
                    }}>
                    Area
                  </TextView>
                </View>
                <View style={{ flex: 0.5 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}></TextView>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(15),
                }}>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      textAlign: "center",
                      lineHeight: 15,
                      fontSize: 10,
                      // color: Colors.white,
                    }}>
                    {kitDetails?.location_name}
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      // color: Colors.white,
                      textAlign: "center",
                    }}>
                    {kitDetails?.area}
                  </TextView>
                </View>
                <View style={{ flex: 0.5 }}>
                  <Image
                    resizeMode="contain"
                    style={{ width: 150, height: 100 }}
                    source={
                      kitDetails?.kit_location_pic !== ""
                        ? { uri: kitDetails?.kit_location_pic }
                        : imagePath.NoIcon
                    }
                  />
                </View>
              </View>
            </View> */}

            {/* </TouchableOpacity> */}

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
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                      textAlign: "center",
                    }}>
                    {AllStrings.Expire_Date}
                  </TextView>
                </View>
              </View>
              <View>
                {/* <FlatList
                  data={listData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.key}
                  style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                /> */}
                <SwipeListView
                  data={listData}
                  renderItem={renderItem}
                  renderHiddenItem={renderHiddenItem}
                  keyExtractor={(item) => item.key}
                  // leftOpenValue={75}
                  rightOpenValue={-75}
                  style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
                // flexDirection: "row",
                marginVertical: 15,
                marginTop: 20,
              }}>
              <Button
                onClick={() => {
                  dispatch(
                    addQRCode(
                      route?.params?.qrCode
                        ? route?.params?.qrCode
                        : storeQrCode
                    )
                  );
                  dispatch(addItemFromProductFound("fromProductFound"));
                  navigation.navigate(navigationString.addItems, {
                    kitId: kitDetails?._id,
                  });
                  // navigation.navigate(navigationString.kitsName);
                }}
                allButtonSty={{
                  alignSelf: "center",
                  width: "70%",
                  borderRadius: 10,
                }}
                buttonColor={Colors.black}
                btnName="Add Item"
              />
              <Button
                onClick={() => {
                  navigation.navigate(navigationString.kitsName);
                }}
                allButtonSty={{
                  alignSelf: "center",
                  width: "70%",
                  borderRadius: 10,
                  marginTop: 10,
                }}
                buttonColor={Colors.black}
                btnName="Save and Close"
              />
            </View>
          </ScrollView>
        </View>
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
        // <DateTimePickerModal
        //   isVisible={show}
        //   testID="dateTimePicker"
        // mode={mode}
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
    </SafeAreaView>
  );
};

export default ProductFound;

const styles = StyleSheet.create({
  rowFront: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    // backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: Colors.secondary,
    right: 0,
  },
  backTextWhite: {
    color: "#FFF",
  },
});
