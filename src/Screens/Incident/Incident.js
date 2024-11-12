import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  RefreshControl,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../Constant/imagePath";
import Colors from "../../Styles/Colors";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import IncidentStyle from "./IncidentStyle";
import moment from "moment";
import InputFields from "../../Components/InputFields";
import { useDispatch, useSelector } from "react-redux";
import {
  call_IncidentDetail_API,
  call_Searchbar_API,
} from "../../redux/action/IncidentReport";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Loading from "../../Components/Loading";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useIsFocused } from "@react-navigation/native";

const Incident = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState("");
  // State variables for start and end dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTrue, setSearchTrue] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mode, setMode] = useState("date");

  const [LeicesterDate, setLeicesterDate] = useState([]);

  const formattedStartDate = startDate
    ? moment(startDate).format("DD-MM-YYYY")
    : "Start Date";
  const formattedEndDate = endDate
    ? moment(endDate).format("DD-MM-YYYY")
    : "End Date";

  // // Function to handle date selection
  // const onChange = (date, pickerType) => {
  //   // console.log(date, "pickerType======", pickerType);
  //   setSearchTrue(false);
  //   setShowStartDatePicker(false);
  //   setShowEndDatePicker(false);
  //   // Update start date or end date based on pickerType
  //   if (pickerType === "start") {
  //     setStartDate(date);
  //   } else if (pickerType === "end") {
  //     setEndDate(date);
  //   }
  // };
  // Function to handle date selection
  const onChange = (date, pickerType) => {
    setSearchTrue(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);

    if (pickerType === "start") {
      setStartDate(date);
      setEndDate(null); // Reset end date when a new start date is selected
    } else if (pickerType === "end") {
      setEndDate(date);
    }
  };

  // Function to calculate the next day after the start date
  const getNextDay = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  // Function to show date picker for start or end date
  const showDatepicker = (pickerType) => {
    if (pickerType === "start") {
      setShowStartDatePicker(true);
    } else if (pickerType === "end") {
      setShowEndDatePicker(true);
    }
  };

  const handleSearch = () => {
    console.log(searchText, "----", startDate, " ---", endDate);
    if (searchText == "" && startDate === null && endDate === null) {
      return;
    }
    setIsLoading(true);
    const payload = {
      search: searchText,
      start_date: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      end_date: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
    };
    // console.log(payload, "-----search payload");
    dispatch(call_Searchbar_API(payload))
      .then((res) => {
        // console.log("respos-------", res?.payload);
        if (res.payload.status == 200) {
          setIsLoading(false);
          setLeicesterDate(res?.payload?.Incidents);
          setSearchTrue(true);
          // setSearchText("");
          // setStartDate("");
          // setEndDate("");
        } else {
          setIsLoading(false);
          // console.log(res?.payload?.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err search000", err);
      });
  };

  const handleClose = () => {
    setSearchTrue(false);
    setStartDate(null);
    setEndDate(null);
    setSearchText("");
    handleIncident();
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        item?.is_detailed_incident == false
          ? navigation.navigate(navigationString.quickSummary, {
              id: item?._id,
              key: "incident",
            })
          : navigation.navigate(navigationString.quickSummary, {
              id: item?._id,
              key: "detailReportSummary",
            });
      }}
      style={{
        flexDirection: "row",
        padding: 10,
        backgroundColor: index % 2 == 0 ? null : Colors.greenLightTint,
        paddingHorizontal: 15,
      }}>
      {console.log("---incident recport ---", JSON.stringify(LeicesterDate))}
      <View style={{ flex: 0.5 }}>
        <TextView heading headingTextSty={IncidentStyle.LeicesterHeading}>
          {moment(item?.incident_date).format("DD MMM yyyy") +
            " " +
            item?.incident_time}
        </TextView>
        {/* <TextView textSty={IncidentStyle.LeicesterText}>
          {item?.area_of_incident}
        </TextView> */}
      </View>
      <View style={{ flex: 0.4 }}>
        <TextView heading headingTextSty={IncidentStyle.LeicesterHeading}>
          {/* {item?.category_of_incident} */}
          {item?.location_of_incident}, {item?.area_of_incident}
        </TextView>
        {/* <TextView textSty={IncidentStyle.LeicesterText}>
          {item?.classification}
        </TextView> */}
      </View>
    </TouchableOpacity>
  );

  const handleRefresh = () => {
    // Set refreshing state to true
    setIsRefreshing(true);
    handleIncident();
    // After data fetching or refreshing, set refreshing state to false
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleIncident();
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      console.log("Screen is focused");

      handleIncident();
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  useEffect(() => {
    if (searchText.length === 0) {
      handleIncident();
      setSearchTrue(false);
    }

    if (searchText.length > 2) {
      setTimeout(() => {
        handleSearch();
      }, 300);
    }
  }, [searchText]);

  const handleIncident = () => {
    setIsLoading(true);
    dispatch(call_IncidentDetail_API())
      .then((res) => {
        // console.log(res.payload, "000000");
        setIsLoading(false);
        if (res.payload.status === 200) {
          setLeicesterDate(res?.payload?.Incidents);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoading}>
        <Loading />
      </Modal>
      <Header back={() => navigation.navigate(navigationString.profile)} />

      <View style={{ flex: 1 }}>
        {/* Green section */}
        <TextView heading headingTextSty={IncidentStyle.headingContainer}>
          {AllStrings.ReportedIncidents}
        </TextView>
        <TextView
          textSty={{
            ...IncidentStyle.Monitorsafetyproducts,
          }}>
          {AllStrings.comprehensivesubmittedeports}
        </TextView>

        {/* Rest of the content */}
        <View style={IncidentStyle.buttonContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary]} // Customize the colors of the refresh indicator
              />
            }
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <View style={{ paddingHorizontal: 15 }}>
              <View>
                <InputFields
                  placeholder="Search"
                  value={searchText}
                  onChangeText={(e) => {
                    setSearchText(e);
                    if (searchText.length === 0) {
                      setSearchTrue(false);
                    }
                  }}
                  textInput={IncidentStyle.searchbarSty}
                  textInputFocused={IncidentStyle.searchbarSty}
                />
              </View>
              <View
                style={{
                  // marginTop: -15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                {/* Start date view */}
                <TouchableOpacity
                  onPress={() => {
                    showDatepicker("start");
                  }}
                  style={IncidentStyle.dateView}>
                  <View>
                    <TextView
                      textSty={{
                        fontSize: 14,
                        color: startDate ? Colors.black : Colors.lightgray,
                      }}>
                      {formattedStartDate}
                    </TextView>
                  </View>
                  <View style={{ marginLeft: 5 }}>
                    <View>
                      <Image
                        source={imagePath.dateIcon}
                        resizeMode="contain"
                        style={{
                          height: responsiveHeight(5),
                          width: responsiveWidth(5),
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* End date view */}
                <TouchableOpacity
                  onPress={() => {
                    showDatepicker("end");
                  }}
                  style={IncidentStyle.dateView}>
                  <View>
                    <TextView
                      textSty={{
                        fontSize: 14,
                        color: endDate ? Colors.black : Colors.lightgray,
                      }}>
                      {formattedEndDate}
                    </TextView>
                  </View>
                  <View style={{ marginLeft: 5 }}>
                    <View>
                      {/* <Image
                        source={imagePath.datePickerIcon}
                        resizeMode="contain"
                      /> */}
                      <Image
                        source={imagePath.dateIcon}
                        resizeMode="contain"
                        style={{
                          height: responsiveHeight(5),
                          width: responsiveWidth(5),
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {searchTrue ? (
                  <TouchableOpacity
                    style={{ top: 25 }}
                    onPress={() => handleClose()}>
                    <Image
                      resizeMode="contain"
                      source={imagePath.close}
                      tintColor={Colors.black}
                      style={{
                        ...IncidentStyle.searchIconSty,
                        width: 25,
                        height: 25,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ top: 20 }}
                    onPress={() => handleSearch()}>
                    <Image
                      source={imagePath.searchIcon}
                      // resizeMode="contain"
                      style={{
                        ...IncidentStyle.searchIconSty,
                        width: 36,
                        height: 36,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* <DateTimePickerModal
                isVisible={showStartDatePicker}
                testID="dateTimePicker"
                mode={mode}
                onConfirm={(selectedDate) => {
                  onChange(selectedDate, "start");
                }}
                onCancel={() => setShowStartDatePicker(false)}
              />

              <DateTimePickerModal
                isVisible={showEndDatePicker}
                testID="dateTimePicker"
                mode={mode}
                onConfirm={(selectedDate) => {
                  onChange(selectedDate, "end");
                }}
                onCancel={() => setShowEndDatePicker(false)}
              /> */}
              {/* // In your JSX where DateTimePickerModal is used: */}
              <DateTimePickerModal
                isVisible={showStartDatePicker}
                testID="dateTimePicker"
                mode={mode}
                onConfirm={(selectedDate) => {
                  onChange(selectedDate, "start");
                }}
                onCancel={() => setShowStartDatePicker(false)}
              />
              <DateTimePickerModal
                isVisible={showEndDatePicker}
                testID="dateTimePicker"
                mode={mode}
                minimumDate={startDate ? getNextDay(startDate) : null} // Set minimum date to one day after the start date
                onConfirm={(selectedDate) => {
                  onChange(selectedDate, "end");
                }}
                onCancel={() => setShowEndDatePicker(false)}
              />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 8,
                }}
              />
              <View style={IncidentStyle.LocationView}>
                <View style={{ flex: 0.5 }}>
                  <TextView
                    heading
                    headingTextSty={IncidentStyle.LeicesterHeading}>
                    {AllStrings.Reported}
                  </TextView>
                </View>
                <View style={IncidentStyle.statusViewSty}>
                  <TextView
                    heading
                    headingTextSty={IncidentStyle.LeicesterHeading}>
                    {/* {AllStrings.IncidentType} */}
                    Location
                  </TextView>
                  <Image source={imagePath.SortMenu} />
                </View>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 1,
                }}
              />
              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                // columnWrapperStyle={{ justifyContent: "space-around" }}
                data={LeicesterDate}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={{ marginBottom: 10 }}
              />
              {LeicesterDate?.length == 0 && (
                <View style={styles.noIncidentView}>
                  <ImageBackground
                    resizeMode="contain"
                    source={imagePath?.ReportedIncidents_GRN}
                    style={styles.imageBackground}
                    imageStyle={styles.imageStyle} // Applying opacity to the image itself
                  >
                    <TextView heading headingTextSty={styles.text}>
                      No incident found
                    </TextView>
                  </ImageBackground>
                </View>
                // <View>
                //   <TextView
                //     heading
                //     headingTextSty={{
                //       fontSize: 14,
                //       color: Colors.black,
                //       textAlign: "center",
                //       marginVertical: 100,
                //     }}>
                //     No incidents found
                //   </TextView>
                // </View>
              )}
              {LeicesterDate?.length !== 0 && (
                <Button
                  onClick={() =>
                    navigation.navigate(navigationString.incidentNav, {
                      key: "reportedIncident",
                    })
                  }
                  allButtonSty={{
                    alignSelf: "center",
                    width: "75%",
                    borderRadius: 10,
                    position: "sticky",

                    marginTop: 10, // Adjust margin top as needed
                  }}
                  btnName="Report An Incident"
                  buttonColor={Colors.black}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Incident;

const styles = StyleSheet.create({
  noIncidentView: {
    // marginTop: 20,
  },
  imageBackground: {
    width: "100%",

    height: Platform.OS === "ios" ? 200 : 290,
    justifyContent: "center", // Centering the text vertically
    alignItems: "center", // Centering the text horizontally
  },
  imageStyle: {
    opacity: 0.2,
    marginTop: Platform.OS === "ios" ? -26 : 0,
    // width: 350,
    // height: 370,
    width: Platform.OS === "ios" ? responsiveWidth(95) : responsiveWidth(95),
    height: Platform.OS === "ios" ? responsiveHeight(45) : responsiveHeight(45),
  },
  text: {
    // fontSize: 14,
    // color: Colors.black,
    // textAlign: "center",
    fontSize: 18,
    top: Platform.OS === "ios" ? 10 : -10,
    color: Colors.black,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    letterSpacing: -1.5,
  },
});
