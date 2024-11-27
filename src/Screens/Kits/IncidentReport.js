import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import kitsStyles from "./kitsStyles";
import navigationString from "../../Navigations/navigationString";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";

const IncidentReport = ({ navigation, route }) => {
  console.log(route?.params?.key, "--from repoted incident screen");
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath.backArrow}
        editHeader={() => {
          route?.params?.key == "reportedIncident"
            ? navigation.navigate(navigationString.incident)
            : navigation.goBack();
        }}
      />

      <View style={kitsStyles.container}>
        <ScrollView>
          <View style={kitsStyles.heading}>
            <TextView heading headingTextSty={{ textAlign: "center" }}>
              {AllStrings.IncidentReport}
            </TextView>
            <TextView heading headingTextSty={kitsStyles.headingText}>
              {AllStrings.Whatreportmake}
            </TextView>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(navigationString.quickReportNav, {
                  key: "StandardReport",
                })
              }>
              <View style={kitsStyles.cardView}>
                <View style={{ flex: 0.35 }}>
                  <Image source={imagePath.stadardImage} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.65 }}>
                  <TextView heading headingTextSty={kitsStyles.cardTeadingText}>
                    {AllStrings.StandardReport}
                  </TextView>
                  <TextView textSty={{ fontSize: 10, lineHeight: 15 }}>
                    {AllStrings.Coversincidents}
                  </TextView>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(navigationString.quickReportNav, {
                  key: "QuickReport",
                })
              }>
              <View
                style={{
                  ...kitsStyles.cardView,
                  marginTop: moderateScaleVertical(50),
                }}>
                <View style={{ flex: 0.35 }}>
                  <Image source={imagePath.quickImage} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      ...kitsStyles.cardTeadingText,
                      marginTop: moderateScaleVertical(8),
                    }}>
                    {AllStrings.QuickReport}
                  </TextView>
                  <TextView
                    textSty={{
                      fontSize: 10,
                      lineHeight: 15,
                      width: moderateScale(150),
                    }}>
                    {AllStrings.Coversminorncidents}
                  </TextView>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default IncidentReport;

const styles = StyleSheet.create({});
