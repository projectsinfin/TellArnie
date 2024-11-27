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
import InputFields from "../../Components/InputFields";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import ModalScreen from "../../Components/ModalScreen";
import { Formik } from "formik";
import { EnterAddProductSchema } from "../../utils/Validation";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  call_AddBarcodeItem_Kit,
  call_AddItem_Kit,
  call_EnterManuallyKit,
} from "../../redux/action/KitInstallationAction";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Components/Loading";
import { RNCamera } from "react-native-camera";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";
import { useIsFocused } from "@react-navigation/native";
import { call_ScanBarcodeItem_API } from "../../redux/action/IncidentReport";
import { addQRCode } from "../../redux/reducer/auth";
import CustomAlert from "../../Components/CustomAlert";
import MonthPicker from "react-native-month-year-picker";

const AddItems = ({ navigation, route }) => {
  const addItemFromProduct = useSelector(
    (state) => state.auth.addItemFromProduct
  );
  console.log("addItemFromProduct---", addItemFromProduct);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [barcodeId, setbarCodeId] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scan, setScan] = useState(false);
  // const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedDate = moment(date).endOf("month").format("MM/YYYY");
  const [scanned, setScanned] = useState(false);
  const [successText, setsuccessText] = useState(false);
  const [scanText, setscanText] = useState(false);
  const [secondTime, setsecondTime] = useState(false);
  const [PleaseSearch, setPleaseSearch] = useState(false);
  const [foundText, setFoundText] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [isEnabled, setIsEnabled] = useState(
    barcodeProduct?.product[0]?.item_not_expire
      ? barcodeProduct?.product[0]?.item_not_expire
      : false
  );
  // console.log(
  //   "69177082-201d-4bda-add7-3589d4d6b58a111",
  //   barcodeProduct?.product[0]?.item_not_expire
  // );
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
    // console.log(date, "****************");
    setShowDate(true);
    setDate(date);
    setShow(false);
  };

  const onValueChange = useCallback(
    (event, newDate) => {
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

  console.log("barcodeId---", isEnabled);
  const handleSaveItem = (val) => {
    if (secondTime === false) {
      return handleShowAlert("Please scan barcode");
    }
    if (barcodeId === "") {
      return handleShowAlert("Scanned item is not found.");
    }
    if (val.quantity == "") {
      return handleShowAlert("Quantity required");
    }
    if (isEnabled === false) {
      if (showDate === false) {
        // return alert("Expiry date required");
        return handleShowAlert("Expiry date required");
      }
    }
    // if (showDate === false) {
    //   return handleShowAlert("Expiry date required");
    // }
    var datestr = new Date(date).toUTCString();
    const payload = {
      kit_id: route?.params?.kitId,
      brand: val.brand || barcodeProduct?.product[0]?.brand,
      product_code:
        val?.product_code || barcodeProduct?.product[0]?.product_code,
      description: val.description || barcodeProduct?.product[0]?.description,
      quantity: val.quantity,
      lot_number: val.lotNumber || barcodeProduct?.product[0]?.lot_number,
      expiry_date:
        isEnabled == true ? "" : moment(date).endOf("month").toISOString(),
      barcode: barcodeId,
      item_not_expire: isEnabled,
    };
    const formData = new FormData();

    // Append each key-value pair in the payload to the FormData object
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    console.log("add item--payload-", JSON.stringify(formData));
    setIsLoading(true);

    if (Platform.OS === "android") {
      dispatch(call_AddBarcodeItem_Kit(formData))
        .then((res) => {
          console.log("add item response", res);
          if (res.payload.status === 200) {
            setIsLoading(false);
            if (res.payload?.is_product_added === false) {
              // alert(res.payload.message);
              handleShowAlert(res?.payload?.message);
            } else {
              console.log("add eroor");
              showToastWithGravityAndOffset();

              setsuccessText(true);

              dispatch(addQRCode(res?.payload?.data?.qr_code));
              setTimeout(() => {
                addItemFromProduct === "fromKitFound"
                  ? navigation.navigate(navigationString.kitsFound)
                  : navigation.navigate(navigationString.productFound);
                // navigation.navigate(navigationString.kitsFound);
              }, 1000);
            }
          } else {
            setIsLoading(false);
            showToastWithGravity();
            // alert(res?.payload?.message);
            handleShowAlert(res?.payload?.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("add item--", err);
        });
    } else {
      dispatch(call_AddItem_Kit(formData))
        .then((res) => {
          console.log("api -res data--", JSON.stringify(res.payload));
          if (res.payload.status === 200) {
            setIsLoading(false);
            if (res.payload?.is_product_added === false) {
              handleShowAlert(res.payload.message);
            } else {
              console.log("add eroor");
              showToastWithGravityAndOffset();

              setsuccessText(true);

              dispatch(addQRCode(res?.payload?.data?.qr_code));
              // setTimeout(() => {
              //   navigation.navigate(navigationString.kitsFound);
              // }, 1000);
              setTimeout(() => {
                addItemFromProduct === "fromKitFound"
                  ? navigation.navigate(navigationString.kitsFound)
                  : navigation.navigate(navigationString.productFound);
                // navigation.navigate(navigationString.kitsFound);
              }, 1000);
            }
          } else {
            setIsLoading(false);
            showToastWithGravity();
            handleShowAlert(res?.payload?.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("add item--", err);
        });
    }
  };

  const handleScan = (scannedData) => {
    // console.log("Add itemscannedData---", scannedData);
    setScanned(true);

    const params = {
      barcode: scannedData?.data,
      kitId: "",
    };

    dispatch(call_ScanBarcodeItem_API(params))
      .then((res) => {
        console.log("get barcode data res--", JSON.stringify(res.payload));
        if (res.payload.status === 200) {
          if (res.payload.is_product === false) {
            setScanned(false);
            setFoundText(false);
            setsecondTime(true);
            setPleaseSearch(false);
            setscanText(true);
            setShowModal(true);
          } else {
            setscanText(false);
            setScanned(false);
            setBarcodeProduct(res.payload.data);
            setFoundText(true);
            setsecondTime(true);
            setPleaseSearch(false);
            setbarCodeId(scannedData?.data);
            setScan(false);
          }
          // setItem(res.payload.data.product);
          // showToastWithGravityAndOffset();
        } else {
          console.log(res.payload.message);
          setsecondTime(true);
          setFoundText(false);
          setScan(false);
          setShowModal(true);
          setPleaseSearch(false);
          setscanText(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (scan) {
      const timeoutId = setTimeout(() => {
        setsecondTime(true);
        setShowModal(false);
        setscanText(true);
        setPleaseSearch(false);
      }, 12000);

      return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout on unmount or state change
    }
  }, [scan]);

  useEffect(() => {
    // This will run every time the screen comes into focus
    if (isFocused) {
      setScan(false);
      setsecondTime(false);
      setPleaseSearch(false);
      setFoundText(false);
      // Perform actions here, such as fetching data or refreshing the screen
      setscanText(false);
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  // useEffect(() => {
  //   let timer;
  //   if (!barcodeId) {
  //     timer = setTimeout(() => {
  //       setShowModal(true);
  //     }, 10000); // 10 seconds timeout
  //   }
  //   return () => clearTimeout(timer); // Clean up the timer when the component unmounts or when barcode is scanned
  // }, [barcodeId]);

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
      // validationSchema={EnterAddProductSchema}
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
            editHeader={
              () =>
                addItemFromProduct === "fromKitFound"
                  ? navigation.goBack()
                  : navigation.navigate(navigationString.productFound)
              // : navigation.navigate(navigationString.productFound)
            }
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
                {barcodeProduct?.product[0]?.brand !== undefined ? (
                  <View style={{ width: "80%", alignSelf: "center" }}>
                    <TextView
                      // onPress={() => {}}
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        fontSize: 16,
                        lineHeight: 21,
                      }}>
                      {barcodeProduct?.product[0]?.brand +
                        " " +
                        barcodeProduct?.product[0]?.product_code +
                        " " +
                        barcodeProduct?.product[0]?.description}
                    </TextView>
                  </View>
                ) : (
                  <>
                    <View style={{ width: "80%", alignSelf: "center" }}>
                      <TextView
                        // onPress={() => {}}
                        heading
                        headingTextSty={{
                          ...kitsStyles.headingText,
                          fontSize: 18,
                          lineHeight: 21,
                        }}>
                        {AllStrings.Pleasequantityexpiration}
                      </TextView>
                    </View>
                    <View
                      style={{
                        // alignSelf: "center",
                        marginTop: 25,
                      }}>
                      {scan === true ? (
                        Platform.OS === "ios" ? (
                          <RNCamera
                            style={{
                              height: responsiveHeight(40),
                              width: responsiveWidth(75),
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
                          //   }}
                          // />
                        )
                      ) : (
                        <Image
                          source={imagePath.scannerImg}
                          resizeMode="contain"
                          style={{
                            width: 120,
                            height: 120,
                            alignSelf: "center",
                          }}
                        />
                      )}

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

                      {PleaseSearch === true && (
                        <TextView
                          textSty={{ textAlign: "center", fontSize: 13 }}>
                          Please wait, searching
                        </TextView>
                      )}

                      {/* {barcodeProduct?.product[0]?.brand !== undefined ? (
                    <View style={{ width: "80%", alignSelf: "center" }}>
                      <TextView
                        // onPress={() => {}}
                        heading
                        headingTextSty={{
                          ...kitsStyles.headingText,
                          fontSize: 16,
                          lineHeight: 21,
                        }}>
                        {barcodeProduct?.product[0]?.brand +
                          " " +
                          barcodeProduct?.product[0]?.description}
                      </TextView>
                    </View>
                  ) : ( */}
                      <Button
                        onClick={() => {
                          setScan(true);
                          setPleaseSearch(true);
                          setFoundText(false);
                          setscanText(false);
                        }}
                        allButtonSty={{
                          width: "40%",
                          borderRadius: 10,
                          marginTop: 15,
                          // marginLeft: 4,
                          alignSelf: "center",
                        }}
                        buttonColor={Colors.black}
                        btnName="SCAN"
                      />
                      {/* )} */}
                    </View>
                  </>
                )}
                {console.log(
                  values?.brand,
                  "(((barcodeProduct--",
                  barcodeProduct?.product[0]?.brand
                )}

                {(values?.brand !== "" ||
                  barcodeProduct?.product[0]?.brand !== undefined) && (
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
                          value={
                            values?.brand || barcodeProduct?.product[0]?.brand
                          }
                          editDisabled={false}
                          handleBlurs={() => setFieldTouched("brand")}
                        />
                      </View>
                      <View style={{ width: "49%" }}>
                        <InputFields
                          placeholder="Product Code"
                          onChangeText={handleChange("product_code")}
                          value={
                            values?.product_code ||
                            barcodeProduct?.product[0]?.product_code
                          }
                          editDisabled={false}
                          handleBlurs={() => setFieldTouched("product_code")}
                        />
                      </View>
                    </View>
                    {touched.brand && errors.brand && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.brand}
                      </TextView>
                    )}
                    <InputFields
                      placeholder="Item Description"
                      onChangeText={handleChange("description")}
                      value={
                        values?.description ||
                        barcodeProduct?.product[0]?.description
                      }
                      editDisabled={false}
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
                          editDisabled={barcodeId !== "" ? true : false}
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
                          editDisabled={barcodeId !== "" ? true : false}
                          onChangeText={handleChange("lotNumber")}
                          value={
                            values.lotNumber ||
                            barcodeProduct?.product[0]?.lot_number
                          }
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
                      disabled={barcodeId !== "" ? false : true}
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
                        borderRadius: 5,
                        marginTop: 20,
                        // width: "49%",
                      }}>
                      <View>
                        <TextView
                          textSty={{
                            fontSize: 14,
                            color:
                              showDate === true
                                ? Colors.black
                                : Colors.lightgray,
                          }}>
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
                              isEnabled === true
                                ? Colors.secondary
                                : Colors.white,
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
                )}
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
                      width:
                        barcodeProduct?.product[0]?.brand == undefined
                          ? "100%"
                          : "35%",
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
                  {(values?.brand !== "" ||
                    barcodeProduct?.product[0]?.brand !== undefined) && (
                    <Button
                      onClick={handleSubmit}
                      // barcodeId
                      // disabled={barcodeId ? false : true}
                      allButtonSty={{
                        alignSelf: "center",
                        marginHorizontal: 0,
                        width: "60%",
                        borderRadius: 10,
                      }}
                      buttonColor={Colors.black}
                      btnName="Save Item"
                    />
                  )}
                </View>
                <Button
                  onClick={() => {
                    // setShowModal(true);
                    navigation.navigate(navigationString.addProductManually, {
                      kitId: route?.params?.kitId,
                    });
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    marginHorizontal: 0,
                    width: "100%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Add Manually"
                />
              </ScrollView>
              {showModal && (
                <ModalScreen
                  visible={showModal}
                  modalheading={AllStrings.ItemNotFound}
                  modalText={AllStrings.Wouldlikeaddmanually}
                  btnName="Yes"
                  buttonColor={Colors.black}
                  buttonColor1={Colors.black}
                  btnName1="Skip Item"
                  modalButton1={() => {
                    navigation.goBack();
                    setScanned(false);
                    setScan(false);
                  }}
                  modalButton={() => {
                    setScanned(false);
                    setScan(false);
                    setShowModal(false);

                    navigation.navigate(navigationString.addProductManually, {
                      kitId: route?.params?.kitId,
                    });
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

export default AddItems;

const styles = StyleSheet.create({});
