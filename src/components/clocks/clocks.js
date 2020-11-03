import React, {useEffect, useState, useMemo, createRef} from "react";
import './clocks.css';

function Clocks(props) {
    const [hours, setHours] = useState( (new Date()).getHours() + 0 );
    const [minutes, setMinutes] = useState( Math.floor((new Date()).getMinutes() / 30) * 30 );

    props.onTimeInitialSet(hours * 60 * 60 + minutes * 60);

    const increaseTime = () => {
        let min = minutes;
        let hrs = hours;
        if (minutes + 30 >= 60) {
            min = 0;
            if (hours + 1 >= 24) {
                hrs = 0;
            }
            else hrs = hours + 1;
        }
        else min = 30;
        props.onTimeChange(hrs * 60 * 60 + min * 60);
        setHours(hrs);
        setMinutes(min);
    }

    const decreaseTime = () => {
        let min = minutes;
        let hrs = hours;
        if (minutes - 30 < 0) {
            min = 30;
            if (hours - 1 < 0) {
                hrs = 23;
            }
            else hrs = hours - 1;
        }
        else min = 0;
        props.onTimeChange(hrs * 60 * 60 + min * 60);
        setHours(hrs);
        setMinutes(min);
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