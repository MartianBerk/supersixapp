import React, { Component } from 'react';

import Games from "./components/container/Games";
import Predictions from "./components/container/Predictions";
import Time from "./components/container/Time";

class SuperSix extends Component {
    render () {
        return (
            <div>
                <Time />
                <Games />
                <Predictions />
            </div>
        )
    }
}

export default SuperSix;
