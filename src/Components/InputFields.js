// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { loginTrue, passImg } from "../Assets";
// import ErrorMessage from "./ErrorMessage";
// import Colors from "../Styles/Colors";
// const InputFields = (props) => {
//   const {
//     placeholder,
//     isChecked,
//     iconPress,
//     value,
//     onChangeText,
//     validate,
//     validationMessage,
//     SecureTextEntrys,
//     keyboardType,
//     maxlength,
//     source,
//     numberOfLines,
//     disabled,
//     multiline,
//     onEndEditing,
//     placeholderTextColor,
//     editDisabled,
//     handleBlurs,
//   } = props;

//   const [isFocused, setIsFocused] = useState(false);
//   const [error, setError] = useState("");

//   const handleFocus = () => {
//     setIsFocused(true);
//   };

//   // useEffect(() => {
//   //   setError(validationMessage);
//   // }, [validationMessage]);

//   const handleBlur = () => {
//     setError(validate);

//     setIsFocused(false);
//   };

//   const isAndroid = Platform.OS === "android";
//   // onBlur={handleBlurs}
//   return (
//     <View>
//       <TextInput
//         style={
//           isFocused
//             ? { ...styles.textInputFocused, ...props.textInputFocused }
//             : { ...styles.textInput, ...props.textInput }
//         }
//         {...props}
//         textAlignVertical={multiline ? "top" : "null"}
//         placeholder={placeholder}
//         placeholderTextColor={
//           placeholderTextColor ? Colors.black : Colors.lightgray
//         }
//         autoCapitalize={"none"}
//         onFocus={handleFocus}
//         onBlur={() => {
//           if (handleBlurs) {
//             handleBlur();
//             handleBlurs();
//           } else {
//             handleBlur();
//           }
//         }}
//         value={value}
//         onChangeText={onChangeText}
//         secureTextEntry={SecureTextEntrys}
//         keyboardType={keyboardType}
//         maxLength={maxlength}
//         numberOfLines={numberOfLines}
//         multiline={multiline}
//         editable={editDisabled}
//         onEndEditing={onEndEditing}
//       />
//       {isChecked && (
//         <TouchableOpacity onPress={iconPress} disabled={disabled}>
//           <Image
//             tintColor={Colors.lightgray}
//             source={source}
//             style={styles.loginTrueImg}
//             resizeMode="contain"></Image>
//         </TouchableOpacity>
//       )}
//       {/*  {error && <ErrorMessage message={error} />} */}
//     </View>
//   );
// };

// export default InputFields;
// const styles = StyleSheet.create({
//   textInput: {
//     height: 40,
//     borderColor: Colors.dividerLight,
//     borderWidth: 1,
//     marginTop: 20,
//     borderRadius: 5,
//     fontSize: 14,
//     paddingHorizontal: 10,
//   },
//   textInputFocused: {
//     height: 40,
//     borderColor: Colors.greenTint,
//     borderWidth: 1,
//     marginTop: 20,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     fontSize: 14,
//   },
//   loginTrueImg: {
//     width: 20,
//     height: 20,
//     position: "absolute",
//     alignSelf: "flex-end",
//     marginTop: -30,

//     right: 10,
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { loginTrue, passImg } from "../Assets";
import ErrorMessage from "./ErrorMessage";
import Colors from "../Styles/Colors";
const InputFields = (props) => {
  const {
    placeholder,
    isChecked,
    iconPress,
    value,
    onChangeText,
    validate,
    validationMessage,
    SecureTextEntrys,
    keyboardType,
    maxlength,
    source,
    numberOfLines,
    disabled,
    multiline,
    onEndEditing,
    placeholderTextColor,
    editDisabled,
    handleBlurs,
    autoCapitalize,
    textContentType,
    autoComplete,
    returnKeyType,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  // useEffect(() => {
  //   setError(validationMessage);
  // }, [validationMessage]);

  const handleBlur = () => {
    setError(validate);

    setIsFocused(false);
  };

  const isAndroid = Platform.OS === "android";
  // onBlur={handleBlurs}
  return (
    <View>
      <TextInput
        style={
          isFocused
            ? { ...styles.textInputFocused, ...props.textInputFocused }
            : { ...styles.textInput, ...props.textInput }
        }
        {...props}
        textAlignVertical={multiline ? "top" : "null"}
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor ? Colors.black : Colors.lightgray
        }
        autoCapitalize={autoCapitalize ? "none" : "sentences"}
        onFocus={handleFocus}
        onBlur={() => {
          if (handleBlurs) {
            handleBlur();
            handleBlurs();
          } else {
            handleBlur();
          }
        }}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={SecureTextEntrys}
        keyboardType={keyboardType}
        maxLength={keyboardType === "phone-pad" ? 15 : maxlength}
        numberOfLines={numberOfLines}
        multiline={multiline}
        editable={editDisabled}
        onEndEditing={onEndEditing}
        textContentType={textContentType}
        autoCompleteType={autoComplete}
        returnKeyType={returnKeyType}
      />
      {isChecked && (
        <TouchableOpacity
          onPress={iconPress}
          disabled={disabled}
          style={{
            // backgroundColor: "red",
            width: 60,
            height: 40,
            marginTop: -40,
            alignContent: "center",
            // backgroundColor: "red",
            alignSelf: "flex-end",
          }}>
          <Image
            tintColor={Colors.lightgray}
            source={source}
            style={styles.loginTrueImg}
            resizeMode="contain"></Image>
        </TouchableOpacity>
      )}
      {/*  {error && <ErrorMessage message={error} />} */}
    </View>
  );
};

export default InputFields;
const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: Colors.dividerLight,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    // backgroundColor: "#ffffff",
    color: "#000",
  },
  textInputFocused: {
    height: 40,
    color: "#000",
    borderColor: Colors.greenTint,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    // backgroundColor: "#ffffff",
  },
  loginTrueImg: {
    width: 20,
    height: 20,
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 10,

    right: 10,
  },
});
