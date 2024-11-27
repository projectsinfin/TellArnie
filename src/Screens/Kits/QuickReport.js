import React, { useEffect, useState } from "react";
import kitsStyles from "./kitsStyles";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import navigationString from "../../Navigations/navigationString";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";
import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
import { RNCamera } from "react-native-camera";
import Button from "../../Components/Button";
import { useIsFocused } from "@react-navigation/native";
import { addKitId } from "../../redux/reducer/auth";
import ModalScreen from "../../Components/ModalScreen";

const QuickReport = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { key } = route.params;

  const [PleaseSearch, setPleaseSearch] = useState(false);
  const [scanText, setscanText] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [foundItem, setFoundItem] = useState(false);
  const [foundNotItem, setFoundNotItem] = useState(false);
  const [kitAlreadyRegister, setKitAlreadyRegister] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true); // State to manage camera activation

  useEffect(() => {
    // This effect will be called when the screen is focused
    if (isFocused) {
      setscanText(false);
      setPleaseSearch(true);
      setIsCameraActive(true);
      setFoundItem(false);
      setFoundNotItem(false);
      // Do something when the screen is focused
      console.log("Screen is focused", isCameraActive);
    }
  }, [isFocused]); //

  useEffect(() => {
    if (isCameraActive) {
      const timeoutId = setTimeout(() => {
        setPleaseSearch(false);
        setscanText(true);
      }, 10000);

      return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout on unmount or state change
    }
  }, [isCameraActive]);

  const handleScan = (scannedData) => {
    setScanned(true); // Set scanning flag to true to prevent multiple scans
    // console.log("scannedData quick report---", scannedData);
    // console.log("Match found! Scanned ID:", scannedData);
    const idPattern =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    const matchResult = scannedData?.data.match(idPattern);
    const data = {
      // qr_code: scannedData?.data,
      qr_code: matchResult ? matchResult[0] : null,
    };

    dispatch(call_InstallKitDetails(data))
      .then((res) => {
        console.log("-res payload---", res.payload);
        if (res.payload.status === 200) {
          if (res.payload?.data?.kit_found === false) {
            // alert(res.payload.message);
            // setFoundNotItem(true);
            setPleaseSearch(false);
            setscanText(true);
          } else {
            if (res.payload?.data?.kit?.company_id == "") {
              return setKitAlreadyRegister(true), setIsCameraActive(false);
            }

            dispatch(addKitId(res?.payload?.data?.kit?._id));
            // key == "StandardReport"
            //   ? navigation.navigate(navigationString.detailedReportFirst)
            //   : navigation.navigate(navigationString.quickReportInfoNav);

            key == "StandardReport"
              ? navigation.navigate(navigationString.kitsFound, {
                  qrCode: matchResult ? matchResult[0] : null,
                  key: "scanStandardReport",
                })
              : navigation.navigate(navigationString.kitsFound, {
                  key: "scanQuickReport",
                  qrCode: matchResult ? matchResult[0] : null,
                });

            setScanned(false);
            setIsCameraActive(false);
            setFoundItem(true);
          }
        } else {
          setScanned(false);
          console.log(res.payload.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setScanned(false);
        setIsScanning(false);
      }); // Reset scanning flag after processing
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
            heading
            headingTextSty={{ ...kitsStyles.headingText, marginTop: 80 }}>
            {AllStrings.ScanQRCode}
          </TextView>
          <View
            style={{
              marginTop: 30,
            }}>
            <View>
              {
                Platform.OS === "ios"
                  ? isCameraActive && (
                      <RNCamera
                        style={{
                          height: responsiveHeight(40),
                          width: responsiveWidth(80),
                        }}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        // onBarCodeRead={(data) => handleScan(data)}
                        onBarCodeRead={scanned ? undefined : handleScan}
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
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        onBarCodeRead={scanned ? undefined : handleScan}

                        // onBarCodeRead={handleScan}
                      />
                    )
                // <QRCodeScanner
                //   onRead={(data) => handleScan(data)}
                //   fadeIn={false}
                //   reactivate={true}
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

          {scanText === true && (
            <TextView
              textSty={{
                fontSize: 13,
                textAlign: "center",
                color: "red",
                marginTop: Platform.OS === "android" ? 40 : 15,
              }}>
              Item not found
            </TextView>
          )}

          {PleaseSearch === true && (
            <TextView
              textSty={{
                textAlign: "center",
                fontSize: 12,
                marginTop: Platform.OS === "android" ? 40 : 15,
              }}>
              Please wait, searching
            </TextView>
          )}
          <ModalScreen
            success
            successText
            kitnotRegister
            visible={kitAlreadyRegister}
            modalheading={"This kit is not registered"}
            // modalText={"Kit is not registered"}
            btnName1="Register this kit here"
            buttonColor={Colors.black}
            modalButton1={() => {
              setKitAlreadyRegister(false);
              // navigation.goBack();

              navigation.navigate(navigationString.kitsInstallation);
            }}
          />
          {foundItem === true && (
            <View>
              <TextView
                textSty={{
                  textAlign: "center",
                  marginBottom: 15,
                  color: "#047835",
                }}>
                Success, item found
              </TextView>
            </View>
          )}
          {foundNotItem === true &&
            (Platform.OS === "ios" ? (
              <View>
                <TextView
                  textSty={{
                    textAlign: "center",
                    marginBottom: Platform.OS === "ios" ? 15 : 0,
                    color: "red",
                    fontSize: 13,
                  }}>
                  Item not found
                </TextView>
              </View>
            ) : (
              <View>
                <TextView
                  textSty={{
                    textAlign: "center",
                    marginTop: 50,
                    color: "red",
                    fontSize: 13,
                  }}>
                  Item not found
                </TextView>
              </View>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickReport;

const styles = StyleSheet.create({});
