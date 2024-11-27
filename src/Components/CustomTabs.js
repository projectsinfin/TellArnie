import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Colors from "../Styles/Colors";
import TextView from "./TextView";
import { SCREEN_WIDTH } from "../Constant/dimensions";
import { responsiveHeight } from "react-native-responsive-dimensions";

const CustomTabs = ({ index, title, setSelectedTab, selectedTab }) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedTab(index)}
      style={{
        backgroundColor:
          index === selectedTab ? Colors.white : Colors.secondary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        // margin: 8,
        marginHorizontal: SCREEN_WIDTH < 393 ? responsiveHeight(0.5) : 8,
      }}>
      <TextView heading headingTextSty={{ fontSize: 10.2, lineHeight: 15 }}>
        {title}
      </TextView>
    </TouchableOpacity>
  );
};

export default CustomTabs;
