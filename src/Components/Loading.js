import React from 'react';
import {View, ActivityIndicator} from 'react-native';
// import { BarIndicator } from 'react-native-indicators';

const Loading = (props = any) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <View style={{backgroundColor: 'transparent', position: 'absolute'}}>
        <ActivityIndicator size={40} color="#fff" />
      </View>
    </View>
  );
};

export default Loading;
