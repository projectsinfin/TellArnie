import {
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AdminStyle from "./AdminStyle";
import TextView from "../../Components/TextView";
import Colors from "../../Styles/Colors";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import Loading from "../../Components/Loading";
import navigationString from "../../Navigations/navigationString";
import {
  call_KisStatus_API,
  call_UpdateRiskCal,
} from "../../redux/action/ManageKits";
import { useDispatch } from "react-redux";
import imagePath from "../../Constant/imagePath";
import moment from "moment";

const RiskAssessment = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoadings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [LeicesterDates, setLeicesterDate] = useState([]);
  const [showUpdateRisk, setShowUpdateRisk] = useState({});
  const [updateKits, setUpdateKits] = useState([]);

  const productNames = [1, 2, 3];
  const productName4 = [1, 2, 3, 4];

  useEffect(() => {
    kitDetails();
  }, []);

  console.log("LeicesterDates---Risk ass--", JSON.stringify(LeicesterDates));

  const kitDetails = () => {
    setIsLoadings(true);
    dispatch(call_KisStatus_API())
      .then((res) => {
        console.log("999----", JSON.stringify(res.payload));
        if (res.payload.status === 200) {
          setIsLoadings(false);
          setLeicesterDate(res.payload.locations);
        } else {
          setIsLoadings(false);
          console.log("err ", res.payload.message);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log(err);
      });
  };

  const UpdateRiskCal = (id) => {
    const payload = {
      kit_ids: [id],
    };
    setIsLoadings(true);
    dispatch(call_UpdateRiskCal(payload))
      .then((res) => {
        if (res.payload.status === 200) {
          setIsLoadings(false);
          setUpdateKits(res.payload?.kits);
          // setLeicesterDate(res.payload.locations);
        } else {
          setIsLoadings(false);
          console.log("err ", res.payload.message);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log(err);
      });
  };

  console.log("999sd555fsiuoiuf", JSON.stringify(updateKits));

  const handleRefresh = () => {
    setIsRefreshing(true);
    kitDetails();
    setIsRefreshing(false);
  };

  const handleShowUpdateRisk = (index) => {
    setShowUpdateRisk((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 2,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }>
        <Modal animated={true} transparent={true} visible={isLoading}>
          <Loading />
        </Modal>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(10),
          }}>
          <TextView heading headingTextSty={AdminStyle.generateQuote}>
            All Areas Identified In The Business
          </TextView>

          {LeicesterDates?.map((item, ind) => (
            <View key={ind}>
              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                }}>
                {item?.name}
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 1,
                }}
              />
              {item?.kits?.map((areaStatus, index) => (
                <React.Fragment key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 15,
                      padding: 10,
                      backgroundColor:
                        index % 2 == 0 ? null : Colors.greenLightTint,
                    }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...AdminStyle.generateQuote,
                        marginVertical: 0,
                        textAlign: "left",
                      }}>
                      {areaStatus.area}
                    </TextView>

                    {areaStatus.is_assessment === true ? (
                      <TouchableOpacity
                        onPress={() => {
                          handleShowUpdateRisk(index);
                          UpdateRiskCal(areaStatus?.kit_id);
                        }}>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <TextView textSty={{ color: Colors.primary }}>
                            Completed
                          </TextView>
                          <Image
                            source={imagePath.Refresh_Code}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            navigationString.areaRiskCalculator,
                            {
                              item: areaStatus,
                              areaName: item?.name,
                              areaId: item?._id,
                            }
                          )
                        }
                        activeOpacity={0.7}
                        style={AdminStyle.startButton}>
                        <TextView
                          heading
                          headingTextSty={{
                            ...AdminStyle.generateQuote,
                            marginVertical: 0,
                          }}>
                          Start
                        </TextView>
                      </TouchableOpacity>
                    )}
                  </View>

                  {showUpdateRisk[index] && (
                    <View style={styles.cardContainer}>
                      <View style={styles.areaContainer}>
                        <Text style={styles.areaName}>
                          {updateKits[0]?.area}
                        </Text>
                        <Text style={styles.assessmentStatus}>
                          Assessment Completed
                        </Text>
                      </View>

                      <View style={styles.detailsContainer}>
                        <View style={styles.detailsRow}>
                          <Text style={styles.label}>Risk Rating</Text>
                          <Text style={styles.label}>Date Completed</Text>
                        </View>
                        <View style={styles.detailsRow}>
                          <Text style={styles.value}>
                            {updateKits[0]?.risk_level}
                          </Text>
                          <Text style={styles.value}>
                            {moment(updateKits[0]?.date).format("DD MMM YYYY")}
                          </Text>
                        </View>
                        <View style={{ ...styles.detailsRow, marginTop: 10 }}>
                          <Text style={styles.label}>Recommended Kit</Text>
                          <TouchableOpacity
                            style={styles.updateButton}
                            onPress={() =>
                              navigation.navigate(
                                navigationString.areaRiskCalculator,
                                {
                                  item: areaStatus,
                                  areaName: item?.name,
                                  areaId: item?._id,
                                }
                              )
                            }>
                            <Text style={styles.updateButtonText}>
                              Update Risk
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ ...styles.detailsRow, top: -25 }}>
                          <Text style={{ ...styles.value, width: "60%" }}>
                            {updateKits[0]?.product_name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RiskAssessment;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    // borderColor: "purple",
    paddingTop: 36,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  areaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  areaName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  assessmentStatus: {
    fontSize: 14,
    color: "#047835",
  },
  detailsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#888888",
  },
  value: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  updateButton: {
    backgroundColor: "#A1D55D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  updateButtonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
});

// import {
//   Image,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import AdminStyle from "./AdminStyle";
// import TextView from "../../Components/TextView";
// import Colors from "../../Styles/Colors";
// import {
//   moderateScale,
//   moderateScaleVertical,
// } from "../../Styles/responsiveSize";
// import Loading from "../../Components/Loading";
// import navigationString from "../../Navigations/navigationString";
// import {
//   call_KisStatus_API,
//   call_UpdateRiskCal,
// } from "../../redux/action/ManageKits";
// import { useDispatch } from "react-redux";
// import imagePath from "../../Constant/imagePath";

// const RiskAssessment = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoadings] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [LeicesterDates, setLeicesterDate] = useState([]);
//   const [showUpdateRisk, setShowUpdateRisk] = useState(false);

//   const productNames = [1, 2, 3];
//   const productName4 = [1, 2, 3, 4];

//   useEffect(() => {
//     kitDetails();
//   }, []);

//   console.log("LeicesterDates---Risk ass--", JSON.stringify(LeicesterDates));

//   // call Kist status details api
//   const kitDetails = () => {
//     setIsLoadings(true);
//     dispatch(call_KisStatus_API())
//       .then((res) => {
//         console.log("999", JSON.stringify(res.payload));
//         if (res.payload.status === 200) {
//           setIsLoadings(false);
//           setLeicesterDate(res.payload.locations);
//         } else {
//           setIsLoadings(false);
//           console.log("err ", res.payload.message);
//         }
//       })
//       .catch((err) => {
//         setIsLoadings(false);
//         console.log(err);
//       });
//   };

//   const UpdateRiskCal = () => {
//     setIsLoadings(true);
//     dispatch(call_UpdateRiskCal())
//       .then((res) => {
//         console.log("999", JSON.stringify(res.payload));
//         if (res.payload.status === 200) {
//           setIsLoadings(false);
//           setLeicesterDate(res.payload.locations);
//         } else {
//           setIsLoadings(false);
//           console.log("err ", res.payload.message);
//         }
//       })
//       .catch((err) => {
//         setIsLoadings(false);
//         console.log(err);
//       });
//   };

//   const handleRefresh = () => {
//     // Set refreshing state to true
//     setIsRefreshing(true);
//     kitDetails();
//     setIsRefreshing(false);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: Colors.white,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingBottom: 2,
//       }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={handleRefresh}
//             colors={[Colors.primary]} // Customize the colors of the refresh indicator
//           />
//         }>
//         <Modal animated={true} transparent={true} visible={isLoading}>
//           <Loading />
//         </Modal>
//         <View
//           style={{
//             paddingHorizontal: moderateScale(20),
//             marginTop: moderateScaleVertical(10),
//           }}>
//           <TextView heading headingTextSty={AdminStyle.generateQuote}>
//             All Areas Identified In The Business
//           </TextView>

//           {LeicesterDates?.map((item, ind) => {
//             console.log("item,----", item);
//             return (
//               <View>
//                 <TextView
//                   heading
//                   headingTextSty={{
//                     ...AdminStyle.generateQuote,
//                     textAlign: "left",
//                   }}>
//                   {/* [Location Name] */}
//                   {item?.name}
//                 </TextView>
//                 <View
//                   style={{
//                     borderWidth: 1,
//                     borderColor: Colors.blackOpacity10,
//                     marginTop: 1,
//                   }}
//                 />
//                 {item?.kits?.map((areaStatus, index) => {
//                   return (
//                     <>
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           paddingVertical: 15,
//                           padding: 10,
//                           backgroundColor:
//                             index % 2 == 0 ? null : Colors.greenLightTint,
//                         }}>
//                         <TextView
//                           heading
//                           headingTextSty={{
//                             ...AdminStyle.generateQuote,
//                             marginVertical: 0,
//                             textAlign: "left",
//                           }}>
//                           {areaStatus.area}
//                         </TextView>
//                         {/* <TextView
//                         textSty={{
//                           color: Colors.primary,
//                           marginTop:
//                             Platform.OS === "android" &&
//                             areaStatus.is_assessment === false &&
//                             15,
//                         }}> */}
//                         {areaStatus.is_assessment === true ? (
//                           <View style={{ flexDirection: "row", gap: 5 }}>
//                             <TextView
//                               textSty={{
//                                 color: Colors.primary,
//                               }}>
//                               Completed
//                             </TextView>
//                             <Image
//                               source={imagePath.Refresh_Code}
//                               resizeMode="contain"
//                             />
//                           </View>
//                         ) : (
//                           <TouchableOpacity
//                             onPress={() =>
//                               navigation.navigate(
//                                 navigationString.areaRiskCalculator,
//                                 { item: areaStatus }
//                               )
//                             }
//                             activeOpacity={0.7}
//                             style={AdminStyle.startButton}>
//                             <TextView
//                               heading
//                               headingTextSty={{
//                                 ...AdminStyle.generateQuote,
//                                 marginVertical: 0,
//                               }}>
//                               Start
//                             </TextView>
//                           </TouchableOpacity>
//                         )}
//                         {/* </TextView> */}
//                       </View>

//                       {/* update risk */}
//                       <View style={styles.cardContainer}>
//                         <View style={styles.areaContainer}>
//                           <Text style={styles.areaName}>[Area Name]</Text>
//                           <Text style={styles.assessmentStatus}>
//                             Assessment Completed
//                           </Text>
//                         </View>

//                         <View style={styles.areaContainer}>
//                           <Text style={styles.areaName}>[Area Name]</Text>
//                           <Text style={styles.assessmentStatus}>
//                             Assessment Completed
//                           </Text>
//                         </View>

//                         <View style={styles.detailsContainer}>
//                           <View style={styles.detailsRow}>
//                             <Text style={styles.label}>Risk Rating</Text>
//                             <Text style={styles.label}>Date Completed</Text>
//                           </View>
//                           <View style={styles.detailsRow}>
//                             <Text style={styles.value}>Rating</Text>
//                             <Text style={styles.value}>15 March 2024</Text>
//                           </View>
//                           <View style={{ ...styles.detailsRow, marginTop: 10 }}>
//                             <Text style={styles.label}>Recommended Kit</Text>
//                             <TouchableOpacity
//                               style={styles.updateButton}
//                               onPress={() =>
//                                 navigation.navigate(
//                                   navigationString.areaRiskCalculator,
//                                   {
//                                     item: "areaStatus",
//                                   }
//                                 )
//                               }>
//                               <Text style={styles.updateButtonText}>
//                                 Update Risk
//                               </Text>
//                             </TouchableOpacity>
//                           </View>
//                           <View style={{ ...styles.detailsRow, top: -25 }}>
//                             <Text style={styles.value}>Name of Kit</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </>
//                   );
//                 })}
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default RiskAssessment;

// const styles = StyleSheet.create({
//   topRow: {},
//   cardContainer: {
//     borderWidth: 1,
//     borderColor: "purple", // or any color you prefer
//     // padding: 16,
//     paddingTop: 36,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     backgroundColor: "#333", // dark background
//     // margin: 16,
//   },
//   areaContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   areaName: {
//     fontSize: 16,
//     color: "#FFFFFF", // white text
//     fontWeight: "bold",
//   },
//   assessmentStatus: {
//     fontSize: 14,
//     color: "#047835", // green text
//   },
//   detailsContainer: {
//     marginTop: 16,
//     marginBottom: 16,
//   },
//   detailsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   label: {
//     fontSize: 14,
//     color: "#888888", // grey text
//   },
//   value: {
//     fontSize: 14,
//     color: "#FFFFFF", // white text
//   },
//   updateButton: {
//     backgroundColor: "#A1D55D", // lime green background for the button
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignSelf: "flex-start",
//   },
//   updateButtonText: {
//     fontSize: 16,
//     color: "#000000", // black text
//     fontWeight: "bold",
//   },
// });
