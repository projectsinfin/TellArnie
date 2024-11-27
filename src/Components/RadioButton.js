import React from 'react';
import {View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import {trueMarkImg} from '../Assets';

export default function RadioButton({label, selected, onSelect}) {
  console.log(selected, '000000');
  return (
    <TouchableOpacity onPress={onSelect}>
      {/* onPress handler runs when item is clicked.*/}
      {selected && (
        <Image
          source={trueMarkImg}
          // style={CommonStyles.rightArrowSty}
          resizeMode="contain"></Image>
      )}
    </TouchableOpacity>
  );
}
