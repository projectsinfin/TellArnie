import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './CardWithMapStyles.css';
import plus from '../Assets/svgs/plus.svg';
import minus from '../Assets/svgs/minus.svg';
import L from 'leaflet';

// Default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create a custom marker icon
const createCustomIcon = (color, size) => {
  return new L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; border-radius: 50%; width: ${size}px; height: ${size}px;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const CardWithMap = () => {
  const [zoom, setZoom] = useState(5); // Initial zoom level
  const [center, setCenter] = useState([54.5, -4.5]); // Center coordinates for the UK and Ireland

  // Sample data for locations with counts
  const initialLocations = [
    { coordinates: [-0.1276, 51.5074], count: 8, color: '#FF0000' }, // London, UK (red)
    { coordinates: [-6.2603, 53.3498], count: 6, color: '#FF0000' }, // Dublin, Ireland (green)
    { coordinates: [-4.2518, 55.8642], count: 5, color: '#FF0000' }, // Glasgow, Scotland (blue)
    { coordinates: [-3.1791, 51.4816], count: 4, color: '#FF0000' }, // Cardiff, Wales (pink)
    { coordinates: [-1.617439, 54.978252], count: 7, color: '#FF0000' }, // Newcastle, UK (yellow)
  ];

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 18)); // Increase zoom level
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 1)); // Decrease zoom level
  };

  return (
    <Card className="reported_incidents rounded_16 border-0 overflow-hidden">
      <Card.Body className="pb-0" style={{ flex: "unset" }}>
        <h4 className="fw-bold mb-0">Reported Incidents</h4>
      </Card.Body>
      <span className="px-3 mb-2 colorgrey">Past 7 Days</span>
      <div className="map-container position-relative">
        <MapContainer center={center} zoom={zoom} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {initialLocations.map((location, index) => (
            <Marker key={index} position={location.coordinates} icon={createCustomIcon(location.color, 30)}>
              <Popup>
                {`Count: ${location.count}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Zoom controls */}
        <div className="d-flex justify-content-center mt-2 plus_minus_block">
          <Button
            className="background-transparent border-0 border-bottom-dark"
            onClick={handleZoomIn}
          >
            <img src={plus} alt="Zoom In" />
          </Button>
          <Button
            className="background-transparent border-0"
            onClick={handleZoomOut}
          >
            <img src={minus} alt="Zoom Out" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CardWithMap;
