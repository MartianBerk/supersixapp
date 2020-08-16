import React, { Component } from 'react';

import Games from "../container/Games.js";
import Scores from "../container/Scores.js";
import Time from "../container/Time.js";

import '../css/SuperSix.css';

class SuperSix extends Component {
    render () {
        return (
            <div className="supersix">
                <Time />
                <Games />
                <Scores />
            </div>
        )
    }
}

export default SuperSix;
