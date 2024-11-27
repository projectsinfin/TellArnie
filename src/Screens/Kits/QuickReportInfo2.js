import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import InputFields from "../../Components/InputFields";
import CustomDropdown from "../../Components/CustomDropdown";
import moment from "moment";
import Button from "../../Components/Button";
import MiniCard from "../../Components/MiniCard";
import ModalScreen from "../../Components/ModalScreen";
import { useDispatch, useSelector } from "react-redux";
import { call_PersonOftreatment_Api } from "../../redux/action/IncidentReport";
import CustomAlert from "../../Components/CustomAlert";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const QuickReportInfo2 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  console.log("getting value from quick report info screen--", route.params);
  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );
  const [itemList, setItemList] = useState(null);
  const [clearDropdown, setClearDropdown] = useState(false);
  // console.log(JSON.stringify(installKitDetails), "item of list ");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelecteduser] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [listData, setListData] = useState([]);
  const [presonIncidentList, setPresonIncidentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(presonIncidentList?.Users);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Function to handle selection from dropdown
  const handleSelect = (item) => {
    setSelectedItem(item);
    setClearDropdown(false);
  };

  // Function to add selected item to used items list

  const addItemToList = () => {
    if (selectedItem == null) {
      return handleShowAlert("Plase select item");
    }
    if (selectedQuantity == "") {
      return handleShowAlert("Quantity required");
    }
    if (searchQuery == "") {
      return handleShowAlert("Name of injured person required");
    }

    const numericValue = selectedQuantity.replace(/[^0-9]/g, "");
    // Update the state only if the resulting value is empty or a valid integer
    if (numericValue === "" || !isNaN(parseInt(numericValue))) {
      setSelectedQuantity(numericValue);
    }
    if (selectedQuantity > selectedItem?.current_quantity) {
      // console.log("usedBy====", selectedQuantity);
      return handleShowAlert(
        `Quantity available is ${selectedItem?.current_quantity}`
      );
    }
    if (parseInt(selectedQuantity) === 0) {
      return handleShowAlert(`Quantity must be greater than 0.`);
    }
    // if (selectedItem && selectedQuantity && searchQuery) {
    const newItem = {
      title: selectedItem?.description,
      used_quantity: parseInt(selectedQuantity),
      user_id: selectedUser?._id,
      full_name: searchQuery,
      // selectedUser?.first_name +
      // "" +
      // (selectedUser?.last_name ? selectedUser?.last_name : ""),
      product_id: selectedItem._id,
    };
    setListData((prevList) => [...prevList, newItem]); // Add new item to the listData array
    setItemList((prevItems) =>
      prevItems.map((item) =>
        item?._id === selectedItem?._id
          ? {
              ...item,
              current_quantity:
                item.current_quantity - parseInt(selectedQuantity),
            }
          : item
      )
    );
    setSelectedQuantity(""); // Reset selectedQuantity state
    setClearDropdown(true);
    setSearchQuery("");
    setSelecteduser(null);
    setSelectedItem(null); // Reset selectedItem state
    // } else {
    //   alert("Please select all fields!");
    // }
  };

  const handleSelects = (item) => {
    console.log(item, "---item");
    setSelecteduser(item);
    setClearDropdown(false);
  };

  useEffect(() => {
    setItemList(installKitDetails?.data.relatedProducts);
  }, [installKitDetails]);

  useEffect(() => {
    personOftreatment();
  }, []);

  const personOftreatment = () => {
    dispatch(call_PersonOftreatment_Api())
      .then((res) => {
        console.log("-----", JSON.stringify(typeof res.payload?.data?.Users));
        if (res.payload.status === 200) {
          setPresonIncidentList(res.payload?.data);
        } else {
          handleShowAlert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const expiryDate = installKitDetails?.data.kit.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  const handleContiune = (val) => {
    // if (listData.length <= 0) {
    //   handleShowAlert("Add to Used Items");
    //   return;
    // }
    const data = {
      listData,
      ...route.params.payload,
    };
    console.log("quick report info 22", data);
    navigation.navigate(navigationString.quickSummary, {
      key: "quickReportInfo2",
      data,
    });
  };

  // const increaseQuantity = (index) => {
  //   const updatedList = [...listData];
  //   updatedList[index].used_quantity++;

  //   setListData(updatedList);
  // };

  // const decreaseQuantity = (index) => {
  //   const updatedList = [...listData];
  //   if (updatedList[index].used_quantity > 1) {
  //     updatedList[index].used_quantity--;
  //     setListData(updatedList);
  //   }
  // };
  const increaseQuantity = (index) => {
    const updatedList = [...listData];

    // Get the selected item's details based on its product ID
    const selectedItem = itemList.find(
      (item) => item._id === updatedList[index].product_id
    );

    if (selectedItem) {
      // Ensure the used quantity does not exceed the available current quantity
      if (updatedList[index].used_quantity < selectedItem.current_quantity) {
        updatedList[index].used_quantity++;
        setListData(updatedList);
      }
      // else {
      //   // Show an alert if the user tries to exceed the current quantity
      //   handleShowAlert(
      //     `You cannot exceed the available quantity of ${selectedItem.current_quantity}.`
      //   );
      // }
    }
  };

  const decreaseQuantity = (index) => {
    const updatedList = [...listData];
    if (updatedList[index].used_quantity > 1) {
      updatedList[index].used_quantity--;
      setListData(updatedList);
    } else {
      handleShowAlert("Quantity cannot be less than 1.");
    }
  };

  const handleSearch = (query) => {
    console.log(query, "----query");
    setIsOpen(true);
    setSearchQuery(query);
    // Filter the data based on the search query
    const filtered = presonIncidentList?.Users.filter((item) => {
      const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    setFilteredData(filtered);
  };

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
        <CustomAlert
          visible={showAlert}
          message={alertMessage} // Pass the dynamic message
          onClose={handleCloseAlert}
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

              <View style={{ width: "80%", alignSelf: "center" }}>
                <TextView
                  onPress={() => {}}
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "center",
                    lineHeight: 21,
                  }}>
                  {(installKitDetails?.data.kit.brand == "false"
                    ? ""
                    : installKitDetails?.data.kit.brand) +
                    " " +
                    (installKitDetails?.data.kit.model_number == "false"
                      ? ""
                      : installKitDetails?.data.kit.model_number) +
                    " " +
                    installKitDetails?.data.kit.product_name}
                  {/* {AllStrings.RelianceMedicalMediumWorkplace} */}
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
                    text={
                      installKitDetails?.data?.kit.lot_number == "false"
                        ? null
                        : installKitDetails?.data?.kit.lot_number
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
                    text={installKitDetails?.data.kit.location_name}
                  />
                </View>
                <View style={{ width: "49%" }}>
                  <MiniCard
                    heading="Installed Location"
                    text={
                      installKitDetails?.data.kit.area
                        ? installKitDetails?.data.kit.area
                        : ""
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginVertical: 35,
                }}></View>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  lineHeight: 21,
                  marginTop: 0,
                }}>
                What items were used?
              </TextView>
              <CustomDropdown
                placeholder={selectedItem === null && "Item"}
                data={itemList}
                type="user"
                userList
                onSelect={handleSelect}
                clearDropdown={clearDropdown}
              />
              <InputFields
                placeholder="Quantity"
                onChangeText={(val) => setSelectedQuantity(val)}
                value={selectedQuantity}
                keyboardType="numeric"
                // onChangeText={handleChange("quantity")}
                // value={values.quantity}
              />

              {/* <CustomDropdown
                placeholder="Person of treatment"
                data={presonIncidentList?.Users}
                userList
                type="treatment"
                onSelect={handleSelects}
                clearDropdown={clearDropdown}
              /> */}
              <InputFields
                placeholder="Name of injured person"
                value={searchQuery}
                onChangeText={handleSearch}

                // onChangeText={handleChange("email")}
                // // onBlur={handleBlur("email")}
                // value={values.email}
              />
              {isOpen && (
                <FlatList
                  data={filteredData}
                  style={{ maxHeight: 150 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery(
                          `${item?.first_name} ${
                            item?.last_name ? item?.last_name : ""
                          }`
                        );
                        setIsOpen(false);
                      }}
                      style={{
                        padding: 10,
                        width: "100%",
                        borderWidth: 0.5,
                      }}>
                      <ScrollView>
                        <Text style={{ color: Colors.black }}>
                          {item?.first_name +
                            " " +
                            (item?.last_name ? item?.last_name : "")}
                        </Text>
                      </ScrollView>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item._id}
                />
              )}

              <View>
                <Button
                  onClick={() => addItemToList()}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    borderRadius: 10,
                    marginTop: 25,
                  }}
                  buttonColor={Colors.white}
                  btnName="Add to Used Items"
                />
              </View>
              {/* <TextView onPressText={showTimepicker}>Show time picker!</TextView> */}

              {/* list of add used item */}
              {listData.length > 0 && (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: Colors.greenTint,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      marginTop: 20,
                    }}>
                    <TextView
                      heading
                      headingTextSty={{
                        lineHeight: 15,
                        fontSize: 10,
                        color: Colors.white,
                      }}>
                      {AllStrings.UsedItems}
                    </TextView>
                    <TextView
                      heading
                      headingTextSty={{
                        lineHeight: 15,
                        fontSize: 10,
                        color: Colors.white,
                      }}>
                      {AllStrings.Quantity}
                    </TextView>
                  </View>
                  <View>
                    {listData.map((item, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 8,
                          }}>
                          <View style={{ flex: 0.8 }}>
                            <TextView
                              textSty={{
                                fontSize: 12,
                                textAlign: "left",
                              }}>
                              {item.title + " Used by " + item.full_name}
                            </TextView>
                          </View>

                          <View
                            style={{
                              flex: 0.2,
                              flexDirection: "row",
                              justifyContent: "space-around",
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                decreaseQuantity(index);
                              }}>
                              <Image
                                source={imagePath.removeIcon}
                                resizeMode="contain"
                                style={{ height: 18, width: 18 }}
                              />
                            </TouchableOpacity>

                            <TextView
                              textSty={{
                                fontSize: 12,
                                textAlign: "left",
                              }}>
                              {item?.used_quantity}
                            </TextView>

                            <TouchableOpacity
                              // disabled={
                              //   selectedItem?.current_quantity >
                              //   item?.used_quantity
                              //     ? false
                              //     : true
                              // }
                              onPress={() => {
                                increaseQuantity(index);
                              }}>
                              <Image
                                source={imagePath.addIcon}
                                resizeMode="contain"
                                style={{ height: 18, width: 18 }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}>
                <Image
                  source={imagePath.secondIndicator}
                  style={{ width: "10%" }}
                />
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 15,
                  marginTop: 60,
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
                    handleContiune();
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "60%",
                    marginHorizontal: 0,
                    borderRadius: 10,
                  }}
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

export default QuickReportInfo2;

const styles = StyleSheet.create({});
