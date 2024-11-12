import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import ModalScreen from "../../../Components/ModalScreen";
import Button from "../../../Components/Button";
import CustomDropdown from "../../../Components/CustomDropdown";
import InputFields from "../../../Components/InputFields";
import kitsStyles from "../kitsStyles";
import navigationString from "../../../Navigations/navigationString";
import AllStrings from "../../../Constant/AllStrings";
import TextView from "../../../Components/TextView";
import Header from "../../../Components/Header";
import imagePath from "../../../Constant/imagePath";
import Colors from "../../../Styles/Colors";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../../Styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
import { call_PersonOftreatment_Api } from "../../../redux/action/IncidentReport";
import CustomAlert from "../../../Components/CustomAlert";

const DetailedReportthree = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isLoading, error, incidentCategoryDetails } = useSelector(
    (state) => state.incidentCategory
  );
  const [clearDropdown, setClearDropdown] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [persontreatment, setPersontreatment] = useState(null);
  const [classification, setClassification] = useState(null);
  const [injuryType, setInjuryType] = useState(null);
  const [classificationItem, setClassificationItem] = useState(null);
  const [presonIncidentList, setPresonIncidentList] = useState(null);
  const [injuryDetails, setInjuryDetails] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [outcome, setOutcome] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState(presonIncidentList?.Users);
  console.log(
    filteredData,
    "--presonIncidentList?.Users--",
    presonIncidentList?.Users
  );

  const handleClearDropdown = () => {
    setClearDropdown(true); // Set the state to true to trigger clearing of dropdown
  };

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handlePersontreatment = (item) => {
    setPersontreatment(item);
    setClearDropdown(false);
  };
  const handleInjuryType = (item) => {
    setInjuryType(item);
    setClassification(item?.description);
    setClearDropdown(false);
  };

  const handleClassification = (item) => {
    setClassificationItem(item);
    setClassification(item?.description);
    setClearDropdown(false);
  };

  const [listData, setListData] = useState([]);

  const addPerson = () => {
    // if (searchQuery == "") {
    //   return alert("Person of treatment required!");
    // }
    // if (injuryType?.name == null) {
    //   return alert("Injury type required!");
    // }
    // if (injuryType?.name == null) {
    //   return alert("Injury type required!");
    // }

    if (searchQuery == "") {
      return handleShowAlert("Name of injured person required");
    }
    if (injuryType == null) {
      return handleShowAlert("Plase select injury type!");
    }
    if (classificationItem == null) {
      return handleShowAlert("Plase select injury classification!");
    }

    const newItem = {
      // user_id: persontreatment?._id,
      full_name: searchQuery,
      // persontreatment.first_name +
      // " " +
      // (persontreatment.last_name ? persontreatment.last_name : ""),
      injury_type: injuryType.name,
      injury_classification: classificationItem,
      injury_details: injuryDetails,
      more_details: moreDetails,
      outcome: outcome,
    };
    setListData((prevList) => [...prevList, newItem]); // Add new item to the listData array
    setInjuryType(null);
    handleClearDropdown();
    setInjuryDetails("");
    setMoreDetails("");
    setOutcome("");
    setSearchQuery("");
    setPersontreatment(null);
  };

  const removeItem = (indexToRemove) => {
    setListData((prevImageUris) =>
      prevImageUris.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    personOftreatment();
  }, []);

  const personOftreatment = () => {
    dispatch(call_PersonOftreatment_Api())
      .then((res) => {
     
        if (res.payload.status === 200) {
          setPresonIncidentList(res.payload?.data);
        } else {
          handleShowAlert(res.payload.message);
        }
      })
      .catch((err) => console.log(err));
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
            {item.full_name}
          </TextView>
        </View>
        <View style={{ flex: 0.4 }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "center",
            }}>
            {item.injury_type}
          </TextView>
        </View>
        <TouchableOpacity
          onPress={() => {
            removeItem(index);
            // setLocationUpdate(!locationUpdate);
            // setLocationList(index);
          }}
          style={{
            flex: 0.1,
          }}>
          <Image
            source={imagePath.removeIcon}
            resizeMode="contain"
            style={{ height: 18, width: 18 }}
          />
        </TouchableOpacity>
      </View>
    );
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
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  marginBottom: -10,
                }}>
                {AllStrings.injured_action_taken}
              </TextView>
           
             
              <InputFields
                placeholder="Name of injured person"
                value={searchQuery}
                onChangeText={handleSearch}

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
                      <ScrollView nestedScrollEnabled={true}>
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

              <CustomDropdown
                type="category"
                placeholder="Injury Type"
                data={incidentCategoryDetails?.data?.Incidents}
                onSelect={handleInjuryType}
                clearDropdown={clearDropdown}
              />
              <CustomDropdown
                type="classification"
                placeholder="Injury Classification"
                data={classification}
                onSelect={handleClassification}
                clearDropdown={clearDropdown}
              />
              <InputFields
                placeholder="Injury Detail"
                value={injuryDetails}
                onChangeText={(text) => {
                  setInjuryDetails(text);
                }}
              />
            
              <InputFields
                placeholder="Incident Outcome"
                value={moreDetails}
                onChangeText={(text) => {
                  setMoreDetails(text);
                }}
              />
              <InputFields
                placeholder="If Other, provide details"
                value={outcome}
                onChangeText={(text) => {
                  setOutcome(text);
                }}
              />

              <View>
                <Button
                  // onClick={() => setShowModal(true)}
                  onClick={() => addPerson()}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    marginTop: moderateScaleVertical(30),
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.white}
                  btnName={
                    listData.length >= 1 ? "Add Another Person" : "Add Person"
                  }
                />
                {listData.length !== 0 && (
                  <View>
                    <TextView
                      heading
                      headingTextSty={{
                        fontSize: 14,
                        lineHeight: 21,
                        marginTop: moderateScaleVertical(20),
                      }}>
                      {AllStrings.Persons_involved_incident}
                    </TextView>
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
                          {AllStrings.Full_Name}
                        </TextView>
                      </View>
                      <View style={{ flex: 0.4 }}>
                        <TextView
                          heading
                          headingTextSty={{
                            textAlign: "center",
                            lineHeight: 15,
                            fontSize: 10,
                            color: Colors.white,
                          }}>
                          {AllStrings.Injury_Type}
                        </TextView>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        <TextView
                          heading
                          headingTextSty={{
                            lineHeight: 15,
                            fontSize: 10,
                            color: Colors.white,
                            textAlign: "center",
                          }}></TextView>
                      </View>
                    </View>
                    <FlatList
                      data={listData}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.key}
                      style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                    />
                  </View>
                )}
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: moderateScaleVertical(15),
                  padding: 10,
                }}>
                <Image
                  source={imagePath.PageIndicator32}
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
                    if (listData.length == 0) {
                      handleShowAlert("Please add person!");
                      // navigation.navigate(navigationString.quickSummary, {
                      //   key: "detailReport",
                      //   data: { listData, ...route.params.payload },
                      // });
                    } else {
                      navigation.navigate(navigationString.detailedReportFour, {
                        addPersonDetail: listData,
                        ...route.params.payload,
                      });
                    }
                  }}
                  buttonColor={Colors.black}
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

export default DetailedReportthree;

const styles = StyleSheet.create({});
