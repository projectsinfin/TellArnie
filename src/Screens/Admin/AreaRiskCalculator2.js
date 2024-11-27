import {
  Alert,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Styles/Colors";
import Loading from "../../Components/Loading";

import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import IncidentStyle from "../Incident/IncidentStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { useDispatch } from "react-redux";
import navigationString from "../../Navigations/navigationString";
import CustomAlert from "../../Components/CustomAlert";
import AdminStyle from "./AdminStyle";
import {
  call_get_kit_pictures,
  call_update_risk_assessment,
} from "../../redux/action/AdminAction";

const AreaRiskCalculator2 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isLoadings, setisLoadings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [productData, setProductData] = useState();

  const [quantities, setQuantities] = useState([]);
  const [updatedMain, setUpdatedMain] = useState([]);
  const [recomdQuantities, setRecomQuantity] = useState([]);
  const [updaterecomdQuantities, setUdateRecomQuantity] = useState([]);

  let mainKit = [];
  let recomKit = [];
  let foundRiskLevel = null;
  let foundMaingroup = null;
  let foundSubgroup = null;

  console.log("routeItem ----", JSON.stringify(route.params));

  const itemsToFind = [
    "Cutting Equipment",
    "Heavy Machinery",
    "Power Tools",
    "Mass Casualty",
  ];
  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  useEffect(() => {
    const payload = {
      mainKit: mainKit,
      recommendedKits: [...new Set(recomKit)],
      risk_level: foundRiskLevel == "Standard" ? "Low" : "High",
      total_person: route.params?.maxQuantity,
    };
    setisLoadings(true);
    dispatch(call_get_kit_pictures(payload))
      .then((res) => {
        setisLoadings(false);
        console.log("res payload  evacuation---", JSON.stringify(res.payload));
        if (res?.payload?.status === 200) {
          setProductData(res.payload?.data);
        } else {
          console.log("kit pictures response err", res.payload?.message);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("getkitPic err", err);
      });
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // find low risk product name
  const trueItem = Object.keys(route.params?.switchData).filter(
    (key) => route.params?.switchData[key].check
  );
  console.log("switchData low true Item ----", trueItem);

  // switch (trueItem[0]) {
  //   case "Agriculture":
  //     mainKit = [322, 6766];
  //     break;
  //   case "Assembly_Work":
  //     mainKit = [330];
  //     recomKit = [955];
  //     break;
  //   case "Clerical Work":
  //     mainKit = [330];
  //     break;
  //   case "Commercial_Catering":
  //     mainKit = [330];
  //     recomKit = [2030, 904];
  //     break;
  //   case "Construction":
  //     mainKit = [330];
  //     recomKit = [2030, 955];
  //     break;
  //   case "Education":
  //     mainKit = [366];
  //     recomKit = [2030, 904, 160];
  //     break;
  //   case "Engineering":
  //     mainKit = [330];
  //     recomKit = [2030, 955];
  //     break;
  //   case "Entertainment/Leisure Venue":
  //     mainKit = [366];
  //     break;
  //   case "Facilities Management":
  //     break;
  //   case "Food_Processing":
  //     mainKit = [330];
  //     break;
  //   case "Forestry":
  //     mainKit = [322];
  //     break;
  //   case "Healthcare":
  //     break;
  //   case "Manufacturing":
  //     mainKit = [330];
  //     recomKit = [2030, 955];
  //     break;
  //   case "Retail":
  //     mainKit = [330];
  //     recomKit = [2030, 904];
  //     break;

  //   case "Transport":
  //     mainKit = [366];
  //     break;

  //   case "Warehouse":
  //     mainKit = [330];
  //     recomKit = [2030, 955];
  //     break;

  //   default:
  //   // Code to be executed if expression doesn't match any case
  // }

  // find high risk product name
  const trueKeys = Object.keys(route.params?.potential).filter(
    (key) => route.params?.potential[key].check
  );

  // find recommended product when select high risk product
  trueKeys.forEach((key) => {
    recomKit = recomKit.concat(route.params?.potential[key].RecommendedKits);
  });

  for (const key in route.params?.switchData) {
    if (route.params?.switchData[key].check) {
      foundRiskLevel = route.params?.switchData[key].Risk_Level;
      foundMaingroup = route.params?.switchData[key].Main_Group;
      foundSubgroup = route.params?.switchData[key].Sub_Group;

      break; // Stop the loop once we find the first match
    }
  }

  function findGroups(
    maingroup,
    subgroup,
    riskLevel,
    maxPerson,
    trueItem,
    potentialItem
  ) {
    // ------- select AED--------------
    if (route.params.AED !== "AED") {
      if (route.params.selectAed == "Outdoors") {
        recomKit = [...recomKit, 2105, 2780, 2877];
      }
      if (route.params.selectAed == "Indoors") {
        recomKit = [...recomKit, 2879, 3098, 2780, 2877];
      }
    }

    // ------- select auxiliaryStaff--------------
    if (Object.keys(route.params?.auxiliaryStaff).length > 0) {
      recomKit = [...recomKit, 6772, 3223];
    }
    // ------- select Evacuation_Chair--------------
    if (route.params?.Evacuation_Chair !== "") {
      recomKit = [...recomKit, 6038];
    }

    // ------- risk level Standard--------------
    if ("Standard" == riskLevel) {
      // ------- group 1 and group 3-------
      if (maingroup == "1" && subgroup == "3") {
        if (maxPerson > 1 && maxPerson <= 25) {
          mainKit = [330];
          if (trueItem[0] == "Education") {
            mainKit = potentialItem[0] === "Cutting Equipment" ? [343] : [330];
            recomKit = [...recomKit, 2030, 904, 160];
          }
          if (trueItem[0] == "Retail") {
            recomKit = [...recomKit, 2030, 904];
          }
        }
        if (maxPerson >= 26 && maxPerson <= 100) {
          mainKit = [343];
          if (trueItem[0] === "Education") {
            mainKit = [2480];
            recomKit = [...recomKit, 124, 904];
          }
          if (trueItem[0] == "Retail") {
            mainKit = [343];
            recomKit = [...recomKit, 124, 904];
          }
        }
        if (maxPerson >= 101 && maxPerson <= 100000) {
          mainKit = [348, 380];
          if (trueItem[0] == "Education") {
            mainKit = [2480];
            // recomKit = [...recomKit, 2717, 124, 2030, 904];
            recomKit = [...recomKit, 124, 904];
          }
          if (trueItem[0] == "Retail") {
            // mainKit = [348, 380];
            mainKit = [348];
            // recomKit = [...recomKit, 124, 904, 2717];
            recomKit = [...recomKit, 124, 904];
          }
        }
        return;
      }
      // ------- group 2 and group 3-------
      if (maingroup == "2" && subgroup == "3") {
        if (maxPerson > 1 && maxPerson <= 25) {
          mainKit = [366];
        }
        if (maxPerson >= 26 && maxPerson <= 100) {
          mainKit = [380];
        }
        if (maxPerson >= 101 && maxPerson <= 100000) {
          mainKit = [384, 366];
          if (trueItem[0] == "Transport") {
            mainKit = [384];
          }
        }
        return;
      }
      // ------- group 1  -------
      if (maingroup == "1") {
        if (maxPerson > 1 && maxPerson <= 25) {
          mainKit = potentialItem.filter((item) => itemsToFind.includes(item))
            ? [343]
            : [330];
          if (trueItem[0] == "Commercial_Catering") {
            mainKit = [427];
            recomKit = [...recomKit, 2030, 904];
          }
          // if (trueItem[0] == "Commercial_Catering") {
          //   mainKit = [427];
          //   recomKit = [...recomKit, 2030, 904];
          // }
        }

        if (maxPerson >= 26 && maxPerson <= 100) {
          mainKit = [343];
          if (trueItem[0] == "Commercial_Catering") {
            mainKit = [428];
            recomKit = [...recomKit, 124, 904];
          }
        }
        if (maxPerson >= 101 && maxPerson <= 100000) {
          // mainKit = [348, 380];
          mainKit = [348];
          if (trueItem[0] == "Commercial_Catering") {
            // mainKit = [429, 427];
            mainKit = [429];
            // recomKit = [...recomKit, 2717, 124, 2030, 904];
            recomKit = [...recomKit, 124, 904];
          }

          if (trueItem[0] == "Clerical Work") {
            // mainKit = [348, 330];
            mainKit = [348];

            if (potentialItem?.length > 0) {
              recomKit = [124, 2030];
              // recomKit = [124, 2030, 5996, 904];
            }
          }
        }
      }
      // ------- group 2-------
      if (maingroup == "2") {
        if (maxPerson > 1 && maxPerson <= 25) {
          mainKit = [366];
        }
        if (maxPerson >= 26 && maxPerson <= 100) {
          mainKit = [380];
        }
        if (maxPerson >= 101 && maxPerson <= 100000) {
          mainKit = [384];
        }
      }
      // ------- group 4-------
      if (maingroup == "4") {
        if (maxPerson > 1 && maxPerson < 100000) {
          // mainKit = [322];
          mainKit = [];
        }
      }
    }

    // ------- risk level High--------------
    if ("High" == riskLevel) {
      // ------- group 1  and sub group 3 -------
      if (maingroup == "1" && subgroup == "3") {
        if (maxPerson > 0 && maxPerson <= 5) {
          mainKit = [366];
        }
        if (maxPerson >= 6 && maxPerson <= 25) {
          mainKit = [343];
        }
        if (maxPerson >= 26 && maxPerson <= 100000) {
          mainKit = [348, 343];
          // if (trueItem[0] == "Entertainment/Leisure Venue") {
          //   mainKit = [348, 366];
          // }
        }
        return;
      }

      // ------- group 1  -------
      if (maingroup == "1") {
        if (maxPerson > 0 && maxPerson <= 5) {
          mainKit = [366];
        }
        if (maxPerson >= 6 && maxPerson <= 25) {
          mainKit = [343];
        }
        if (maxPerson >= 26 && maxPerson <= 100000) {
          mainKit = [348];
        }
      }
      // ------- group 2  -------
      if (maingroup == "2") {
        if (maxPerson > 0 && maxPerson <= 5) {
          mainKit = [330];
          recomKit = [955];
          if (trueItem[0] == "Construction" || trueItem[0] == "Engineering") {
            recomKit = [...recomKit, 2030, 955];
          }
          if (trueItem[0] == "Food_Processing") {
            mainKit = [427];
            recomKit = [];
          }
          if (trueItem[0] == "Manufacturing" || trueItem[0] == "Warehouse") {
            recomKit = [...recomKit, 2030, 955];
          }
          return;
        }
        if (maxPerson >= 6 && maxPerson <= 25) {
          mainKit = [380];
          if (
            trueItem[0] == "Construction" ||
            trueItem[0] == "Engineering" ||
            trueItem[0] == "Warehouse"
          ) {
            recomKit = [...recomKit, 2030, 955];
          }
          if (trueItem[0] == "Food_Processing") {
            mainKit = [428];
          }
          if (trueItem[0] == "Manufacturing") {
            recomKit = [...recomKit, 2030, 955];
          }
          if (trueItem[0] == "Assembly_Work") {
            recomKit = [...recomKit, 955];
          }
          return;
        }
        if (maxPerson >= 26 && maxPerson <= 100000) {
          mainKit = [384, 380];
          // if (
          //   // trueItem[0] == "Construction" ||

          //   trueItem[0] == "Warehouse"
          // ) {
          //   recomKit = [...recomKit, 124, 955];
          // }
          if (
            // trueItem[0] == "Construction" ||
            // trueItem[0] == "Engineering" ||
            // trueItem[0] == "Manufacturing" ||
            trueItem[0] == "Warehouse"
          ) {
            if (maxPerson > 50 && maxPerson < 53) {
              mainKit = [384];
              // recomKit = [...recomKit, 2717, 124, 2030, 955];
              recomKit = [...recomKit, 124, 955];
            }
            if (maxPerson > 53 && maxPerson < 100) {
              mainKit = [384, 380];
              // recomKit = [...recomKit, 2717, 124, 2030, 955];
              recomKit = [...recomKit, 124, 955];
            }

            if (maxPerson > 100 && maxPerson < 10000) {
              mainKit = [384, 380];
              recomKit = [...recomKit, 124, 955];
            }
          }

          if (
            trueItem[0] == "Construction" ||
            trueItem[0] == "Engineering" ||
            trueItem[0] == "Manufacturing"
          ) {
            if (maxPerson > 50 && maxPerson < 53) {
              mainKit = [384];
            }
            if (maxPerson > 53 && maxPerson < 58) {
              mainKit = [384, 330];
            }
            recomKit = [...recomKit, 124, 955];
          }
          // if (trueItem[0] == "Engineering") {
          //   recomKit = [...recomKit, 124, 955];
          //   return;
          // }
          if (trueItem[0] == "Food_Processing") {
            // mainKit = [429, 427];
            mainKit = [429];
          } else {
            recomKit = [...recomKit, 955];
          }
          return;
        }
      }
      // ------- group 4  -------
      if (maingroup == "4") {
        if (maxPerson > 1 && maxPerson < 100000) {
          mainKit = trueItem[0] == "Agriculture" ? [322, 6766] : [322];
        }
        return;
      }
    }

    return null; // Return null if no true check is found
  }

  const findRequiredProduct = findGroups(
    foundMaingroup,
    foundSubgroup,
    foundRiskLevel,
    route.params?.maxQuantity,
    trueItem,
    trueKeys
  );

  console.log(
    trueKeys,
    "-----",
    mainKit,
    "kit code --==",
    trueItem,
    "-==",
    findRequiredProduct,
    "----",
    [...new Set(recomKit)]
  );

  const handleRiskCalculater = () => {
    let mergeArr = [quantities, recomdQuantities];
    const payload = {
      // quantity: mergeArr?.flat(),
      is_assessment: true,
      mainKit: updatedMain,
      recommendedKits: updaterecomdQuantities,
      area: route?.params?.item?.area,
      location_name: route?.params?.areaName,
      location_id: route?.params?.areaId,
    };
    // console.log(quantities, "7573535", payload);
    dispatch(call_update_risk_assessment(payload))
      .then((res) => {
        setisLoadings(false);
        console.log("api response call_update_risk_assessment", payload);
        if (res.payload.status === 200) {
          // handleShowAlert(res.payload.message);
          alert(res.payload.message);
          navigation.navigate(navigationString.admin);
        } else {
          console.log("err response ", res.payload);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log(err, "---err");
      });
  };

  useEffect(() => {
    if (productData?.main) {
      setQuantities(
        productData.main.map((item) => String(item.quantity || ""))
      );
    }
    if (productData?.recommended) {
      setRecomQuantity(
        productData?.recommended.map((item) => String(item.quantity || ""))
      );
    }
  }, [productData]);

  // Update the main array with the new quantities
  useEffect(() => {
    const newMain = productData?.main?.map((item, index) => ({
      ...item,
      quantity: Number(quantities[index] || item.quantity), // Ensure quantity is a number
    }));
    setUpdatedMain(newMain);
  }, [quantities]);

  useEffect(() => {
    const newMain = productData?.recommended?.map((item, index) => ({
      ...item,
      quantity: Number(quantities[index] || item.quantity), // Ensure quantity is a number
    }));
    setUdateRecomQuantity(newMain);
  }, [recomdQuantities]);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>
      <Header
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
      />
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
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
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Area Results
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <TextView
                textSty={{ fontSize: 14, lineHeight: 21, marginTop: 15 }}>
                These are the minimum requirements suggested based on the
                information you provided.
              </TextView>
              {/*======== heading of table==== */}
              {productData?.main.length != 0 && (
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: "red",
                    borderBottomWidth: 1.5,
                    borderColor: Colors.black,
                    flexDirection: "row",
                  }}>
                  <View style={{ flex: 0.25 }}></View>
                  <View style={{ flex: 0.15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Qty
                    </TextView>
                  </View>
                  <View style={{ flex: 0.15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Code
                    </TextView>
                  </View>
                  <View style={{ flex: 0.45 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Product Name
                    </TextView>
                  </View>
                </View>
              )}

              {/* ---------table content--------- */}
              {productData?.main?.map((item, index) => {
                // Function to handle quantity change
                const handleQuantityChange = (newQuantity, index) => {
                  // Update the specific quantity in the array
                  const updatedQuantities = [...quantities];
                  updatedQuantities[index] = newQuantity;
                  setQuantities(updatedQuantities);
                };

                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        gap: 2,
                        marginTop: 15,
                        // backgroundColor: "red",
                        flexDirection: "row",
                        // justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <View style={{ flex: 0.25 }}>
                        <Image
                          source={
                            item?.kit_picture
                              ? { uri: item?.kit_picture }
                              : imagePath.NoIcon
                          }
                          style={{
                            width: 60,
                            height: 60,
                            alignSelf: "center",
                            // marginTop: 25,
                          }}
                        />
                      </View>
                      <View style={{ flex: 0.15 }}>
                        {/* <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.quantity}
                        </TextView> */}
                        {/* Make quantity editable */}
                        <TextInput
                          value={String(quantities[index])}
                          onChangeText={(newQuantity) =>
                            handleQuantityChange(newQuantity, index)
                          }
                          style={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                            borderWidth: 1,
                            borderColor: Colors.black,
                            lineHeight: 21,
                            fontSize: 14,

                            textAlign: "center",
                            marginHorizontal: 2,
                          }}
                          keyboardType="numeric" // Ensure numeric input
                        />
                      </View>
                      <View style={{ flex: 0.15, alignItems: "center" }}>
                        <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.product_code}
                        </TextView>
                      </View>
                      <View style={{ flex: 0.45 }}>
                        <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.product_name}
                        </TextView>
                      </View>
                    </View>

                    <View
                      style={{
                        marginTop: 15,
                        width: "90%",
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: Colors.black,
                      }}
                    />
                  </>
                );
              })}

              <TextView
                textSty={{ fontSize: 14, lineHeight: 21, marginTop: 40 }}>
                Consider the following products for your workplace:
              </TextView>

              {/* ---------table heading--------- */}
              {productData?.recommended.length != 0 && (
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: "red",
                    borderBottomWidth: 1.5,
                    borderColor: Colors.black,
                    flexDirection: "row",
                  }}>
                  <View style={{ flex: 0.25 }}></View>
                  <View style={{ flex: 0.15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Qty
                    </TextView>
                  </View>
                  <View style={{ flex: 0.15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Code
                    </TextView>
                  </View>
                  <View style={{ flex: 0.45 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        textAlign: "left",
                      }}>
                      Product Name
                    </TextView>
                  </View>
                </View>
              )}

              {/* ---------table content--------- */}
              {productData?.recommended?.map((item, index) => {
                // Function to handle quantity change
                const handleQuantityChange = (newQuantity, index) => {
                  // Update the specific quantity in the array
                  const updatedQuantities = [...recomdQuantities];
                  updatedQuantities[index] = newQuantity;
                  setRecomQuantity(updatedQuantities);
                };

                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        gap: 2,
                        marginTop: 15,
                        alignItems: "center",
                        flexDirection: "row",
                      }}>
                      <View style={{ flex: 0.25 }}>
                        <Image
                          source={
                            item?.kit_picture
                              ? { uri: item?.kit_picture }
                              : imagePath.NoIcon
                          }
                          style={{
                            width: 60,
                            height: 60,
                            alignSelf: "center",
                            // marginTop: 25,
                          }}
                        />
                      </View>
                      <View style={{ flex: 0.15 }}>
                        {/* <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.quantity}
                        </TextView> */}
                        <TextInput
                          value={String(recomdQuantities[index])}
                          onChangeText={(newQuantity) =>
                            handleQuantityChange(newQuantity, index)
                          }
                          style={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                            borderBottomWidth: 1,
                            borderColor: Colors.black,
                            textAlign: "left",
                            borderWidth: 1,
                            borderColor: Colors.black,
                            lineHeight: 21,
                            fontSize: 14,

                            textAlign: "center",
                            marginHorizontal: 2,
                          }}
                          keyboardType="numeric" // Ensure numeric input
                        />
                      </View>
                      <View style={{ flex: 0.15, alignItems: "center" }}>
                        <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.product_code}
                        </TextView>
                      </View>
                      <View style={{ flex: 0.45 }}>
                        <TextView
                          textSty={{
                            ...AdminStyle.generateQuote,
                            textAlign: "left",
                          }}>
                          {item?.product_name}
                        </TextView>
                      </View>
                    </View>

                    <View
                      style={{
                        marginTop: 15,
                        width: "90%",
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: Colors.black,
                      }}
                    />
                  </>
                );
              })}

              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",

                  marginVertical: 35,
                  // marginHorizontal: 20,
                  justifyContent: "space-between",
                }}>
                <Button
                  onClick={() => {
                    // handleDelete();
                    // handleRiskCalculater();
                    navigation.navigate(navigationString.admin);
                  }}
                  allButtonSty={{
                    backgroundColor: "black",
                    borderRadius: 10,
                    width: "48%",
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.white}
                  btnColor="#fff"
                  btnName="Request Now"
                />
                <Button
                  onClick={() => {
                    handleRiskCalculater();
                    // navigation.navigate(navigationString.admin);
                  }}
                  buttonColor={Colors.black}
                  btnName={"Add to Quote"}
                  allButtonSty={{
                    borderRadius: 10,
                    width: "48%",
                    marginHorizontal: 0,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AreaRiskCalculator2;

const styles = StyleSheet.create({});
