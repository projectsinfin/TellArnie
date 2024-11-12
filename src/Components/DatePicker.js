import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import TextView from "./TextView";
import Colors from "../Styles/Colors";
import imagePath from "../Constant/imagePath";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MonthPicker from "react-native-month-year-picker";

const DatePicker = ({
  onDateChange,
  disabled,
  showDates,
  profile,
  detePickerSty,
}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [selectProfileDate, setselectProfileDate] = useState("");
  const formattedDate = moment(date).format("DD/MM/YYYY");

  const onChange = (date) => {
    setShow(false);
    setDate(date);
    setselectProfileDate(date);
    onDateChange(date);
    setShowDate(true);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          showDatepicker();
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
          ...detePickerSty,
          // width: "49%",
        }}>
        {/* {alert(showDates)} */}
        <View>
          {profile ? (
            <TextView
              textSty={{
                fontSize: 14,
                color:
                  showDates == undefined &&
                  showDates == null &&
                  selectProfileDate == ""
                    ? Colors.lightgray
                    : Colors.black,
              }}>
              {selectProfileDate
                ? moment(selectProfileDate).format("DD-MM-YYYY")
                : showDates === undefined || showDates === null
                ? "DD/MM/YYYY"
                : moment(showDates).format("DD-MM-YYYY")}
            </TextView>
          ) : (
            <TextView
              textSty={{
                fontSize: 14,
                color: showDate === true ? Colors.black : Colors.lightgray,
              }}>
              {showDate == false ? "Expiry Date" : formattedDate}
            </TextView>
          )}
        </View>
        <View>
          <View>
            <Image source={imagePath.datePickerIcon} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity>
      {show && (
        // <DateTimePicker
        //   disabled={disabled}
        //   testID="dateTimePicker"
        //   value={date}
        //   mode={mode}
        //   is24Hour={true}
        //   onChange={onChange}
        // />
        <DateTimePickerModal
          isVisible={show}
          testID="dateTimePicker"
          mode={mode}
          onConfirm={(selectedDate) => {
            onChange(selectedDate, "start");
          }}
          onCancel={() => setShow(false)}
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({});
