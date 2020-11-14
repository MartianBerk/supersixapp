import React, { Component } from 'react';

import LineGraph from "../container/graphs/LineGraph.js";

import '../css/Performance.css';

class Performance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
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
                <div className="overall-stats">
                    <LineGraph
                        height={300}
                        width={300}
                        data={this.state.data}
                        xAxis="score"
                        yAxis="date"
                    />
                </div>
            </div>
        )
    }
}

export default Performance;