import React, { Component } from 'react';

import LineGraph from "../container/graphs/LineGraph.js";

import '../css/Performance.css';

class Performance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            renderLineGraph: false,
            sortColumn: { column: "overall", desc: true }
        };

        this.handleNameSelect = this.handleNameSelect.bind(this);
        this.handleColourSelect = this.handleColourSelect.bind(this);
        this.handleColumnSort = this.handleColumnSort.bind(this);
    }

    formatDate(date) {
        date = new Date(date);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }

    sortStats(column, direction) {
        return function(a, b) {
            if(direction === "desc" && a[column] < b[column])
                return 1;
            else if(direction === "desc" && a[column] > b[column])
                return -1;
            else if(a[column] < b[column])
                return -1;
            else if(a[column] > b[column])
                return 1;
            else
                return 0
        }
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
                stat.name = stat.name in this.props.meta ? this.props.meta[stat.name] : stat.name;
            });

            stat.percent = stat.overall / stat.matches * 100;

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

                newData.sort(this.sortStats("overall", "desc"));

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
                newData[index].lineColour = newData[index].lineColour ? newData[index].lineColour : "#000000";
    
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

    handleColumnSort(event) {
        const id = event.target.id.split("-")[0]
        let column = this.state.sortColumn.column;
        let desc = this.state.sortColumn.desc;

        switch (id) {
            case "percent": column = "percent"; break;
            case "overall": column = "overall"; break;
            case "playername": column = "name"; break;
            default: break;
        }

        if (column === this.state.sortColumn.column) {
            desc = !desc;
        }

        this.setState({ sortColumn: { column: column, desc:desc } });

        this.setState(oldState => {
            let newData = [...oldState.data];
            newData.sort(this.sortStats(oldState.sortColumn.column, desc ? "desc" : "asc"));

            return { data: newData };
        })
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
                            <th id="playername-column" className="table-column-header table-column-header-sort" onClick={this.handleColumnSort}>
                                <span id="playername-title" className="table-column-header-contents">Player</span>
                                <span id="playername-sort" className="table-column-header-contents">
                                    {this.state.sortColumn.column === "name" ? <img className="table-sort" src={this.state.sortColumn.desc ? "expand.png" : "shrink.png"} height="10" width="10" /> : ""}
                                </span>
                            </th>
                            <th id="overall-column" className="table-column-header table-column-header-sort" onClick={this.handleColumnSort}>
                                <span id="overall-title" className="table-column-header-contents" onClick={this.handleColumnSort}>Current</span>
                                <span id="overall-sort" className="table-column-header-contents">
                                    {this.state.sortColumn.column === "overall" ? <img className="table-sort" src={this.state.sortColumn.desc ? "expand.png" : "shrink.png"} height="10" width="10" /> : ""}
                                </span>
                            </th>
                            <th id="percent-column" className="table-column-header table-column-header-sort" onClick={this.handleColumnSort}>
                                <span id="percent-title" className="table-column-header-contents">%</span>
                                <span id="percent-sort" className="table-column-header-contents">
                                    {this.state.sortColumn.column === "percent" ? <img className="table-sort" src={this.state.sortColumn.desc ? "expand.png" : "shrink.png"} height="10" width="10" /> : ""}
                                </span>  
                            </th>
                            <th className="table-column-header">Show</th>
                        </thead>
                        <tbody>
                            {this.state.data.map((player, i) => {
                                return (
                                    <tr className={i % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                                        <td>
                                            <span>{player.name}</span>
                                        </td>
                                        <td>
                                            {player.overall} / {player.matches}
                                        </td>
                                        <td>
                                            {Math.round(player.percent)}%
                                        </td>
                                        <td className="color-picker-container">
                                            <input className="color-picker" type="color" id={`${i}-player-colorpicker`} onInput={this.handleColourSelect} />    
                                            <input
                                                className="line-reveal"
                                                type="checkbox"
                                                id={`line-graph-player-${i}`}
                                                name="legend"
                                                value={i}
                                                onClick={this.handleNameSelect}
                                                checked={player.show}
                                            />
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