import React, {useEffect, useState, useMemo, createRef} from "react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, GeoJSON } from "react-leaflet";
import './App.css';

// указываем путь к файлам marker
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

function App() {

  const [start, setStart] = useState([59.848321845463, 30.329407098684058]);
  const [end, setEnd] = useState([59.9449045093987, 30.29482121384622]);
  const [zoom, setZoom] = useState(12);
  const [path, setPath] = useState([]);
  const [b, setB] = useState(false);

  const handleMarkerMove = () => {
    console.log(123);
  };

  const buildRoute = (src, trgt) => {
    const url = "https://transportservice.onti.actcognitive.org/api.v2/route";
    const currentTime = (new Date()).getHours * 60 * 60;
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

  let currentMarker = "start";

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

  useEffect(() => {
    if (b) return;
    setB(true);
    buildRoute(start,end);
  });

  const log = (e) => { console.log(e) };

  return (
    <MapContainer center={[(start[0]+end[0])/2,(start[1]+start[1])/2]} zoom={zoom} scrollWheelZoom={false}>
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
  );
}

export default App;