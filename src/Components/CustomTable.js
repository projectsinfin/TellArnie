import React, { useEffect, useState } from "react";
import countryPhoneCodes from "../Constant/country-phones.json";
import {
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../Styles/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from "../Styles/responsiveSize";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import TextView from "./TextView";
import ModalScreen from "./ModalScreen";
import { useDispatch, useSelector } from "react-redux";
import { addAdminUserId } from "../redux/reducer/auth";
import {
  call_EditUser_API,
  call_edit_UserDetails,
  call_get_UserInfo,
} from "../redux/action/AdminAction";
import InputFields from "./InputFields";
import DatePicker from "./DatePicker";
import imagePath from "../Constant/imagePath";
import DocumentPicker from "react-native-document-picker";
import Button from "./Button";
import CustomDropdown from "./CustomDropdown";
import { call_GetLocation_API } from "../redux/action/KitInstallationAction";
import CountryPicker from "react-native-country-picker-modal";

const CustomTable = ({
  columns,
  rowsData,
  type,
  headerText,
  isApproved,
  setSwicthScreens,
  completeDelete,
}) => {
  // const userDatas = useSelector(
  //   (state) => state?.editUserDetails?.editUserDetails?.data
  // );
  const dispatch = useDispatch();
  const [keepUpdateModal, setKeepUpdateModal] = useState(false);
  const [isEnabled5, setIsEnabled5] = useState(false);
  const [allLocation, setAllLocation] = useState(null);
  const [selectedlocation, setSelectedLocation] = useState(null);
  const [editUserItemId, setEditUserItemId] = useState(null);
  const [dates, setDates] = useState("");
  const [pdfUri, setPdfUri] = useState(null);
  const [userId, setUserId] = useState();
  const [userDatas, setUserDatas] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [countryName, setCountryName] = useState("GB");
  const [country_Code, set_Country_Code] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    {
      id: "1",
      label: "Super Admin",
    },
    {
      id: "2",
      label: "Admin",
    },
    {
      id: "3",
      label: "Staff",
    },
    {
      id: "4",
      label: "Approver",
    },
  ];
  const newArray = userDatas?.user_details?.permissions[0]?.split(",");
  useEffect(() => {
    if (userDatas) {
      setName({ value: userDatas?.user_details?.first_name || "", err: "" });
      setSurName({ value: userDatas?.user_details?.last_name || "", err: "" });
      setArea({ value: "", err: "" });
      setEmail({ value: userDatas?.user_details?.email || "", err: "" });
      setContact({
        value: userDatas?.user_details?.contact_number || "",
        err: "",
      });
      setRole({
        value:
          userDatas?.user_details?.assigned_role === "user"
            ? "Staff"
            : userDatas?.user_details?.assigned_role || "",
        err: "",
      });
      setStatus({ value: userDatas?.user_details?.status, err: "" });
      setIsEnabled5(userDatas?.user_details?.is_firstaid_certified);
      setPdfUri(userDatas?.user_details?.firstaid_certificate);
      setDates(userDatas?.user_details?.firstaid_certificate_date);

      setSwitche({
        Share_Incidents:
          newArray == undefined ? false : newArray?.includes("Share_Incidents"),
        Access_Kits:
          newArray == undefined ? false : newArray?.includes("Access_Kits"),
      });
      setSwitches({
        Incidents_Via_Email:
          newArray == undefined
            ? false
            : newArray?.includes("Incidents_Via_Email"),
        Access_Incidents:
          newArray == undefined
            ? false
            : newArray?.includes("Access_Incidents"),
      });
      // setAllLocation(userDatas?.user_details?.location_name);
    }
  }, [userDatas]);

  const [surName, setSurName] = useState({
    value: "",
    err: "",
  });

  const [name, setName] = useState({
    value: "",
    err: "",
  });

  const [area, setArea] = useState({
    value: "",
    err: "",
  });
  const [email, setEmail] = useState({
    value: "",
    err: "",
  });
  const [contact, setContact] = useState({
    value: "",
    err: "",
  });
  const [role, setRole] = useState({
    value: "",
    err: "",
  });
  const [status, setStatus] = useState({
    value: "",
    err: "",
  });

  const [switches, setSwitches] = useState({
    Incidents_Via_Email: false,
    Access_Incidents: false,
    // Incidents_Via_Email:
    //   newArray == undefined ? false : newArray?.includes("Incidents_Via_Email"),
    // Access_Incidents:
    //   newArray == undefined ? false : newArray?.includes("Access_Incidents"),
  });

  const [switche, setSwitche] = useState({
    Share_Incidents: false,
    Access_Kits: false,

    // Share_Incidents:
    //   newArray == undefined ? false : newArray?.includes("Share_Incidents"),
    // Access_Kits:
    //   newArray == undefined ? false : newArray?.includes("Access_Kits"),
  });

  const toggleSwitchs = (key) => {
    setSwitches((prevSwitches) => ({
      ...prevSwitches,
      [key]: !prevSwitches[key],
    }));
  };

  const toggleSwitch = (key) => {
    setSwitche((prevSwitches) => ({
      ...prevSwitches,
      [key]: !prevSwitches[key],
    }));
  };

  // Function to format the switch name
  const formatSwitchName = (name) => {
    // Replace underscores with spaces
    return name.replace(/_/g, " ");
  };

  const handleOkbutton = () => {
    isApproved(userId, "Ok");
    setKeepUpdateModal(false);
  };
  const handleNobutton = () => {
    isApproved(userId, "No");
    setKeepUpdateModal(false);
  };

  const handleDateChange = (selectedDate) => {
    setDates(selectedDate);
    // Do something with the selected date, such as updating state
  };

  useEffect(() => {
    const info = countryPhoneCodes.filter((el) => {
      return el.code === countryName;
    });
    if (info.length > 0) {
      set_Country_Code(info[0].dial_code);
    }
  }, [countryName]);

  useEffect(() => {
    if (userDatas?.user_details?.country_code) {
      // If the user's country code is +91, set the country_Code to +91
      set_Country_Code(userDatas?.user_details?.country_code);
      // setCountryName("IN");
      const info = countryPhoneCodes.filter((el) => {
        return userDatas?.user_details?.country_code == el.dial_code
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
  }, [userDatas]);

  //functionality of upload pdf file
  const pickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setPdfUri(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log("Error picking PDF:", err);
      } else {
        console.log("User canceled the picker");
      }
    }
  };

  const handleSelect = (item) => {
    setSelectedLocation(item);
  };

  useEffect(() => {
    dispatch(call_GetLocation_API())
      .then((res) => {
        if (res.payload.status === 200) {
          setAllLocation(res.payload.locations);
        }
      })
      .catch((err) => console.log("get location err--", err));
  }, []);

  const handleRole = (item) => {
    setSelectedRole(item);
  };

  const separateAndCapitalize = (str) => {
    const index = str.indexOf("admin");
    if (index !== -1) {
      const superSubstring = str.substring(0, index);
      const adminSubstring = str.substring(index);
      const capitalizeFirstLetter = (word) =>
        word.charAt(0).toUpperCase() + word.slice(1);
      return [
        capitalizeFirstLetter(superSubstring),
        " ",
        capitalizeFirstLetter(adminSubstring),
      ];
    } else {
      return [str];
    }
  };

  //first_name:Naveen
  //last_name:dadhwal
  //location:Farnham Branch
  //country_code:+1
  //contact_number:55555678
  //employee_id:ABC007
  //job_title:Designer
  //assigned_role:superadmin
  //is_firstaid_certified:true
  //firstaid_certificate_date:2024-02-15
  // user_id:

  const handleUpdateProfile = (val) => {
    const vals = Object.keys(switches).filter((key) => switches[key]);
    const select = Object.keys(switche).filter((key) => switche[key]);
    const mergedArray = [...vals, ...select];

    const payload = new FormData();
    payload.append("first_name", name?.value);
    payload.append("last_name", surName?.value);
    payload.append(
      "location_id",
      selectedlocation?._id || userDatas?.user_details?.location_id
    );
    payload.append("country_code", country_Code);
    payload.append("contact_number", contact?.value);
    {
      payload.append(
        "assigned_role",
        selectedRole == null
          ? role?.value == "Staff"
            ? "user"
            : role?.value
          : selectedRole?.label === "Staff"
          ? "user"
          : selectedRole?.label?.replace(/\s+/g, "")?.toLowerCase()
      );
    }

    payload.append("permissions", mergedArray);

    payload.append("is_firstaid_certified", isEnabled5);

    var datestr = new Date(dates)?.toUTCString();
    {
      dates !== null && payload.append("firstaid_certificate_date", datestr);
    }
    // payload.append("is_mentally_fit", mentally);
    payload.append("user_id", val);

    {
      pdfUri !== null &&
        pdfUri[0]?.uri &&
        payload.append("firstaid_certificate", {
          uri: pdfUri[0].uri,
          type: "application/pdf",
          name: pdfUri[0].name,
        });
    }
    // console.log("payload---", JSON.stringify(payload));
    // setEditUserItemId(null);

    // setisLoadings(true);
    dispatch(call_edit_UserDetails(payload))
      .then((res) => {
        console.log("update profie----", res.payload);
        if (res.payload.status === 200) {
          setEditUserItemId(null);
          alert(res.payload.message);
        } else {
          // setisLoadings(false);
          // alert(res.payload.message);
        }
      })
      .catch((res) => {
        // setisLoadings(false);
        console.log(res);
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

  return (
    <View style={styles.table}>
      {/* Table Header */}
      {type === "manageUsers" ? (
        <View
          style={{
            flexDirection: "row",
            // height:Platform.OS==='ios'? responsiveHeight(6):responsiveHeight(4),
            alignItems: "center",
            paddingHorizontal: responsiveHeight(3),
            paddingVertical:
              Platform.OS === "ios" ? responsiveWidth(4) : responsiveWidth(3),
          }}>
          <View style={{ flex: 0.5 }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,

                fontWeight: "700",
              }}>
              {columns[0]}
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "flex-start",
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,
                fontWeight: "700",
                marginLeft: 10,
              }}>
              {columns[1]}
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "flex-start",
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,
                fontWeight: "700",
                marginLeft: 10,
              }}>
              {columns[2]}
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            // height:Platform.OS==='ios'? responsiveHeight(6):responsiveHeight(4),
            alignItems: "center",
            paddingHorizontal: responsiveHeight(3),
            paddingVertical:
              Platform.OS === "ios" ? responsiveWidth(4) : responsiveWidth(3),
          }}>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,
                fontWeight: "700",
              }}>
              {columns[0]}
            </Text>
          </View>
          <View style={{ flex: 3, alignItems: "center" }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,
                fontWeight: "700",
              }}>
              {columns[1]}
            </Text>
          </View>
          <View style={{ flex: 3, alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.5),
                color: Colors.black,
                lineHeight: 15,
                fontWeight: "700",
              }}>
              {columns[2]}
            </Text>
          </View>
        </View>
      )}
      {/* Table Body */}
      {type === "Dashboard"
        ? rowsData?.map((x, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.tableRow,
                  {
                    paddingHorizontal: responsiveHeight(3),
                    backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                  },
                ]}>
                <View
                  style={[
                    styles.cell,
                    {
                      flex: 4,
                      paddingHorizontal: 0,
                      alignItems: "flex-start",
                      backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                    },
                  ]}>
                  <Text style={styles.cellText}>{x.full_name}</Text>
                </View>
                <View
                  style={[
                    styles.cell,
                    {
                      flex: 3,
                      alignItems: "center",
                      backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                    },
                  ]}>
                  <Text style={styles.cellText}>{x.count}</Text>
                </View>
                <View
                  style={[
                    styles.cell,
                    {
                      flex: 3,
                      alignItems: "flex-end",
                      backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                    },
                  ]}>
                  <Text style={styles.cellText}>{x.rating}</Text>
                </View>
              </View>
            );
          })
        : type === "manageUsers"
        ? rowsData?.map((x, i) => {
            let assigned_role;

            switch (x.assigned_role) {
              case "salesrepresentative":
                assigned_role = "Sales Representative";
                break;
              case "admin":
                assigned_role = "Admin";
                break;
              case "superadmin":
                assigned_role = "Super Admin";
                break;
              case "approver":
                assigned_role = "Approver";
                break;
              case "user":
                assigned_role = "Staff";
                break;
              default:
                assigned_role = null;
            }

            let colorName;
            switch (x?.user_status) {
              // case "First Aid Expired":
              case "Training expired":
                colorName = "#FA0000";
                break;
              // case "First Aid compliant":
              case "First Aid Trained":
                colorName = "#047835";
                break;
              // case "First Aid Expires Soon":
              case "First Aid Training Expires Soon":
                colorName = "#FAA500";
                break;
              default:
                colorName = null;
            }

            return (
              <React.Fragment key={i}>
                {editUserItemId !== x._id ? (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(call_get_UserInfo(x?._id))
                        .then((res) => {
                          if (res.payload.status === 200) {
                            setUserDatas(res.payload?.data);
                            setEditUserItemId(x?._id);
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                      justifyContent: "space-between",
                      paddingHorizontal: moderateScale(20),
                    }}>
                    <View
                      style={{
                        backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                        flex: 0.5,
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            fontSize: 14,
                            fontWeight: "700",
                            color: Colors.black,
                          },
                        ]}>
                        {x.first_name + " " + x.last_name}
                      </Text>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            fontSize: 14,
                            fontWeight: "400",
                            color: Colors.black,
                          },
                        ]}>
                        {x.company_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        color: Colors.black,
                        flex: 0.5,
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            fontSize: 14,
                            fontWeight: "400",
                            color: Colors.black,
                            textAlign: "left",
                            marginLeft: 10,
                          },
                        ]}>
                        {assigned_role}
                      </Text>

                      {x?.user_status !== "" ? (
                        x?.user_status === "Pending Approval" ? (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                              borderRadius: 6,
                              width: Platform.OS === "ios" ? "62%" : 100,
                              backgroundColor: Colors.primary,
                              marginLeft: 10,
                              paddingHorizontal: 12,
                              paddingVertical: 2,
                            }}
                            onPress={() => {
                              setKeepUpdateModal(!keepUpdateModal);
                              setUserId(x);
                            }}>
                            <TextView
                              heading
                              headingTextSty={{
                                fontSize: 9,
                                lineHeight: 13.5,
                                color: Colors.white,
                              }}>
                              Pending Approval
                            </TextView>
                          </TouchableOpacity>
                        ) : (
                          <TextView
                            heading
                            headingTextSty={{
                              fontSize: 9,
                              lineHeight: 13.5,
                              color: colorName,
                              paddingHorizontal: 12,
                              paddingVertical: 2,
                              borderRadius: 6,
                            }}>
                            {x?.user_status}
                          </TextView>
                        )
                      ) : (
                        ""
                      )}
                    </View>
                    <View
                      style={{
                        backgroundColor: i % 2 === 0 ? "#B6DEC8" : Colors.white,
                        flex: 0.5,
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            fontSize: 14,
                            fontWeight: "400",
                            color: Colors.black,
                            textAlign: "left",
                            marginLeft: 10,
                          },
                        ]}>
                        {x?.location_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#04783533",
                      marginTop: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 25,
                    }}>
                    <TouchableOpacity
                      style={{
                        // backgroundColor: "red",
                        position: "absolute",
                        alignSelf: "flex-end",
                        // top: 15,
                        width: 40,
                        height: 40,
                        right: 10,
                      }}
                      onPress={() => setEditUserItemId(null)}>
                      <Image
                        source={imagePath.crossIcon}
                        // tintColor={Colors.black}
                        style={{
                          width: 20,
                          height: 20,
                          alignSelf: "center",
                          top: 20,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}>
                      <View style={{ width: "49%" }}>
                        <Text style={styles.boldAndSmallFont}>Name</Text>
                        <InputFields
                          value={name.value}
                          onChangeText={(e) => setName({ value: e, err: "" })}
                          placeholder={"Surname"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                        />
                      </View>

                      <View style={{ width: "49%" }}>
                        <Text style={styles.boldAndSmallFont}>Surname</Text>
                        <InputFields
                          value={surName.value}
                          onChangeText={(e) =>
                            setSurName({ value: e, err: "" })
                          }
                          placeholder={"Name"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          // maxlength={25}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomColor: "grey",
                        marginVertical: 20,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />
                    {/* Edit user item content */}
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}>
                      <View style={{ width: "49%" }}>
                        <Text style={styles.boldAndSmallFont}>Location</Text>
                        {/* <InputFields
                          value={location.value}
                          onChangeText={(e) =>
                            setLocation({ value: e, err: "" })
                          }
                          placeholder={"Location"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          // maxlength={15}
                        /> */}
                        {console.log("allLocation---", allLocation)}
                        <View style={{ marginTop: -15, width: 150 }}>
                          <CustomDropdown
                            // placeholder="Location"
                            type="location"
                            changeColor={{
                              color:
                                userDatas?.user_details?.location_name !==
                                  null || selectedlocation !== null
                                  ? Colors.black
                                  : Colors.lightgray,
                            }}
                            placeholder={
                              userDatas?.user_details?.location_name
                                ? userDatas?.user_details?.location_name
                                : "Location"
                            }
                            data={allLocation}
                            onSelect={handleSelect}
                          />
                        </View>
                      </View>

                      <View style={{ width: "49%" }}>
                        {/* <Text style={styles.boldAndSmallFont}>Area</Text>
                        <InputFields
                          value={area.value}
                          onChangeText={(e) => setArea({ value: e, err: "" })}
                          placeholder={"Area"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          // maxlength={25}
                        /> */}
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomColor: "grey",
                        marginVertical: 20,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />

                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // flexDirection: "row",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text style={styles.boldAndSmallFont}>Email</Text>
                        <InputFields
                          value={email.value}
                          onChangeText={(e) => setEmail({ value: e, err: "" })}
                          keyboardType="email-address"
                          placeholder={"Email"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          textContentType="emailAddress"
                          autoComplete="email"
                          // maxlength={15}
                        />
                      </View>
                      <View style={{ width: "100%", marginTop: 10 }}>
                        <Text style={styles.boldAndSmallFont}>Contact</Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}>
                          {/* {contact.value !== "" && (
                            // <TextView textSty={{ fontSize: 14, marginTop: -4 }}>
                            //   {countryCode}{" "}
                            // </TextView>
                           
                          )} */}

                          <View
                            style={{
                              flexDirection: "row",
                              width: "29%",
                              height: 40,
                              alignItems: "center",
                              alignSelf: "center",
                              // marginTop: 20,
                              // borderWidth: 1,
                              // borderColor: "lightgray",
                              borderRadius: 5,
                              justifyContent: "space-evenly",
                            }}>
                            <View style={{ marginRight: -13 }}>
                              <CountryPicker
                                {...{
                                  countryCode: countryName,
                                  withFilter: true,
                                  withFlag: true,
                                  withAlphaFilter: true,

                                  onClose: handleCloseModal,
                                  visible: modalVisible,
                                  onSelect: (selected) => {
                                    handleCountrySelect(selected);
                                  },
                                }}
                                // visible={false}
                              />
                            </View>

                            <TextView textSty={{ fontSize: 14 }}>
                              {country_Code ? country_Code : "+44"}
                            </TextView>

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

                          <InputFields
                            value={`${contact.value}`}
                            onChangeText={(e) =>
                              setContact({ value: e, err: "" })
                            }
                            placeholder={"Contact"}
                            textInputFocused={styles.textBoxSty}
                            textInput={styles.textBoxSty}
                            keyboardType="numeric"
                            // maxlength={25}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomColor: "grey",
                        marginVertical: 20,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />

                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}>
                      <View style={{ width: "49%" }}>
                        <Text style={styles.boldAndSmallFont}>Role</Text>
                        {/* <InputFields
                          value={role.value}
                          onChangeText={(e) => setRole({ value: e, err: "" })}
                          placeholder={"Role"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          // maxlength={15}
                        /> */}
                        <View style={{ marginTop: -15, width: 150 }}>
                          <CustomDropdown
                            changeColor={{
                              color: Colors.black,
                            }}
                            type={"countryName"}
                            placeholder={
                              role.value
                                ? ([capitalizedSuper, capitalizedAdmin] =
                                    separateAndCapitalize(role.value))
                                : "Assign Role"
                            }
                            data={data}
                            onSelect={handleRole}
                          />
                        </View>
                      </View>

                      <View style={{ width: "49%" }}>
                        <Text style={styles.boldAndSmallFont}>Status</Text>
                        <InputFields
                          editDisabled={false}
                          value={status.value}
                          onChangeText={(e) => setStatus({ value: e, err: "" })}
                          placeholder={"Status"}
                          textInputFocused={styles.textBoxSty}
                          textInput={styles.textBoxSty}
                          // maxlength={25}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomColor: "grey",
                        marginVertical: 20,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />

                    <View>
                      <Text style={styles.boldAndSmallFont}>Permissions</Text>

                      <View style={{ flexDirection: "row", marginTop: 15 }}>
                        {Object.keys(switches).map((key) => {
                          // console.log("select -key -", key);
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                // justifyContent: "space-between",

                                width: "50%",
                              }}>
                              <View
                                style={{
                                  alignSelf: "flex-start",
                                  backgroundColor:
                                    switches[key] == false
                                      ? Colors.white
                                      : Colors.secondary,

                                  // elevation: 0.01,
                                  borderColor: Colors.lightgray,
                                  borderWidth: 0.7,
                                  borderRadius: 20,
                                }}>
                                <Switch
                                  thumbColor={"#ffffff"}
                                  trackColor={{
                                    true: Colors.secondary,
                                    false: Colors.white,
                                  }}
                                  value={switches[key]}
                                  onValueChange={() => toggleSwitchs(key)}
                                />
                              </View>
                              <TextView textSty={{ marginLeft: 5 }}>
                                {formatSwitchName(key)}
                              </TextView>
                            </View>
                          );
                        })}
                      </View>

                      <View style={{ flexDirection: "row", marginTop: 15 }}>
                        {Object.keys(switche).map((key) => {
                          console.log("select -key -", key);
                          return (
                            // <View style={styles.switchContainer} key={key}>
                            //   <Switch
                            //     trackColor={{
                            //       true: Colors.secondary,
                            //       false: Colors.white,
                            //     }}
                            //     value={switche[key]}
                            //     onValueChange={() => toggleSwitch(key)}
                            //   />
                            //   <TextView textSty={{ marginLeft: 5 }}>
                            //     {formatSwitchName(key)}
                            //   </TextView>
                            // </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                // justifyContent: "space-between",

                                width: "50%",
                              }}>
                              <View
                                style={{
                                  alignSelf: "flex-start",
                                  backgroundColor:
                                    switche[key] == false
                                      ? Colors.white
                                      : Colors.secondary,

                                  // elevation: 0.01,
                                  borderColor: Colors.lightgray,
                                  borderWidth: 0.7,
                                  borderRadius: 20,
                                }}>
                                <Switch
                                  thumbColor={"#ffffff"}
                                  trackColor={{
                                    true: Colors.secondary,
                                    false: Colors.white,
                                  }}
                                  value={switche[key]}
                                  onValueChange={() => toggleSwitch(key)}
                                />
                              </View>
                              <TextView textSty={{ marginLeft: 5 }}>
                                {formatSwitchName(key)}
                              </TextView>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.boldAndSmallFont}>
                        First Aider Information
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor: isEnabled5
                              ? Colors.secondary
                              : Colors.white,

                            // elevation: 0.01,
                            borderColor: Colors.lightgray,
                            borderWidth: 0.7,
                            borderRadius: 20,
                          }}>
                          <Switch
                            trackColor={{
                              true: Colors.secondary,
                              false: Colors.white,
                            }}
                            thumbColor={isEnabled5 ? Colors.white : "#fff"}
                            onValueChange={() => setIsEnabled5(!isEnabled5)}
                            value={isEnabled5}
                            style={{
                              transform: [{ scaleX: 1 }, { scaleY: 1 }],
                            }}
                          />
                        </View>
                        <TextView textSty={{ marginLeft: 5 }}>
                          Certified First Aider
                        </TextView>
                      </View>

                      <View
                        style={{
                          backgroundColor: Colors.white,
                          marginTop: 10,
                          height: 50,
                        }}>
                        {/* <DatePicker
                          detePickerSty={{
                            marginTop: 0,
                            borderRadius: 5,
                            height: 50,
                          }}
                          onDateChange={handleDateChange}
                          disabled={!isEnabled5}
                        /> */}
                        <DatePicker
                          detePickerSty={{
                            marginTop: 0,
                            borderRadius: 5,
                            height: 50,
                          }}
                          showDates={
                            userDatas?.user_details?.firstaid_certificate_date
                          }
                          onDateChange={handleDateChange}
                          profile
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: moderateScaleVertical(20),
                        // height: moderateScale(60),
                      }}>
                      <View style={{ flex: 0.5 }}>
                        <Button
                          onClick={
                            () => {
                              pickPDF();
                            }
                            // navigation.navigate(navigationString.kitsInstallation)
                          }
                          allButtonSty={{
                            marginHorizontal: 0,
                          }}
                          buttonColor={Colors.black}
                          btnName="Add Certificate"
                        />
                      </View>
                      {pdfUri !== null && pdfUri !== "" && (
                        <View
                          style={{
                            flex: 0.5,
                            marginLeft: moderateScale(5),
                            flexDirection: "row",
                            alignItems: "center",
                          }}>
                          <Image
                            source={imagePath.PDF_file_icon}
                            resizeMode="contain"
                            style={{
                              width: moderateScale(18),
                              height: moderateScale(18),
                            }}
                          />
                          <TextView>
                            {/* {pdfUri !== null && pdfUri[0]?.name} */}
                            {(pdfUri !== null && pdfUri[0]?.name) ||
                              pdfUri?.substring(pdfUri?.lastIndexOf("/") + 1)}
                          </TextView>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        marginVertical: 15,
                        marginTop: 20,
                      }}>
                      <Button
                        allButtonSty={{
                          backgroundColor: Colors.black,
                          borderRadius: 10,
                          width: "35%",
                          marginHorizontal: 0,
                        }}
                        buttonColor={Colors.white}
                        btnName="Delete"
                        onClick={() => {
                          dispatch(call_EditUser_API(x._id))
                            .then((res) => {
                              console.log(res);
                              completeDelete(x._id);
                            })
                            .catch((err) => console.log(err));
                        }}
                      />
                      <Button
                        onClick={() => {
                          handleUpdateProfile(x._id);
                          // handleUpdateItem(item?._id);
                        }}
                        allButtonSty={{
                          alignSelf: "center",
                          width: "60%",
                          marginHorizontal: 0,
                          borderRadius: 10,
                        }}
                        buttonColor={Colors.black}
                        btnName="Update"
                      />
                    </View>
                  </View>
                )}
              </React.Fragment>
            );
          })
        : ""}

      <ModalScreen
        cross
        visible={keepUpdateModal}
        modalheading={"Approve User"}
        modalText={"Are you sure you want to approve this user?"}
        btnName="Make User"
        btnName1="Make Admin"
        // buttonColor={Colors.}
        // btnStyle={{ backgroundColor: Colors.black }}
        ModalBtn={{ width: "90%" }}
        ModalBtn1={{ width: "90%" }}
        modalButton1={() => {
          handleOkbutton();
          // setKeepUpdateModal(false);
        }}
        crossOnPress={() => {
          setKeepUpdateModal(false);
        }}
        modalButton={() => {
          handleNobutton();
          // setKeepUpdateModal(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: Colors.white,
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.black,
    fontSize: 14,
  },
  cellText: {
    // textAlign: 'left',
    color: Colors.black,
  },
  boldAndSmallFont: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.black,
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
    marginTop: -5,
    marginLeft: -10,
  },
});
export default CustomTable;
