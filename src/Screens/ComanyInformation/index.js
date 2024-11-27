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
  PermissionsAndroid,
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
  NewLocation,
  addCompInfoVal,
  addLocationItem,
} from "../../redux/reducer/auth";
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
} from "../../redux/action/AdminAction";
import { Formik } from "formik";
import { CompanyInfoSchema, SignUpSchema } from "../../utils/Validation";
import Loading from "../../Components/Loading";
import { useIsFocused } from "@react-navigation/native";
import RiskAssessment from "../Admin/RiskAssessment";
import navigationString from "../../Navigations/navigationString";
import UpdateLocation from "./UpdateLocation";
import CustomAlert from "../../Components/CustomAlert";
import Geolocation from "react-native-geolocation-service";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const CompanyInformation = ({ titleName, navigation }) => {
  const newLocation = useSelector((state) => state.auth.nav);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const compInfoRedux = useSelector((state) => state.auth.compInfo);
  const [manageLocationScreens, setManageLocationScreens] =
    useState("companyInfo");

  const CommonDetailsComponent = (color, item) => {
    console.log("sagdajsdkhads", item);
    return (
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: moderateScale(10),
        }}>
        <View style={[styles.flexContainer, { marginTop: 20 }]}>
          <View style={{ width: "50%" }}>
            <View>
              <Text style={styles.boldAndSmallFont}>Location Name</Text>
              <Text style={styles.normalFont}>{item?.location_name}</Text>
            </View>
            <View>
              <Text style={styles.boldAndSmallFont}>
                House Number and Street Name
              </Text>
              <Text style={styles.normalFont}>{item?.street}</Text>
            </View>
            <View>
              <Text style={styles.boldAndSmallFont}>City / Town</Text>
              <Text style={styles.normalFont}>{item?.city}</Text>
            </View>
            <View>
              <Text style={styles.boldAndSmallFont}>Country</Text>
              <Text style={styles.normalFont}>{item?.country}</Text>
            </View>
          </View>
          <View style={{ width: "50%" }}>
            {/* <Image
              resizeMode="stretch"
              source={imagePath.Map}
              style={{ height: 125, width: 150 }}
            /> */}
            <TouchableOpacity
              onPress={() => {
                // setManageLocationScreens("New Location");
                dispatch(addLocationItem(item));
                setManageLocationScreens("Update Location");
                dispatch(NewLocation({ New_Location: "Update Locaion" }));
                dispatch(addCompInfoVal("aa"));
              }}
              activeOpacity={0.6}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}>
              <Image
                source={imagePath.highlighterIcon}
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
              />
              <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 14,
                  color: Colors.lightgray,
                }}>
                Edit
              </TextView>
            </TouchableOpacity>
            <View>
              {/* {console.log("lat long type", parseInt(item.latitude))} */}
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                  height: responsiveHeight(20),
                  width: responsiveWidth(43),
                  // height: 200,
                  // width: 200,
                }}
                initialRegion={{
                  latitude: parseFloat(item?.latitude),
                  longitude: parseFloat(item?.longitude),
                  // latitude: 53.08701,
                  // longitude: -2.26527,
                  // latitudeDelta: 0.0017,
                  // longitudeDelta: 0.0035,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}>
                {/* Marker */}
                <Marker
                  coordinate={{
                    latitude: parseFloat(item?.latitude),
                    longitude: parseFloat(item?.longitude),
                    // latitude: 53.08701,
                    // longitude: -2.26527,
                  }}
                  title={item?.location_name}
                  // description={"Your Marker Description"}
                />
              </MapView>
            </View>

            <View>
              <Text style={styles.boldAndSmallFont}>Post Code</Text>
              <Text style={styles.normalFont}>{item?.zip_code}</Text>
            </View>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View style={[styles.flexContainer, { marginLeft: 5 }]}>
          <View style={{ width: "50%" }}>
            <Text style={styles.boldAndSmallFont}>Email</Text>
            <Text style={styles.normalFont}>{item?.business_email}</Text>
          </View>

          <View style={{ width: "50%" }}>
            {item?.telephone?.length > 6
              ? item?.telephone !== null &&
                item?.telephone !== "undefined undefined" && (
                  <>
                    <Text style={styles.boldAndSmallFont}>Contact</Text>
                    <Text style={styles.normalFont}>{item?.telephone}</Text>
                  </>
                )
              : null}
          </View>
        </View>

        <View style={[styles.flexContainer, { marginLeft: 5 }]}>
          <View style={{ width: "50%" }}>
            <Text style={styles.boldAndSmallFont}>Assigned Super Admin</Text>
            <Text style={styles.normalFont}>{item?.assigned_admin_name}</Text>
          </View>

          <View style={{ width: "50%" }}>
            {item?.assigned_approver_name !== null && (
              <>
                <Text style={styles.boldAndSmallFont}>Assigned Approver</Text>
                <Text style={styles.normalFont}>
                  {item?.assigned_approver_name}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const CompanyDetails = () => {
    const [compLocation, setCompLocation] = useState(null);
    const [salesRepresentative, setSalesRepresentative] = useState([]);
    const [selectedId, setselectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [businessName, setbusinessName] = useState(null);
    const [refreshing, setIsrefreshing] = useState(false);
    const [textEdit, setTextEdit] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleShowAlert = (message) => {
      setAlertMessage(message); // Set the dynamic message
      setShowAlert(true);
    };

    const handleCloseAlert = () => {
      setShowAlert(false);
    };

    const onRefresh = () => {
      setIsrefreshing(true); // Set refreshing to true to show the spinner
      showLocation(); // Call the function to fetch new data
      setIsrefreshing(false);
    };

    console.log(
      businessName,
      "--",
      salesRepresentative,
      "-----compLocation-----",
      compLocation
    );

    useEffect(() => {
      showLocation();
    }, []);

    const showLocation = () => {
      setIsLoading(true);
      dispatch(call_AdminCaompanyDetail())
        .then((res) => {
          console.log("company detail res", JSON.stringify(res.payload));
          if (res.payload.status == 200) {
            setbusinessName(res?.payload?.company?.company_name);
            setCompLocation(res?.payload?.locations);
            // Update each sales representative object with 'edited' flag
            const updatedSalesReps = res?.payload?.salesRepresentatives.map(
              (rep) => ({
                ...rep,
                edited: false,
                checked: false,
              })
            );
            setSalesRepresentative(updatedSalesReps);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    };

    const handleNameChange = (value, index) => {
      const updatedData = [...salesRepresentative];

      updatedData[index] = {
        ...updatedData[index],
        distributor_name: value,
        edited: true, // Set edited flag to true
      };
      setSalesRepresentative(updatedData);
    };
    const handleEmailChange = (value, index) => {
      const updatedData = [...salesRepresentative];
      updatedData[index] = {
        ...updatedData[index],
        email: value,
        edited: true, // Set edited flag to true
      };
      setSalesRepresentative(updatedData);
    };

    const handleContactNumberChange = (value, index) => {
      const updatedData = [...salesRepresentative];
      updatedData[index] = {
        ...updatedData[index],
        phone: value,
        edited: true, // Set edited flag to true
      };
      setSalesRepresentative(updatedData);
    };

    const handleEditBusiness = () => {
      // setTextEdit(!textEdit);
      const editedReps = salesRepresentative.filter((rep) => rep.edited);
      console.log(editedReps, "----edit");
      const payload = {
        company_name: businessName,
        salesRepresentatives: editedReps.map((rep) => ({
          phone: rep.phone,
          email: rep.email,
          distributor_name: rep.distributor_name,
          user_id: rep._id,
        })),
      };

      setIsLoading(true);
      dispatch(call_Edit_business_details(payload))
        .then((res) => {
          console.log("res edit business detail api --", res);
          if (res.payload.status == 200) {
            setTextEdit(false);
            // dispatch(call_AdminCaompanyDetail());
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err edit business detail api --", err);
        });
    };

    const handleDelete = (val) => {
      const a = salesRepresentative.filter((rep) => rep.checked);
      console.log("****aaaa", a);
      if (a.length == 0) {
        return handleShowAlert("Select sales representative");
      }
      // call_DeleteSalesUser_API
      setIsLoading(true);
      dispatch(call_DeleteSalesUser_API(selectedId))
        .then((res) => {
          if (res.payload.status === 200) {
            dispatch(call_AdminCaompanyDetail());
            setIsLoading(false);
          } else {
            console.log("err delete sales---", res.payload);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err- delete user", err);
        });
    };

    const handleCheck = (index, id) => {
      let updated_checkboxes = [...salesRepresentative];
      updated_checkboxes[index].checked = !updated_checkboxes[index].checked;
      setSalesRepresentative(updated_checkboxes);
      setselectedId(id);
      // setSalesRepresentative((prevState) =>
      //   prevState.map((rep, i) =>
      //     i === index ? { ...rep, checked: true } : { ...rep, checked: false }
      //   )
      // );
    };

    return (
      <View
        style={{
          ...styles.container,
          // flex: 0,
          // height: responsiveHeight(100),
          // marginBottom: 120,
          // paddingBottom: -10,
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
          <Modal animated={true} transparent={true} visible={isLoading}>
            <Loading />
          </Modal>
          <CustomAlert
            visible={showAlert}
            message={alertMessage} // Pass the dynamic message
            onClose={handleCloseAlert}
          />
          <View
            style={{
              ...styles.topRow,
              paddingHorizontal: moderateScale(20),
              marginTop: moderateScaleVertical(25),
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Text style={styles.boldAndSmallFont}>Business Name</Text>
              {/* <TouchableOpacity
                onPress={() => {
                  textEdit == false ? setTextEdit(true) : handleEditBusiness();
                }}
                activeOpacity={0.6}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={imagePath.highlighterIcon}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
                <TextView
                  textSty={{
                    fontSize: 14,
                    lineHeight: 14,
                    color: Colors.lightgray,
                  }}>
                  Edit
                </TextView>
              </TouchableOpacity> */}
            </View>

            {console.log("businessName++++++=", businessName)}
            <InputFields
              placeholder={"Business Name"}
              value={businessName}
              onChangeText={(e) => setbusinessName(e)}
              editDisabled={textEdit}
              textInputFocused={{
                ...styles.textBoxSty,
                fontWeight: "700",
                color: Colors.black,
              }}
              textInput={{
                ...styles.textBoxSty,
                fontWeight: "700",
                color: Colors.black,
              }}
              maxlength={15}
            />
          </View>
          {/* {console.log(salesRepresentative, "salesRepresentative--")} */}
          {salesRepresentative?.map((representative, index) => (
            <View key={index}>
              <View style={styles.topBox}>
                <View style={styles.flexBetween}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Text style={{ ...styles.boldAndSmallFont }}>
                        Sales Representative
                      </Text>
                      {/* <TouchableOpacity
                        // onPress={() => handleCheck(index, representative._id)}
                        >
                        <Image
                          source={
                            representative.checked
                              ? imagePath.fullCheckBoxIcon
                              : imagePath.CheckBoxIcon
                          }
                          resizeMode="contain"
                          style={{
                            left: 3,
                            width: responsiveWidth(6),
                            height: responsiveHeight(6),
                          }}
                        />
                      </TouchableOpacity> */}
                    </View>

                    <View style={{}}>
                      <InputFields
                        value={`${representative.distributor_name}`}
                        onChangeText={(value) => handleNameChange(value, index)}
                        keyboardType="email-address"
                        placeholder={"Tarek Gray"}
                        editDisabled={textEdit}
                        textInputFocused={styles.textBoxSty}
                        textInput={styles.textBoxSty}
                        maxlength={25}
                        textContentType="emailAddress"
                        autoComplete="email"
                      />
                    </View>
                  </View>
                  {salesRepresentative[0]?.company_logo && (
                    <View>
                      <Image
                        source={{ uri: salesRepresentative[0]?.company_logo }}
                        // resizeMode="contain"
                        style={{
                          // left: 3,
                          width: 100,
                          height: 50,
                          marginBottom: 10,
                        }}
                      />
                    </View>
                  )}
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    // marginTop: 15,
                  }}>
                  {representative.phone?.length > 6 && (
                    <View>
                      <Text style={styles.boldAndSmallFont}>
                        Contact Number
                      </Text>
                      <InputFields
                        value={representative.phone}
                        onChangeText={(value) =>
                          handleContactNumberChange(value, index)
                        }
                        keyboardType="numeric"
                        placeholder={"Tarek Gray"}
                        // value={contactNumber || "+44 2458 2365"}
                        // onChangeText={(e) => setContactNumber(e)}
                        editDisabled={textEdit}
                        textInputFocused={styles.textBoxSty}
                        textInput={styles.textBoxSty}
                        maxlength={15}
                      />
                    </View>
                  )}
                  <View>
                    <Text style={styles.boldAndSmallFont}>Email</Text>
                    <InputFields
                      value={representative.email}
                      onChangeText={(value) => handleEmailChange(value, index)}
                      keyboardType="email-address"
                      placeholder={"Tarek Gray"}
                      // value={email || item?.email}
                      // onChangeText={(e) => setEmail(e)}
                      editDisabled={textEdit}
                      textInputFocused={styles.textBoxSty}
                      textInput={styles.textBoxSty}
                      maxlength={25}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}

          {salesRepresentative?.length !== 0 && (
            <>
              <View
                style={[
                  styles.flexStyles,
                  {
                    marginTop: 20,
                    // marginHorizontal: 20,
                    // justifyContent: "space-between",
                    justifyContent: "space-around",
                  },
                ]}>
                {/* <Button
                  onClick={() => {
                    handleDelete();
                  }}
                  allButtonSty={{
                    backgroundColor: "black",
                    borderRadius: 10,
                    // width: "29%",
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.white}
                  btnColor="#fff"
                  btnName="Delete"
                /> */}
                <Button
                  onClick={() => {
                    textEdit == false
                      ? setTextEdit(true)
                      : handleEditBusiness();
                  }}
                  buttonColor={Colors.black}
                  btnName={
                    textEdit == false
                      ? "Edit Business Details"
                      : "Update Business Details"
                  }
                  allButtonSty={{
                    borderRadius: 10,
                    width: "88%",
                    marginHorizontal: 0,
                    paddingVertical: 3,
                  }}
                />
              </View>
            </>
          )}

          <Button
            allButtonSty={styles.ButtonStyle}
            buttonColor={Colors.white}
            btnName="Perform Risk Assessment"
            onClick={() => {
              setManageLocationScreens("Risk_Assessment");
              dispatch(NewLocation({ New_Location: "Risk Assessment" }));
              dispatch(addCompInfoVal("aa"));
            }}></Button>
          {compLocation?.map((item, index) => {
            console.log("log index---", index);
            if (index % 2 === 0) {
              return CommonDetailsComponent(Colors.white, item);
            } else {
              return CommonDetailsComponent("#04783533", item);
            }
          })}
          {/* {CommonDetailsComponent(Colors.white)}

        <View style={{ marginTop: 10 }}>
          {CommonDetailsComponent("#04783533")}
        </View> */}

          <View style={{ margin: 35 }}>
            <Button
              allButtonSty={{ borderRadius: 10 }}
              buttonColor={Colors.black}
              btnName="Add Location"
              onClick={() => {
                dispatch(NewLocation({ New_Location: "New Location" }));
                dispatch(addCompInfoVal("aa"));
                setManageLocationScreens("New Location");
              }}></Button>
          </View>
        </ScrollView>
      </View>
    );
  };

  const AddNewLocation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isEnableds, setIsEnableds] = useState(false);
    const [superAdmin, setSuperAdmin] = useState(null);
    const [assignApprover, setAssignApprover] = useState(null);
    const [selectAdmin, setSelectAdmin] = useState("");
    const [selectApprover, setSelectApprover] = useState("");

    const [countryName, setCountryName] = useState("GB");
    const [country_Code, set_Country_Code] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [allPostCode, setallPostCode] = useState([]);
    const [city, setCity] = useState("");
    const [county, setCounty] = useState("");
    const [country, setCountry] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [address, setAddress] = useState("");

    const handleShowAlert = (message) => {
      setAlertMessage(message); // Set the dynamic message
      setShowAlert(true);
    };

    const handleCloseAlert = () => {
      setShowAlert(false);
    };
    // console.log(country_Code, "country_Code");

    useEffect(() => {
      const info = countryPhoneCodes.filter((el) => {
        return el.code === countryName;
      });
      if (info.length > 0) {
        console.log("hksjadahsd", JSON.stringify(info));
        set_Country_Code(info[0].dial_code);
      }
    }, [countryName]);

    const handleSelect = (item) => {
      setSelectAdmin(item);
    };

    const handleSelects = (item) => {
      setSelectApprover(item);
    };

    const handleAddressSubmit = async (address) => {
      getCurrentLocation();
      console.log(address, "----add address---", location);
      setCoordinates({ latitude: location?.lat, longitude: location?.lng });
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
        "Success, location saved",
        Toast.SHORT,
        Toast.CENTER,
        {
          textColor: Colors.primary,
          backgroundColor: Colors.white,
          tapToDismissEnabled: true,
        }
      );
    };

    console.log(coordinates, "----coordinates", location);
    const handleAddLocation = (val) => {
      if (location?.lat == null || location?.lng == null) {
        // return handleShowAlert("Plesase enter correct location name");
        showSettingsAlert();
        return;
      }
      if (val.city == "" && city == "") {
        return handleShowAlert("Please enter city.");
      }
      if (val.County == "" && county == "") {
        return handleShowAlert("Please enter county.");
      }
      if (selectedCountry?.label == null && country == "") {
        return handleShowAlert("Please select country.");
      }
      if (selectAdmin == "") {
        return handleShowAlert("Please select assigned super admin.");
      }
      // if (selectApprover == "") {
      //   return alert("Please select assigned approver.");
      // }
      handleAddressSubmit(
        val.address,
        country !== ""
          ? country
          : selectedCountry == null
          ? ""
          : selectedCountry?.label
      );
      setIsLoading(true);
      const payload = {
        location_name: val.address,
        street: val.street,
        city: val.city || city,
        county: val.County || county,
        country:
          country !== ""
            ? country
            : selectedCountry == null
            ? ""
            : selectedCountry?.label,

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
      console.log(payload, "-----payloadvalue");
      dispatch(call_AdminAddLocation(payload))
        .then((res) => {
          if (res.payload.status === 200) {
            showToastWithGravityAndOffset();

            setTimeout(() => {
              setIsLoading(false);

              dispatch(addCompInfoVal("bb"));
              dispatch(NewLocation({}));

              setManageLocationScreens("companyInfo");
            }, 5000);
          } else {
            handleShowAlert(res.payload.message);
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

    // const getLocationPermission = async () => {
    //   if (Platform.OS === "ios") {
    //     return true;
    //   }
    //   console.log("---granted");
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     {
    //       title: "Location Permission",
    //       message:
    //         "We need access to your location to show your current address",
    //       buttonNeutral: "Ask Me Later",
    //       buttonNegative: "Cancel",
    //       buttonPositive: "OK",
    //     }
    //   );
    //   console.log(granted, "---granted");
    //   return granted === PermissionsAndroid.RESULTS.GRANTED;
    // };

    // //this method use to find current location
    // const getCurrentLocation = async () => {
    //   const hasLocationPermission = await getLocationPermission();
    //   if (!hasLocationPermission) {
    //     return;
    //   }

    //   Geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords;
    //       console.log(latitude, "--position", longitude);
    //       setLocation({ lat: latitude, lng: longitude });

    //       // fetchAddress(latitude, longitude);
    //     },
    //     (error) => {
    //       console.error(error);
    //       // alert("Please enable GPS in your settings to use location features.");
    //     },
    //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //   );
    // };
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
        "Please turn on GPS in settings to add a new location.",
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

    const fetchAddress = async (latitude, longitude) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      try {
        const response = await axios.get(url);
        if (response.data && response.data.display_name) {
          setAddress(response.data.display_name);
        } else {
          alert("Address not found");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching address");
      }
    };

    return (
      <Formik
        initialValues={{
          address: "",
          street: "",
          city: "",
          County: "",
          zipCode: "",
          Number: "",
          business_email: "",
        }}
        validationSchema={CompanyInfoSchema(countryName, country_Code)}
        onSubmit={(values) => handleAddLocation(values)}>
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
              <CustomAlert
                visible={showAlert}
                message={alertMessage} // Pass the dynamic message
                onClose={handleCloseAlert}
              />
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
                  // value={address}
                  // onChangeText={(text) => setAddress(text)}
                  onSubmitEditing={(e) =>
                    handleAddressSubmit(e.nativeEvent.text)
                  }
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
                    <TextView textSty={{ fontSize: 14 }}>
                      {country_Code}
                    </TextView>
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
                  type="treatment"
                  userList
                  onSelect={handleSelect}
                  placeholder="Assigned Super Admin"
                  data={superAdmin}
                />
                <CustomDropdown
                  userList
                  type="treatment"
                  onSelect={handleSelects}
                  placeholder="Assigned Approver"
                  data={assignApprover}
                />
              </View>

              <View
                style={{
                  marginVertical: 25,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "95%",
                }}>
                <View style={{ width: "49%" }}>
                  <Button
                    allButtonSty={{ borderRadius: 10 }}
                    buttonColor={Colors.black}
                    btnName={
                      newLocation.New_Location === "Update Locaion"
                        ? "Update"
                        : "Add Location"
                    }
                    onClick={handleSubmit}></Button>
                </View>
                <View style={{ width: "49%" }}>
                  <Button
                    onClick={() => {
                      // navigation?.goBack();
                      setManageLocationScreens("companyInfo");
                    }}
                    allButtonSty={{
                      backgroundColor: "black",
                      borderRadius: 10,
                      // width: "29%",
                      marginHorizontal: 0,
                    }}
                    buttonColor={Colors.white}
                    btnColor="#fff"
                    btnName="Cancel"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    );
  };

  const RenderConditionalScreens = () => {
    switch (manageLocationScreens) {
      case "companyInfo":
        return <CompanyDetails />;
      case "New Location":
        return <AddNewLocation />;
      case "Risk_Assessment":
        return <RiskAssessment navigation={navigation} />;
      case "Update Location":
        return (
          <UpdateLocation setManageLocationScreens={setManageLocationScreens} />
        );
      default:
        return <CompanyDetails />; // Set default value to CompanyDetails
    }
  };
  // const renderSwicthComponent = {
  //   MANAGE_USERS: <ManageUsers />,
  //   REGISTER_USER: <RegisterUser navigation={navigation} />,
  // };

  useEffect(() => {
    if (compInfoRedux == "bb") {
      setManageLocationScreens("companyInfo");
    }
  }, [compInfoRedux]);

  console.log("isFocused--", isFocused, "--", manageLocationScreens);
  return <RenderConditionalScreens />;
};
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
    paddingHorizontal: 25,
  },
  textBoxSty: {
    borderWidth: 0,
    marginTop: -10,
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

export default CompanyInformation;

// import React, { useState, useEffect } from "react";
// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Modal,
//   Switch,
//   RefreshControl,
// } from "react-native";
// import Colors from "../../Styles/Colors";
// import Button from "../../Components/Button";
// import InputFields from "../../Components/InputFields";
// import CustomDropdown from "../../Components/CustomDropdown";
// import CountryPicker, {
//   getAllCountries,
//   FlagType,
// } from "react-native-country-picker-modal";
// import imagePath from "../../Constant/imagePath";
// import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
// import {
//   height,
//   moderateScale,
//   moderateScaleVertical,
// } from "../../Styles/responsiveSize";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   NewLocation,
//   addCompInfoVal,
//   addLocationItem,
// } from "../../redux/reducer/auth";
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from "react-native-responsive-dimensions";
// import axios from "axios";
// import { countryNames } from "../../redux/action/CountryDataAction";

// import TextView from "../../Components/TextView";
// import countryPhoneCodes from "../../Constant/country-phones.json";
// import Toast from "react-native-simple-toast";
// import {
//   call_AdminAddLocation,
//   call_AdminApprover,
//   call_AdminCaompanyDetail,
//   call_DeleteSalesUser_API,
//   call_Edit_business_details,
// } from "../../redux/action/AdminAction";
// import { Formik } from "formik";
// import { CompanyInfoSchema, SignUpSchema } from "../../utils/Validation";
// import Loading from "../../Components/Loading";
// import { useIsFocused } from "@react-navigation/native";
// import RiskAssessment from "../Admin/RiskAssessment";
// import navigationString from "../../Navigations/navigationString";
// import UpdateLocation from "./UpdateLocation";
// import CustomAlert from "../../Components/CustomAlert";
// import Geolocation from "react-native-geolocation-service";

// const CompanyInformation = ({ titleName, navigation }) => {
//   const newLocation = useSelector((state) => state.auth.nav);
//   const dispatch = useDispatch();
//   const isFocused = useIsFocused();
//   const compInfoRedux = useSelector((state) => state.auth.compInfo);
//   const [manageLocationScreens, setManageLocationScreens] =
//     useState("companyInfo");

//   const CommonDetailsComponent = (color, item) => {
//     console.log("sagdajsdkhads", item);
//     return (
//       <View
//         style={{
//           backgroundColor: color,
//           paddingHorizontal: moderateScale(10),
//         }}>
//         <View style={[styles.flexContainer, { marginTop: 20 }]}>
//           <View style={{ width: "50%" }}>
//             <View>
//               <Text style={styles.boldAndSmallFont}>Location Name</Text>
//               <Text style={styles.normalFont}>{item?.location_name}</Text>
//             </View>
//             <View>
//               <Text style={styles.boldAndSmallFont}>
//                 House Number and Street Name
//               </Text>
//               <Text style={styles.normalFont}>{item?.street}</Text>
//             </View>
//             <View>
//               <Text style={styles.boldAndSmallFont}>City / Town</Text>
//               <Text style={styles.normalFont}>{item?.city}</Text>
//             </View>
//             <View>
//               <Text style={styles.boldAndSmallFont}>Country</Text>
//               <Text style={styles.normalFont}>{item?.country}</Text>
//             </View>
//           </View>
//           <View style={{ width: "50%" }}>
//             {/* <Image
//               resizeMode="stretch"
//               source={imagePath.Map}
//               style={{ height: 125, width: 150 }}
//             /> */}
//             <TouchableOpacity
//               onPress={() => {
//                 // setManageLocationScreens("New Location");
//                 dispatch(addLocationItem(item));
//                 setManageLocationScreens("Update Location");
//                 dispatch(NewLocation({ New_Location: "Update Locaion" }));
//                 dispatch(addCompInfoVal("aa"));
//               }}
//               activeOpacity={0.6}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "flex-end",
//               }}>
//               <Image
//                 source={imagePath.highlighterIcon}
//                 resizeMode="contain"
//                 style={{ width: 25, height: 25 }}
//               />
//               <TextView
//                 textSty={{
//                   fontSize: 14,
//                   lineHeight: 14,
//                   color: Colors.lightgray,
//                 }}>
//                 Edit
//               </TextView>
//             </TouchableOpacity>
//             <View>
//               {/* {console.log("lat long type", parseInt(item.latitude))} */}
//               <MapView
//                 provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//                 style={{
//                   height: responsiveHeight(20),
//                   width: responsiveWidth(43),
//                   // height: 200,
//                   // width: 200,
//                 }}
//                 initialRegion={{
//                   latitude: parseFloat(item?.latitude),
//                   longitude: parseFloat(item?.longitude),
//                   // latitude: 53.08701,
//                   // longitude: -2.26527,
//                   // latitudeDelta: 0.0017,
//                   // longitudeDelta: 0.0035,
//                   latitudeDelta: 0.05,
//                   longitudeDelta: 0.05,
//                 }}>
//                 {/* Marker */}
//                 <Marker
//                   coordinate={{
//                     latitude: parseFloat(item?.latitude),
//                     longitude: parseFloat(item?.longitude),
//                     // latitude: 53.08701,
//                     // longitude: -2.26527,
//                   }}
//                   title={item?.location_name}
//                   // description={"Your Marker Description"}
//                 />
//               </MapView>
//             </View>

//             <View>
//               <Text style={styles.boldAndSmallFont}>Post Code</Text>
//               <Text style={styles.normalFont}>{item?.zip_code}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.horizontalLine} />

//         <View style={[styles.flexContainer, { marginLeft: 5 }]}>
//           <View style={{ width: "50%" }}>
//             <Text style={styles.boldAndSmallFont}>Email</Text>
//             <Text style={styles.normalFont}>{item?.business_email}</Text>
//           </View>

//           <View style={{ width: "50%" }}>
//             {item?.telephone?.length > 6
//               ? item?.telephone !== null &&
//                 item?.telephone !== "undefined undefined" && (
//                   <>
//                     <Text style={styles.boldAndSmallFont}>Contact</Text>
//                     <Text style={styles.normalFont}>{item?.telephone}</Text>
//                   </>
//                 )
//               : null}
//           </View>
//         </View>

//         <View style={[styles.flexContainer, { marginLeft: 5 }]}>
//           <View style={{ width: "50%" }}>
//             <Text style={styles.boldAndSmallFont}>Assigned Super Admin</Text>
//             <Text style={styles.normalFont}>{item?.assigned_admin_name}</Text>
//           </View>

//           <View style={{ width: "50%" }}>
//             {item?.assigned_approver_name !== null && (
//               <>
//                 <Text style={styles.boldAndSmallFont}>Assigned Approver</Text>
//                 <Text style={styles.normalFont}>
//                   {item?.assigned_approver_name}
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const CompanyDetails = () => {
//     const [compLocation, setCompLocation] = useState(null);
//     const [salesRepresentative, setSalesRepresentative] = useState([]);
//     const [selectedId, setselectedId] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const [businessName, setbusinessName] = useState(null);
//     const [refreshing, setIsrefreshing] = useState(false);
//     const [textEdit, setTextEdit] = useState(false);
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState("");

//     const handleShowAlert = (message) => {
//       setAlertMessage(message); // Set the dynamic message
//       setShowAlert(true);
//     };

//     const handleCloseAlert = () => {
//       setShowAlert(false);
//     };

//     const onRefresh = () => {
//       setIsrefreshing(true); // Set refreshing to true to show the spinner
//       showLocation(); // Call the function to fetch new data
//       setIsrefreshing(false);
//     };

//     console.log(
//       businessName,
//       "--",
//       salesRepresentative?.length,
//       "-----compLocation-----",
//       compLocation
//     );

//     useEffect(() => {
//       showLocation();
//     }, []);

//     const showLocation = () => {
//       setIsLoading(true);
//       dispatch(call_AdminCaompanyDetail())
//         .then((res) => {
//           console.log("company detail res", JSON.stringify(res.payload));
//           if (res.payload.status == 200) {
//             setbusinessName(res?.payload?.company?.company_name);
//             setCompLocation(res?.payload?.locations);
//             // Update each sales representative object with 'edited' flag
//             const updatedSalesReps = res?.payload?.salesRepresentatives.map(
//               (rep) => ({
//                 ...rep,
//                 edited: false,
//                 checked: false,
//               })
//             );
//             setSalesRepresentative(updatedSalesReps);
//             setIsLoading(false);
//           } else {
//             setIsLoading(false);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           setIsLoading(false);
//         });
//     };

//     const handleNameChange = (value, index) => {
//       const updatedData = [...salesRepresentative];

//       updatedData[index] = {
//         ...updatedData[index],
//         full_name: value,
//         edited: true, // Set edited flag to true
//       };
//       setSalesRepresentative(updatedData);
//     };
//     const handleEmailChange = (value, index) => {
//       const updatedData = [...salesRepresentative];
//       updatedData[index] = {
//         ...updatedData[index],
//         email: value,
//         edited: true, // Set edited flag to true
//       };
//       setSalesRepresentative(updatedData);
//     };

//     const handleContactNumberChange = (value, index) => {
//       const updatedData = [...salesRepresentative];
//       updatedData[index] = {
//         ...updatedData[index],
//         phone: value,
//         edited: true, // Set edited flag to true
//       };
//       setSalesRepresentative(updatedData);
//     };

//     const handleEditBusiness = () => {
//       // setTextEdit(!textEdit);
//       const editedReps = salesRepresentative.filter((rep) => rep.edited);
//       const payload = {
//         company_name: businessName,
//         salesRepresentatives: editedReps.map((rep) => ({
//           phone: rep.phone,
//           email: rep.email,
//           full_name: rep.full_name,
//           user_id: rep._id,
//         })),
//       };

//       setIsLoading(true);
//       dispatch(call_Edit_business_details(payload))
//         .then((res) => {
//           console.log("res edit business detail api --", res);
//           if (res.payload.status == 200) {
//             setTextEdit(false);
//             // dispatch(call_AdminCaompanyDetail());
//             setIsLoading(false);
//           } else {
//             setIsLoading(false);
//           }
//         })
//         .catch((err) => {
//           setIsLoading(false);
//           console.log("err edit business detail api --", err);
//         });
//     };

//     const handleDelete = (val) => {
//       const a = salesRepresentative.filter((rep) => rep.checked);
//       console.log("****aaaa", a);
//       if (a.length == 0) {
//         return handleShowAlert("Select sales representative");
//       }
//       // call_DeleteSalesUser_API
//       setIsLoading(true);
//       dispatch(call_DeleteSalesUser_API(selectedId))
//         .then((res) => {
//           if (res.payload.status === 200) {
//             dispatch(call_AdminCaompanyDetail());
//             setIsLoading(false);
//           } else {
//             console.log("err delete sales---", res.payload);
//             setIsLoading(false);
//           }
//         })
//         .catch((err) => {
//           setIsLoading(false);
//           console.log("err- delete user", err);
//         });
//     };

//     const handleCheck = (index, id) => {
//       let updated_checkboxes = [...salesRepresentative];
//       updated_checkboxes[index].checked = !updated_checkboxes[index].checked;
//       setSalesRepresentative(updated_checkboxes);
//       setselectedId(id);
//       // setSalesRepresentative((prevState) =>
//       //   prevState.map((rep, i) =>
//       //     i === index ? { ...rep, checked: true } : { ...rep, checked: false }
//       //   )
//       // );
//     };

//     return (
//       <View
//         style={{
//           ...styles.container,
//           // flex: 0,
//           // height: responsiveHeight(100),
//           // marginBottom: 120,
//           // paddingBottom: -10,
//         }}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#9Bd35A", "#689F38"]}
//               // tintColor="#689F38" // Android only
//               // title="Pull to refresh" // iOS only
//             />
//           }>
//           <Modal animated={true} transparent={true} visible={isLoading}>
//             <Loading />
//           </Modal>
//           <CustomAlert
//             visible={showAlert}
//             message={alertMessage} // Pass the dynamic message
//             onClose={handleCloseAlert}
//           />
//           <View
//             style={{
//               ...styles.topRow,
//               paddingHorizontal: moderateScale(20),
//               marginTop: moderateScaleVertical(25),
//             }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}>
//               <Text style={styles.boldAndSmallFont}>Business Name</Text>
//               {/* <TouchableOpacity
//                 onPress={() => {
//                   textEdit == false ? setTextEdit(true) : handleEditBusiness();
//                 }}
//                 activeOpacity={0.6}
//                 style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Image
//                   source={imagePath.highlighterIcon}
//                   resizeMode="contain"
//                   style={{ width: 25, height: 25 }}
//                 />
//                 <TextView
//                   textSty={{
//                     fontSize: 14,
//                     lineHeight: 14,
//                     color: Colors.lightgray,
//                   }}>
//                   Edit
//                 </TextView>
//               </TouchableOpacity> */}
//             </View>

//             {console.log("businessName++++++=", businessName)}
//             <InputFields
//               placeholder={"Business Name"}
//               value={businessName}
//               onChangeText={(e) => setbusinessName(e)}
//               editDisabled={textEdit}
//               textInputFocused={{
//                 ...styles.textBoxSty,
//                 fontWeight: "700",
//                 color: Colors.black,
//               }}
//               textInput={{
//                 ...styles.textBoxSty,
//                 fontWeight: "700",
//                 color: Colors.black,
//               }}
//               maxlength={15}
//             />
//           </View>
//           {console.log(salesRepresentative, "salesRepresentative--")}
//           {salesRepresentative?.map((representative, index) => (
//             <View key={index}>
//               <View style={styles.topBox}>
//                 <View style={styles.flexBetween}>
//                   <View>
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}>
//                       <Text style={styles.boldAndSmallFont}>
//                         Sales Representative
//                       </Text>
//                       <TouchableOpacity
//                         onPress={() => handleCheck(index, representative._id)}>
//                         <Image
//                           source={
//                             representative.checked
//                               ? imagePath.fullCheckBoxIcon
//                               : imagePath.CheckBoxIcon
//                           }
//                           resizeMode="contain"
//                           style={{
//                             left: 3,
//                             width: responsiveWidth(6),
//                             height: responsiveHeight(6),
//                           }}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                     <View style={{ marginTop: -15 }}>
//                       <InputFields
//                         value={`${representative.full_name}`}
//                         onChangeText={(value) => handleNameChange(value, index)}
//                         keyboardType="email-address"
//                         placeholder={"Tarek Gray"}
//                         editDisabled={textEdit}
//                         textInputFocused={styles.textBoxSty}
//                         textInput={styles.textBoxSty}
//                         maxlength={25}
//                       />
//                     </View>
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     flexDirection: "row",
//                     // marginTop: 15,
//                   }}>
//                   {representative.phone?.length > 6 && (
//                     <View>
//                       <Text style={styles.boldAndSmallFont}>
//                         Contact Number
//                       </Text>
//                       <InputFields
//                         value={representative.phone}
//                         onChangeText={(value) =>
//                           handleContactNumberChange(value, index)
//                         }
//                         keyboardType="numeric"
//                         placeholder={"Tarek Gray"}
//                         // value={contactNumber || "+44 2458 2365"}
//                         // onChangeText={(e) => setContactNumber(e)}
//                         editDisabled={textEdit}
//                         textInputFocused={styles.textBoxSty}
//                         textInput={styles.textBoxSty}
//                         maxlength={15}
//                       />
//                     </View>
//                   )}
//                   <View>
//                     <Text style={styles.boldAndSmallFont}>Email</Text>
//                     <InputFields
//                       value={representative.email}
//                       onChangeText={(value) => handleEmailChange(value, index)}
//                       keyboardType="email-address"
//                       placeholder={"Tarek Gray"}
//                       // value={email || item?.email}
//                       // onChangeText={(e) => setEmail(e)}
//                       editDisabled={textEdit}
//                       textInputFocused={styles.textBoxSty}
//                       textInput={styles.textBoxSty}
//                       maxlength={25}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </View>
//           ))}

//           {salesRepresentative?.length !== 0 && (
//             <>
//               <View
//                 style={[
//                   styles.flexStyles,
//                   {
//                     marginTop: 20,
//                     // marginHorizontal: 20,
//                     // justifyContent: "space-between",
//                     justifyContent: "space-around",
//                   },
//                 ]}>
//                 <Button
//                   onClick={() => {
//                     handleDelete();
//                   }}
//                   allButtonSty={{
//                     backgroundColor: "black",
//                     borderRadius: 10,
//                     // width: "29%",
//                     marginHorizontal: 0,
//                   }}
//                   buttonColor={Colors.white}
//                   btnColor="#fff"
//                   btnName="Delete"
//                 />
//                 <Button
//                   onClick={() => {
//                     textEdit == false
//                       ? setTextEdit(true)
//                       : handleEditBusiness();
//                   }}
//                   buttonColor={Colors.black}
//                   btnName={
//                     textEdit == false
//                       ? "Edit Business Details"
//                       : "Update Business Details"
//                   }
//                   allButtonSty={{
//                     borderRadius: 10,
//                     // width: "75%",
//                     marginHorizontal: 0,
//                   }}
//                 />
//               </View>
//             </>
//           )}

//           <Button
//             allButtonSty={styles.ButtonStyle}
//             buttonColor={Colors.white}
//             btnName="Perform Risk Assessment"
//             onClick={() => {
//               setManageLocationScreens("Risk_Assessment");
//               dispatch(NewLocation({ New_Location: "Risk Assessment" }));
//               dispatch(addCompInfoVal("aa"));
//             }}></Button>
//           {compLocation?.map((item, index) => {
//             console.log("log index---", index);
//             if (index % 2 === 0) {
//               return CommonDetailsComponent(Colors.white, item);
//             } else {
//               return CommonDetailsComponent("#04783533", item);
//             }
//           })}
//           {/* {CommonDetailsComponent(Colors.white)}

//         <View style={{ marginTop: 10 }}>
//           {CommonDetailsComponent("#04783533")}
//         </View> */}

//           <View style={{ margin: 35 }}>
//             <Button
//               allButtonSty={{ borderRadius: 10 }}
//               buttonColor={Colors.black}
//               btnName="Add Location"
//               onClick={() => {
//                 dispatch(NewLocation({ New_Location: "New Location" }));
//                 dispatch(addCompInfoVal("aa"));
//                 setManageLocationScreens("New Location");
//               }}></Button>
//           </View>
//         </ScrollView>
//       </View>
//     );
//   };

//   const AddNewLocation = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [coordinates, setCoordinates] = useState(null);
//     const [selectedCountry, setSelectedCountry] = useState(null);
//     const [isEnableds, setIsEnableds] = useState(false);
//     const [superAdmin, setSuperAdmin] = useState(null);
//     const [assignApprover, setAssignApprover] = useState(null);
//     const [selectAdmin, setSelectAdmin] = useState("");
//     const [selectApprover, setSelectApprover] = useState("");

//     const [countryName, setCountryName] = useState("GB");
//     const [country_Code, set_Country_Code] = useState("");
//     const [modalVisible, setModalVisible] = useState(false);

//     const [allPostCode, setallPostCode] = useState([]);
//     const [city, setCity] = useState("");
//     const [county, setCounty] = useState("");
//     const [country, setCountry] = useState("");
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState("");
//     const [location, setLocation] = useState({ lat: null, lng: null });
//     const [address, setAddress] = useState("");

//     const handleShowAlert = (message) => {
//       setAlertMessage(message); // Set the dynamic message
//       setShowAlert(true);
//     };

//     const handleCloseAlert = () => {
//       setShowAlert(false);
//     };
//     // console.log(country_Code, "country_Code");

//     useEffect(() => {
//       const info = countryPhoneCodes.filter((el) => {
//         return el.code === countryName;
//       });
//       if (info.length > 0) {
//         console.log("hksjadahsd", JSON.stringify(info));
//         set_Country_Code(info[0].dial_code);
//       }
//     }, [countryName]);

//     const handleSelect = (item) => {
//       setSelectAdmin(item);
//     };

//     const handleSelects = (item) => {
//       setSelectApprover(item);
//     };

//     const handleAddressSubmit = async (address) => {
//       getCurrentLocation();
//       console.log(address, "----add address---", location);
//       setCoordinates({ latitude: location?.lat, longitude: location?.lng });
//       // try {
//       //   const response = await axios.get(
//       //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       //       address
//       //     )}`
//       //   );
//       //   // console.log("get address ===", response);
//       //   if (response.data && response.data.length > 0) {
//       //     const { lat, lon } = response.data[0];
//       //     setCoordinates({ latitude: lat, longitude: lon });
//       //   } else {
//       //     // Handle no results found
//       //     setCoordinates(null);
//       //   }
//       // } catch (error) {
//       //   // Handle error
//       //   console.error("Error fetching coordinates:", error);
//       // }
//     };

//     const handleSelectCountry = (item) => {
//       // console.log("item----", item);
//       setSelectedCountry(item);
//     };

//     useEffect(() => {
//       dispatch(call_AdminApprover())
//         .then((res) => {
//           console.log("assignrole---", res.payload);
//           if (res.payload.status == 200) {
//             setSuperAdmin(res.payload.data.Superadmins);
//             setAssignApprover(res.payload.data.Approvers);
//           }
//         })
//         .catch((err) => console.log(err));
//     }, []);

//     const showToastWithGravityAndOffset = () => {
//       Toast.showWithGravity(
//         "Success, location saved",
//         Toast.SHORT,
//         Toast.CENTER,
//         {
//           textColor: Colors.primary,
//           backgroundColor: Colors.white,
//           tapToDismissEnabled: true,
//         }
//       );
//     };

//     const handleAddLocation = (val) => {
//       // Alert.alert("location added successfully");
//       console.log(coordinates, "----coordinates");
//       if (
//         coordinates?.latitude == undefined ||
//         coordinates?.longitude == undefined
//       ) {
//         return handleShowAlert("Plesase enter correct location name");
//       }
//       if (val.city == "" && city == "") {
//         return handleShowAlert("Please enter city.");
//       }
//       if (val.County == "" && county == "") {
//         return handleShowAlert("Please enter county.");
//       }
//       if (selectedCountry?.label == null && country == "") {
//         return handleShowAlert("Please select country.");
//       }
//       if (selectAdmin == "") {
//         return handleShowAlert("Please select assigned super admin.");
//       }
//       // if (selectApprover == "") {
//       //   return alert("Please select assigned approver.");
//       // }
//       handleAddressSubmit(
//         val.address,
//         country !== ""
//           ? country
//           : selectedCountry == null
//           ? ""
//           : selectedCountry?.label
//       );
//       setIsLoading(true);
//       const payload = {
//         location_name: val.address,
//         street: val.street,
//         city: val.city || city,
//         county: val.County || county,
//         country:
//           country !== ""
//             ? country
//             : selectedCountry == null
//             ? ""
//             : selectedCountry?.label,

//         zip_code: val.zipCode,
//         country_code: country_Code,
//         contact_number: val.Number,
//         assigned_admin_id: selectAdmin?._id,
//         assigned_approver_id: selectApprover?._id,
//         longitude: coordinates?.longitude,
//         latitude: coordinates?.latitude,
//         business_email: val.business_email,
//         is_remote_location: isEnableds,
//       };
//       console.log(payload, "-----payloadvalue");
//       dispatch(call_AdminAddLocation(payload))
//         .then((res) => {
//           if (res.payload.status === 200) {
//             showToastWithGravityAndOffset();
//             setTimeout(() => {
//               setIsLoading(false);
//               setManageLocationScreens("companyInfo");
//             }, 5000);
//           } else {
//             handleShowAlert(res.payload.message);
//             setIsLoading(false);
//             console.log("res.payload.message--", res.payload);
//           }
//         })
//         .catch((err) => {
//           setIsLoading(false);
//           console.log(err);
//         });
//     };

//     // Function to handle country selection from modal
//     const handleCountrySelect = (selected) => {
//       setCountryName(selected.cca2);
//       setModalVisible(false); // Close the modal after selecting a country
//     };

//     // Function to handle opening of the modal
//     const handleOpenModal = () => {
//       setModalVisible(true);
//     };

//     // Function to handle closing of the modal
//     const handleCloseModal = () => {
//       setModalVisible(false);
//     };

//     const fetchCityAndCountry = async (postalCode) => {
//       console.log("Fetching city and country for postal code:", postalCode);

//       try {
//         const countryCode = "GB"; // Country code for United Kingdom
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&countrycodes=${countryCode}&format=json&addressdetails=1`
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch data. Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Response data:", data);

//         if (data && data.length > 0) {
//           const city = data[0].address.municipality;
//           const county = data[0].address.county;
//           const country = data[0].address.country;

//           // Update the state variables with the retrieved data
//           setCity(city);
//           setCounty(county);
//           setCountry(country);
//           setallPostCode(data);
//         } else {
//           console.error("No city and country data found in response.");
//         }
//       } catch (error) {
//         console.error("Error fetching city and country:", error.message);
//       }
//     };

//     const getLocationPermission = async () => {
//       if (Platform.OS === "ios") {
//         return true;
//       }

//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: "Location Permission",
//           message:
//             "We need access to your location to show your current address",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK",
//         }
//       );

//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     };

//     //this method use to find current location
//     const getCurrentLocation = async () => {
//       const hasLocationPermission = await getLocationPermission();
//       if (!hasLocationPermission) {
//         return;
//       }

//       Geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ lat: latitude, lng: longitude });

//           // fetchAddress(latitude, longitude);
//         },
//         (error) => {
//           console.error(error);
//           alert("Error getting location");
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     };

//     const fetchAddress = async (latitude, longitude) => {
//       const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
//       try {
//         const response = await axios.get(url);
//         if (response.data && response.data.display_name) {
//           setAddress(response.data.display_name);
//         } else {
//           alert("Address not found");
//         }
//       } catch (error) {
//         console.error(error);
//         alert("Error fetching address");
//       }
//     };

//     return (
//       <Formik
//         initialValues={{
//           address: "",
//           street: "",
//           city: "",
//           County: "",
//           zipCode: "",
//           Number: "",
//           business_email: "",
//         }}
//         validationSchema={CompanyInfoSchema(countryName, country_Code)}
//         onSubmit={(values) => handleAddLocation(values)}>
//         {({
//           handleChange,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//           setFieldTouched,
//         }) => (
//           // <KeyboardAvoidingView
//           // behavior={Platform.OS === "ios" ? "padding" : "null"}
//           // style={{ flex: 1 }}></KeyboardAvoidingView>
//           <View style={styles.container}>
//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               automaticallyAdjustKeyboardInsets={true}>
//               <Modal animated={true} transparent={true} visible={isLoading}>
//                 <Loading />
//               </Modal>
//               <CustomAlert
//                 visible={showAlert}
//                 message={alertMessage} // Pass the dynamic message
//                 onClose={handleCloseAlert}
//               />
//               <Text
//                 style={[
//                   styles.boldAndLargeFont,
//                   { textAlign: "center", marginTop: moderateScaleVertical(20) },
//                 ]}>
//                 Enter your business information
//               </Text>
//               <View style={{ paddingHorizontal: 20 }}>
//                 <InputFields
//                   placeholder="Location Name"
//                   // value={address}
//                   // onChangeText={(text) => setAddress(text)}
//                   onSubmitEditing={(e) =>
//                     handleAddressSubmit(e.nativeEvent.text)
//                   }
//                   onChangeText={(text) => {
//                     handleChange("address")(text); // Update the form field value
//                     handleAddressSubmit(text); // Call handleAddressSubmit with the updated text
//                   }}
//                   value={values.address}
//                   handleBlurs={() => setFieldTouched("address")}
//                 />
//                 {touched.address && errors.address && (
//                   <TextView textSty={{ color: Colors.danger }}>
//                     {errors.address}
//                   </TextView>
//                 )}
//                 {/* {console.log(coordinates)} */}

//                 <InputFields
//                   placeholder="Street Address"
//                   // value={street}
//                   // onChangeText={(text) => setStreet(text)}
//                   onChangeText={handleChange("street")}
//                   value={values.street}
//                   handleBlurs={() => setFieldTouched("street")}
//                 />
//                 {touched.street && errors.street && (
//                   <TextView textSty={{ color: Colors.danger }}>
//                     {errors.street}
//                   </TextView>
//                 )}
//                 <View
//                   style={{
//                     width: "100%",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     // gap: 10,
//                     justifyContent: "space-between",
//                   }}>
//                   <View style={{ width: "49%" }}>
//                     <InputFields
//                       placeholder="City"
//                       onChangeText={handleChange("city")}
//                       // value={values.city}
//                       value={values.city || city}
//                       handleBlurs={() => setFieldTouched("city")}
//                     />
//                     {touched.city && errors.city && (
//                       <TextView textSty={{ color: Colors.danger }}>
//                         {errors.city}
//                       </TextView>
//                     )}
//                   </View>
//                   <View style={{ width: "49%" }}>
//                     <InputFields
//                       placeholder="County"
//                       onChangeText={handleChange("County")}
//                       // value={values.County}
//                       value={values.County || county}
//                       handleBlurs={() => setFieldTouched("County")}
//                     />
//                     {touched.County && errors.County && (
//                       <TextView textSty={{ color: Colors.danger }}>
//                         {errors.County}
//                       </TextView>
//                     )}
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     width: "100%",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}>
//                   <View style={{ width: "49%" }}>
//                     <CustomDropdown
//                       countryNames
//                       type="countryName"
//                       placeholder={country == "" ? "Country" : country}
//                       data={countryNames}
//                       changeColor={{
//                         color:
//                           selectedCountry !== null
//                             ? Colors.black
//                             : country == ""
//                             ? Colors.lightgray
//                             : Colors.black,
//                       }}
//                       onSelect={handleSelectCountry}
//                     />
//                   </View>
//                   <View style={{ width: "49%" }}>
//                     <InputFields
//                       placeholder="Post Code"
//                       // value={zipCode}
//                       // onChangeText={(text) => setZipCode(text)}
//                       onChangeText={(text) => {
//                         handleChange("zipCode")(text);
//                         fetchCityAndCountry(text);
//                       }}
//                       value={values.zipCode}
//                       handleBlurs={() => setFieldTouched("zipCode")}
//                     />

//                     {touched.zipCode && errors.zipCode && (
//                       <TextView textSty={{ color: Colors.danger }}>
//                         {errors.zipCode}
//                       </TextView>
//                     )}
//                   </View>
//                 </View>
//                 {allPostCode.length > 0 &&
//                   allPostCode
//                     // .filter((item) => item.address.city)
//                     .map((item, index) => {
//                       console.log(item);
//                       return (
//                         <View
//                           style={
//                             {
//                               // height: 42,
//                             }
//                           }>
//                           <ScrollView
//                             nestedScrollEnabled={true}
//                             style={{
//                               // maxHeight: 150,
//                               // marginTop: 5,
//                               borderWidth: 1,
//                               borderColor: "#cdcdcd",
//                               paddingVertical: 5,
//                             }}>
//                             <TouchableOpacity
//                               key={index}
//                               onPress={() => {
//                                 setCity(item.address.city);
//                                 setCounty(item.address.county);
//                                 setCountry(item.address.country);
//                                 setallPostCode([]);
//                               }}>
//                               <TextView
//                                 textSty={{
//                                   marginTop: 10,
//                                   marginLeft: 15,
//                                   fontSize: 14,
//                                 }}>
//                                 {/* {`${item.address?.postcode} ${item.address.country}`} */}
//                                 <Text>
//                                   {item.address?.postcode}{" "}
//                                   {item.address.city == undefined
//                                     ? null
//                                     : item.address.city}{" "}
//                                   {item.address.county == undefined
//                                     ? null
//                                     : item.address.county}{" "}
//                                   {item.address.country}
//                                 </Text>
//                                 {/* {`${item.address?.postcode} ${item.address.city} ${item.address.county} ${item.address.country}`} */}
//                               </TextView>
//                             </TouchableOpacity>
//                           </ScrollView>
//                         </View>
//                       );
//                     })}

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     marginTop: 20,
//                   }}>
//                   <View
//                     style={{
//                       alignSelf: "flex-start",
//                       borderColor: Colors.lightgray,
//                       borderWidth: 0.7,
//                       borderRadius: 20,
//                       backgroundColor:
//                         isEnableds == false ? Colors.white : Colors.secondary,
//                     }}>
//                     <Switch
//                       trackColor={{
//                         true: Colors.secondary,
//                         false: Colors.white,
//                       }}
//                       thumbColor={Colors.white}
//                       onValueChange={() => setIsEnableds(!isEnableds)}
//                       value={isEnableds}
//                       style={{
//                         transform: [{ scaleX: 1 }, { scaleY: 1 }],
//                       }}
//                     />
//                   </View>
//                   <TextView textSty={{ marginLeft: 5 }}>
//                     This is a remote location
//                   </TextView>
//                 </View>
//                 <View style={styles.horizontalLine} />
//                 <InputFields
//                   placeholder="Business Email"
//                   autoCapitalize
//                   keyboardType="email-address"
//                   onChangeText={handleChange("business_email")}
//                   value={values.business_email}
//                   handleBlurs={() => setFieldTouched("business_email")}
//                 />
//                 {touched.business_email && errors.business_email && (
//                   <TextView textSty={{ color: Colors.danger }}>
//                     {errors.business_email}
//                   </TextView>
//                 )}

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       width: "29%",
//                       height: 40,
//                       alignItems: "center",
//                       alignSelf: "center",
//                       marginTop: 20,
//                       borderWidth: 1,
//                       borderColor: Colors.dividerLight,
//                       borderRadius: 5,
//                       justifyContent: "space-evenly",
//                     }}>
//                     <View style={{ marginRight: -13 }}>
//                       <View>
//                         <CountryPicker
//                           {...{
//                             countryCode: countryName,
//                             withFilter: true,
//                             withFlag: true,
//                             withAlphaFilter: true,
//                             // onSelect: (selected) => {
//                             //   setCountryName(selected.cca2);
//                             // },
//                             onClose: handleCloseModal,
//                             visible: modalVisible,
//                             onSelect: (selected) => {
//                               handleCountrySelect(selected);
//                             },
//                           }}

//                           // visible={false}
//                         />
//                       </View>
//                     </View>
//                     <TextView textSty={{ fontSize: 14 }}>
//                       {country_Code}
//                     </TextView>
//                     {/* <Image
//                       source={imagePath.downArrow}
//                       resizeMode="contain"
//                       style={{ width: 10, height: 10, paddingLeft: 10 }}
//                      /> */}
//                     <TouchableOpacity onPress={() => handleOpenModal()}>
//                       <Image
//                         source={imagePath.downArrow}
//                         resizeMode="contain"
//                         style={{
//                           width: 10,
//                           height: 10,
//                           paddingLeft: 10,
//                         }}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                   <View style={{ width: "70%" }}>
//                     <InputFields
//                       placeholder="Number"
//                       keyboardType="phone-pad"
//                       // onChangeText={(text) => setNumber(text)}
//                       // value={Number}
//                       onChangeText={handleChange("Number")}
//                       value={values.Number}
//                       handleBlurs={() => setFieldTouched("Number")}
//                     />
//                   </View>
//                 </View>
//                 {touched.Number && errors.Number && (
//                   <TextView textSty={{ color: Colors.danger }}>
//                     {errors.Number}
//                   </TextView>
//                 )}
//                 <CustomDropdown
//                   type="treatment"
//                   userList
//                   onSelect={handleSelect}
//                   placeholder="Assigned Super Admin"
//                   data={superAdmin}
//                 />
//                 <CustomDropdown
//                   userList
//                   type="treatment"
//                   onSelect={handleSelects}
//                   placeholder="Assigned Approver"
//                   data={assignApprover}
//                 />
//               </View>

//               <View
//                 style={{
//                   marginVertical: 25,
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   width: "95%",
//                 }}>
//                 <View style={{ width: "49%" }}>
//                   <Button
//                     allButtonSty={{ borderRadius: 10 }}
//                     buttonColor={Colors.black}
//                     btnName={
//                       newLocation.New_Location === "Update Locaion"
//                         ? "Update"
//                         : "Add Location"
//                     }
//                     onClick={handleSubmit}></Button>
//                 </View>
//                 <View style={{ width: "49%" }}>
//                   <Button
//                     onClick={() => {
//                       // navigation?.goBack();
//                       setManageLocationScreens("companyInfo");
//                     }}
//                     allButtonSty={{
//                       backgroundColor: "black",
//                       borderRadius: 10,
//                       // width: "29%",
//                       marginHorizontal: 0,
//                     }}
//                     buttonColor={Colors.white}
//                     btnColor="#fff"
//                     btnName="Cancel"
//                   />
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         )}
//       </Formik>
//     );
//   };

//   const RenderConditionalScreens = () => {
//     switch (manageLocationScreens) {
//       case "companyInfo":
//         return <CompanyDetails />;
//       case "New Location":
//         return <AddNewLocation />;
//       case "Risk_Assessment":
//         return <RiskAssessment navigation={navigation} />;
//       case "Update Location":
//         return (
//           <UpdateLocation setManageLocationScreens={setManageLocationScreens} />
//         );
//       default:
//         return <CompanyDetails />; // Set default value to CompanyDetails
//     }
//   };
//   // const renderSwicthComponent = {
//   //   MANAGE_USERS: <ManageUsers />,
//   //   REGISTER_USER: <RegisterUser navigation={navigation} />,
//   // };

//   useEffect(() => {
//     if (compInfoRedux == "bb") {
//       setManageLocationScreens("companyInfo");
//     }
//   }, [compInfoRedux]);

//   console.log("isFocused--", isFocused, "--", manageLocationScreens);
//   return <RenderConditionalScreens />;
// };
// const styles = StyleSheet.create({
//   boldAndSmallFont: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: Colors.black,
//   },
//   boldAndLargeFont: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: Colors.black,
//     marginTop: 8,
//   },
//   topRow: { paddingVertical: 10, paddingHorizontal: 10, marginTop: 10 },
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   normalFont: { fontSize: 14, fontWeight: "400" },

//   flexStyles: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   horizontalLine: {
//     borderWidth: 1,
//     borderColor: "#17171780",
//     width: "100%",
//     marginTop: 15,
//   },
//   flexContainer: {
//     width: "100%",
//     display: "flex",
//     paddingHorizontal: 10,
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//   },
//   flexBetween: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   topBox: {
//     width: "100%",
//     backgroundColor: "#04783533",
//     marginTop: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//   },
//   textBoxSty: {
//     borderWidth: 0,
//     marginTop: -10,
//     marginLeft: -10,
//   },
//   ButtonStyle: {
//     width: "88%",
//     alignSelf: "center",
//     borderRadius: 10,
//     marginVertical: 20,
//     backgroundColor: Colors.primary,
//     paddingVertical: 3,
//   },
// });

// export default CompanyInformation;
