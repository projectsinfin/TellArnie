import moment from "moment";
import React, { useState, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import MonthPicker from "react-native-month-year-picker";
import Colors from "../Styles/Colors";
import imagePath from "../Constant/imagePath";

const MonthPickers = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker]
  );

  return (
    <SafeAreaView>
      <Text>Month Year Picker Example</Text>
      <Text>{moment(date, "MM-YYYY")}</Text>
      <TouchableOpacity onPress={() => showPicker(true)}>
        <Text>OPEN</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => {
          showPicker(true);
        }}
        style={{
          // backgroundColor: "red",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: Colors.dividerLight,
          padding: 8,
          marginTop: 20,
          borderRadius: 5,
          // width: "49%",
        }}>
        <View>
       <TextView
            textSty={{
              fontSize: 14,
              color: showDate === true ? Colors.black : Colors.lightgray,
            }}>
            // {showDate ? formattedDate : "Expiry Date"}
            {showDate == false ? "Expiry Date" : formattedDate}
          </TextView>  
        </View>
        <View>
          <View>
            <Image source={imagePath.datePickerIcon} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity> */}
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 5)}
          locale="ko"
        />
      )}
    </SafeAreaView>
  );
};

export default MonthPickers;

const styles = StyleSheet.create({});
