import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import navigationString from "../../Navigations/navigationString";
import { call_ShowMessage_API } from "../../redux/action/MessagesAction";
import Loading from "../../Components/Loading";
import moment from "moment";
import WebView from "react-native-webview";
import RenderHtml from "react-native-render-html";

// const Notification = () => {
const Notification = ({}) => {
  const isFocused = useIsFocused();
  // Assuming this is where you want to fetch data from Redux
  const [isLoadings, setisLoadings] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Function to handle navigation to NotificationDetails
  const navigateToNotificationDetails = (imageSource) => {
    navigation.navigate("notificationDetails", { imageSource });
  };

  const [data, setData] = useState([
    // {
    //   id: 1,
    //   image: imagePath.GreenKit,
    //   title: "Green Pursuit Pro First Aid Kit Bag",
    //   text: "Eco-friendly packaging includes packaging that is easy to recycle and made from materials manufactured...",
    //   time: "21 June 2024",
    // },
  ]);

  useEffect(() => {
    showdata();
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      console.log("Screen is focused");

      showdata();
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  const showdata = () => {
    setisLoadings(true);
    dispatch(call_ShowMessage_API())
      .then((res) => {
        console.log("show notification *****- ", res.payload);
        if (res.payload.status === 200) {
          setData(res.payload.data);
          setisLoadings(false);
        } else {
          setisLoadings(false);
          console.log("notification api response err---", res.payload);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("show notification err- ", err);
      });
  };

  const renderItem = ({ item }) => {
    const source = {
      html: `
      ${item?.sub_title}
     `,
    };
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigateToNotificationDetails(item, { _id: item?._id })
          }>
          {console.log(item)}
          <View
            style={{
              // flexDirection: "row",
              marginTop: 20,
              padding: 10,
            }}>
            {/* Image component */}
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
              }}>
              {/* Image component */}
              <View style={{ flex: 0.3 }}>
                <Image
                  source={
                    item?.featured_image !== ""
                      ? { uri: item?.featured_image }
                      : imagePath.NoIcon
                  }
                  style={{ width: 90, height: 80 }}
                  resizeMode="cover"
                />
              </View>

              <View
                style={{
                  // flex: 1,
                  flex: 0.7,
                  paddingLeft: 12,
                  backgroundColor: "white",
                }}>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 14,
                    fontWeight: "700",
                    lineHeight: 21,
                    letterSpacing: -0.011,
                    textAlign: "left",
                    color: "#000000",
                  }}>
                  {item.title}
                </Text>
                {/* <Text
                style={{
                  fontFamily: "Open Sans",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 21,
                  letterSpacing: -0.011,
                  textAlign: "left",
                  color: "#000000",
                }}>
                {item?.content}
              </Text> */}

                <RenderHtml
                  //  contentWidth={width}
                  source={source}
                  // contentWidth={300} // Set your desired content width here
                  tagsStyles={{ body: { marginTop: 5 } }} // Set your desired content height here
                />

                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 10,
                    fontWeight: "400",
                    lineHeight: 15,
                    letterSpacing: -0.011,
                    textAlign: "left",
                    color: "#000000", // Adjust color as needed
                    marginTop: 8,
                  }}>
                  {moment(item.publish_on).format("DD MMM YYYY")}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.blackOpacity10,
            // marginTop: 2,
            marginHorizontal: 14,
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header back={() => navigation.navigate(navigationString.profile)} />
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>
      <View style={{ flex: 1 }}>
        <TextView
          heading
          headingTextSty={{
            color: "#FFFFFF",
            marginVertical: 10,
            width: "90%",
            textAlign: "center",
            alignSelf: "center",
            marginHorizontal: 15,
            letterSpacing: -1,
          }}>
          Notification Centre
        </TextView>
        <View style={{ marginBottom: 15, width: "80%", alignSelf: "center" }}>
          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 21,
              letterSpacing: -0.011,
              textAlign: "center",
              color: "white",
            }}>
            The latest news, training and updates to keep your businesses safe
            and compliant.
          </Text>
        </View>
        {/* Green section */}

        {/* Scrollable content */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            flex: 1,
          }}>
          {/* <View style={styles.container}> */}
          <View style={{ marginHorizontal: 15 }}>
            <FlatList
              // columnWrapperStyle={{ justifyContent: "space-around" }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderItem}
              // numColumns={3}
              keyExtractor={(item) => item.key}
              style={{ height: "auto", marginTop: 0, marginBottom: 10 }}
            />
            {data?.length == 0 && (
              <View>
                <TextView
                  heading
                  headingTextSty={{
                    marginTop: 5,
                    fontSize: 14,
                    color: Colors.black,
                    textAlign: "center",
                    marginTop: 100,
                  }}>
                  No notifications!
                </TextView>
              </View>
            )}
          </View>

          {/* </View> */}
        </View>
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headingText: {
    fontFamily: "Open Sans",
    fontSize: 36,
    fontWeight: "bold", // Set fontWeight to bold
    lineHeight: 43,
    letterSpacing: -0.011,
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    // width: 333,
    height: "auto",
    paddingVertical: 20,
    paddingHorizontal: 0,
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
});

export default Notification;
