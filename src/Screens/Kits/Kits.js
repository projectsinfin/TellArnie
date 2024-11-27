import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../Constant/imagePath";
import Colors from "../../Styles/Colors";
import kitsStyles from "./kitsStyles";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import { moderateScale } from "../../Styles/responsiveSize";
import ModalScreen from "../../Components/ModalScreen";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { call_KisStatus_API } from "../../redux/action/ManageKits";
import Loading from "../../Components/Loading";
import { SwipeListView } from "react-native-swipe-list-view";
import { addQRCode } from "../../redux/reducer/auth";
import { call_delete_Kit_API } from "../../redux/action/AdminAction";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const Kits = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [listId, setListId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [LeicesterDates, setLeicesterDate] = useState(null);
  const [isLoadings, setIsLoadings] = useState(false);
  const [isItemId, setIsItemId] = useState("");

  console.log("LeicesterDates---", JSON.stringify(LeicesterDates));

  const details = [
    {
      id: 1,
      image: imagePath.view_Folder,
      title: "View",
      nav: navigationString.productFound,
    },
    {
      id: 2,
      image: imagePath.archive_Folder,
      title: "Archive",
      nav: () => handleArchiveButtonPress(),
    },
  ];

  // Logic for handling "Archive" button press
  const handleArchiveButtonPress = (id) => {
    // Toggle showModal to display the archive modal
    setIsItemId(id);
    setShowModal(true);
  };

  const handleArchiveConfirmation = () => {
    dispatch(call_delete_Kit_API(isItemId))
      .then((res) => {
        if (res.payload.status === 200) {
          // Close the archive modal
          setIsItemId("");
          setShowModal(false);

          // Show the success modal
          setshowSuccess(true);
          kitDetails();
        }
        setIsLoadings(false);
      })
      .catch((err) => {
        setIsLoadings(false);
        console.error("Error deleting kit:", err);
      });
  };

  useEffect(() => {
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      console.log("Screen is focused");
      setCheckStatus(false);
      kitDetails();
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  // call Kist status details api
  const kitDetails = () => {
    setIsLoadings(true);
    dispatch(call_KisStatus_API())
      .then((res) => {
        console.log("call_KisStatus_API---", JSON.stringify(res.payload));
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

  // const renderHiddenItem = ({ item, index }) => (
  //   // <View style={styles.rowBack}>
  //   <TouchableOpacity
  //     style={[styles.backRightBtn, styles.backRightBtnRight]}
  //     onPress={() => {
  //       setIsLoadings(true);
  //       dispatch(call_delete_Kit_API(item?.kit_id))
  //         .then((res) => {
  //           kitDetails();
  //           setIsLoadings(false);
  //         })
  //         .catch((err) => {
  //           setIsLoadings(false);
  //           console.log("err product delete--", err);
  //         });
  //     }}>
  //     <Image
  //       source={imagePath.deleteIcon}
  //       tintColor={Colors.black}
  //       resizeMode="contain"
  //     />
  //   </TouchableOpacity>
  //   // </View>
  // );

  const renderHiddenItem = ({ item, index }, rowMap) => {
    const locationIndex = LeicesterDates.findIndex((location) =>
      location.kits.some((kit) => kit.kit_id === item.kit_id)
    );

    return (
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDeleteKit(locationIndex, item.kit_id)}>
        <Image
          source={imagePath.deleteIcon}
          tintColor={Colors.black}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const handleDeleteKit = (locationIndex, kitId) => {
    setIsLoadings(true);
    dispatch(call_delete_Kit_API(kitId))
      .then((res) => {
        if (res.payload.status === 200) {
          const updatedLocations = LeicesterDates.map((location, index) => {
            if (index === locationIndex) {
              const updatedKits = location.kits.filter(
                (kit) => kit.kit_id !== kitId
              );
              return { ...location, kits: updatedKits };
            }
            return location;
          });
          setLeicesterDate(updatedLocations);
        }
        setIsLoadings(false);
      })
      .catch((err) => {
        setIsLoadings(false);
        console.error("Error deleting kit:", err);
      });
  };

  const formate = (string) => {
    const words = string.split("_");

    // Capitalize the first letter of each word and join them back with spaces
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header back={() => navigation.navigate(navigationString.profile)} />
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>

      <View style={{ flex: 1 }}>
        {/* Green section */}
        <TextView heading headingTextSty={kitsStyles.headingContainer}>
          {AllStrings.KitManagement}
        </TextView>
        <TextView
          textSty={{
            ...kitsStyles.Monitorsafetyproducts,
            // width: "95%",
            paddingHorizontal: Platform.OS === "android" ? 2 : 15,
            textAlign: "center",
          }}>
          {/* {AllStrings.Monitorsafetyproducts} */}
          Keep within the law and in control of your workplace first aid.
          {/* Monitor, update and retire your safety Products 
          Keep within the law and in control of your workplace first aid
          */}
        </TextView>

        {/* Rest of the content */}

        <View style={kitsStyles.buttonContainer}>
          <ImageBackground
            resizeMode="contain"
            source={
              LeicesterDates?.length == 0 && imagePath?.RegisterFirstAidBox_GRN
            }
            style={{ marginTop: 20 }}
            imageStyle={{
              opacity: 0.25,
              width: responsiveWidth(100),
              height: responsiveHeight(40),
              marginTop: 60,
            }}>
            <ScrollView>
              <View
              // resizeMode="contain"
              // source={imagePath?.RegisterFirstAidBox_GRN}
              // style={{ marginTop: 20 }}
              // imageStyle={{ opacity: 0.3 }}
              >
                {LeicesterDates?.map((item, ind) => {
                  return (
                    <View>
                      <View style={kitsStyles.LocationView}>
                        <View style={{ flex: 0.5 }}>
                          <TextView
                            heading
                            headingTextSty={kitsStyles.LeicesterHeading}>
                            {/* {AllStrings.LeicesterSquare} */}
                            {item?.name}
                          </TextView>
                        </View>
                        <View style={kitsStyles.statusViewSty}>
                          <TextView
                            heading
                            headingTextSty={kitsStyles.LeicesterHeading}>
                            {AllStrings.Status}
                          </TextView>
                          <Image source={imagePath.SortMenu} />
                        </View>
                      </View>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: Colors.blackOpacity10,

                          marginHorizontal: 14,
                        }}
                      />

                      {item?.kits.length == 0 && (
                        <TextView
                          heading
                          headingTextSty={{
                            // marginTop: 5,
                            fontSize: 14,
                            color: Colors.black,
                            textAlign: "center",
                            // marginTop: 100,
                            marginVertical: 5,
                          }}>
                          No Kits Installed
                        </TextView>
                      )}

                      <SwipeListView
                        // columnWrapperStyle={{ justifyContent: "space-around" }}
                        data={item?.kits}
                        renderHiddenItem={renderHiddenItem}
                        keyExtractor={(item) => item.key}
                        // leftOpenValue={75}
                        rightOpenValue={-75}
                        style={{
                          height: "auto",
                          marginTop: 1,
                          marginBottom: 10,
                          marginBottom: 20,
                        }}
                        renderItem={({
                          item: innerItem,
                          index: innerIndex,
                        }) => {
                          let statusImage;
                          switch (innerItem.status) {
                            case "Compliant":
                              statusImage = imagePath.ComplaintsIcon;
                              break;
                            case "compliant":
                              statusImage = imagePath.ComplaintsIcon;
                              break;
                            case "non_compliant":
                              statusImage = imagePath.NonComplaintsIcon;
                              break;
                            case "near_expiry":
                              statusImage = imagePath.NearExpiry;
                              break;
                            default:
                              statusImage = null;
                          }

                          // product_name
                          const firstTwoLetters =
                            innerItem?.product_name?.substring(0, 2);

                          // console.log(
                          //   innerItem.status,
                          //   innerItem,
                          //   "First two letters:",
                          //   firstTwoLetters
                          // );
                          return (
                            <>
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                  // setListId(index);
                                  // setCheckStatus(!checkStatus);
                                  setListId(ind * 1000 + innerIndex); // Unique identifier
                                  setCheckStatus(!checkStatus);
                                }}
                                style={{
                                  flexDirection: "row",
                                  padding: 10,
                                  backgroundColor:
                                    innerIndex % 2 == 0
                                      ? Colors.white
                                      : Colors.greenLightTint,
                                  paddingHorizontal: 15,
                                }}>
                                <View style={{ flex: 0.5 }}>
                                  <TextView textSty={kitsStyles.LeicesterText}>
                                    {innerItem?.area}
                                  </TextView>
                                </View>
                                {firstTwoLetters === "BS" ? (
                                  <View
                                    style={{ flex: 0.4, flexDirection: "row" }}>
                                    <Image
                                      source={statusImage}
                                      resizeMode="contain"
                                    />
                                    <TextView
                                      textSty={{
                                        ...kitsStyles.LeicesterText,
                                        marginLeft: 5,
                                      }}>
                                      {/* {innerItem?.status?.replace(/_/g, " ")} */}
                                      {formate(innerItem?.status)}
                                    </TextView>
                                  </View>
                                ) : (
                                  <View
                                    style={{ flex: 0.5, flexDirection: "row" }}>
                                    <Image
                                      source={statusImage}
                                      resizeMode="contain"
                                    />
                                    <TextView
                                      textSty={{
                                        ...kitsStyles.LeicesterText,
                                        marginLeft: 5,
                                      }}>
                                      {/* {innerItem?.status?.replace(/_/g, " ")} */}
                                      {/* {innerItem.status == "non_compliant"
                                        ? "Expired"
                                        : innerItem?.status == "near_expiry"
                                        ? "Near Expiry"
                                        : "In Date"} */}
                                      {innerItem.status == "non_compliant"
                                        ? "Please update"
                                        : innerItem?.status == "near_expiry"
                                        ? "Near Expiry"
                                        : "Complete"}
                                    </TextView>
                                  </View>
                                )}
                              </TouchableOpacity>
                              {checkStatus &&
                                listId == ind * 1000 + innerIndex && (
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        flex: 0.5,
                                        backgroundColor: Colors.greenLightTint,
                                        padding: moderateScale(15),
                                      }}>
                                      {/* <TextView
                                        textSty={kitsStyles.LeicesterText}>
                                        {innerItem?.area}
                                      </TextView> */}
                                      {innerItem?.lot_number !== "false" && (
                                        <TextView
                                          textSty={kitsStyles.LeicesterText}>
                                          Lot: {innerItem?.lot_number}
                                        </TextView>
                                      )}

                                      {innerItem?.product_code !== "false" && (
                                        <TextView
                                          textSty={kitsStyles.LeicesterText}>
                                          {/* Batch: {innerItem?.batch_number} */}
                                          Product code:{" "}
                                          {innerItem?.product_code}
                                        </TextView>
                                      )}
                                    </View>
                                    <View
                                      style={{
                                        flex: 0.5,
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        backgroundColor: Colors.secondary,
                                      }}>
                                      {details.map((item) => {
                                        return (
                                          <TouchableOpacity
                                            onPress={() => {
                                              item.title == "View"
                                                ? navigation.navigate(
                                                    item.nav,
                                                    {
                                                      qrCode:
                                                        innerItem?.qr_code,
                                                    }
                                                  )
                                                : handleArchiveButtonPress(
                                                    innerItem?.kit_id
                                                  );

                                              // setShowModal(!showModal);
                                            }}
                                            style={{
                                              alignItems: "center",
                                            }}>
                                            <Image
                                              source={item.image}
                                              resizeMode="contain"
                                              style={{
                                                width: moderateScale(18),
                                                height: moderateScale(18),
                                              }}
                                            />
                                            <TextView
                                              heading
                                              headingTextSty={{
                                                fontSize: 8,
                                                lineHeight: 12,
                                              }}>
                                              {item.title}
                                            </TextView>
                                          </TouchableOpacity>
                                        );
                                      })}
                                    </View>
                                  </View>
                                )}
                            </>
                          );
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {LeicesterDates?.length == 0 && (
                <View>
                  <TextView
                    heading
                    headingTextSty={{
                      marginTop: 5,
                      fontSize: 14,
                      color: Colors.black,
                      textAlign: "center",
                      marginVertical: 100,
                    }}>
                    No Kit Registered
                  </TextView>
                </View>
              )}
              <Button
                onClick={() =>
                  navigation.navigate(navigationString.kitsInstallation)
                }
                allButtonSty={{ ...kitsStyles.buttonStyle, width: "80%" }}
                buttonColor={Colors.black}
                btnName="Register a First Aid Kit"
              />
            </ScrollView>

            <ModalScreen
              visible={showModal}
              modalheading={AllStrings.Archive_Kit}
              modalText={AllStrings.Would_archive_kit_all_items}
              btnName="Cancel"
              btnName1="Yes"
              buttonColor={Colors.white}
              btnStyle={{
                backgroundColor: Colors.black,
              }}
              ModalBtn1={{ width: "45%" }}
              ModalBtn={{ width: "55%" }}
              modalButton1={handleArchiveConfirmation}
              modalButton={() => setShowModal(false)}
            />

            <ModalScreen
              success
              visible={showSuccess}
              modalText={`The safety kit was successfully saved to your company’s database.`}
              btnName1="Continue"
              buttonColor={Colors.white}
              btnStyle={{ backgroundColor: Colors.black }}
              modalButton1={() => {
                setshowSuccess(false);
                setCheckStatus(false);
              }}
            />
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Kits;

const styles = StyleSheet.create({
  rowFront: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    // backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: Colors.secondary,
    right: 0,
  },
  backTextWhite: {
    color: "#FFF",
  },
});
