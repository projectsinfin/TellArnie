import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import countryPhoneCodes from "../../../Constant/country-phones.json";
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
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../../Styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Toast from "react-native-simple-toast";
import { call_ScanBarcodeItem_API } from "../../../redux/action/IncidentReport";
import { useIsFocused } from "@react-navigation/native";
import CustomAlert from "../../../Components/CustomAlert";

const DetailedReportFour = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );

  console.log("route data in 4screen", JSON.stringify(route.params));
  const { listOfPerson } = useSelector((state) => state.incidentCategory);
  const [scanned, setScanned] = useState(false);
  const [clearDropdown, setClearDropdown] = useState(false);
  const [scan, setScan] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [validBarcode, setValidBarcode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [usedBy, setUsedBy] = useState(null);
  const [barcodeId, setbarCodeId] = useState("");
  const [listData, setListData] = useState([]);

  const [scanText, setscanText] = useState(false);
  const [pleaseSearch, setPleaseSearch] = useState(false);

  const [data, setItem] = useState(installKitDetails.data.relatedProducts);

  const [foundText, setfoundText] = useState(false);
  const [data1, setdata] = useState(route.params.addPersonDetail);
  const [usedIdTrue, setusedIdTrue] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setusedIdTrue(true);
    setClearDropdown(false);
  };
  const handleSelects = (item) => {
    // console.log("used by -=====", item);
    setUsedBy(item);
    setClearDropdown(false);
  };

  const renderItem = ({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
      }}>
      <View style={{ flex: 0.8 }}>
        <TextView
          textSty={{
            fontSize: 12,
            textAlign: "left",
          }}>
          {item.title + " Used by " + item.full_name}
        </TextView>
      </View>
      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          justifyContent: "space-around",
        }}>
        <TouchableOpacity
          onPress={() => {
            decreaseQuantity(index);
          }}>
          <Image
            source={imagePath.removeIcon}
            resizeMode="contain"
            style={{ height: 18, width: 18 }}
          />
        </TouchableOpacity>

        <TextView
          textSty={{
            fontSize: 12,
            textAlign: "left",
          }}>
          {item?.used_quantity}
        </TextView>
        <TouchableOpacity
          // disabled={
          //   (selectedItem?.current_quantity || data[0]?.current_quantity) >=
          //   item?.used_quantity
          //     ? false
          //     : true
          // }
          onPress={() => {
            increaseQuantity(index);
          }}>
          <Image
            source={imagePath.addIcon}
            resizeMode="contain"
            style={{ height: 18, width: 18 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const addItemToList = () => {
    const numericValue = selectedQuantity.replace(/[^0-9]/g, "");
    // Update the state only if the resulting value is empty or a valid integer
    if (numericValue === "" || !isNaN(parseInt(numericValue))) {
      setSelectedQuantity(numericValue);
    }
    if (
      selectedQuantity >
      (selectedItem?.current_quantity || data[0]?.current_quantity)
    ) {
      // console.log("usedBy====", selectedQuantity);
      return handleShowAlert(
        `Quantity available is ${
          selectedItem?.current_quantity || data[0]?.current_quantity
        }`
      );
    }
    if (parseInt(selectedQuantity) === 0) {
      return handleShowAlert(`Quantity must be greater than 0.`);
    }
    // if ((selectedItem || validBarcode) && selectedQuantity && usedBy) {
    if (!(selectedItem || validBarcode)) {
      return handleShowAlert("Plase select used item");
    }
    if (selectedQuantity == "") {
      return handleShowAlert("Quantity required");
    }
    if (usedBy == null) {
      return handleShowAlert("Plase select used by!");
    }

    const newItem = {
      product_id: selectedItem?._id || data[0]?._id,
      used_by_id: usedBy?._id,
      title: selectedItem?.description || data[0]?.description,
      used_quantity: parseInt(selectedQuantity),
      full_name: usedBy?.full_name,
      user_id: usedBy?.user_id,
      // kit_id:
      // full_name: usedBy?.first_name + " " + usedBy?.last_name,
    };
    console.log(newItem, "------new item");
    setListData((prevList) => [...prevList, newItem]); // Add new item to the listData array
    // setItem(installKitDetails.data.relatedProducts);
    console.log(data, "---data---");
    setItem((prevItems) =>
      prevItems.map((item) =>
        item?._id === selectedItem?._id
          ? {
              ...item,
              current_quantity:
                item.current_quantity - parseInt(selectedQuantity),
            }
          : item
      )
    );
    setClearDropdown(true);
    setusedIdTrue(false);
    setfoundText(false);
    setValidBarcode(false);
    setSelectedItem(null); // Reset selectedItem state
    setSelectedQuantity(""); // Reset selectedQuantity state
    // } else {
    //   alert("Please select all fields!");
    // }
  };

  // const increaseQuantity = (index) => {
  //   const updatedList = [...listData];
  //   updatedList[index].used_quantity++;
  //   setListData(updatedList);
  // };

  const increaseQuantity = (index) => {
    const updatedList = [...listData];

    // Get the selected item's details based on its product ID
    const selectedItem = data.find(
      (item) => item._id === updatedList[index].product_id
    );

    if (selectedItem) {
      // Ensure the used quantity does not exceed the available current quantity
      if (updatedList[index].used_quantity <= selectedItem.current_quantity) {
        updatedList[index].used_quantity++;
        setListData(updatedList);
      }
      // else {
      //   // Show an alert if the user tries to exceed the current quantity
      //   handleShowAlert(
      //     `You cannot exceed the available quantity of ${selectedItem.current_quantity}.`
      //   );
      // }
    }
  };

  const decreaseQuantity = (index) => {
    const updatedList = [...listData];

    if (updatedList[index].used_quantity > 1) {
      updatedList[index].used_quantity--;
      setListData(updatedList);
    }
  };

  const handleContiune = (val) => {
    // if (listData.length <= 0) {
    //   handleShowAlert("Add Items");
    //   return;
    // }

    // console.log(route.params, "quick report info 22", data);
    navigation.navigate(navigationString.quickSummary, {
      key: "detailReport",
      data: { listData, ...route.params },
    });
  };

  useEffect(() => {
    setValidBarcode(false);
  }, []);
  useEffect(() => {
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      setPleaseSearch(false);
      setscanText(false);
      setfoundText(false);
      setValidBarcode(false);
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  useEffect(() => {
    if (scan) {
      const timeoutId = setTimeout(() => {
        setValidBarcode(false);
        setscanText(true);
        setPleaseSearch(false);
        setfoundText(false);
        // setbarCodeId(scannedData?.data);
        setScan(false);
      }, 15000);

      return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout on unmount or state change
    }
  }, [scan]);

  const handleScan = (scannedData) => {
    getItemBarcode(scannedData);
    setbarCodeId(scannedData?.data);
  };

  // useEffect(() => {
  //   getItemBarcode(barcodeId);
  //   let timer;
  //   if (!barcodeId) {
  //     timer = setTimeout(() => {
  //       setScan(false);
  //     }, 15000); // 10 seconds timeout
  //   }

  //   setScan(false);
  //   return () => clearTimeout(timer); // Clean up the timer when the component unmounts or when barcode is scanned
  // }, [barcodeId]);

  console.log(barcodeId, "----------barcodeId");
  const showToastWithGravityAndOffset = () => {
    Toast.showWithGravity("Success, item found", Toast.SHORT, Toast.CENTER, {
      textColor: Colors.primary,
      backgroundColor: Colors.white,
    });
  };

  const showToastWithGravity = () => {
    Toast.showWithGravity("Please wait, searching", Toast.SHORT, Toast.BOTTOM, {
      textColor: Colors.black,
      backgroundColor: Colors.white,
    });
  };

  const getItemBarcode = (val) => {
    console.log(val, "------val------", installKitDetails.data.kit._id);
    const params = {
      barcode: val?.data,
      kitId: installKitDetails.data.kit._id,
    };
    setScanned(true);
    dispatch(call_ScanBarcodeItem_API(params))
      .then((res) => {
        console.log(
          "get barcode product incident",
          JSON.stringify(res.payload)
        );
        if (res.payload.status === 200) {
          if (res.payload.is_product === false) {
            setscanText(true);
            setPleaseSearch(false);
            setScan(false);
            setScanned(false);
          } else {
            setfoundText(true);
            setscanText(false);
            setPleaseSearch(false);
            setScan(false);
            setValidBarcode(true);
            setItem(res.payload.data.product);
            setScanned(false);
            // showToastWithGravityAndOffset();
          }
        } else {
          console.log(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
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
          {/* <ImageBackground
            resizeMode="contain"
            source={imagePath?.ScanBarcode_GRN}
            style={{ flex: 1 }}
            imageStyle={{
              opacity: 0.2,
              // width: 400,
              // height: 490,
              width:
                Platform.OS === "ios"
                  ? responsiveWidth(110)
                  : responsiveWidth(110),
              height:
                Platform.OS === "ios"
                  ? responsiveHeight(70)
                  : responsiveHeight(90),
              marginTop: Platform.OS === "ios" ? 50 : 0,
            }}> */}
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
                  marginBottom: scan === true ? 20 : -20,
                }}>
                {AllStrings.Items_used_this_person}
              </TextView>
              {scan === true ? (
                Platform.OS === "ios" ? (
                  <RNCamera
                    style={{
                      height: responsiveHeight(40),
                      width: responsiveWidth(75),
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                    barCodeTypes={[
                      // RNCamera.Constants.BarCodeType.qr,
                      RNCamera.Constants.BarCodeType.code128,
                      RNCamera.Constants.BarCodeType.ean13,
                    ]}
                    // onBarCodeRead={handleScan}
                    onBarCodeRead={scanned ? undefined : handleScan}
                  />
                ) : (
                  <RNCamera
                    style={{
                      height: responsiveHeight(30),
                      width: responsiveWidth(35),
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                    // onBarCodeRead={handleScan}
                    barCodeTypes={[
                      RNCamera.Constants.BarCodeType.code128,
                      RNCamera.Constants.BarCodeType.ean13,
                    ]}
                    onBarCodeRead={scanned ? undefined : handleScan}
                  />
                  // <QRCodeScanner
                  //   onRead={handleScan}
                  //   // onRead={(data) => console.log("qr----", JSON.stringify(data))}
                  //   // flashMode={flashMode}
                  //   fadeIn={false}
                  //   reactivate={false}
                  //   containerStyle={{
                  //     alignItems: "center",
                  //   }}
                  //   cameraStyle={{
                  //     height: responsiveHeight(30),
                  //     width: responsiveWidth(25),
                  //     marginBottom: 20,
                  //   }}
                  // />
                )
              ) : null}

              {pleaseSearch === true && (
                <TextView textSty={{ textAlign: "center", fontSize: 13 }}>
                  Please wait, searching
                </TextView>
              )}
              <View style={{ marginBottom: -10 }}>
                <View
                  style={{
                    backgroundColor: Colors.black,
                    position: "absolute",
                    padding: 6.5,
                    top: moderateScaleVertical(29),
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
                  onClick={() => {
                    // setscanText(true);
                    setfoundText(false);
                    setScan(true);
                    setPleaseSearch(true);
                  }}
                  allButtonSty={{
                    // backgroundColor: Colors.black,
                    marginVertical: moderateScaleVertical(30),
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.black}
                  btnName="Scan Barcode"
                />
              </View>

              {scanText === true && (
                <TextView
                  textSty={{
                    fontSize: 13,
                    textAlign: "center",
                    color: "red",
                  }}>
                  Item not found
                </TextView>
              )}

              {foundText === true && (
                <TextView
                  textSty={{
                    fontSize: 13,
                    textAlign: "center",
                    color: Colors.primary,
                  }}>
                  Success, item found
                </TextView>
              )}

              {/* if (barcodeId !== "") {
      return setSelectedItem(item[0]), setClearDropdown(false);
    } */}
              {console.log("data---", data)}
              {/* {barcodeId ? showToastWithGravityAndOffset : showToastWithGravity} */}

              <CustomDropdown
                userList
                type="user"
                changeColor={{
                  color: validBarcode
                    ? Colors.black
                    : usedIdTrue
                    ? Colors.black
                    : Colors.lightgray,
                }}
                placeholder={validBarcode ? data[0]?.description : "Item used"}
                data={data}
                onSelect={handleSelect}
                clearDropdown={clearDropdown}
              />

              <InputFields
                keyboardType="numeric"
                placeholder="Quantity"
                value={selectedQuantity}
                onChangeText={(text) => {
                  setSelectedQuantity(text);
                }}
                textInputFocused={{ backgroundColor: "#ffffff" }}
                textInput={{ backgroundColor: "#ffffff" }}
              />
              {/* <CustomDropdown
              placeholder="Quantity"
              data={data}
              onSelect={handleSelect}
            /> */}

              <CustomDropdown
                type="fullName"
                placeholder="Used by"
                data={data1}
                onSelect={handleSelects}
                clearDropdown={clearDropdown}
              />

              <View>
                <Button
                  onClick={() => {
                    addItemToList();
                  }}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    marginTop: moderateScaleVertical(30),
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.white}
                  btnName={
                    listData.length >= 1 ? "Add Another Item" : "Add Item"
                  }
                />

                {/* //@Container of Equipments used in Incident */}
                {listData.length !== 0 && (
                  <View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.blackOpacity10,
                        marginTop: moderateScaleVertical(35),
                      }}
                    />
                    <TextView
                      heading
                      headingTextSty={{
                        fontSize: 14,
                        lineHeight: 21,
                        marginTop: moderateScaleVertical(20),
                      }}>
                      {AllStrings.Items_used_incident}
                    </TextView>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: Colors.greenTint,
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        marginTop: 20,
                      }}>
                      <TextView
                        heading
                        headingTextSty={{
                          lineHeight: 15,
                          fontSize: 10,
                          color: Colors.white,
                        }}>
                        {AllStrings.UsedItems}
                      </TextView>
                      <TextView
                        heading
                        headingTextSty={{
                          lineHeight: 15,
                          fontSize: 10,
                          color: Colors.white,
                        }}>
                        {AllStrings.Quantity}
                      </TextView>
                    </View>
                    <View>
                      <FlatList
                        data={listData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                        style={{
                          height: "auto",
                          marginTop: 1,
                          marginBottom: 10,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* code of PageIndicator3 */}
              {/* <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: moderateScaleVertical(15),
                  padding: 10,
                }}>
                <Image
                  source={imagePath.PageIndicator33}
                  style={{ width: "10%" }}
                />
              </View> */}

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

            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: 30,
                marginBottom: 10,
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

              {/* Navigate from DetailedReportFour to quick report summary */}
              <Button
                onClick={() => {
                  handleContiune();
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
          </View>
          {/* </ImageBackground> */}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default DetailedReportFour;

const styles = StyleSheet.create({});
