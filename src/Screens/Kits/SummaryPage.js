

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import MiniCard from "../../Components/MiniCard";
import ModalScreen from "../../Components/ModalScreen";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  call_AddLocation_API,
  CallUploadImage,
} from "../../redux/action/KitInstallationAction";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import ImageResizer from "react-native-image-resizer";
import Loading from "../../Components/Loading";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";

const SummaryPage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isLoadings, setIsLoadings] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );


  const expiryDate = installKitDetails?.data?.kit?.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  // call complete button funtionality

  const handleComplete = async () => {
    const payload = new FormData();
    payload.append(
      "location_name",
      route.params?.payload.location.location_name
    );
    const compressedImage = await ImageResizer.createResizedImage(
      route.params?.payload.img || "",
      300, // Set the maximum width
      400, // Set the maximum height
      "JPEG", // Set the output format ('JPEG' or 'PNG')
      80 // Set the compression quality (0 - 100)
    );

    payload.append("area", route.params?.payload.area);
    payload.append(
      "kit_id",
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty
        ? route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.is_empty_QRCode
        : installKitDetails?.data.kit._id
    );
    payload.append("is_moving", route.params?.payload.isMoving);
    payload.append("location_id", route.params?.payload.location._id);

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "expiry_date",
          route?.params?.payload?.allPropduct?.mainExpiryDate
        );
    }
    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "products",
          route?.params?.payload?.allPropduct?.listData
        );
    }
    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "is_empty",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.is_empty
        );
    }
    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "lot_number",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.payload
            ?.lotNumber
        );
    }
    {
      route.params?.payload.img !== null &&
        payload.append("kit_location_pic", {
          uri: compressedImage.uri,
          name: "image.jpg",
          type: "image/jpeg",
        });
    }

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "kit_pic",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.productDetails?.kit_picture
          // uri: route.params?.payload?.allPropduct?.is_Empty_QrCode
          //   ?.is_empty_QRCode?.productDetails?.kit_picture,
          // name: "image.jpg",
          // type: "image/jpeg",
        );
    }

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "product_code",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.productDetails?.product_code
        );
    }

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "brand",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.productDetails?.brand
        );
    }

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "model_number",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.productDetails?.model_number
        );
    }

    {
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true &&
        payload.append(
          "product_name",
          route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
            ?.productDetails?.product_name
        );
    }

    if (
      route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
        ?.is_empty === true
    ) {
      setIsLoadings(true);
      const res = await CallUploadImage(payload);
      setIsLoadings(false);
      setshowSuccess(true);
      return;
    }
    setIsLoadings(true);
    dispatch(call_AddLocation_API(payload))
      .then((res) => {
        setIsLoadings(false);
        if (res.payload.status === 200) {
          setIsLoadings(false);
          setshowSuccess(true);
        } else {
          setIsLoadings(false);
          alert(res?.payload?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoadings(false);
      });
  };

  const handleUPdateComplete = async () => {
    const compressedImage = await ImageResizer.createResizedImage(
      route.params?.payload.img || "",
      300, // Set the maximum width
      400, // Set the maximum height
      "JPEG", // Set the output format ('JPEG' or 'PNG')
      80 // Set the compression quality (0 - 100)
    );

    

    const formData = new FormData();
    const payloadData = {
      location_name: route.params?.payload.location.location_name,
      area: route.params?.payload.area,
      
      products: route?.params?.payload?.allPropduct?.listData,
      kit_location_pic: compressedImage?.uri,
      kit_pic:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.productDetails?.kit_picture,
      product_code:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.productDetails?.product_code,
      brand:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.productDetails?.brand,
      model_number:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.productDetails?.model_number,
      product_name:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.productDetails?.product_name,
      kit_id:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.is_empty_QRCode,
      is_moving: route.params?.payload.isMoving,
      location_id: route.params?.payload.location._id,
      expiry_date: new Date(
        route?.params?.payload?.allPropduct?.mainExpiryDate
      )?.toISOString(),
      is_empty:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.is_empty_QRCode
          ?.is_empty,
      lot_number:
        route.params?.payload?.allPropduct?.is_Empty_QrCode?.payload?.lotNumber,
    };

    formData.append("location_name", payloadData?.location_name);
    formData.append("area", payloadData?.area);
    formData.append("product_code", payloadData?.product_code);
    formData.append("brand", payloadData?.brand);
    formData.append("model_number", payloadData?.model_number);
    formData.append("product_name", payloadData?.product_name);
    formData.append("kit_id", payloadData?.kit_id);
    formData.append("is_moving", payloadData?.is_moving);
    formData.append("location_id", payloadData?.location_id);
    formData.append("expiry_date", payloadData?.expiry_date);
    formData.append("is_empty", payloadData?.is_empty);
    formData.append("lot_number", payloadData?.lot_number);

    if (payloadData?.kit_location_pic) {
      formData.append("kit_location_pic", {
        uri: payloadData.kit_location_pic,
        name: "kit_location_pic.jpg", // You can set this dynamically
        type: "image/jpeg", // Adjust the type according to the file
      });
    }

    if (payloadData?.kit_pic) {
      formData.append(
        "kit_pic",
        payloadData.kit_pic
        //   {
        //   uri: payloadData.kit_pic,
        //   name: "kit_pic.jpg",
        //   type: "image/jpeg",
        // }
      );
    }

    payloadData.products.forEach((product, index) => {
      formData.append(`products[${index}][_id]`, product._id);
      formData.append(`products[${index}][kit_id]`, product.kit_id);
      formData.append(`products[${index}][brand]`, product.brand);
      formData.append(`products[${index}][description]`, product.description);
      formData.append(`products[${index}][quantity]`, product.quantity);
      formData.append(
        `products[${index}][current_quantity]`,
        product.current_quantity
      );
      formData.append(`products[${index}][product_code]`, product.product_code);

      // Handle expiry date explicitly for null or undefined
      formData.append(
        `products[${index}][expiry_date]`,
        product.expiry_date ? new Date(product.expiry_date)?.toISOString() : "" // Append empty string if expiry_date is null
      );

      // Handle product picture if available
      if (product?.product_picture) {
        formData.append(
          `products[${index}][product_picture]`,
          product.product_picture
        );
      }
    });

    setIsLoadings(true);
    const res = await CallUploadImage(formData);
   
    setIsLoadings(false);
    if (res.status === 200) {
      setshowSuccess(true);
    }
  };

  const renderItem = ({ item, index }) => {

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 5,
          backgroundColor: index % 2 == 0 ? null : Colors.greenLightTint,
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
        <View
          style={{
            flex: 0.25,
          }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "center",
            }}>
            {item.current_quantity}
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
            {item?.expiry_date === null || !item?.expiry_date
              ? ""
              : moment(item?.expiry_date).format("MMM YYYY")}
          </TextView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack()}
      />
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>

      <View style={kitsStyles.container}>
        <View
          style={{
            ...kitsStyles.heading,
            marginTop: 15,
            marginHorizontal: 20,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 0 }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  lineHeight: 21,
                }}>
                {AllStrings.InstallationDetails}
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 10,
                }}
              />
              <View style={{ alignSelf: "center", marginTop: 10 }}>
                <Image
                  source={
                    route.params?.payload.img
                      ? { uri: route.params?.payload.img }
                      : imagePath.NoIcon
                  }
                  style={{
                    // alignSelf: "center",
                    height: responsiveHeight(25),
                    width: responsiveWidth(90),
                    marginBottom: 10,
                  }}
                  resizeMode="cover"
                />
               
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      height: responsiveHeight(25),
                      width: responsiveWidth(50),
                    }}
                    initialRegion={{
                      latitude:
                        Platform.OS === "ios"
                          ? route.params?.payload?.location?.latitude
                          : parseFloat(
                              route.params?.payload?.location?.latitude
                            ),
                      longitude:
                        Platform.OS === "ios"
                          ? route.params?.payload?.location?.longitude
                          : parseFloat(
                              route.params?.payload?.location?.longitude
                            ),
                      // latitude: 30.733315,
                      // longitude: 76.779419,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}>
                    {/* Marker */}
                    <Marker
                      coordinate={{
                        latitude:
                          Platform.OS === "ios"
                            ? route.params?.payload?.location?.latitude
                            : parseFloat(
                                route.params?.payload?.location?.latitude
                              ),
                        longitude:
                          Platform.OS === "ios"
                            ? route.params?.payload?.location?.longitude
                            : parseFloat(
                                route.params?.payload?.location?.longitude
                              ),
                        // latitude: route.params?.payload?.location?.latitude,
                        // longitude: route.params?.payload?.location?.longitude,
                      }}
                      // title={kitDetails?.location_name}
                      // description={"Your Marker Description"}
                    />
                  </MapView>

                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 18,

                        marginTop: 0,
                      }}>
                      {route.params?.payload?.location?.location_name}
                    </TextView>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 18,

                        marginTop: 0,
                      }}>
                      {route.params?.payload?.area}
                    </TextView>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  lineHeight: 21,
                }}>
                {AllStrings.KitContentDetails}
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 10,
                }}
              />
            </View>

            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                // source={
                //   installKitDetails?.data?.kit?.kit_picture
                //     ? { uri: installKitDetails?.data.kit?.kit_picture }
                //     : imagePath.productImg
                // }
                source={
                  installKitDetails?.data.kit?.kit_picture !== ""
                    ? { uri: installKitDetails?.data.kit?.kit_picture }
                    : imagePath.NoIcon
                  // imagePath.NoIcon
                }
                resizeMode="contain"
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(90),
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
                  // text={installKitDetails?.data.kit?.product_code}
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
                  // text={installKitDetails?.data.kit?.lot_number}
                  text={
                    route?.params?.payload?.allPropduct?.lotNumber
                      ? route?.params?.payload?.allPropduct?.lotNumber
                      : installKitDetails?.data.kit?.lot_number == "false"
                      ? null
                      : installKitDetails?.data.kit?.lot_number
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.ExpiryDate}
                  text={
                    route?.params?.payload?.allPropduct?.mainExpiryDate
                      ? moment(
                          route?.params?.payload?.allPropduct?.mainExpiryDate
                        ).format("MMM YYYY")
                      : installKitDetails?.data?.kit?.expiry_date
                      ? formattedDate
                      : ""
                  }
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
                <FlatList
                  data={
                    route?.params?.payload?.allPropduct?.listData
                      ? route?.params?.payload?.allPropduct?.listData
                      : installKitDetails?.data.relatedProducts
                  }
                  renderItem={renderItem}
                  keyExtractor={(item) => item.key}
                  style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: 30,
              }}>
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                allButtonSty={{
                  backgroundColor: Colors.black,
                  borderRadius: 10,
                  width: "35%",
                  marginHorizontal: 0,
                }}
                buttonColor={Colors.white}
                btnName="Cancel"
              />
              <Button
                onClick={() => {
                  route.params?.payload?.allPropduct?.is_Empty_QrCode
                    ?.is_empty_QRCode?.is_empty === true
                    ? handleUPdateComplete()
                    : handleComplete();
                }}
                allButtonSty={{
                  alignSelf: "center",
                  width: "60%",
                  marginHorizontal: 0,
                  borderRadius: 10,
                }}
                buttonColor={Colors.black}
                btnName="Complete"
              />
            </View>
            {showModal && (
              <ModalScreen
                visible={showModal}
                modalheading={AllStrings.CancelKitInstallation}
                modalText={AllStrings.cancelinstallationkit}
                btnName="No"
                btnName1="Yes"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  navigation.navigate(
                    navigationString.kitsFound
                    // {
                    // qrCode: route?.params?.qrCode,
                    // }
                  );
                }}
                modalButton={() => setShowModal(false)}
              />
            )}
            {showSuccess && (
              <ModalScreen
                success
                visible={showSuccess}
                modalheading={AllStrings.PleaseConfirm}
                modalText={AllStrings.Successfullyarchived}
                btnName1="Continue"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  setshowSuccess(false);
                  setIsLoadings(false);
                  navigation.navigate(navigationString.Home);
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SummaryPage;

const styles = StyleSheet.create({});
