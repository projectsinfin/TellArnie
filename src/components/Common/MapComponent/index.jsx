import React from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
} from "react-google-maps";

function Map({ latitude, longitude }) {
  return (
    <GoogleMap
      defaultZoom={5}
      center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
    >
      <Marker
        position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
      />
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));
function MapComponent({ latitude, longitude }) {
  const apiKey = "AIzaSyCHp_2JnrOZJygBCYJPB-p8Y2VONw68Ig8";
  // return null;

  return (
    <div style={{ width: "150px", height: "155px" }}>
      {" "}
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  );
}
export default MapComponent;

// import React from 'react';
// import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';

// function Map({ latitude, longitude }) {
//   return (
//     <GoogleMap
//       defaultZoom={10}
//       center={{ lat: latitude, lng: longitude }}
//     >
//       <Marker position={{ lat: latitude, lng: longitude }} /> {/* Marker at the specified location */}
//     </GoogleMap>
//   );
// }

// const WrappedMap = withScriptjs(withGoogleMap(Map));

// function MapComponent({ latitude, longitude }) {
//   const apiKey = 'AIzaSyCt_5mZ_1qf_ow5EdDGIl0MLntAEP1Rl-E';

//   return (
//     <div style={{ width: '100%', height: '200px' }}>
//       <WrappedMap
//         googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,drawing,places`}
//         loadingElement={<div style={{ height: '100%' }} />}
//         containerElement={<div style={{ height: '100%' }} />}
//         mapElement={<div style={{ height: '100%' }} />}
//         latitude={latitude}
//         longitude={longitude}
//       />
//     </div>
//   );
// }

// export default MapComponent;

// import React from "react";
// import GoogleMapReact from 'google-map-react';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

// export default function SimpleMap(){
//   const defaultProps = {
//     center: {
//       lat: 10.99835602,
//       lng: 77.01502627
//     },
//     zoom: 11
//   };

//   return (
//     // Important! Always set the container height explicitly
//     <div style={{ height: '100vh', width: '100%' }}>
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: "" }}
//         defaultCenter={defaultProps.center}
//         defaultZoom={defaultProps.zoom}
//       >
//         <AnyReactComponent
//           lat={59.955413}
//           lng={30.337844}
//           text="My Marker"
//         />
//       </GoogleMapReact>
//     </div>
//   );
// }