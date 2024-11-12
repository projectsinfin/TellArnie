import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../Constant/imagePath";
import SignupStyle from "./SignupStyle";
import AllStrings from "../../Constant/AllStrings";
import TextView from "../../Components/TextView";
import Button from "../../Components/Button";
import InputFields from "../../Components/InputFields";
import navigationString from "../../Navigations/navigationString";
import CustomDropdown from "../../Components/CustomDropdown";
import ModalScreen from "../../Components/ModalScreen";
import Colors from "../../Styles/Colors";
import { useDispatch, useSelector } from "react-redux";
import { addDistributerId, saveUserData } from "../../redux/reducer/auth";
import { call_RegisteCompany_Api, login } from "../../redux/action/AuthAction";
import { Formik } from "formik";
import { countryNames } from "../../redux/action/CountryDataAction";
import { RegisterCompanyValidation } from "../../utils/Validation";
import Loading from "../../Components/Loading";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../Components/CustomAlert";
import Geolocation from "react-native-geolocation-service";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const Signupbusiness = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { isLoading, error, user } = useSelector((state) => state.auths);
  const { distributerLinkemail } = useSelector((state) => state?.auth);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoadings, setisLoadings] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [allPostCode, setallPostCode] = useState([]);

  const [registerData, setRegisterData] = useState(null);
  const [payloadValue, setPayloadValue] = useState(null);
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [location, setLocation] = useState({ lat: null, lng: null }); //set user currect lat, long

 


 

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
       
        return true;
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
       
          return true;
        } else if (requestResult === RESULTS.DENIED) {
        
          return false;
        } else if (requestResult === RESULTS.BLOCKED) {
      
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
      "Please activate GPS in settings to complete sign-up",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ]
    );
  };

  const getCurrentLocation = async () => {
    const hasLocationPermission = await requestLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
    
      },
      (error) => {
        console.error("Error getting location:", error);
      
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleAddressSubmit = async (address) => {
    getCurrentLocation();
    setCoordinates({ latitude: location?.lat, longitude: location?.lng });
   
  };

  const data = [
    { id: "1", label: "Agriculture, Forestry & Fishing" },
    { id: "2", label: "Mining & Quarrying" },
    { id: "3", label: "Manufacturing" },
    { id: "4", label: "Electricity, Gas, Steam & Air Conditioning Supply" },
    {
      id: "5",
      label: "Water Supply, Sewerage, Waste & Remediation Activities",
    },
    { id: "6", label: "Construction" },
    {
      id: "7",
      label: "Wholesale & Retail Trade",
    },
    { id: "8", label: "Accommodation & Food Service Activities" },
    { id: "9", label: "Information & Communication" },
    { id: "10", label: "Financial & Insurance Activities" },
    { id: "11", label: "Real Estate Activities" },
    { id: "12", label: "Professional Scientific & Technical Activities" },
    { id: "13", label: "Administrative & Support Service Activities" },
    { id: "14", label: "Public Admin & Defence; Compulsory Social Security" },
    { id: "15", label: "Education" },
    { id: "16", label: "Human Health & Social Work Activities" },
    { id: "17", label: "Arts, Entertainment & Recreation" },
    { id: "18", label: "Other Service Activities" },
    { id: "19", label: "Private Households" },
    { id: "20", label: "Transport & Storage" },
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleSelectCountry = (item) => {
    setSelectedCountry(item);
  };

  const fetchCityAndCountry = async (postalCode) => {
  
    try {
      const countryCode = "GB"; // Country code for United Kingdom
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=${countryCode}&format=json&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

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

  const handleSkip = () => {
    setisLoadings(true);
    dispatch(call_RegisteCompany_Api(payloadValue))
      .then(async (res) => {
     

        if (res.payload.status === 200) {
          dispatch(addDistributerId({}));
          setisLoadings(false);
          setRegisterData(res.payload.data);
          const AccessToken = res.payload.data.access_token;
          const ReffToken = res.payload.data.refresh_token;
          const role = res.payload.data.role;
          setShowModal(false);
          dispatch(saveUserData({ isLogin: true }));
          dispatch(login(AccessToken, ReffToken, role));
          await AsyncStorage.setItem("globalData", JSON.stringify(res.payload));
       
        } else {
          handleShowAlert(res.payload.message);
          setisLoadings(false);
          setShowModal(false);
         
        }
      })
      .catch((err) => {
        console.log(err);
        setisLoadings(false);
        setShowModal(false);
      });
  };

  // code of enter value in all fields and show popup
  const handleRegisterCompany = (val) => {
  
    if (selectedItem == null) {
      return handleShowAlert("Please select industry");
    }
    if (location?.lat == null || location?.lng == null) {
      
      showSettingsAlert();
      return;
    }
    if (val.city == "" && city == "") {
      return handleShowAlert("Please enter city.");
    }
    if (val.county == "" && county == "") {
      return handleShowAlert("Please enter county.");
    }
    if (selectedCountry?.label == null && country == "") {
      return handleShowAlert("Please select country.");
    }
    // Set registerCalled to true to prevent multiple API call
    const payload = {
      company_name: val.company_name,
      industry: selectedItem.label,
      street: val.streetAddress,
      city: val.city || city,
      county: val.county || county,
      country:
        country !== ""
          ? country
          : selectedCountry == null
          ? // ? "United Kingdom"
            ""
          : selectedCountry?.label,
      distributor_name: val.distributor_name,
      distributor_email: val.distributor_email?.toLowerCase(),
      
      user_id: user?.data?.user_id,
      zip_code: val.zip_code,
      location_name: val.address,
     
      longitude: location?.lng,
      latitude: location?.lat,
    };

    setPayloadValue(payload);
    setShowModal(true);
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
   
    <Formik
      enableReinitialize
      initialValues={{
        company_name: "",
        address: "",
        industry: "",
        streetAddress: "",
        city: "",
        distributor_name: distributerLinkemail.name || "",
        distributor_email: distributerLinkemail.email || "",
        zip_code: "",
        county: "",
      }}
      validationSchema={RegisterCompanyValidation}
      onSubmit={(values) => handleRegisterCompany(values)}>
      {({
        handleChange,
        handleSubmit,
        touched,
        values,
        errors,
        isValid,
        setFieldTouched,
      }) => (
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "null"}
          style={{ flex: 1, backgroundColor: Colors.white }}>
          <SafeAreaView style={{ flex: 1 }}>
            <Modal animated={true} transparent={true} visible={isLoadings}>
              <Loading />
            </Modal>
            <CustomAlert
              visible={showAlert}
              message={alertMessage} // Pass the dynamic message
              onClose={handleCloseAlert}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}>
              <View style={{ flex: 0.3 }}>
                <Image
                  source={imagePath.HearderImage}
                  resizeMode="stretch"
                  style={{ width: "100%", marginTop: -20 }}
                />
              </View>
              <View style={{ flex: 0.7 }}>
                <View style={SignupStyle.inner}>
                  <TextView heading>{AllStrings.RegisterCompany}</TextView>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      marginTop: 10,
                    }}>
                    {AllStrings.Enterbusinessinformation}
                  </TextView>
                  <View>
                    <InputFields
                      placeholder="Business Name"
                      onChangeText={handleChange("company_name")}
                      value={values.company_name}
                      handleBlurs={() => setFieldTouched("company_name")}
                    />
                    {errors.company_name && touched.company_name ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.company_name}
                      </TextView>
                    ) : null}
                    <InputFields
                      placeholder="Location Name"
                      // onEndEditing={handleAddressSubmit}
                      onSubmitEditing={(e) =>
                        handleAddressSubmit(e.nativeEvent.text)
                      }
                      // onChangeText={handleChange("address")}
                      onChangeText={(text) => {
                        handleChange("address")(text); // Update the form field value
                        handleAddressSubmit(text); // Call handleAddressSubmit with the updated text
                      }}
                      value={values.address}
                      handleBlurs={() => setFieldTouched("address")}
                    />
                

                    {errors.address && touched.address && (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.address}
                      </TextView>
                    )}
                    <View>
                      <CustomDropdown
                        changeColor={Colors.lightgray}
                        type={"countryName"}
                        placeholder="Industry"
                        data={data.sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        onSelect={handleSelect}
                      />
                      {/* <TextView> {selectedItem ? selectedItem.label : "None"}</TextView> */}
                    </View>
                    <InputFields
                      placeholder="Street Address"
                      onChangeText={handleChange("streetAddress")}
                      value={values.streetAddress}
                      handleBlurs={() => setFieldTouched("streetAddress")}
                    />
                    {errors.streetAddress && touched.streetAddress ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.streetAddress}
                      </TextView>
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <View style={{ width: "48%" }}>
                        <InputFields
                          placeholder="City"
                          onChangeText={handleChange("city")}
                          value={values.city || city}
                          handleBlurs={() => setFieldTouched("city")}
                        />
                        {errors.city && touched.city ? (
                          <TextView textSty={{ color: Colors.danger }}>
                            {errors.city}
                          </TextView>
                        ) : null}
                      </View>
                      <View style={{ width: "48%" }}>
                        <InputFields
                          placeholder="County"
                          onChangeText={handleChange("county")}
                          value={values.county || county}
                          handleBlurs={() => setFieldTouched("county")}
                        />
                        {errors.county && touched.county ? (
                          <TextView textSty={{ color: Colors.danger }}>
                            {errors.county}
                          </TextView>
                        ) : null}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <View style={{ width: "48%" }}>
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
                      <View style={{ width: "48%" }}>
                        <InputFields
                          // keyboardType="numeric"
                          placeholder="Post Code"
                          // onChangeText={handleChange("zip_code")}
                          onChangeText={(text) => {
                            handleChange("zip_code")(text);
                            fetchCityAndCountry(text);
                          }}
                          handleBlurs={() => setFieldTouched("zip_code")}
                          value={values.zip_code}
                        />

                        {errors.zip_code && touched.zip_code ? (
                          <TextView textSty={{ color: Colors.danger }}>
                            {errors.zip_code}
                          </TextView>
                        ) : null}
                      </View>
                    </View>
                    {allPostCode.length > 0 &&
                      allPostCode
                        // .filter((item) => item.address.city)
                        .map((item, index) => {
                    
                          return (
                            <View>
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
                    <InputFields
                      // placeholder={AllStrings.SafetyEquipment}
                      placeholder="First Aid Supplier’s name"
                      onChangeText={handleChange("distributor_name")}
                      value={values.distributor_name}
                      keyboardType="email-address"
                      handleBlurs={() => setFieldTouched("distributor_name")}
                    />
                    {errors.distributor_name && touched.distributor_name ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.distributor_name}
                      </TextView>
                    ) : null}

                    {/* distributerLinkemail */}
                    <InputFields
                      autoCapitalize
                      // placeholder={AllStrings.SafetyEquipment}
                      placeholder="First Aid Supplier’s email"
                      onChangeText={handleChange("distributor_email")}
                      value={values.distributor_email}
                      keyboardType="email-address"
                      handleBlurs={() => setFieldTouched("distributor_email")}
                      textContentType="emailAddress"
                      autoComplete="email"
                    />
                    {errors.distributor_email && touched.distributor_email ? (
                      <TextView textSty={{ color: Colors.danger }}>
                        {errors.distributor_email}
                      </TextView>
                    ) : null}
                  </View>

                  <Button
                    onClick={() => handleSubmit()}
                    allButtonSty={{
                      alignSelf: "center",
                      width: "80%",
                      // marginTop: 25,
                      marginVertical: 25,
                    }}
                    buttonColor={Colors.black}
                    btnName="Register Company"
                  />
                </View>
              </View>
              <ModalScreen
                visible={showModal}
                modalheading={AllStrings.Registerapprover}
                modalText={AllStrings.Wouldofficer}
                btnName="Yes"
                buttonColor={Colors.black}
                buttonColor1={Colors.black}
                btnName1="Skip"
                modalButton1={() => handleSkip()}
                modalButton={() => {
                
                  setisLoadings(true);
                  dispatch(call_RegisteCompany_Api(payloadValue))
                    .then((res) => {
                   
                      if (res.payload.status === 200) {
                       
                        dispatch(addDistributerId({}));
                        setisLoadings(false);
                        setShowModal(false);
                        navigation.navigate(navigationString.Approvalcontact, {
                          registerData: res.payload.data,
                        });
                      } else {
                        setisLoadings(false);
                        setShowModal(false);
                        handleShowAlert(res.payload.message);
                     
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      setShowModal(false);
                      setisLoadings(false);
                    });
                }}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </Formik>
    // {/* </ContainerView> */}
  );
};

export default Signupbusiness;
