import React, { Component } from 'react';

import LineGraph from "../container/graphs/LineGraph.js";

import '../css/Performance.css';

class Performance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            renderLineGraph: false
        };
        this.colourPalette = [
            "#803030",
            "#427a33",
            "#34507d"
        ];

        this.handleSelect = this.handleSelect.bind(this);
    }

    formatDate(date) {
        date = new Date(date);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }

    getPerformanceStats() {
        // fetch("http://192.168.0.12:5000/supersix/stats/list")
        fetch("stats.json")
        .then(response => response.json())
        .then(data => data.stats.forEach((stat, i) => {
            stat.lineColour = i < this.colourPalette.length ? this.colourPalette[i] : "#000000";
            stat.show = true;

            stat.scores.forEach(score => {
                score.date = this.formatDate(score.date);
            });

            // this allows for effective updating of a states array and rerendering
            this.setState((oldState) => {
                let newData = [...oldState.data];

                if (i <= newData.length - 1) {
                    if (newData[i].scores.length <= stat.scores.length) {
                        return null;
                    }

                    newData[i].scores.push(stat.scores.slice(newData.length - 1));
                }

                newData.push(stat);

                return { data: newData };
            });

            if ((i + 1) === data.stats.length) {
                this.setState({ renderLineGraph: true });
            }
        }))
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.getPerformanceStats();
    }

    handleSelect(event) {
        const index = event.target.value;

        if (event.target.checked) {
            this.setState(oldState => {
                let newData = [...oldState.data];
                newData[index].show = true;
    
                return { data: newData };
            });
        }
        else {
            this.setState(oldState => {
                let newData = [...oldState.data];
                newData[index].show = false;
    
                return { data: newData };
            });
        }

        event.target.checked = event.target.checked;
    }

    render() {
        const overall = (
            <div className="overall-stats">
                <LineGraph
                    height={400}
                    width={600}
                    backgroundColour="#635f5f"
                    data={this.state.data.filter(player => { return player.show ? player : null })}
                    xAxis="date"
                    yAxis="score"
                    graphData="scores"
                    lineLabel="name"
                />
                <br />
                {this.state.data.map((player, i) => {
                    return (
                        <div>
                            <input
                                type="checkbox"
                                id={`line-graph-player-${i}`}
                                name="legend"
                                value={i}
                                onClick={this.handleSelect}
                                defaultChecked={player.show ? true : false}
                            />
                            <span className="line-graph-legend" style={{ color: player.lineColour }}>{player.name}</span>
                        </div>
                    )
                })}
            </div>
        )

        return (
            <div className="performance">
                <br />
                {this.state.renderLineGraph && overall}
            </div>
        )
    }
}

export default Performance;