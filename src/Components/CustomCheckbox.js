import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import CommonStyles from "../Helper/CommonStyles";
import TextView from "./TextView";
import { blankCheckBox, fillCheckBox } from "../Assets";
import PopularCard from "./PopularCard";
import moment from "moment";
import { formatDuration } from "../Helper/Regex";

const CustomCheckbox = ({ label, onChange, filter, item, onChanges }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckeds, setIsCheckeds] = useState(false);
  const toggleCheckbox = () => {
    setIsCheckeds(!isCheckeds);
    onChanges && onChanges(!isCheckeds);
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };

  if (filter) {
    return (
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          paddingVertical: 12,
        }}>
        <View
          style={{
            alignItems: "center",
          }}>
          {/* <Image source={fillCheckBox} resizeMode="contain" /> */}
          <View style={CommonStyles.checkbox}>
            {isChecked ? (
              <Image
                source={fillCheckBox}
                style={CommonStyles.blankCheckSty}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={blankCheckBox}
                style={CommonStyles.blankCheckSty}
                resizeMode="contain"
              />
            )}
          </View>
        </View>

        <TextView
          textAlign="left"
          alignSelf="left"
          fontSize={16}
          left={8}
          fontWeight={500}>
          {label}
        </TextView>
      </TouchableOpacity>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          marginHorizontal: 10,
          alignItems: "center",
          paddingBottom: Platform.OS === "android" ? 3 : null,
        }}>
        <View
          style={{
            width: "90%",
          }}>
          <PopularCard
            author={item.speaker}
            duration={formatDuration(
              item?.video_duration ||
                route.params.itemData?.video_id?.video_duration
            )}
            video_title={item.title}
            video_thumbnail={{ uri: item.thumbnail_url }}
            views={item.view_count}
            Available
          />
        </View>
        <View
          style={{
            alignItems: "center",
          }}>
          <TouchableOpacity
            style={CommonStyles.checkbox}
            onPress={toggleCheckbox}>
            {isCheckeds && <View style={CommonStyles.checkboxInner} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CustomCheckbox;
