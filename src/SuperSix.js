import React, { Component } from 'react';

import Games from "./components/container/Games";
import Scores from "./components/container/Scores";
import Time from "./components/container/Time";

class SuperSix extends Component {
    render () {
        return (
            <div>
                <Time />
                <Games />
                <Scores />
            </div>
        )
    }
}

export default SuperSix;
