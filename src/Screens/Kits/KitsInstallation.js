import React, { useEffect, useState } from "react";
import kitsStyles from "./kitsStyles";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import { SafeAreaView, Text, View, StyleSheet, Platform } from "react-native";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import navigationString from "../../Navigations/navigationString";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import ModalScreen from "../../Components/ModalScreen";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
import Button from "../../Components/Button";
import { addQRCode } from "../../redux/reducer/auth";
import { useIsFocused } from "@react-navigation/native";

const KitsInstallation = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [keepUpdateModal, setKeepUpdateShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [textValue, setTextValue] = useState("Scan Barcode");
  const [expectedId, setExpectedId] = useState("");
  const [kitAlreadyRegister, setKitAlreadyRegister] = useState(false);
  const [kitNotFound, setKitNotFound] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true); // State to manage camera activation

  useEffect(() => {
    // This effect will be called when the screen is focused
    if (isFocused) {
      setIsCameraActive(true);
      setExpectedId("");
      setKitNotFound(false);
      setTextValue("Scan Barcode");
      // setShowModal(false);
      if (Platform.OS === "android") {
        setScanned(false);
      }

      // Do something when the screen is focused
      console.log(expectedId, "Screen is focused", isCameraActive);
    }
  }, [isFocused]); //

  // useEffect(() => {
  //   if (isCameraActive) {
  //     const timeoutId = setTimeout(() => {
  //       setShowModal(true);
  //       setIsCameraActive(false); // Disable camera after 3 seconds
  //       setTextValue("Enter Manually");
  //       setExpectedId("12");
  //       setScanned(false);
  //     }, 15000);

  //     return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout on unmount or state change
  //   }
  // }, [isCameraActive]);

  const handleScan = (scannedData) => {
    console.log(scannedData, "scanned----", scanned);
    setScanned(true);
    const idPattern =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    const matchResult = scannedData?.data.match(idPattern);

    console.log("Match found! Scanned ID:", matchResult);
    const data = {
      // qr_code: scannedData?.data,
      qr_code: matchResult ? matchResult[0] : null,
    };

    dispatch(call_InstallKitDetails(data))
      .then((res) => {
        console.log(
          res?.payload?.data?.kit_found,
          "res.payload_54646___",
          res.payload.data
        );
        if (res.payload.status === 200) {
          if (res?.payload?.data?.kit_found === false) {
            // No match found
            setTextValue("Enter Manually");
            setShowModal(true);
            dispatch(addQRCode(matchResult ? matchResult[0] : null));
            setExpectedId(matchResult ? matchResult[0] : null);
            console.log(
              "No match found. Scanned ID:",
              matchResult ? matchResult[0] : null
            );
            setIsCameraActive(false);
            setScanned(false);
          } else {
            if (res.payload?.data?.kit?.company_id !== "") {
              return setKitAlreadyRegister(true);
            }

            //when kit is empty goto barcode Scanner
            if (res.payload?.data?.kit?.is_empty == true) {
              navigation.navigate(navigationString.scanBarcodeScreen, {
                qrCode: res.payload?.data?.kit?._id,
                is_empty: res.payload?.data?.kit?.is_empty,
              });
              return;
            }
            dispatch(addQRCode(matchResult ? matchResult[0] : null));
            setExpectedId(matchResult ? matchResult[0] : null);
            setShowModal(false);
            setKitNotFound(true);
            setTimeout(() => {
              navigation.navigate(navigationString.kitsFound, {
                qrCode: matchResult ? matchResult[0] : null,
              });
              setIsCameraActive(false);
            }, 3000);
            setScanned(false);
          }
        } else {
          alert(res?.payload?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack()}
      />

      <View style={kitsStyles.container}>
        <View style={kitsStyles.heading}>
          <TextView
            // onPress={() => navigation.navigate(navigationString.kitsFound)}
            heading
            headingTextSty={{
              ...kitsStyles.headingText,
              marginTop: Platform.OS === "android" && 30,
            }}>
            {/* {AllStrings.ScanQRCode} */}
            New first aid kit? Scan the Tell Arnie QR code on your first aid kit
            or add it manually
          </TextView>
          {/* <TextView
            onPressText={() => setShowModal(true)}
            textSty={{ textAlign: "center" }}>
            Kit Not Found
          </TextView> */}
          <View
            style={{
              marginTop: 30,
            }}>
            <View style={{ backgroundColor: "red", flex: 1 }}>
              {
                Platform.OS === "ios"
                  ? isCameraActive && (
                      <RNCamera
                        style={{
                          height: responsiveHeight(40),
                          width: responsiveWidth(80),
                        }}
                        onBarCodeRead={scanned ? undefined : handleScan}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        // onBarCodeRead={handleScan}

                        // barCodeTypes={[
                        //   RNCamera.Constants.BarCodeType.qr,
                        //   // RNCamera.Constants.BarCodeType.code128,
                        //   // RNCamera.Constants.BarCodeType.ean13,
                        // ]}
                      />
                    )
                  : isCameraActive && (
                      <RNCamera
                        style={{
                          marginTop: 50,
                          // height: responsiveHeight(20),
                          // width: responsiveWidth(80),
                          height: 220,
                          alignSelf: "center",
                          width: 220,
                        }}
                        onBarCodeRead={scanned ? undefined : handleScan}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        // onBarCodeRead={handleScan}
                      />
                    )
                // <QRCodeScanner
                //   onRead={handleScan}
                //   // onBarCodeRead={scanned ? undefined : handleScan}
                //   // onRead={(data) => console.log("qr----", JSON.stringify(data))}
                //   // flashMode={flashMode}
                //   fadeIn={false}
                //   reactivate={scanned === false ? true : false}
                //   containerStyle={{
                //     alignItems: "center",
                //   }}
                //   showMarker={true}
                //   cameraStyle={{
                //     height: responsiveHeight(40),
                //     width: responsiveWidth(75),
                //   }}
                // />
              }
            </View>
          </View>
        </View>

        {/* {showModal && ( */}
        <ModalScreen
          visible={showModal}
          modalheading={AllStrings.KitNotFound}
          modalText={AllStrings.Wouldlikeaddmanually}
          btnName="Yes"
          buttonColor={Colors.black}
          buttonColor1={Colors.black}
          btnName1="No"
          ModalBtn={{ width: responsiveWidth(35) }}
          ModalBtn1={{ width: responsiveWidth(35) }}
          modalButton1={() => {
            setShowModal(false);
            if (Platform.OS === "ios") {
              setShowModal(false);
              setKeepUpdateShowModal(true);
              return;
            }
            setKeepUpdateShowModal(true);
          }}
          modalButton={() => {
            setShowModal(false);
            navigation.navigate(navigationString.kitNotFound, {
              qrCode: expectedId,
            });
          }}
        />
        {/* )} */}

        {/* {keepUpdateModal == true && ( */}
        <ModalScreen
          visible={keepUpdateModal}
          modalheading={AllStrings.KeepUpdated}
          modalText={AllStrings.updateproductavailable}
          btnName="Yes"
          ModalBtn={{ width: "38%" }}
          ModalBtn1={{ width: "65%" }}
          buttonColor={Colors.black}
          buttonColor1={Colors.black}
          btnName1="No thanks"
          modalButton1={() => {
            setKeepUpdateShowModal(false);
            navigation.navigate(navigationString.Home);
            // navigation.navigate(navigationString.kitsFound, {
            //   qrCode: expectedId,
            // });
          }}
          modalButton={() => {
            setKeepUpdateShowModal(false);
            setStatus(true);
          }}
        />
        {/* )} */}
        {/* {status && ( */}
        <ModalScreen
          success
          successText
          visible={status}
          modalheading={AllStrings.KeepUpdated}
          modalText={AllStrings.notificationsentproductinventory}
          btnName1="Close"
          buttonColor={Colors.black}
          modalButton1={() => {
            setStatus(false);
            navigation.navigate(navigationString.Home);
            // navigation.navigate(navigationString.kitsFound, {
            //   qrCode: expectedId,
            // });
          }}
        />
        {/* )} */}

        <ModalScreen
          success
          successText
          visible={kitAlreadyRegister}
          modalheading={"Kit already registered"}
          modalText={"Kit is already registered"}
          btnName1="Okay"
          buttonColor={Colors.black}
          modalButton1={() => {
            // setKitAlreadyRegister(false);
            navigation.goBack();
          }}
        />

        {/* <ModalScreen
          success
          visible={kitAlreadyRegister}
          modalText={"This kit is already registered"}
          btnName1="Okay"
          buttonColor={Colors.black}
          modalButton1={() => {
            setKitAlreadyRegister(false);
          }}
        /> */}

        {expectedId !== "" ? (
          kitNotFound && (
            <TextView
              textSty={{
                textAlign: "center",
                marginBottom: 5,
                color: "#047835",
              }}>
              Success, item found
            </TextView>
          )
        ) : (
          <TextView
            textSty={{
              textAlign: "center",
              marginBottom: 5,
              fontSize: 13,
            }}>
            Please wait, searching
          </TextView>
        )}
        <TextView
          heading
          headingTextSty={{
            fontSize: 14,
            fontWeight: 21,
            textAlign: "center",
          }}>
          No QR Code? Try one of the following
        </TextView>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button
            onClick={() => {
              textValue == "Enter Manually"
                ? navigation.navigate(navigationString.kitNotFound, {
                    qrCode: expectedId,
                  })
                : setIsCameraActive(false);
              setScanned(false);
              navigation.navigate(navigationString.scanBarcodeScreen, {
                qrCode: expectedId,
              });
            }}
            allButtonSty={{
              flxGrow: 1,
              alignSelf: "center",
              width: "40%",
              borderRadius: 10,
              marginBottom: 20, // Adjusted to -40
            }}
            btnName={"Use Barcode"}
            buttonColor={Colors.black}
          />
          <Button
            onClick={() => {
              setIsCameraActive(false);

              setScanned(false);
              navigation.navigate(navigationString.kitNotFound, {
                qrCode: expectedId,
              });
            }}
            allButtonSty={{
              flxGrow: 1,
              alignSelf: "center",
              width: "40%",
              borderRadius: 10,
              marginBottom: 20, // Adjusted to -40
            }}
            btnName={"Add Manually"}
            buttonColor={Colors.black}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KitsInstallation;

const styles = StyleSheet.create({
  centerText: {
    // flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});
