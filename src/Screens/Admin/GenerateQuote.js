import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AdminStyle from "./AdminStyle";
import TextView from "../../Components/TextView";
import CustomDropdown from "../../Components/CustomDropdown";
import InputFields from "../../Components/InputFields";
import Button from "../../Components/Button";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import {
  call_generate_quote,
  call_productList,
} from "../../redux/action/AdminAction";
import { useDispatch } from "react-redux";
import Loading from "../../Components/Loading";
import navigationString from "../../Navigations/navigationString";
import { useIsFocused } from "@react-navigation/native";
import CustomAlert from "../../Components/CustomAlert";

const GenerateQuote = ({ setShowDashboard }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const [isLoadings, setisLoadings] = useState(false);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productName, setProductName] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [filteredData, setFilteredData] = useState(suggestions);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getProductList();
    }
  }, [isFocused]);

  const getProductList = () => {
    dispatch(call_productList())
      .then((res) => {
  
        if (res.payload.status === 200) {
          setSuggestions(res.payload.data.products);
        }
      })
      .catch((err) => {
        console.log("product list", err);
      });
  };

  const handleQuantity = (value) => {
    if (product?.trim() === "") {
      return handleShowAlert("Product required");
    }
    if (quantity?.trim() === "") {
      return handleShowAlert("Quantity required");
    }
    pattern = /^\d+$/; // Regular expression to match integer values

    if (isNaN(quantity) || !pattern.test(quantity)) {
      return handleShowAlert("Quantity must be numeric");
    }
    const newItem = {
      product: product,
      quantity: quantity,
    };
    setProductName((prevList) => [...prevList, newItem]); // Add new item to the listData array
    setProduct("");
    setQuantity("");
  };

  const removeItem = (indexToRemove) => {
    setProductName((prevImageUris) =>
      prevImageUris.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleGenerateQuote = () => {
    // if (productName?.length === 0) {
    //   return alert("Please add custom item");
    // }
    if (
      isEnabled === false &&
      isExpiring === false &&
      productName.length === 0
    ) {
      return handleShowAlert(
        "Select any one. Non-complaint item and all items near expirating"
      );
    }

    const payload = {
      all_non_compliant: isEnabled,
      all_near_expiry: isExpiring,
      custom_item: productName,
    };
    console.log("generate quote--", payload);
    setisLoadings(true);
    dispatch(call_generate_quote(payload))
      .then((res) => {
        setisLoadings(false);
        if (res.payload.status === 200) {
          setShowDashboard("Dashboard");
          alert(res.payload.message);
          // handleShowAlert(res.payload.message);
        } else {
          console.log(res.payload, "err payload generate");
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log(err, "err generate");
      });
  };

  return (
    <View style={{ marginHorizontal: 15 }}>
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
      />

      <TextView heading headingTextSty={AdminStyle.generateQuote}>
        Generate Quote
      </TextView>
      <TextView heading headingTextSty={AdminStyle.followingText}>
        Include The Following
      </TextView>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
        <View
          style={{
            ...AdminStyle.switchcontainer,
            backgroundColor:
              isEnabled == false ? Colors.white : Colors.secondary,
          }}>
          <Switch
            trackColor={{
              false: Colors.white,
              true: Colors.secondary,
            }}
            thumbColor={Colors.white}
            onValueChange={() => setIsEnabled(!isEnabled)}
            value={isEnabled}
            style={{
              transform: [{ scaleX: 1 }, { scaleY: 1 }],
            }}
          />
        </View>
        <TextView textSty={{ marginLeft: 10 }}>
          All Non-compliant Items
        </TextView>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
        <View
          style={{
            ...AdminStyle.switchcontainer,
            backgroundColor:
              isExpiring == false ? Colors.white : Colors.secondary,
          }}>
          <Switch
            trackColor={{
              false: Colors.white,
              true: Colors.secondary,
            }}
            thumbColor={Colors.white}
            onValueChange={() => setIsExpiring(!isExpiring)}
            value={isExpiring}
            style={{
              transform: [{ scaleX: 1 }, { scaleY: 1 }],
            }}
          />
        </View>
        <TextView textSty={{ marginLeft: 10 }}>
          All Items Near Expiring
        </TextView>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.blackOpacity10,
          marginTop: 25,
        }}
      />
      <TextView
        heading
        headingTextSty={{ ...AdminStyle.followingText, marginTop: 25 }}>
        Add Custom Item To Quote
      </TextView>
      {/* <CustomDropdown
        type={"countryName"}
        placeholder={"Product"}
        data={[]}
        onSelect={() => {}}
      /> */}
      <InputFields
        placeholder="Product"
        value={product}
        onChangeText={(text) => {
          setProduct(text);
          // Filter the data based on the search query
          // const filtered = suggestions.filter((item) =>
          //   item.product_name?.toLowerCase()?.includes(text.toLowerCase())
          // );
          const filtered = suggestions?.filter(
            (item) =>
              item.product_name?.toLowerCase()?.includes(text.toLowerCase()) ||
              item.product_code?.toLowerCase()?.includes(text.toLowerCase())
          );
          setFilteredData(filtered);
        }}
      />

      {filteredData.length !== 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ height: 150 }}>
          <View
            style={{
              // maxHeight: 150,
              marginTop: 5,
              borderWidth: 1,
              borderColor: "gray",
            }}>
            {filteredData?.map((item, index) => {
              return (
                <View
                  style={{
                    backgroundColor: index % 2 !== 0 ? "#c1d7cb" : Colors.white,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setProduct(item?.product_code + "-" + item?.product_name);
                      setFilteredData([]);
                    }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: Colors.black }}>
                      {item?.product_code}-{item?.product_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <View style={AdminStyle.quantityContainerText}>
        <View style={{ width: "40%" }}>
          <InputFields
            placeholder="Quantity"
            marginTop={0}
            value={quantity}
            keyboardType="numeric"
            onChangeText={(text) => setQuantity(text)}
          />
        </View>
        <View style={{ width: "59%" }}>
          <Button
            btnName="Add To Quote"
            onClick={() => {
              handleQuantity();
            }}
          />
        </View>
      </View>

      {productName.length !== 0 && (
        <View style={{ marginVertical: 20 }}>
          <TextView heading headingTextSty={AdminStyle.generateQuote}>
            Custom Added Items
          </TextView>
        </View>
      )}

      {productName.map((itemName, index) => {
        return (
          <View style={AdminStyle.AddedItemContainer}>
            <View style={AdminStyle.AddedItemInnerContainer}>
              <View style={{ flex: 1 }}>
                <TextView
                  textSty={{
                    fontSize: 14,
                    lineHeight: 21,
                  }}>
                  {`${itemName?.quantity?.trim()} ${itemName?.product?.trim()}`}
                </TextView>
              </View>
              {/* <View style={{ flex: 0.89 }}>
                <TextView
                  textSty={{
                    textAlign: "left",
                    fontSize: 14,
                    lineHeight: 21,
                    marginLeft: 10,
                  }}>
                  {itemName?.product?.trim()}
                </TextView>
              </View> */}
            </View>
            {/* <View > */}
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignItems: "flex-end",
                justifyContent: "center",
                height: 25,
              }}
              onPress={() => removeItem(index)}>
              <Image
                source={imagePath.crossIcon}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
            {/* </View> */}
          </View>
        );
      })}

      <Button
        onClick={
          () => {
            handleGenerateQuote();
          }
          // navigation.navigate(navigationString.kitsInstallation)
        }
        allButtonSty={AdminStyle.quoteButton}
        buttonColor={Colors.black}
        btnName="Generate Quote"
      />
    </View>
  );
};

export default GenerateQuote;

const styles = StyleSheet.create({});
