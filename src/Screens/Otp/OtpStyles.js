import { Platform, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constant/dimensions";
import Colors from "../../Styles/Colors";

export default OtpStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 25,
    borderWidth: 0.1,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: Colors.greenTint,
    borderWidth: 1,
    marginBottom: 36,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },

  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 50,
    fontSize: 24,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    textAlign: "center",
    borderRadius: 5,
    color: Colors.black,
    paddingTop: 8,
  },
  focusCell: {
    borderColor: Colors.secondary,
  },
});
