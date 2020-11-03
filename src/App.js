import React, {useEffect, useState, useMemo, createRef} from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, GeoJSON } from "react-leaflet";
import Clocks from "./components/clocks/clocks";
import Controls from "./components/controls/controls";
import './App.css';

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

function App() {

  const [center, setCenter] = useState([59.848321845463, 30.329407098684058]);
  const [start, setStart] = useState([59.848321845463, 30.329407098684058]);
  const [end, setEnd] = useState([59.9449045093987, 30.29482121384622]);
  const [path, setPath] = useState([]);
  const [b, setB] = useState(false);
  const [time, setTime] = useState(0);

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

  const eventHandlers = useMemo(
    () => ({
      moveend(e) {
        const latLng = e.target._latlng;
        switch (e.target.options.purpose) {
          case "start":
            setStart([latLng.lat, latLng.lng]);
            break;
          case "end":
            setEnd([latLng.lat, latLng.lng]);
            break;
          default:
            break;
        }
        setB(false);
      },
    }),
    [],
  )
  const onTimeChange = (e) => {
    setTime(e);
  };
  useEffect(() => {
    if (b) return;
    setB(true);
    buildRoute(start,end);
  });

  return (
    <div className="interface">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={start} draggable={true} eventHandlers={eventHandlers} purpose={"start"}>
          <Tooltip>From</Tooltip>
        </Marker>
        <Marker position={end} draggable={true} eventHandlers={eventHandlers} purpose={"end"}>
          <Tooltip>To</Tooltip>
        </Marker>
        <Polyline
          positions={path} color={'#c97128'}
        />
      </MapContainer>
      <Controls onMarkerSetting={onMarkerSetting}/>
      <Clocks onTimeChange={onTimeChange} onTimeInitialSet={(e) => {setTime(e)}}/>
    </div>
  );
}

export default App;