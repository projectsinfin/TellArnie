import React, { useState, useEffect, memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import imagePath from "../Constant/imagePath";
import Colors from "../Styles/Colors";
import TextView from "./TextView";

const DropdownItem = memo(
  ({ item, onPress, userList }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={{ padding: 10, backgroundColor: "#ffffff" }}>
        <ScrollView>
          <Text style={{ color: Colors.black }}>
            {userList
              ? item?.description
                ? item?.description
                : item?.first_name +
                  " " +
                  (item?.last_name ? item?.last_name : "")
              : item?.location_name ||
                item?.name ||
                item?.label ||
                item?.full_name ||
                item}
          </Text>
        </ScrollView>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if props or state change
    return (
      prevProps.item === nextProps.item &&
      prevProps.userList === nextProps.userList
    );
  }
);

const CustomDropdown = ({
  countryNames,
  data,
  onSelect,
  placeholder,
  userList,
  type,
  clearDropdown,
  changeColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter the data based on the search query
    const filtered = data.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = useCallback(
    (item) => {
      setSelectedItem(item);
      onSelect(item);
      setIsOpen(false);
    },
    [onSelect]
  );
  useEffect(() => {
    if (clearDropdown) {
      setSelectedItem(null);
    }
  }, [clearDropdown]);
  const renderSelectedItem = () => {
    switch (type) {
      case "category":
        return selectedItem?.name || placeholder;
      case "user":
        return selectedItem?.description || placeholder;
      case "location":
        return selectedItem?.location_name || placeholder;
      case "countryName":
        return selectedItem?.label || placeholder;
      case "treatment":
        return (
          selectedItem?.first_name +
            " " +
            (selectedItem?.last_name ? selectedItem?.last_name : "") ||
          placeholder
        );
      case "fullName":
        return selectedItem?.full_name;
      case "classification":
        return selectedItem;
      default:
        return placeholder;
    }
  };
  return (
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "lightgray",
          borderRadius: 5,
          backgroundColor: "#ffffff",
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              color: selectedItem ? Colors.black : Colors.lightgray,
              ...changeColor,
            }}>
            {selectedItem ? renderSelectedItem() : placeholder}
          </Text>
          <Image source={imagePath.downArrow} />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <>
          {countryNames && (
            <TextInput
              style={{ borderWidth: 1, padding: 10 }}
              placeholder="Search Country"
              value={searchQuery}
              onChangeText={handleSearch} // Call handleSearch function on text change
            />
          )}
          <ScrollView
            nestedScrollEnabled={true}
            style={{
              maxHeight: 150,
              marginTop: 5,
              borderWidth: 1,
              borderColor: "gray",
            }}>
            <FlatList
              data={countryNames ? filteredData : data}
              renderItem={({ item }) => (
                <DropdownItem
                  item={item}
                  onPress={handleSelectItem}
                  userList={userList}
                />
              )}
              keyExtractor={(item) => item._id}
              renderWhenEmpty={() => {
                return (
                  <View style={{ height: 50 }}>
                    <TextView textSty={{ textAlign: "center" }}>
                      List is empty!
                    </TextView>
                  </View>
                );
              }}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
};
export default CustomDropdown;
