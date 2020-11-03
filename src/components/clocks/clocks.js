import React, {useEffect, useState, useMemo, createRef} from "react";
import './clocks.css';

function Clocks(props) {
    const [hours, setHours] = useState( (new Date()).getHours() + 0 );
    const [minutes, setMinutes] = useState( Math.floor((new Date()).getMinutes() / 30) * 30 );

    props.onTimeInitialSet(hours * 60 * 60 + minutes * 60);

    const increaseTime = () => {
        if (minutes + 30 >= 60) {
            setMinutes(0);
            if (hours + 1 >= 24) {
                setHours(0);
            }
            else setHours(hours + 1);
        }
        else setMinutes(30);
        props.onTimeChange(hours * 60 * 60 + minutes * 60);
    }

    const decreaseTime = () => {
        if (minutes - 30 < 0) {
            setMinutes(30);
            if (hours - 1 < 0) {
                setHours(23);
            }
            else setHours(hours - 1);
        }
        else setMinutes(0);
        props.onTimeChange(hours * 60 * 60 + minutes * 60);
    }

    return (
        <div className="clocks">
            <div className="clocks__value">{hours<10?"0"+hours:hours}</div>
            <div className="clocks__separator">:</div>
            <div className="clocks__value">{minutes<10?"0"+minutes:minutes}</div>
            <div className="clocks__buttons">
                <a className="clocks__button" onClick={increaseTime}>+</a>
                <a className="clocks__button" onClick={decreaseTime}>-</a>
            </div>
        </div>
    );
}

export default Clocks;