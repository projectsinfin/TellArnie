// according to client changes

import {
  StyleSheet,
  Text,
  View,
  Modal,
  RefreshControl,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import imagePath from "../../Constant/imagePath";
import Loading from "../../Components/Loading";
import IncidentStyle from "../Incident/IncidentStyle";
import Colors from "../../Styles/Colors";
import TextView from "../../Components/TextView";
import AdminStyle from "./AdminStyle";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import InputFields from "../../Components/InputFields";
import CustomAlert from "../../Components/CustomAlert";
import CustomDropdown from "../../Components/CustomDropdown";
import { useIsFocused } from "@react-navigation/native";

const AreaRiskCalculator = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isEnableds, setIsEnableds] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [staffQuantity, setStaffQuantity] = useState("");
  const [vehiclesNumber, setVehiclesNumber] = useState("");
  const [evacuationNumber, setEvacuationNumber] = useState("");

  const [areaTotal, setAreaTotal] = useState("");

  const [switchData, setSwitchData] = useState({});
  const [Potential, setPotential] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // To keep track of the order of selections
  const [selectAed, setAed] = useState(null);
  const [clearDropdown, setClearDropdown] = useState(false);

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const potentialData = {
      "Body Spills": {
        check: false,
        RecommendedKits: 25 > Number(staffQuantity) ? [2717] : [718],
        // RecommendedKits: [2717, 718],
        text: "e.g. bodily fluids such as: blood, urine, vomit, etc.",
      },
      Burns: {
        check: false,
        RecommendedKits: 26 > Number(staffQuantity) ? [2030] : [124],
        text: "",
      },
      Chemicals: {
        check: false,
        RecommendedKits: [5996],
        text: "e.g. acid and alkali splashes to the eyes and skin.",
      },
      "Cutting Equipment": {
        check: false,
        RecommendedKits: [955],
        text: "",
      },
      "Eye Injury": {
        check: false,
        RecommendedKits: [955],
        text: "e.g. dust or debris, splashes, or foreign objects in eye",
      },
      "Heavy Machinery": {
        check: false,
        RecommendedKits: [955],
        text: "e.g. agricultural, construction, and/or warehouse vehicles",
      },
      "Mass Casualty": {
        check: false,
        RecommendedKits: [6743, 6745, 6741],
        text: "e.g. terrorist attack",
      },
      "Power Tools": {
        check: false,
        RecommendedKits: [6772],
        text: "",
      },
      "Sharp Objects": {
        check: false,
        RecommendedKits: 26 > Number(staffQuantity) ? [2721] : [988],
        text: "e.g. needles or scalpels",
      },
      "Transport Vehicles": {
        check: false,
        RecommendedKits: [3011],
        text: "",
      },
    };
    // Fetch your JSON data here or load it from a file
    const jsonData = {
      Agriculture: {
        check: false,
        Main_Group: "4",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
      Assembly_Work: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "e.g. production line, joinery etc.",
      },
      "Clerical Work": {
        check: false,
        Main_Group: "1",
        Sub_Group: "",
        Risk_Level: "Standard",
        text: "",
      },
      Commercial_Catering: {
        check: false,
        Main_Group: "1",
        Sub_Group: "",
        Risk_Level: "Standard",
        text: "e.g. restaurant, employee canteen etc.",
      },
      Construction: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
      Education: {
        check: false,
        Main_Group: "1",
        Sub_Group: "3",
        Risk_Level: "Standard",
        text: "e.g. schools, universities, colleges, nurseries, pre-schools etc.",
      },
      Engineering: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
      "Entertainment/Leisure Venue": {
        check: false,
        Main_Group: "1",
        Sub_Group: "3",
        Risk_Level: "High",
        text: "e.g. Theatre, concert venue, Cinema, sports clubs etc.",
      },
      "Facilities Management": {
        check: false,
        Main_Group: "4",
        Sub_Group: "",
        Risk_Level: "Standard",
        text: "e.g. grounds, maintenance etc.",
      },
      Food_Processing: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "e.g. food production line, bakery etc.",
      },
      Forestry: {
        check: false,
        Main_Group: "4",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
      Healthcare: {
        check: false,
        Main_Group: "4",
        Sub_Group: "",
        Risk_Level: "Standard",
        text: "",
      },
      Manufacturing: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
      Retail: {
        check: false,
        Main_Group: "1",
        Sub_Group: "3",
        Risk_Level: "Standard",
        text: "e.g. shops, supermarkets, trade merchants etc.",
      },

      Transport: {
        check: false,
        Main_Group: "2",
        Sub_Group: "3",
        Risk_Level: "Standard",
        text: "e.g. bus/train station, airport, coach, train etc.",
      },
      Warehouse: {
        check: false,
        Main_Group: "2",
        Sub_Group: "",
        Risk_Level: "High",
        text: "",
      },
    };
    // Set the JSON data to state
    setSwitchData(jsonData);
    setPotential(potentialData);
  }, [staffQuantity]);

  //handle low risk toggle
  const lowRisktoggleSwitchItem = (key) => {
    const updatedPotential = { ...switchData };
    // Set the value of the toggled switch to true
    updatedPotential[key].check = true;

    // Set the values of all other switches to false
    Object.keys(updatedPotential).forEach((potentialKey) => {
      if (potentialKey !== key) {
        updatedPotential[potentialKey].check = false;
      }
    });

    // Update the state with the new values
    setSwitchData(updatedPotential);
  };

  //handle high risk toggle
  const highRisktoggleSwitchItem = (key) => {
    setPotential((prevPotential) => ({
      ...prevPotential,
      [key]: {
        ...prevPotential[key],
        check: !prevPotential[key].check, // Toggle the check value
      },
    }));
  };

  // Function to format the switch name
  const formatSwitchName = (name) => {
    // Replace underscores with spaces
    return name.replace(/_/g, " ");
  };

  const staffData = [
    {
      id: "3",
      name: "First Aiders",
      number: "First Aiders",
    },
    {
      id: "1",
      name: "Security Staff (non first aider)",
      number: "Security",
    },
    {
      id: "2",
      name: "Cleaners (non first aider)",
      number: "Cleaners",
    },
  ];

  const findTrueItem = (obj) => {
    for (let key in obj) {
      if (obj[key] === true) {
        return key;
      }
    }
    return null; // If no item is true
  };
  const trueItem = findTrueItem(Potential);

  const [inputValues, setInputValues] = useState({});

  // const handleTextChange = (name, text) => {
  //   setInputValues((prevState) => ({
  //     ...prevState,
  //     [name]: text,
  //   }));
  // };
  const handleTextChange = (name, text) => {
    setInputValues((prevState) => {
      if (text.trim() === "") {
        // Create a copy of the current state without the key if the text is empty
        const { [name]: _, ...rest } = prevState;
        return rest;
      }
      return {
        ...prevState,
        [name]: text,
      };
    });
  };
 

  let totalPersonnel = Number(areaTotal) + Number(staffQuantity);


  const handleAEDType = (item) => {
    setAed(item);
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoading}>
        <Loading />
      </Modal>
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
      />
      <Header
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
      />

      <View style={{ flex: 1 }}>
        {/* Green section */}
        <TextView
          heading
          headingTextSty={{
            ...IncidentStyle.headingContainer,
            marginBottom: 20,
          }}>
          {route.params?.item?.area} Risk {"\n"} Calculator
        </TextView>

        {/* Rest of the content */}
        <View style={IncidentStyle.buttonContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                // onRefresh={handleRefresh}
                colors={[Colors.primary]} // Customize the colors of the refresh indicator
              />
            }
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <View style={{ paddingHorizontal: 20 }}>
              <TextView
                textSty={{ fontSize: 14, lineHeight: 21, marginVertical: 25 }}>
                Please ensure all questions are accurately answered as
                inaccuracies could result in safety kits being inadequately
                prepared.
              </TextView>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 0,
                }}>
                Area Personnel
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Maximum Employees
                  </TextView>
                  <TextView
                    heading
                    headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
                    The highest possible number of your team who frequents this
                    area.
                  </TextView>
                </View>
                <View
                  style={{
                    flex: 0.35,

                    // alignItems: "flex-end",
                  }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Staff Quantity
                  </TextView> */}

                  <InputFields
                    placeholder={"Staff Quantity"}
                    keyboardType="numeric"
                    value={staffQuantity}
                    onChangeText={(e) => setStaffQuantity(e)}
                    textInputFocused={{ marginTop: 0 }}
                    textInput={{ marginTop: 0 }}
                  />
                </View>
              </View>

              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Non-Employee
                  </TextView>
                </View>
                <View
                  style={{
                    flex: 0.35,
                    // alignItems: "flex-end",
                  }}>
                  <InputFields
                    placeholder={"Quantity"}
                    keyboardType="numeric"
                    value={areaTotal}
                    onChangeText={(e) => setAreaTotal(e)}
                    textInputFocused={{ marginTop: 0 }}
                    textInput={{ marginTop: 0 }}
                  />
                </View>
              </View> */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Total Personnel
                  </TextView>
                  <TextView
                    heading
                    headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
                    Everyone including employees, customers, visitors, couriers,
                    the public, etc.
                  </TextView>
                </View>
                <View
                  style={{
                    flex: 0.35,
                    // alignItems: "flex-end",
                  }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    {totalPersonnel}
                  </TextView> */}

                  <InputFields
                    // editDisabled={false}
                    placeholder={"Area Total"}
                    keyboardType="numeric"
                    value={areaTotal}
                    onChangeText={(e) => setAreaTotal(e)}
                    textInputFocused={{ marginTop: 0 }}
                    textInput={{ marginTop: 0 }}
                  />
                  {/* <InputFields
                    editDisabled={false}
                    placeholder={"Total"}
                    keyboardType="numeric"
                    value={totalPersonnel}
                    // onChangeText={(e) => setAreaTotal(e)}
                  /> */}
                </View>
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Activities Performed in Area
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 15,
                }}>
                Select only one.
              </TextView>
              {/* -------- low Risk View ----- */}
              <View style={{}}>
                {Object.keys(switchData).map((key) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 15,
                      }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor:
                            switchData[key].check === true
                              ? Colors.secondary
                              : Colors.white,

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
                          value={switchData[key].check}
                          onValueChange={() => lowRisktoggleSwitchItem(key)}
                        />
                      </View>
                      <View marginLeft={5}>
                        <Text
                          style={{
                            fontWeight: "400",
                            fontSize: 14,
                            lineHeight: 21,
                            color: Colors.black,
                          }}>
                          {formatSwitchName(key)}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 8,
                            lineHeight: 12,
                            fontFamily: "OpenSans-Bold",
                            color: "#A8A8BD",
                          }}>
                          {switchData[key].text}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Potential Risks
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 15,
                }}>
                Select all that apply.
              </TextView>
              {/* -------- potential Risk View ----- */}
              <View style={{}}>
                {Object.keys(Potential).map((key) => {
                  return (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 15,
                        }}>
                        <View
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor:
                              Potential[key].check === true
                                ? Colors.secondary
                                : Colors.white,

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
                            value={Potential[key].check}
                            onValueChange={() => highRisktoggleSwitchItem(key)}
                          />
                        </View>
                        <View marginLeft={5}>
                          <Text
                            style={{
                              fontWeight: "400",
                              fontSize: 14,
                              lineHeight: 21,
                              color: Colors.black,
                            }}>
                            {formatSwitchName(key)}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "700",
                              fontSize: 8,
                              lineHeight: 12,
                              fontFamily: "OpenSans-Bold",
                              color: "#A8A8BD",
                            }}>
                            {Potential[key].text}
                          </Text>
                        </View>
                      </View>
                    </>
                  );
                })}
                {Potential["Transport Vehicles"]?.check && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 15,
                      // flex: 1,
                    }}>
                    <View style={{ flex: 0.65 }}>
                      <TextView
                        textSty={{
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        How many vehicles
                      </TextView>
                    </View>
                    <View style={{ flex: 0.35 }}>
                      <InputFields
                        placeholder={"Number"}
                        keyboardType="numeric"
                        value={vehiclesNumber}
                        onChangeText={(e) => setVehiclesNumber(e)}
                        textInputFocused={{ marginTop: 0 }}
                        textInput={{ marginTop: 0 }}
                      />
                    </View>
                  </View>
                )}
              </View>
              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                AED
              </TextView>

              {/* ------------- AED view ------- */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor:
                      isEnabled == false ? Colors.white : Colors.secondary,
                    borderColor: Colors.lightgray,
                    borderWidth: 0.7,
                    borderRadius: 20,
                  }}>
                  <Switch
                    trackColor={{
                      false: Colors.white,
                      true: Colors.secondary,
                    }}
                    thumbColor={Colors.white}
                    onValueChange={() => setIsEnabled(!isEnabled)}
                    value={isEnabled}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <View marginLeft={5} flex={1}>
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: 14,
                      lineHeight: 21,
                      color: Colors.black,
                    }}>
                    Can you access an AED within 2 minutes?
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 8,
                      lineHeight: 12,
                      fontFamily: "OpenSans-Bold",
                      color: "#A8A8BD",
                    }}>
                    Consider public access AEDs
                  </Text>
                </View>
              </View>
              {!isEnabled && (
                <CustomDropdown
                  type="category"
                  placeholder="Select AED"
                  data={[
                    { id: 1, name: "Indoors" },
                    { id: 2, name: "Outdoors" },
                  ]}
                  onSelect={handleAEDType}
                  clearDropdown={clearDropdown}
                />
              )}

              {/* ----------- Evacuation Chair View---------- */}
              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                Evacuation Chair
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />
              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor:
                      isEnableds == false ? Colors.white : Colors.secondary,
                    borderColor: Colors.lightgray,
                    borderWidth: 0.7,
                    borderRadius: 20,
                  }}>
                  <Switch
                    trackColor={{
                      false: Colors.white,
                      true: Colors.secondary,
                    }}
                    thumbColor={Colors.white}
                    onValueChange={() => setIsEnableds(!isEnableds)}
                    value={isEnableds}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <View flex={1}>
                  <TextView
                    textSty={{
                      marginLeft: 5,
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Do you have stairs anywhere in your building?
                  </TextView>
                </View>
              </View> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.7 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    How many sets of stairs are in your building?
                  </TextView>
                </View>
                <View style={{ flex: 0.3 }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Area Total
                  </TextView> */}
                  <InputFields
                    placeholder={"Number"}
                    keyboardType="numeric"
                    value={evacuationNumber}
                    onChangeText={(e) => setEvacuationNumber(e)}
                    // editDisabled={isEnableds ? true : false}
                    textInputFocused={{ marginTop: 0 }}
                    textInput={{ marginTop: 0 }}
                  />
                </View>
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                Auxiliary Staff
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />
              <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 10,
                }}>
                Please enter the number of
              </TextView>

              {staffData.map((item) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 15,
                      flex: 1,
                    }}>
                    <View style={{ flex: 0.7 }}>
                      <TextView
                        textSty={{
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {item?.name}
                      </TextView>
                    </View>
                    <View flex={0.3}>
                      {/* <TextView
                        textSty={{
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {item?.number}
                      </TextView> */}
                      <InputFields
                        placeholder={item?.number}
                        keyboardType="numeric"
                        // editDisabled={isEnableds ? true : false}
                        textInputFocused={{ marginTop: 0 }}
                        textInput={{ marginTop: 0 }}
                        value={inputValues[item.name] || ""}
                        onChangeText={(text) =>
                          handleTextChange(item.name, text)
                        }
                      />
                    </View>
                  </View>
                );
              })}

              <Button
                allButtonSty={{
                  width: "70%",
                  alignSelf: "center",
                  marginVertical: 20,
                }}
                buttonColor={Colors.black}
                btnName="Get Results"
                onClick={() => {
                  pattern = /^\d+$/; // Regular expression to match integer values

                  const highRisk = (obj) => {
                    for (let key in obj) {
                      if (obj[key].check === true) {
                        return key;
                      }
                    }
                    return null; // If no item is true
                  };
                  const highRiskStatus = highRisk(switchData);

                  if (staffQuantity === "") {
                    return handleShowAlert("Staff quantity is required.");
                  }
                  if (isNaN(staffQuantity) || !pattern.test(staffQuantity)) {
                    setStaffQuantity(staffQuantity);
                    return handleShowAlert(
                      "Staff quantity must be a numeric value."
                    );
                  }
                  // if (areaTotal === "") {
                  //   return handleShowAlert("Total area is required.");
                  // }
                  if (highRiskStatus == null) {
                    return handleShowAlert("Select activities performed area.");
                  }

                  navigation.navigate(navigationString.areaRiskCalculator2, {
                    // maxQuantity: staffQuantity,
                    maxQuantity: totalPersonnel,
                    areaTotal: areaTotal,
                    potential: Potential, // Pass the updated Potential state
                    switchData: switchData,
                    item: route?.params?.item,
                    areaName: route?.params?.areaName,
                    areaId: route?.params?.areaId,
                    AED: isEnabled === true ? "AED" : "",
                    Evacuation_Chair: evacuationNumber,
                    lowRisk: selectedItems,
                    auxiliaryStaff: inputValues,
                    vehiclesNumber: vehiclesNumber,
                    selectAed: selectAed?.name,
                  });
                }}></Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AreaRiskCalculator;

const styles = StyleSheet.create({});
