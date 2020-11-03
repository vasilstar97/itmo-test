import React, {useEffect, useState, useMemo, createRef} from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvent } from "react-leaflet";
import Clocks from "./components/clocks/clocks";
import Controls from "./components/controls/controls";
import './App.css';
import marker_a from './marker_a.png';
import marker_b from './marker_b.png';

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

function MapClickEvent(props) {
  const map = useMapEvent('click', (e) => {
    props.onMapClick(e);
  })
  return null
}

function App() {
  const [path, setPath] = useState([]);
  const [center, setCenter] = useState([59.848321845463, 30.329407098684058]);
  const [markerFrom, setMarkerFrom] = useState([]);
  const [markerTo, setMarkerTo] = useState([]);
  const [time, setTime] = useState(0);

  const [settingMarker, setSettingMarker] = useState(undefined);

  const buildRoute = (src, trgt) => {
    const url = "https://transportservice.onti.actcognitive.org/api.v2/route";
    const currentTime = time;
    const body = {
      source: src,
      target: trgt,
      day_time: currentTime,
      mode_type: "car_cost"
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(responce => responce.json()).then(responce => setPath(responce['features'].map((item) => [item['geometry']['coordinates'][1], item['geometry']['coordinates'][0]])));
  }
  
  const setMarker = (marker, latlng) => {
    if (marker === "from") {
      setMarkerFrom(latlng);
      if (markerTo.length>0 && latlng.length>0) buildRoute(latlng, markerTo);
    }
    if (marker === "to") {
      setMarkerTo(latlng);
      if (markerFrom.length>0 && latlng.length>0) buildRoute(markerFrom, latlng);
    }
  };

  const onMapClick = (e) => {
    if (settingMarker === undefined) return;
    let latlng = [e.latlng.lat, e.latlng.lng];
    setMarker(settingMarker,latlng);
    setSettingMarker(undefined);
  };

  const onTimeChange = (e) => {
    setTime(e);
    if (markerFrom.length>0 && markerTo.length>0) buildRoute(markerFrom, markerTo);
  };

  const onMarkerRemoving = (e) => {
    setMarker(e, []);
    setPath([]);
  }
  
  const onMarkerAdding = (e) => {
    setSettingMarker(e);
  }

  var icon_a = L.icon({
    iconUrl: marker_a,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  var icon_b = L.icon({
    iconUrl: marker_b,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });


  return (
    <div className="interface">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} onClick={(e) => { console.log(123) }}>
        <MapClickEvent onMapClick={onMapClick}/>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerFrom.length > 0 && <Marker position={markerFrom} draggable={false} icon={icon_a}/>}
        {markerTo.length > 0 && <Marker position={markerTo} draggable={false} icon={icon_b}/>}
        {markerFrom.length>0 && markerTo.length>0 && <Polyline
          positions={path} color={'black'}
        />}
      </MapContainer>
      <Controls onMarkerAdding={onMarkerAdding} onMarkerRemoving={onMarkerRemoving} markerFrom={markerFrom} markerTo={markerTo}/>
      <Clocks onTimeChange={onTimeChange} onTimeInitialSet={(e) => {setTime(e)}}/>
    </div>
  );
}

export default App;