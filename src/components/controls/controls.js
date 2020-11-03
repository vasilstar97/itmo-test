import React, {useEffect, useState, useMemo, createRef} from "react";
import './controls.css';

function Controls(props) {
    const [settingMarker, setSettingMarker] = useState(undefined);

    if (props.markerFrom.length > 0 && settingMarker == "from") setSettingMarker(undefined);
    if (props.markerTo.length > 0 && settingMarker == "to") setSettingMarker(undefined);

    let aClasses = "controls__control " + (props.markerFrom.length != 0 ? "controls__control_set" : "");
    let bClasses = "controls__control " + (props.markerTo.length != 0 ? "controls__control_set" : "");

    const setMarker = (marker) => {
        if (settingMarker === undefined) {
            setSettingMarker(marker);
            props.onMarkerAdding(marker);
        }
    }
    const removeMarker = (marker) => {
        props.onMarkerRemoving(marker);
    }

    const onMarkerClick = (marker) => {
        if (marker == "from") {
            if (props.markerFrom.length == 0)
                setMarker(marker);
            else removeMarker(marker);
        }
        if (marker == "to") {
            if (props.markerTo.length == 0)
                setMarker(marker);
            else removeMarker(marker);
        }
    }

    return (
        <div className="controls">
            <a className={aClasses} onClick={() => { onMarkerClick("from") }}>A</a>
            <a className={bClasses} onClick={() => { onMarkerClick("to") }}>B</a>
        </div>
    );
}

export default Controls;