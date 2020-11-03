import React, {useEffect, useState, useMemo, createRef} from "react";
import './controls.css';

function Controls(props) {

    return (
        <div className="interface__controls">
            <a className="interface__control">A</a>
            <a className="interface__control">B</a>
        </div>
    );
}

export default Controls;