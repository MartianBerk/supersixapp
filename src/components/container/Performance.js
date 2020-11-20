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

        this.handleNameSelect = this.handleNameSelect.bind(this);
        this.handleColourSelect = this.handleColourSelect.bind(this);
    }

    formatDate(date) {
        date = new Date(date);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }

    getPerformanceStats() {
        // fetch("http://192.168.0.12:5000/supersix/stats/aggregate")
        fetch("aggregate_stats.json")
        .then(response => response.json())
        .then(data => data.stats.forEach((stat, i) => {
            stat.lineColour = null;
            stat.show = false;
            stat.overall = 0;
            stat.matches = 0;

            stat.scores.forEach(score => {
                score.date = this.formatDate(score.date);
                stat.overall += score.score;
                stat.matches += score.matches;
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

                newData.sort((a, b) => {
                    if(a.overall < b.overall)
                        return 1;
                    else if(a.overall > b.overall)
                        return -1;
                    else
                        return 0
                });

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

    handleNameSelect(event) {
        const index = event.target.value;

        if (event.target.checked) {
            this.setState(oldState => {
                let newData = [...oldState.data];
                newData[index].show = true;
                newData[index].lineColour = "#000000";
    
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

    handleColourSelect(event) {
        const index = parseInt(event.target.id.split("-")[0]);

        let newData = [...this.state.data];
        newData[index].lineColour = event.target.value;

        this.setState({ data: newData });
    }

    render() {
        const overall = (
            <div className="overall-stats">
                <LineGraph
                    height={200}
                    width={300}
                    backgroundColour="#635f5f"
                    axisColour="#000000"
                    gridColour="#ffffff"
                    data={this.state.data.filter(player => { return player.show ? player : null })}
                    xAxis="date"
                    yAxis="score"
                    graphData="scores"
                    lineLabel="name"
                />
                <br />
                <div className="performance-table">
                    <table>
                        <thead>
                            <th>Show</th>
                            <th>Colour</th>
                            <th>Player</th>
                            <th>Current</th>
                        </thead>
                        <tbody>
                            {this.state.data.map((player, i) => {
                                return (
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                id={`line-graph-player-${i}`}
                                                name="legend"
                                                value={i}
                                                onClick={this.handleNameSelect}
                                                defaultChecked={player.show ? true : false}
                                            />
                                        </td>
                                        <td>
                                            <input type="color" id={`${i}-player-colorpicker`} onInput={this.handleColourSelect} />
                                        </td>
                                        <td>
                                            <span>{player.name}</span>
                                        </td>
                                        <td>
                                            ({player.overall} / {player.matches})
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )

        return (
            <div className="performancecontainer">
                <div className="performance">
                    {this.state.renderLineGraph && overall}
                </div>
            </div>
        )
    }
}

export default Performance;