import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Styles/Colors";
import Header from "../../Components/Header";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import InputFields from "../../Components/InputFields";
import Button from "../../Components/Button";
import { useFormik } from "formik";
import navigationString from "../../Navigations/navigationString";

const BarCodeScanKitFound = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);

  console.log("route===5==", route.params);

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    // setRefreshing(true); // Set refreshing to true to show the spinner
    // fetchData(); // Call the function to fetch new data
  };

  // Initialize useFormik hook
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brand: route?.params?.productDetails?.brand || "",
      productName: route?.params?.productDetails?.product_name || "",
      lotNumber: "",
    },
    // validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    payload = {
      ...formik.values,
    };

    navigation.navigate(navigationString.kitsFound, {
      payload,
      qrCode: route?.params?.qrCode,
      is_empty_QRCode: route?.params,
      key: "BarcodeScanKit",
    });
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
                // tintColor="#689F38" // Android only
                // title="Pull to refresh" // iOS only
              />
            }>
            <View style={{ width: "80%", alignSelf: "center" }}>
              <TextView
                heading
                headingTextSty={{
                  ...styles.headingText,
                }}>
                Please enter the kit details
              </TextView>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                source={
                  //   installKitDetails?.data.kit?.kit_picture !== ""
                  //     ? { uri: installKitDetails?.data.kit?.kit_picture }
                  //     : imagePath.NoIcon
                  route?.params?.productDetails?.kit_picture
                    ? { uri: route?.params?.productDetails?.kit_picture }
                    : imagePath.NoIcon
                }
                resizeMode="contain"
                style={{
                  width: responsiveWidth(80),
                  height: responsiveHeight(25),
                }}
              />
            </View>
            <View>
              <InputFields
                placeholder="Brand"
                editDisabled={false}
                value={formik.values.brand}
                onChangeText={formik.handleChange("brand")}
                handleBlurs={() => formik.setFieldTouched("brand")}
              />
              <InputFields
                placeholder="Product Name"
                editDisabled={false}
                value={formik.values.productName}
                onChangeText={formik.handleChange("productName")}
                handleBlurs={() => formik.setFieldTouched("productName")}
              />
              <InputFields
                placeholder="Lot Number"
                editDisabled={true}
                value={formik.values.lotNumber}
                onChangeText={formik.handleChange("lotNumber")}
                handleBlurs={() => formik.setFieldTouched("lotNumber")}
              />
            </View>

            {/* code of cancel and Save Item Button */}
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: "30%",
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
                  //   addItemFromProduct === "fromKitFound"
                  //     ? navigation.navigate(navigationString.kitsFound)
                  //     : navigation.navigate(navigationString.productFound);
                  navigation.navigate(navigationString.Home);
                }}
              />

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
                btnName="Assign Kit"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BarCodeScanKitFound;

const styles = StyleSheet.create({
  headingText: {
    textAlign: "center",
    fontSize: 18,
    // fontSize: responsiveFontSize(1.5),
    marginTop: 25,
    lineHeight: 21,
  },
});
