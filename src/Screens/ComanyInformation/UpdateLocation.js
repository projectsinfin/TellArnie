import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Switch,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import Colors from "../../Styles/Colors";
import Button from "../../Components/Button";
import InputFields from "../../Components/InputFields";
import CustomDropdown from "../../Components/CustomDropdown";
import CountryPicker, {
  getAllCountries,
  FlagType,
} from "react-native-country-picker-modal";
import imagePath from "../../Constant/imagePath";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import axios from "axios";
import { countryNames } from "../../redux/action/CountryDataAction";

import TextView from "../../Components/TextView";
import countryPhoneCodes from "../../Constant/country-phones.json";
import Toast from "react-native-simple-toast";
import {
  call_AdminAddLocation,
  call_AdminApprover,
  call_AdminCaompanyDetail,
  call_DeleteSalesUser_API,
  call_Edit_business_details,
  call_UpdateLocation,
  call_delete_location_API,
} from "../../redux/action/AdminAction";
import { Formik } from "formik";
import { CompanyInfoSchema, SignUpSchema } from "../../utils/Validation";
import Loading from "../../Components/Loading";
import { useIsFocused } from "@react-navigation/native";
import RiskAssessment from "../Admin/RiskAssessment";
import navigationString from "../../Navigations/navigationString";
import { NewLocation, addCompInfoVal } from "../../redux/reducer/auth";
import ModalScreen from "../../Components/ModalScreen";
import Geolocation from "react-native-geolocation-service";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const UpdateLocation = ({ setManageLocationScreens }) => {
  // const newLocation = useSelector((state) => state.auth.nav);

  const isFocused = useIsFocused();
  const locationDetail = useSelector((state) => state?.auth?.locationItem);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: locationDetail?.latitude,
    longitude: locationDetail?.longitude,
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isEnableds, setIsEnableds] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(null);
  const [assignApprover, setAssignApprover] = useState(null);
  const [selectAdmin, setSelectAdmin] = useState("");
  const [selectApprover, setSelectApprover] = useState("");

  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteLocation, setDeleteLocation] = useState(false);
  const [allPostCode, setallPostCode] = useState([]);
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState(locationDetail?.country);
  const [location, setLocation] = useState({ lat: null, lng: null });

  console.log(locationDetail, "---locationDetail");

  let parts = locationDetail?.telephone?.split(" ");
  // let countryCode = parts[0];
  // let number = parts[1];

  //   useEffect(() => {
  //     if (isFocused) {
  //       showLocation();
  //     }
  //   }, [isFocused]);

  //   const showLocation = () => {
  //     setIsLoading(true);
  //     dispatch(call_AdminCaompanyDetail())
  //       .then((res) => {
  //         console.log("update detail res", JSON.stringify(res.payload));
  //         if (res.payload.status == 200) {
  //           //   setbusinessName(res?.payload?.company?.company_name);
  //           //   setCompLocation(res?.payload?.locations);
  //           //   // Update each sales representative object with 'edited' flag
  //           //   const updatedSalesReps = res?.payload?.salesRepresentatives.map(
  //           //     (rep) => ({
  //           //       ...rep,
  //           //       edited: false,
  //           //       checked: false,
  //           //     })
  //           //   );
  //           //   setSalesRepresentative(updatedSalesReps);
  //           setIsLoading(false);
  //         } else {
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });
  //   };

  useEffect(() => {
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      console.log("hksjadahsd", JSON.stringify(info));
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

  useEffect(() => {
    if (locationDetail?.telephone) {
      // If the user's country code is +91, set the country_Code to +91
      set_Country_Code(parts[0]);
      // setCountryName("IN");
      const info = countryPhoneCodes.filter((el) => {
        return parts[0] == el.dial_code ? el.code : null;
      });

      if (info.length > 0) {
        setCountryName(info[0].code);
      }
    } else {
      // Otherwise, set the country_Code to an empty string
      set_Country_Code("");
    }
  }, [locationDetail]);

  const handleSelect = (item) => {
    setSelectAdmin(item);
  };

  const handleSelects = (item) => {
    setSelectApprover(item);
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        console.log("Location permission granted");
        return true;
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          console.log("Location permission granted");
          return true;
        } else if (requestResult === RESULTS.DENIED) {
          console.log("Location permission denied");
          return false;
        } else if (requestResult === RESULTS.BLOCKED) {
          console.log("Location permission blocked");
          showSettingsAlert();
          return false;
        }
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };

  const showSettingsAlert = () => {
    Alert.alert(
      "Permission Required",
      "Please turn on GPS in settings to edit location.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ]
    );
  };

  const getCurrentLocation = async () => {
    const hasLocationPermission = await requestLocationPermission();
    console.log("Permission Status:", hasLocationPermission);
    if (!hasLocationPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        console.log("Current location:", position);
        // fetchAddress(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        // alert("Location permission denied. Please enable it in settings.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleAddressSubmit = async (address) => {
    getCurrentLocation();
    console.log(address, "----add address---", location);
    setCoordinates({ latitude: location?.lat, longitude: location?.lng });
    // console.log("add address", address);
    // try {
    //   const response = await axios.get(
    //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //       address
    //     )}`
    //   );
    //   // console.log("get address ===", response);
    //   if (response.data && response.data.length > 0) {
    //     const { lat, lon } = response.data[0];
    //     setCoordinates({ latitude: lat, longitude: lon });
    //   } else {
    //     // Handle no results found
    //     setCoordinates(null);
    //   }
    // } catch (error) {
    //   // Handle error
    //   console.error("Error fetching coordinates:", error);
    // }
  };

  const handleSelectCountry = (item) => {
    // console.log("item----", item);
    setSelectedCountry(item);
  };

  useEffect(() => {
    dispatch(call_AdminApprover())
      .then((res) => {
        console.log("assignrole---", res.payload);
        if (res.payload.status == 200) {
          setSuperAdmin(res.payload.data.Superadmins);
          setAssignApprover(res.payload.data.Approvers);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const showToastWithGravityAndOffset = () => {
    Toast.showWithGravity(
      "Success, location updated",
      Toast.SHORT,
      Toast.CENTER,
      {
        textColor: Colors.primary,
        backgroundColor: Colors.white,
        tapToDismissEnabled: true,
      }
    );
  };

  const handleUpdateLocation = (val) => {
    // handleAddressSubmit(val.address);
    // Alert.alert("location added successfully");

    if (location?.lat == null && location?.lng == null) {
      if (
        locationDetail?.latitude == null &&
        locationDetail?.longitude == null
      ) {
        // return handleShowAlert("Plesase enter correct location name");
        showSettingsAlert();
        return;
      }
    }
    setIsLoading(true);
    const payload = {
      location_id: locationDetail?._id,
      location_name: val.address,
      street: val.street,
      city: val.city || city,
      county: val.County || county,
      country: selectedCountry !== null ? selectedCountry?.label : country,
      zip_code: val.zipCode,
      country_code: country_Code,
      contact_number: val.Number,
      assigned_admin_id: selectAdmin?._id,
      assigned_approver_id: selectApprover?._id,
      // longitude: coordinates?.longitude,
      // latitude: coordinates?.latitude,
      longitude: location?.lng,
      latitude: location?.lat,
      business_email: val.business_email,
      is_remote_location: isEnableds,
    };

    console.log(payload, "update location-----payloadvalue");
    dispatch(call_UpdateLocation(payload))
      .then((res) => {
        if (res.payload.status === 200) {
          showToastWithGravityAndOffset();
          dispatch(NewLocation({}));
          setManageLocationScreens("companyInfo");
        } else {
          // alert(res.payload.message);
          setIsLoading(false);
          console.log("res.payload.message--", res.payload);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  // Function to handle country selection from modal
  const handleCountrySelect = (selected) => {
    setCountryName(selected.cca2);
    setModalVisible(false); // Close the modal after selecting a country
  };

  // Function to handle opening of the modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  // Function to handle closing of the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const fetchCityAndCountry = async (postalCode) => {
    console.log("Fetching city and country for postal code:", postalCode);

    try {
      const countryCode = "GB"; // Country code for United Kingdom
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=${countryCode}&format=json&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data && data.length > 0) {
        const city = data[0].address.municipality;
        const county = data[0].address.county;
        const country = data[0].address.country;

        // Update the state variables with the retrieved data
        setCity(city);
        setCounty(county);
        setCountry(country);
        setallPostCode(data);
      } else {
        console.error("No city and country data found in response.");
      }
    } catch (error) {
      console.error("Error fetching city and country:", error.message);
    }
  };

  console.log("locationDetail------", locationDetail?.latitude);
  return (
    <Formik
      initialValues={{
        address: locationDetail?.location_name,
        street: locationDetail?.street,
        city: locationDetail?.city,
        County: locationDetail?.county,
        zipCode: locationDetail?.zip_code,
        Number: locationDetail?.telephone?.length > 6 ? parts[1] : "",
        business_email: locationDetail?.business_email,
      }}
      validationSchema={CompanyInfoSchema(countryName, country_Code)}
      onSubmit={(values) => handleUpdateLocation(values)}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
      }) => (
        // <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "null"}
        // style={{ flex: 1 }}></KeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <Modal animated={true} transparent={true} visible={isLoading}>
              <Loading />
            </Modal>
            <Text
              style={[
                styles.boldAndLargeFont,
                { textAlign: "center", marginTop: moderateScaleVertical(20) },
              ]}>
              Enter your business information
            </Text>
            <View style={{ paddingHorizontal: 20 }}>
              <InputFields
                placeholder="Location Name"
                onSubmitEditing={(e) => handleAddressSubmit(e.nativeEvent.text)}
                onChangeText={(text) => {
                  handleChange("address")(text); // Update the form field value
                  handleAddressSubmit(text); // Call handleAddressSubmit with the updated text
                }}
                value={values.address}
                handleBlurs={() => setFieldTouched("address")}
              />
              {touched.address && errors.address && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.address}
                </TextView>
              )}
              {/* {console.log(coordinates)} */}

              <InputFields
                placeholder="Street Address"
                // value={street}
                // onChangeText={(text) => setStreet(text)}
                onChangeText={handleChange("street")}
                value={values.street}
                handleBlurs={() => setFieldTouched("street")}
              />
              {touched.street && errors.street && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.street}
                </TextView>
              )}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  // gap: 10,
                  justifyContent: "space-between",
                }}>
                <View style={{ width: "49%" }}>
                  <InputFields
                    placeholder="City"
                    onChangeText={handleChange("city")}
                    // value={values.city}
                    value={values.city || city}
                    handleBlurs={() => setFieldTouched("city")}
                  />
                  {touched.city && errors.city && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.city}
                    </TextView>
                  )}
                </View>
                <View style={{ width: "49%" }}>
                  <InputFields
                    placeholder="County"
                    onChangeText={handleChange("County")}
                    // value={values.County}
                    value={values.County || county}
                    handleBlurs={() => setFieldTouched("County")}
                  />
                  {touched.County && errors.County && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.County}
                    </TextView>
                  )}
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <View style={{ width: "49%" }}>
                  {/* {console.log(selectedCountry, "country----", country)} */}
                  <CustomDropdown
                    countryNames
                    type="countryName"
                    placeholder={country == "" ? "Country" : country}
                    data={countryNames}
                    changeColor={{
                      color:
                        selectedCountry !== null
                          ? Colors.black
                          : country == ""
                          ? Colors.lightgray
                          : Colors.black,
                    }}
                    onSelect={handleSelectCountry}
                  />
                </View>
                <View style={{ width: "49%" }}>
                  <InputFields
                    placeholder="Post Code"
                    // value={zipCode}
                    // onChangeText={(text) => setZipCode(text)}
                    onChangeText={(text) => {
                      handleChange("zipCode")(text);
                      fetchCityAndCountry(text);
                    }}
                    value={values.zipCode}
                    handleBlurs={() => setFieldTouched("zipCode")}
                  />

                  {touched.zipCode && errors.zipCode && (
                    <TextView textSty={{ color: Colors.danger }}>
                      {errors.zipCode}
                    </TextView>
                  )}
                </View>
              </View>
              {allPostCode.length > 0 &&
                allPostCode
                  // .filter((item) => item.address.city)
                  .map((item, index) => {
                    console.log(item);
                    return (
                      <View
                        style={
                          {
                            // height: 42,
                          }
                        }>
                        <ScrollView
                          nestedScrollEnabled={true}
                          style={{
                            // maxHeight: 150,
                            // marginTop: 5,
                            borderWidth: 1,
                            borderColor: "#cdcdcd",
                            paddingVertical: 5,
                          }}>
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setCity(item.address.city);
                              setCounty(item.address.county);
                              setCountry(item.address.country);
                              setallPostCode([]);
                            }}>
                            <TextView
                              textSty={{
                                marginTop: 10,
                                marginLeft: 15,
                                fontSize: 14,
                              }}>
                              {/* {`${item.address?.postcode} ${item.address.country}`} */}
                              <Text>
                                {item.address?.postcode}{" "}
                                {item.address.city == undefined
                                  ? null
                                  : item.address.city}{" "}
                                {item.address.county == undefined
                                  ? null
                                  : item.address.county}{" "}
                                {item.address.country}
                              </Text>
                              {/* {`${item.address?.postcode} ${item.address.city} ${item.address.county} ${item.address.country}`} */}
                            </TextView>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    );
                  })}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    borderColor: Colors.lightgray,
                    borderWidth: 0.7,
                    borderRadius: 20,
                    backgroundColor:
                      isEnableds == false ? Colors.white : Colors.secondary,
                  }}>
                  <Switch
                    trackColor={{
                      true: Colors.secondary,
                      false: Colors.white,
                    }}
                    thumbColor={Colors.white}
                    onValueChange={() => setIsEnableds(!isEnableds)}
                    value={isEnableds}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <TextView textSty={{ marginLeft: 5 }}>
                  This is a remote location
                </TextView>
              </View>
              <View style={styles.horizontalLine} />
              <InputFields
                placeholder="Business Email"
                autoCapitalize
                keyboardType="email-address"
                onChangeText={handleChange("business_email")}
                value={values.business_email}
                handleBlurs={() => setFieldTouched("business_email")}
                textContentType="emailAddress"
                autoComplete="email"
              />
              {touched.business_email && errors.business_email && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.business_email}
                </TextView>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "29%",
                    height: 40,
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: Colors.dividerLight,
                    borderRadius: 5,
                    justifyContent: "space-evenly",
                  }}>
                  <View style={{ marginRight: -13 }}>
                    <View>
                      <CountryPicker
                        {...{
                          countryCode: countryName,
                          withFilter: true,
                          withFlag: true,
                          withAlphaFilter: true,
                          // onSelect: (selected) => {
                          //   setCountryName(selected.cca2);
                          // },
                          onClose: handleCloseModal,
                          visible: modalVisible,
                          onSelect: (selected) => {
                            handleCountrySelect(selected);
                          },
                        }}

                        // visible={false}
                      />
                    </View>
                  </View>
                  <TextView textSty={{ fontSize: 14 }}>{country_Code}</TextView>
                  {/* <Image
                      source={imagePath.downArrow}
                      resizeMode="contain"
                      style={{ width: 10, height: 10, paddingLeft: 10 }}
                     /> */}
                  <TouchableOpacity onPress={() => handleOpenModal()}>
                    <Image
                      source={imagePath.downArrow}
                      resizeMode="contain"
                      style={{
                        width: 10,
                        height: 10,
                        paddingLeft: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ width: "70%" }}>
                  <InputFields
                    placeholder="Number"
                    keyboardType="phone-pad"
                    // onChangeText={(text) => setNumber(text)}
                    // value={Number}
                    onChangeText={handleChange("Number")}
                    value={values.Number}
                    handleBlurs={() => setFieldTouched("Number")}
                  />
                </View>
              </View>
              {touched.Number && errors.Number && (
                <TextView textSty={{ color: Colors.danger }}>
                  {errors.Number}
                </TextView>
              )}
              <CustomDropdown
                changeColor={{
                  color: locationDetail?.assigned_admin_name
                    ? Colors.black
                    : Colors.lightgray,
                }}
                type="treatment"
                userList
                onSelect={handleSelect}
                placeholder={
                  locationDetail?.assigned_admin_name
                    ? locationDetail?.assigned_admin_name
                    : "Assigned Super Admin"
                }
                data={superAdmin}
              />
              <CustomDropdown
                changeColor={{
                  color: locationDetail?.assigned_approver_name
                    ? Colors.black
                    : Colors.lightgray,
                }}
                userList
                type="treatment"
                onSelect={handleSelects}
                placeholder={
                  locationDetail?.assigned_approver_name
                    ? locationDetail?.assigned_approver_name
                    : "Assigned Approver"
                }
                data={assignApprover}
              />
            </View>

            <View
              style={{
                marginVertical: 25,
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}>
              {/* <View style={{ width: "49%" }}> */}
              <TouchableOpacity
                onPress={() => {
                  setDeleteLocation(true);
                }}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={imagePath.deleteIcon} resizeMode="contain" />
                <TextView
                  textSty={{ fontSize: 14, lineHeight: 16, marginLeft: 5 }}>
                  Delete
                </TextView>
              </TouchableOpacity>

              {/* </View>
              <View style={{ width: "49%" }}> */}
              <Button
                onClick={() => {
                  dispatch(NewLocation({}));
                  setManageLocationScreens("companyInfo");
                }}
                allButtonSty={{
                  backgroundColor: "black",
                  borderRadius: 10,
                  width: "30%",
                  marginHorizontal: 0,
                }}
                buttonColor={Colors.white}
                btnColor="#fff"
                btnName="Cancel"
              />
              <Button
                allButtonSty={{ borderRadius: 10, width: "30%" }}
                buttonColor={Colors.black}
                btnName={"Update"}
                onClick={handleSubmit}
              />
              {/* </View> */}
            </View>
          </ScrollView>
          {/* Are you sure you want to delete this location?  */}
          <ModalScreen
            visible={deleteLocation}
            modalheading={"Delete Location"}
            modalText={"This will also delete all kit data at this location."}
            btnName="Yes"
            ModalBtn={{ width: "49%" }}
            ModalBtn1={{ width: "49%" }}
            buttonColor={Colors.black}
            buttonColor1={Colors.black}
            btnName1="No"
            modalButton1={() => {
              setDeleteLocation(false);
            }}
            modalButton={() => {
              dispatch(call_delete_location_API(locationDetail?._id))
                .then((res) => {
                  if (res.payload.status === 200) {
                    alert(res.payload.message);

                    setManageLocationScreens("companyInfo");
                    // dispatch(addCompInfoVal("bb"));
                    dispatch(NewLocation({}));
                  } else {
                    setDeleteLocation(false);
                  }
                })
                .catch((err) => {
                  console.log("delete api status", err);
                });
              // setDeleteLocation(false);
            }}
          />
        </View>
      )}
    </Formik>
  );
};

export default UpdateLocation;

const styles = StyleSheet.create({
  boldAndSmallFont: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.black,
  },
  boldAndLargeFont: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginTop: 8,
  },
  topRow: { paddingVertical: 10, paddingHorizontal: 10, marginTop: 10 },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  normalFont: { fontSize: 14, fontWeight: "400" },

  flexStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  horizontalLine: {
    borderWidth: 1,
    borderColor: "#17171780",
    width: "100%",
    marginTop: 15,
  },
  flexContainer: {
    width: "100%",
    display: "flex",
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  topBox: {
    width: "100%",
    backgroundColor: "#04783533",
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textBoxSty: {
    borderWidth: 0,
    marginTop: 0,
    marginLeft: -10,
  },
  ButtonStyle: {
    width: "88%",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 3,
  },
});
