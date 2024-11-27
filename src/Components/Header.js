import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import TextView from "./TextView";
import Colors from "../Styles/Colors";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { call_Profile_Api } from "../redux/action/ProfileAction";
import imagePath from "../Constant/imagePath";
const Header = (props) => {
  const { iconName, headingText, headingText2, back, editHeader, backIcon } =
    props;

  const { isLoading, error, profileDetails } = useSelector(
    (state) => state.profileData
  );
  const dispatch = useDispatch();
  // console.log("profileDetails---", profileDetails);
  useEffect(() => {
    dispatch(call_Profile_Api());
  }, []);

  const separateAndCapitalize = (str) => {
    if (str) {
      const index = str?.indexOf("admin");
      if (index !== -1) {
        const superSubstring = str?.substring(0, index);
        const adminSubstring = str?.substring(index);
        const capitalizeFirstLetter = (word) =>
          word.charAt(0)?.toUpperCase() + word?.slice(1);
        return [
          capitalizeFirstLetter(superSubstring),
          " ",
          capitalizeFirstLetter(adminSubstring),
        ];
      } else {
        return [str];
      }
    }
  };

  return (
    <View
      style={{
        height: responsiveHeight(8),

        paddingHorizontal: responsiveHeight(1),
        // marginTop: 10,
      }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={back}
          // onPress={() => navigation.navigate(navigationString.profile)}
          style={{
            flex: 0.18,
            justifyContent: "center",
            alignItems: "flex-start",
          }}>
          <Image
            source={
              iconName
                ? iconName
                : profileDetails?.data.user_details.profile_pic !== ""
                ? {
                    uri: profileDetails?.data.user_details.profile_pic,
                  }
                : imagePath.ProfilePic
            }
            // source={
            //   profileDetails?.data.user_details.profile_pic !== ""
            //     ? {
            //         uri: profileDetails?.data.user_details.profile_pic,
            //       }
            //     : imagePath.ProfilePic
            // }
            style={styles.ImageSty}
            // resizeMode="contain"
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 0.8,
            justifyContent: "center",
            alignItems: "flex-start",
          }}>
          <TextView
            textSty={{
              // fontSize: 14,
              fontSize: responsiveFontSize(1.5),
              color: Colors.white,
            }}>
            {/* {headingText} */}

            {profileDetails?.data.user_details.first_name === undefined
              ? ""
              : profileDetails?.data.user_details.first_name +
                " " +
                (profileDetails?.data.user_details.last_name == null
                  ? ""
                  : profileDetails?.data.user_details.last_name)}
          </TextView>
          {/* 
          <TextView
            textSty={{
              // fontSize: 14,
              fontSize: responsiveFontSize(1.5),
              color: Colors.white,
              backgroundColor: "red",
              position: "absolute",
              marginLeft: 100,
              paddingHorizontal: 10,
              marginTop: -15,
            }}>
            Test V-80
          </TextView> */}

          <TextView
            textSty={{
              // fontSize: 10,
              fontSize: responsiveFontSize(1.1),
              color: Colors.white,
            }}>
            {/* {headingText2} */}
            {/* {
            profileDetails?.data.user_details.assigned_role +
              ", " +
              profileDetails?.data.user_details.company_name} */}
            {profileDetails?.data?.user_details?.assigned_role === "staff"
              ? profileDetails?.data?.user_details?.assigned_role
                  ?.charAt(0)
                  .toUpperCase() +
                profileDetails?.data?.user_details?.assigned_role?.slice(1)
              : profileDetails?.data?.user_details?.assigned_role &&
                ([capitalizedSuper, capitalizedAdmin] = separateAndCapitalize(
                  profileDetails?.data?.user_details?.assigned_role
                ))}
            {", "}
            {profileDetails?.data.user_details.company_name}
          </TextView>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={editHeader}
          style={{
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center",
            right: 5,
          }}>
          {backIcon !== null && (
            <Image
              source={backIcon}
              style={styles.backIconSty}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  ImageSty: {
    width: responsiveHeight(6),
    height: responsiveHeight(6),
    borderRadius: responsiveHeight(3),
  },
  backIconSty: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    // width: 45, height: 45
  },
});
