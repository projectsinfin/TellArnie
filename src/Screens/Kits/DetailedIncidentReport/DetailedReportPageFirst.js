import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import countryPhoneCodes from "../../../Constant/country-phones.json";
import CountryPicker from "react-native-country-picker-modal";
import moment from "moment";
import ModalScreen from "../../../Components/ModalScreen";
import Button from "../../../Components/Button";
import InputFields from "../../../Components/InputFields";
import kitsStyles from "../kitsStyles";
import navigationString from "../../../Navigations/navigationString";
import AllStrings from "../../../Constant/AllStrings";
import TextView from "../../../Components/TextView";
import Header from "../../../Components/Header";
import imagePath from "../../../Constant/imagePath";
import Colors from "../../../Styles/Colors";
import MiniCard from "../../../Components/MiniCard";
import { moderateScaleVertical } from "../../../Styles/responsiveSize";
import { useSelector } from "react-redux";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const DetailedReportPageFirst = ({ navigation }) => {
  const { profileDetails } = useSelector((state) => state.profileData);
  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [showModal, setShowModal] = useState(false);
  const expiryDate = installKitDetails?.data?.kit?.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  // useEffect(() => {
  //   const info = countryPhoneCodes.filter((el) => {
  //     return el.code === countryName;
  //   });
  //   if (info.length > 0) {
  //     console.log("hksjadahsd", JSON.stringify(info));
  //     set_Country_Code(info[0].dial_code);
  //   }
  // }, [countryName]);

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
              <View style={{ alignSelf: "center" }}>
                <Image
                  source={
                    installKitDetails?.data.kit?.kit_picture !== ""
                      ? { uri: installKitDetails?.data.kit?.kit_picture }
                      : imagePath.NoIcon
                    // imagePath.NoIcon
                  }
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(80),
                    height: responsiveHeight(25),
                  }}
                />
              </View>

              <View
                style={{
                  width: "80%",
                  alignSelf: "center",
                  marginTop: moderateScaleVertical(5),
                }}>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "center",
                    lineHeight: 21,
                  }}>
                  {/* {AllStrings.RelianceMedicalMediumWorkplace} */}
                  {installKitDetails?.data?.kit?.brand +
                    " " +
                    installKitDetails?.data?.kit?.model_number ==
                  "false"
                    ? ""
                    : installKitDetails?.data?.kit?.model_number +
                        " " +
                        installKitDetails?.data?.kit?.product_name ==
                      "false"
                    ? null
                    : installKitDetails?.data?.kit?.product_name}
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
                    // text={installKitDetails?.data.kit.batch_number}
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
                    // text={installKitDetails?.data?.kit.lot_number}
                    text={
                      installKitDetails?.data?.kit?.lot_number == "false"
                        ? null
                        : installKitDetails?.data?.kit?.lot_number
                    }
                  />
                </View>

                <View style={{ flex: 4 }}>
                  <MiniCard
                    heading={AllStrings.ExpiryDate}
                    text={formattedDate}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 12,
                }}>
                <View style={{ width: "49%" }}>
                  <MiniCard
                    heading="Installed Location"
                    text={installKitDetails?.data?.kit?.location_name}
                  />
                </View>
                <View style={{ width: "49%" }}>
                  <MiniCard
                    heading="Installed Area"
                    text={
                      installKitDetails?.data?.kit?.area
                        ? installKitDetails?.data?.kit?.area
                        : "Not Display"
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: moderateScaleVertical(25),
                }}></View>

              <TextView
                onPress={() =>
                  navigation.navigate(navigationString.quickReportInfoNav)
                }
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  marginBottom: -10,
                }}>
                {AllStrings.Pleaseprovideinformation}
              </TextView>
              <InputFields
                placeholder="First Name"
                editDisabled={false}
                value={profileDetails?.data?.user_details?.first_name}
              />
              <InputFields
                editDisabled={false}
                placeholder="Last Name"
                value={profileDetails?.data?.user_details?.last_name}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View style={kitsStyles.countryContainer}>
                  <View style={kitsStyles.countryModal}>
                    <CountryPicker
                      {...{
                        countryCode: countryName,
                        withFilter: true,
                        withFlag: true,
                        withAlphaFilter: true,

                        onSelect: (selected) => {
                          // setCountryName(selected.cca2);
                        },
                      }}
                      visible={false}
                    />
                  </View>
                  <View style={kitsStyles.countrytext}>
                    <TextView textSty={{ fontSize: 14 }}>
                      {country_Code || "+44"}
                    </TextView>
                    <Image
                      source={imagePath.downArrow}
                      resizeMode="contain"
                      style={kitsStyles.downArrow}
                    />
                  </View>
                </View>
                <View style={{ width: "70%" }}>
                  <InputFields
                    editDisabled={false}
                    placeholder="Number"
                    keyboardType="phone-pad"
                    value={profileDetails?.data.user_details.contact_number}
                  />
                </View>
              </View>
              <InputFields
                editDisabled={false}
                placeholder="Business Email"
                value={profileDetails?.data.user_details.email}
              />

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}>
                <Image
                  source={imagePath.PageIndicator31}
                  style={{ width: "10%" }}
                />
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 15,
                  marginTop: 35,
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
                <Button
                  onClick={() => {
                    navigation.navigate(navigationString.detailedRepSecond);
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
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default DetailedReportPageFirst;

const styles = StyleSheet.create({});
