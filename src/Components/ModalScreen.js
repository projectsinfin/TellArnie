import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "./Button";
import TextView from "./TextView";
import Colors from "../Styles/Colors";
import imagePath from "../Constant/imagePath";
import { moderateScale, moderateScaleVertical } from "../Styles/responsiveSize";
import AllStrings from "../Constant/AllStrings";
const ModalScreen = (props) => {
  const {
    visible,
    btnName,
    modalheading,
    modalText,
    mailImg,
    imageURL,
    hide,
    btnName1,
    modalButton,
    modalButton1,
    buttonColor,
    buttonColor1,
    successText,
    downPopUp,
    showDownPopUp,
    details,
    img,
    selectPic,
    closePopUp,
    removePic,
    cross,
    crossOnPress,
    kitnotRegister,
    distributorName,
  } = props;

  if (props.success) {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide" // You can customize the animation type
          transparent={true}
          visible={visible}
          onRequestClose={hide}>
          <View style={styles.InnerModal}>
            <View style={styles.subInnerModal}>
              {successText ? (
                <TextView
                  heading
                  headingTextSty={{
                    fontSize: 18,
                    color: Colors.primary,
                    textAlign: "center",
                  }}>
                  {modalheading}
                </TextView>
              ) : (
                <Image
                  source={imagePath.successImg}
                  resizeMode="contain"
                  style={{ alignSelf: "center", marginTop: 10 }}
                />
              )}

              <TextView textSty={styles.textViewsty}>{modalText}</TextView>
              {distributorName && (
                <TextView
                  textSty={{
                    ...styles.textViewsty,
                    marginTop: 5,
                    marginBottom: -10,
                  }}>
                  {distributorName}
                </TextView>
              )}

              <View
                style={{
                  marginTop: kitnotRegister ? -20 : 20,
                  marginVertical: 10,
                }}>
                <Button
                  buttonColor={Colors.black}
                  onClick={modalButton1}
                  btnName={btnName1}
                  allButtonSty={{ borderRadius: 10, marginTop: 10 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else if (downPopUp) {
    return (
      <Modal
        animationType="slide" // You can customize the animation type
        transparent={true}
        visible={showDownPopUp}
        // onRequestClose={hide}
      >
        <View style={styles.downpopview}>
          <View style={styles.subDownpopup}>
            <View style={styles.editView}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {img && (
                  <Image
                    source={imageURL}
                    // resizeMode="contain"
                    style={{
                      width: moderateScale(40),
                      height: moderateScale(40),
                      borderRadius: moderateScale(20),
                    }}
                  />
                )}
                <TextView
                  heading
                  headingTextSty={{
                    fontSize: 14,
                    marginLeft: img ? 5 : 0,
                    color: Colors.black,
                  }}>
                  Edit Profile Picture
                </TextView>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closePopUp}
                style={styles.closeBtnSty}>
                <Image
                  resizeMode="contain"
                  source={imagePath.close}
                  tintColor={Colors.black}
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
            {details.map((item, ind) => {
              return (
                <TouchableOpacity
                  onPress={() => selectPic(item, ind)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#D3D3D3",
                  }}>
                  <TextView
                    textSty={{
                      fontSize: 14,

                      color: Colors.black,
                    }}>
                    {item.label}
                  </TextView>
                  <Image
                    resizeMode="contain"
                    source={item.image}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={removePic}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
              }}>
              <TextView
                textSty={{
                  fontSize: 14,
                  color: Colors.danger,
                }}>
                {img ? AllStrings.Delete_Photo : AllStrings.ResetPicture}
              </TextView>
              <Image
                resizeMode="contain"
                tintColor={Colors.danger}
                source={imagePath.delete}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide" // You can customize the animation type
          transparent={true}
          visible={visible}
          onRequestClose={hide}>
          <View style={styles.InnerModal}>
            <View style={styles.subInnerModal}>
              <TextView
                heading
                headingTextSty={{
                  fontSize: 18,
                  color: Colors.primary,
                  textAlign: "center",
                }}>
                {modalheading}
              </TextView>
              {cross && (
                <TouchableOpacity
                  style={{
                    // backgroundColor: "red",
                    position: "absolute",
                    alignSelf: "flex-end",
                    // top: 15,
                    width: 40,
                    height: 40,
                    right: 10,
                  }}
                  onPress={crossOnPress}>
                  <Image
                    source={imagePath.crossIcon}
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: "center",
                      top: 20,
                    }}
                  />
                </TouchableOpacity>
              )}
              <TextView
                textSty={{
                  marginTop: 10,
                  fontSize: 14,
                  textAlign: "center",
                  color: Colors.black,
                }}>
                {modalText}
              </TextView>

              <View
                style={{
                  marginTop: 5,
                  marginVertical: 10,
                  flexDirection: cross ? "column" : "row",
                  justifyContent: cross ? "center" : "space-between",
                  alignItems: cross && "center",
                }}>
                <View style={{ width: "40%", ...props.ModalBtn }}>
                  <Button
                    onClick={modalButton}
                    btnName={btnName}
                    buttonColor={buttonColor}
                    allButtonSty={{
                      borderRadius: 10,
                      marginTop: 10,
                      ...props.btnStyle,
                    }}
                  />
                </View>
                <View style={{ width: "60%", ...props.ModalBtn1 }}>
                  <Button
                    buttonColor={buttonColor1}
                    onClick={modalButton1}
                    btnName={btnName1}
                    allButtonSty={{ borderRadius: 10, marginTop: 10 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  InnerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  subInnerModal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android shadow
    width: "80%",
  },
  textViewsty: {
    marginTop: 20,
    width: "90%",
    fontSize: 14,
    alignSelf: "center",
    textAlign: "center",
    color: Colors.black,
  },
  downpopview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: '#1F043B',
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  subDownpopup: {
    backgroundColor: "#D3D3D3",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5, // Android shadow
    width: "100%",
  },
  closeBtnSty: {
    backgroundColor: Colors.whiteOpacity10,
    padding: 5,
    borderRadius: 16,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  editView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});
