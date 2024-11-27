import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { LineChart } from "react-native-chart-kit";
import imagePath from "../../Constant/imagePath";
import Colors from "../../Styles/Colors";
import CustomTable from "../../Components/CustomTable";
import CustomTabs from "../../Components/CustomTabs";
import TextView from "../../Components/TextView";
import AdminStyle from "./AdminStyle";
import CompanyInformation from "../ComanyInformation";
import Button from "../../Components/Button";
import { height, moderateScale, width } from "../../Styles/responsiveSize";
import RegisterUser from "./RegisterUser";
import { useDispatch, useSelector } from "react-redux";
import { NewLocation, addCompInfoVal } from "../../redux/reducer/auth";
import navigationString from "../../Navigations/navigationString";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { call_ManageUser_Api } from "../../redux/action/ManageUserAction";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../Components/Loading";
import {
  call_AdminDeashboard_API,
  call_approve_user,
} from "../../redux/action/AdminAction";
import { SCREEN_WIDTH } from "../../Constant/dimensions";
import moment from "moment";
import GenerateQuote from "./GenerateQuote";
import RiskAssessment from "./RiskAssessment";
import CustomAlert from "../../Components/CustomAlert";
import EditRegisterUser from "./EditRegisterUser";

const Admin = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const newLocation = useSelector((state) => state.auth.nav);
  console.log(route.params, "----new location ", newLocation);

  const [showDashboard, setShowDashboard] = useState("Dashboard");
  const [isLoadings, setisLoadings] = useState(false);
  const [datas, setData] = useState([]);
  const [DashboardData, setDashboardData] = useState([]);
  const [riskRating, setRiskRating] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [swicthScreen, setSwicthScreens] = useState("MANAGE_USERS");
  const [tabs, setTabs] = useState([
    "Dashboard",
    "Manage Users",
    "Company Details",
  ]);
  const [tabsTitle, setTabstitle] = useState([
    "Dashboard",
    "Manage Users",
    "Company Info",
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const data = {
    labels: DashboardData?.incidentCountsByDate?.incident_date,
    datasets: [
      {
        data: DashboardData?.incidentCountsByDate?.count || [0, 1, 2, 3, 4, 20],
        // ? DashboardData?.incidentCountsByDatem?.count
        // : [0, 1, 2, 3, 4, 20],

        strokeWidth: 2, // optional
      },
    ],
  };
  // const data = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //   datasets: [
  //     {
  //       data: ["0", "5", "10", "15", "20"],
  //       // ? DashboardData?.incidentCountsByDatem?.count
  //       // : [0, 1, 2, 3, 4, 20],

  //       strokeWidth: 2, // optional
  //     },
  //   ],
  // };

  console.log("----DashboardData++++++++", JSON.stringify(DashboardData));
  const getSelectedTab = (data) => {
    // console.log("1tab 1");
    manageUserAPI();
    setSelectedTab(data);
    dispatch(NewLocation({}));
    dispatch(addCompInfoVal("bb"));
    setSwicthScreens("MANAGE_USERS");
    setShowDashboard("Dashboard");
    setRegisterValue();
  };

  const setRegisterValue = () => {
    setTabs((prevTabs) => {
      console.log(prevTabs, "---pre tabs");
      const newTabs = [...prevTabs]; // Create a copy of the previous tabs array
      console.log(newTabs, "---newTabs");
      // Find the index of "Manage Users"
      const manageUsersIndex = newTabs.findIndex(
        (tab) => tab === "Register User"
      );
      console.log(manageUsersIndex, "---manageUsersIndex");
      if (manageUsersIndex !== -1) {
        // If "Manage Users" is found in the array
        // Replace it with the new value
        newTabs[manageUsersIndex] = "Manage Users"; // Replace "Your New Value" with the value you want to set
      }
      return newTabs; // Return the updated tabs array
    });
  };

  useEffect(() => {
    if (isFocused) {
      manageUserAPI();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true to show the spinner
    manageUserAPI(); // Call the function to fetch new data
    setRefreshing(false);
  };

  const manageUserAPI = () => {
    setisLoadings(true);
    dispatch(call_ManageUser_Api())
      .then((res) => {
        // console.log("manage user --", JSON.stringify(res.payload));
        if (res.payload.status === 200) {
          setData(res.payload.data.Users);
          setisLoadings(false);
        } else {
          alert(res?.payload?.message);
          setisLoadings(false);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log(err);
      });
  };

  // Function to handle pull-to-refresh
  const isApproved = (val, clickStatus) => {
    // console.log(val, "-------click action", clickStatus);
    const payload = {
      user_id: val?._id,
      is_approved: clickStatus == "Ok" ? true : false,
    };
    setisLoadings(true);
    console.log("payload-------", payload);
    dispatch(call_approve_user(payload))
      .then((res) => {
        console.log("---is approved---", res.payload);
        if (res.payload.status === 200) {
          handleShowAlert(res.payload?.message);
          manageUserAPI();
          setisLoadings(false);
        } else {
          setisLoadings(false);
          // handleShowAlert(res.payload?.message);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("err---", err);
      });
  };

  const completeDelete = () => {
    manageUserAPI();
  };
  const ManageUsers = () => {
    return (
      <View
        style={{
          flex: 1,
          // height: responsiveHeight(100),
          flexGrow: 1,
          backgroundColor: Colors.white,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
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
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              flexDirection: "row",
              marginTop: 20,
            }}>
            <Text
              style={{ color: Colors.black, fontSize: 14, fontWeight: 700 }}>
              Registered Users
            </Text>
            {/* <Text style={{ color: Colors.black, fontSize: 14, fontWeight: 700 }}>
            -
          </Text> */}
            <Image source={imagePath.SortMenu} resizeMode="contain" />
          </View>
          <View
            style={{
              borderBottomColor: "grey",
              marginTop: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <CustomTable
            type={"manageUsers"}
            columns={["Name", "Role", "Location"]}
            rowsData={datas}
            isApproved={isApproved}
            completeDelete={completeDelete}
            setSwicthScreens={setSwicthScreens}
          />

          <View style={{ margin: 15 }}>
            <Button
              buttonColor={Colors.black}
              onClick={() => {
                setSwicthScreens("REGISTER_USER");

                setTabs((prevTabs) => {
                  console.log(prevTabs, "---pre tabs");
                  const newTabs = [...prevTabs]; // Create a copy of the previous tabs array
                  console.log(newTabs, "---newTabs");
                  // Find the index of "Manage Users"
                  const manageUsersIndex = newTabs.findIndex(
                    (tab) => tab === "Manage Users"
                  );
                  console.log(manageUsersIndex, "---manageUsersIndex");
                  if (manageUsersIndex !== -1) {
                    // If "Manage Users" is found in the array
                    // Replace it with the new value
                    newTabs[manageUsersIndex] = "Register User"; // Replace "Your New Value" with the value you want to set
                  }
                  return newTabs; // Return the updated tabs array
                });
              }}
              btnName="Register a New User"></Button>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSwicthComponent = {
    MANAGE_USERS: <ManageUsers />,
    REGISTER_USER: (
      <RegisterUser
        setSelectedTab={setSelectedTab}
        setSwicthScreens={setSwicthScreens}
        navigation={navigation}
        setRegisterValue={setRegisterValue}
      />
    ),
    EDIT_REGISTER_USER: <EditRegisterUser />,
  };

  useEffect(() => {
    showdata();
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      if (newLocation.New_Location == "Risk Assessment") {
        // return setShowDashboard("Quote Dashboard");
        dispatch(NewLocation({}));
        <CompanyInformation navigation={navigation} />;
        dispatch(addCompInfoVal("bb"));
      } else {
        dispatch(NewLocation({}));
        setShowDashboard("Dashboard");
        setSelectedTab(0);
        showdata();
      }
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  const showdata = () => {
    setisLoadings(true);
    dispatch(call_AdminDeashboard_API())
      .then((res) => {
        // console.log("admin *****- ", JSON.stringify(res.payload));
        if (res.payload.status === 200) {
          setDashboardData(res.payload.data);
          setisLoadings(false);
        } else {
          setisLoadings(false);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("admin notification err- ", err);
      });
  };

  const DashboardScreen = () => {
    return (
      <React.Fragment>
        <View style={AdminStyle.circleContainer}>
          {/* kits are fully compliant */}

          <View style={AdminStyle.circleView}>
            <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
              {DashboardData?.compliantCount}
            </TextView>
            <TextView
              heading
              headingTextSty={{
                ...AdminStyle.circleText,
                fontSize: 8.3,
                letterSpacing: -0.1,
                lineHeight: 10,
              }}>
              {/* Kits are fully compliant  */}
              Complete or compliant kits
            </TextView>
          </View>

          {/* Kits expire in {">"} 90 days */}
          <View
            style={{
              ...AdminStyle.circleView,
              backgroundColor: "#FAA500",
            }}>
            <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
              {DashboardData?.kitsExpiringWithin90Days}
            </TextView>
            <TextView
              heading
              headingTextSty={{
                ...AdminStyle.circleText,
                fontSize: 8.3,
                letterSpacing: -0.1,
                lineHeight: 10,
              }}>
              {/* Kits expire {"\n"} in {">"} 90 days */}
              Kits expire {"\n"} in {"<"} 90 days
            </TextView>
          </View>
          {/* Kits are not compliant */}
          <View style={{ ...AdminStyle.circleView, backgroundColor: "red" }}>
            <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
              {DashboardData?.nonCompliantCount}
            </TextView>
            <TextView
              heading
              headingTextSty={{
                ...AdminStyle.circleText,
                fontSize: 8.3,
                letterSpacing: -0.1,
                lineHeight: 10,
              }}>
              Incomplete or expired kits
              {/* Kits are not compliant */}
            </TextView>
          </View>
        </View>

        <View
          style={{
            width: "80%",
            alignSelf: "center",
          }}>
          <TextView
            heading
            headingTextSty={{
              ...AdminStyle.circleText,
              fontSize: 12,
              letterSpacing: -0.1,
              lineHeight: 20,
              color: Colors.black,
              marginTop: 10,
            }}>
            Do you need to order more first aid supplies?
          </TextView>
          <Button
            onClick={() => setShowDashboard("Quote Dashboard")}
            allButtonSty={{ marginVertical: 25, paddingVertical: 3 }}
            btnName="Generate Quote"
            buttonColor={Colors.black}
          />
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <View
            style={{
              ...AdminStyle.largeview,
              backgroundColor: Colors.black,
            }}>
            <TextView heading headingTextSty={AdminStyle.text29}>
              {DashboardData?.daysSinceLatestNonDetailedIncident == null ||
              DashboardData?.daysSinceLatestNonDetailedIncident == -1
                ? 0
                : DashboardData?.daysSinceLatestNonDetailedIncident}
            </TextView>

            <TextView
              heading
              headingTextSty={{
                ...AdminStyle.LeicesterText,
                color: Colors.white,
                textAlign: "center",
              }}>
              Days Without Reported Safety Issues
            </TextView>
          </View>
          <View style={AdminStyle.largeview}>
            <TextView heading headingTextSty={AdminStyle.text29}>
              {DashboardData?.daysSinceLatestDetailedIncident == null ||
              DashboardData?.daysSinceLatestDetailedIncident == -1
                ? 0
                : DashboardData?.daysSinceLatestDetailedIncident}
            </TextView>
            <TextView
              heading
              headingTextSty={{
                ...AdminStyle.LeicesterText,
                color: Colors.white,
                textAlign: "center",
              }}>
              Days Without Reported Serious Injury
            </TextView>
          </View>
        </View>

        <View style={{ backgroundColor: Colors.white, paddingHorizontal: 15 }}>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 14,
              flexDirection: "row",
              marginTop: 30,
            }}>
            <Text
              style={{
                color: Colors.black,
                fontSize: 14,
                fontWeight: 700,
              }}>
              Recent Incident Reports
            </Text>

            <Image source={imagePath.SortMenu} resizeMode="contain" />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.blackOpacity10,
              marginTop: 8,
              marginHorizontal: 14,
            }}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            // columnWrapperStyle={{ justifyContent: "space-around" }}
            data={DashboardData?.incidents}
            renderItem={({ item, index }) => (
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
                  backgroundColor:
                    index % 2 == 0 ? null : Colors.greenLightTint,
                  paddingHorizontal: 15,
                }}>
                <View style={{ flex: 0.5 }}>
                  <TextView
                    heading
                    headingTextSty={IncidentStyle.LeicesterHeading}>
                    {moment(item?.incident_date).format("DD MMM yyyy") +
                      " " +
                      item?.incident_time}
                  </TextView>
                  {/* <TextView textSty={IncidentStyle.LeicesterText}>
                    {item?.area_of_incident}
                  </TextView> */}
                </View>
                <View style={{ flex: 0.4 }}>
                  <TextView
                    heading
                    headingTextSty={IncidentStyle.LeicesterHeading}>
                    {/* {item?.category_of_incident} */}
                    {item?.location_of_incident}, {item?.area_of_incident}
                  </TextView>
                  {/* <TextView textSty={IncidentStyle.LeicesterText}>
                    {item?.classification}
                  </TextView> */}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
            style={{ marginBottom: 10 }}
          />
          {DashboardData?.incidents?.length == 0 && (
            <View>
              <TextView
                heading
                headingTextSty={{
                  marginTop: 5,
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: "center",
                  marginVertical: 50,
                }}>
                No incidents reported
              </TextView>
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: "#cde4d7",
            width: "100%",
            marginTop: 30,
          }}>
          {DashboardData?.incidentCountsByDate?.incident_date == 0 ? null : (
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: 700,
                }}>
                Incident Trend
              </Text>

              <LineChart
                data={data}
                bezier
                width={width} // Width of the chart
                height={moderateScale(180)} // Height of the chart
                // yAxisLabel="$" // Y-axis label (e.g., "$")
                yAxisInterval={1}
                chartConfig={{
                  propsForDots: {
                    opacity: 0,
                  },
                  backgroundColor: "#cde4d7", // Background color of the chart
                  backgroundGradientFrom: "#cde4d7", // Background gradient from color
                  backgroundGradientTo: "#cde4d7", // Background gradient to color
                  decimalPlaces: 0, // Number of decimal places for Y-axis labels
                  color: () => Colors.primary, // Color of the data points and lines
                  labelColor: () => Colors.black, // Color of the labels
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    strokeWidth: 2,
                    stroke: "#c8dfd2",
                    strokeDasharray: "0",
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  marginTop: 20,
                  marginLeft: -31,
                  width: "100%",
                  marginBottom: 10,
                }}
                withDots={false} // Hide the dots on the line chart
                withHorizontalLines={true} // Remove horizontal grid lines
                withVerticalLines={false} // Remove vertical grid lines
                withInnerLines={true}
              />
            </View>
          )}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 20,
              marginBottom: 30,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                fontWeight: 700,
              }}>
              First Aiders
            </Text>

            <View
              style={{
                ...AdminStyle.circleContainer,
                height: 130,
                marginBottom: -20,
                backgroundColor: "#cde4d7",
              }}>
              {/* kits are fully compliant */}

              <View style={AdminStyle.circleView}>
                <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
                  {DashboardData?.firstAidCertifiedUsersCount}
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...AdminStyle.circleText,
                    fontSize: 8.3,
                    letterSpacing: -0.1,
                    lineHeight: 10,
                  }}>
                  Certified
                </TextView>
              </View>

              {/* Kits expire in {">"} 90 days */}
              <View
                style={{
                  ...AdminStyle.circleView,
                  backgroundColor: "#FAA500",
                }}>
                <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
                  {DashboardData?.certificatesExpiringWithin90Days}
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...AdminStyle.circleText,
                    fontSize: 8.3,
                    letterSpacing: -0.1,
                    lineHeight: 10,
                  }}>
                  Certificates expire in {"<"} 90 days
                </TextView>
              </View>
              {/* Kits are not compliant */}
              <View
                style={{ ...AdminStyle.circleView, backgroundColor: "red" }}>
                <TextView heading headingTextSty={{ ...AdminStyle.circleText }}>
                  {DashboardData?.expiredCertificatesCount}
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    ...AdminStyle.circleText,
                    fontSize: 8.3,
                    letterSpacing: -0.1,
                    lineHeight: 10,
                  }}>
                  Expired Certificates
                </TextView>
              </View>
            </View>
          </View>

          {console.log(
            "DashboardData?.personal_risk_rating.length--",
            DashboardData?.personal_risk_rating?.length
          )}
          <View style={{ backgroundColor: Colors.white, width: "100%" }}>
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: 700,
                }}>
                Personnel Risk Rating
              </Text>
              <View
                style={{
                  borderBottomColor: "grey",
                  marginTop: 10,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <CustomTable
                headerText={{
                  textAlign: "left",
                  marginLeft: moderateScale(23),
                }}
                type={"Dashboard"}
                columns={["Name", "# of incidents", "Rating"]}
                rowsData={DashboardData?.personal_risk_rating}
              />
              {DashboardData?.personal_risk_rating?.length === 0 && (
                <TextView
                  heading
                  headingTextSty={{
                    marginTop: 5,
                    fontSize: 14,
                    color: Colors.black,
                    textAlign: "center",
                    marginVertical: 52,
                  }}>
                  No Personnel Risk Rating
                </TextView>
              )}
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  };

  const RenderConditionalScreens = () => {
    switch (showDashboard) {
      case "Dashboard":
        return <DashboardScreen />;
      case "Quote Dashboard":
        return <GenerateQuote setShowDashboard={setShowDashboard} />;
      // return <RiskAssessment />;
      default:
        return <DashboardScreen />; // Set default value to CompanyDetails
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
      />
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={
          tabs[1] == "Register User" ||
          newLocation.New_Location ||
          showDashboard == "Quote Dashboard"
            ? imagePath.backArrow
            : null
        }
        // editHeader={() => navigation.goBack()}
        editHeader={() => {
          tabs[1] == "Register User"
            ? (setRegisterValue(), setSwicthScreens("MANAGE_USERS"))
            : showDashboard == "Quote Dashboard"
            ? setShowDashboard("Dashboard")
            : dispatch(addCompInfoVal("bb"));
          dispatch(NewLocation({}));
        }}
      />

      <View
        style={{
          // flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <TextView heading headingTextSty={AdminStyle.headingContainer}>
          {newLocation.New_Location
            ? newLocation.New_Location === "Risk Assessment"
              ? "Risk Assessment"
              : newLocation.New_Location === "Update Locaion"
              ? "Update Locaion"
              : "New Location"
            : tabs[selectedTab]}
        </TextView>
      </View>

      {/* Tab View Container */}
      <View style={AdminStyle.tabView}>
        {tabsTitle.map((x, i) => {
          return (
            <CustomTabs
              key={i}
              index={i}
              title={x}
              selectedTab={selectedTab}
              setSelectedTab={getSelectedTab}
            />
          );
        })}
      </View>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {selectedTab === 0 ? (
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: Colors.white }}>
          <RenderConditionalScreens />
        </ScrollView>
      ) : selectedTab === 1 ? (
        <React.Fragment>{renderSwicthComponent[swicthScreen]}</React.Fragment>
      ) : (
        <React.Fragment>
          <CompanyInformation navigation={navigation} />
        </React.Fragment>
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Admin;

const styles = StyleSheet.create({});
