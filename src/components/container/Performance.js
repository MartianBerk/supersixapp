import React, { Component } from 'react';

import '../css/Performance.css';

class Performance extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    getPerformanceStats() {
        // fetch("http://192.168.0.12:5000/supersix/stats/list")
        fetch("stats.json")
        .then(response => response.json())
        .then(data => data.states.forEach((stat, i) => {
            return null;
        }))
        .catch(/* do nothing */);
    }

    render() {
        return (
            <div className="performance">
                TBC
            </div>
        )
    }
}

export default Performance;