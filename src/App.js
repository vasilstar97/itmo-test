import React, {useEffect, useState, useMemo, createRef} from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvent } from "react-leaflet";
import Clocks from "./components/clocks/clocks";
import Controls from "./components/controls/controls";
import './App.css';

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

function MapClickEvent(props) {
  const map = useMapEvent('click', (e) => {
    props.onMapClick(e);
  })
  return null
}

function App() {

  const [start, setStart] = useState([59.848321845463, 30.329407098684058]);
  const [end, setEnd] = useState([59.9449045093987, 30.29482121384622]);
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
    }).then(responce => responce.json()).then(responce => setPath(responce['features'].map((item) => [item['geometry']['coordinates'][1],item['geometry']['coordinates'][0]])));
  }

  const markerEventHandlers = useMemo(
    () => ({
      moveend(e) {
        // const latLng = e.target._latlng;
        // switch (e.target.options.purpose) {
        //   case "start":
        //     setStart([latLng.lat, latLng.lng]);
        //     break;
        //   case "end":
        //     setEnd([latLng.lat, latLng.lng]);
        //     break;
        //   default:
        //     break;
        // }
      }
    }),
    [],
  );

  const onMapClick = (e) => {
    if (settingMarker === undefined) return;
    let latlng = [e.latlng.lat, e.latlng.lng];
    switch (settingMarker) {
      case "from":
        setMarkerFrom(latlng);
        setSettingMarker(undefined);
        break;
      case "to":
        setMarkerTo(latlng);
        setSettingMarker(undefined);
      default:
        break;
    }
  };

  const onTimeChange = (e) => {
    setTime(e);
  };

  const onMarkerRemoving = (e) => {
    switch (e) {
      case "from":
        setMarkerFrom([]);
        break;
      case "to":
        setMarkerTo([]);
        break;
      default:
        break;
    }
  }
  
  const onMarkerAdding = (e) => {
    setSettingMarker(e);
  }

  return (
    <div className="interface">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} onClick={(e) => { console.log(123) }}>
        <MapClickEvent onMapClick={onMapClick}/>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerFrom.length>0 && <Marker position={markerFrom} draggable={true} eventHandlers={markerEventHandlers} purpose={"from"}>
          <Tooltip>From</Tooltip>
        </Marker>}
        {markerTo.length>0 && <Marker position={markerTo} draggable={true} eventHandlers={markerEventHandlers} purpose={"to"}>
          <Tooltip>To</Tooltip>
        </Marker>}
        <Polyline
          positions={path} color={'black'}
        />
      </MapContainer>
      <Controls onMarkerAdding={onMarkerAdding} onMarkerRemoving={onMarkerRemoving} markerFrom={markerFrom} markerTo={markerTo}/>
      <Clocks onTimeChange={onTimeChange} onTimeInitialSet={(e) => {setTime(e)}}/>
    </div>
  );
}

export default App;