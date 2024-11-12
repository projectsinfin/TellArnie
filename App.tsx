import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Index from './src';

const App = () => {
  const [isConnected, setIsConnected] = useState(true); // State to track network connectivity

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
  
      setIsConnected(state?.isConnected);
    });

    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, []);

   
   
   return (isConnected===true? <Index />:alert('No Internet Connection'))  
 
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

// const App = () => {
//   return (
//     // <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE} // use Google Maps
//         style={styles.map}
//         initialRegion={{
//           latitude: 30.733315,
//           longitude: 76.779419,
//           latitudeDelta: 0.015,
//           longitudeDelta: 0.0121,
//         }}>
//         {/* <Marker
//           coordinate={{
//             latitude: 30.733315,
//             longitude: 76.779419,
//           }}
//           // Optionally add title and description
//           title="My Marker"
//           description="Marker Description"
//         /> */}
//       </MapView>
//     // </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     height: responsiveHeight(100),
//     width: responsiveWidth(100),
//   },
// });

// export default App;
