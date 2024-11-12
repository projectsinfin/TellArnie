import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';

const countries = [
  {code: 'US', name: 'United States', callingCode: '+1'},
  {code: 'CA', name: 'Canada', callingCode: '+1'},
  // Add more countries here
];

const CountryPicker = ({isVisible, onSelect, onClose}) => {
  return (
    <Modal isVisible={isVisible}>
      <View>
        <FlatList
          data={countries}
          keyExtractor={item => item.code}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CountryPicker;
