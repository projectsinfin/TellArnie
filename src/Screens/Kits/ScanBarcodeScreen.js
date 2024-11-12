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
import { useZxing } from "react-zxing";

const ScanBarcodeScreen = ({ navigation, route }) => {
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
      setShowModal(false);
      if (Platform.OS === "android") {
        setScanned(false);
      }

      // Do something when the screen is focused
    }
  }, [isFocused]); //

  

  const handleScan = (scannedData) => {
    setScanned(true);
   
    const idPattern =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    const matchResult = scannedData?.data.match(idPattern);
    const data = {
      // qr_code: "5060497990661",
      qr_code: scannedData.data,
      // qr_code: matchResult ? matchResult[0] : null,
    };

    dispatch(call_InstallKitDetails(data))
      .then((res) => {
     
        if (res.payload.status === 200) {
          if (res?.payload?.data?.kit_found === false) {
            // No match found
            setTextValue("Enter Manually");
            setShowModal(true);
            setIsCameraActive(false);
            setScanned(false);
            dispatch(addQRCode(scannedData.data));
            setExpectedId(scannedData.data);
          
          } else {
            if (res.payload?.data?.kit?.company_id !== "") {
              return setKitAlreadyRegister(true);
            }

            if (route?.params?.is_empty === true) {
              navigation.navigate(navigationString.BarCodeScanKitFoundScreen, {
                productDetails: res.payload?.data?.kit,
                qrCode: scannedData.data,
                is_empty: route?.params?.is_empty,
                is_empty_QRCode: route?.params?.qrCode,
              });
              return;
            }
          
            dispatch(addQRCode(scannedData.data));
            setExpectedId(scannedData.data);
            setShowModal(false);
            setKitNotFound(true);
            setScanned(false);
            setTimeout(() => {
              navigation.navigate(navigationString.kitsFound, {
                // qrCode: matchResult ? matchResult[0] : null,
                // qrCode: "5060497990661",
                qrCode: scannedData.data,
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
            headingTextSty={{ ...kitsStyles.headingText, marginTop: 60 }}>
            {AllStrings.ScanBarCode}
          </TextView>

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
                        barCodeTypes={[
                          // RNCamera.Constants.BarCodeType.qr,
                          RNCamera.Constants.BarCodeType.code128,
                          RNCamera.Constants.BarCodeType.ean13,
                        ]}
                        // onBarCodeRead={handleScan}
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
                        barCodeTypes={[
                          // RNCamera.Constants.BarCodeType.qr,
                          RNCamera.Constants.BarCodeType.code128,
                          RNCamera.Constants.BarCodeType.ean13,
                        ]}
                        // onBarCodeRead={handleScan}
                      />
                    )
               
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
           
          }}
          modalButton={() => {
            setKeepUpdateShowModal(false);
            setStatus(true);
          }}
        />
    
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
           
          }}
        />
     

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
            // navigation.goBack();
            navigation.navigate(navigationString.Home);
          }}
        />

       

        {expectedId !== "" ? (
          kitNotFound && (
            <TextView
              textSty={{
                textAlign: "center",
                marginBottom: 15,
                color: "#047835",
              }}>
              Success, item found
            </TextView>
          )
        ) : (
          <TextView
            textSty={{ textAlign: "center", marginBottom: 15, fontSize: 13 }}>
            Please wait, searching
          </TextView>
        )}
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
            width: "75%",
            borderRadius: 10,
            marginBottom: 20, // Adjusted to -40
          }}
          btnName={"Add Manually"}
          buttonColor={Colors.black}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScanBarcodeScreen;

const styles = StyleSheet.create({});
