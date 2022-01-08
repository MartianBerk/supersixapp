import React, { Component } from 'react';

import * as Constants from "../constants";
import LineGraph from "../container/graphs/LineGraph.js";

import '../css/Performance.css';

class Performance extends Component {
    VIEWS = ["current", "historic", "winners"];

    constructor(props) {
        super(props);
        this.state = {
            currentRoundStartDate: props.startDate,
            startDate: props.startDate,
            endDate: null,
            data: [],
            winners: [],
            render: false,
            sortColumn: { column: "percent", desc: true },
            viewIndex: 0,
            playerId: props.playerId
        };

        this.handleNameSelect = this.handleNameSelect.bind(this);
        this.handleColourSelect = this.handleColourSelect.bind(this);
        this.handleColumnSort = this.handleColumnSort.bind(this);
        this.handleDateClick = this.handleDateClick.bind(this);
    }

    formatDate(date, format) {
        date = new Date(date);

        if (format === "dd mmm yyyy") {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

            return day + " " + months[month] + " " + year;
        }
        else {
            return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        }
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
        let startDate = this.state.startDate ? new Date(this.state.startDate) : null;
        let endDate = this.state.endDate ? new Date(this.state.endDate) : null;

        let url = Constants.AGGREGATESTATSURL;

        if (startDate) {
            url = url + `?start_date=${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
        }

        if (endDate) {
            url = url + (startDate ? "&" : "?") + `?end_date=${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
        }

        fetch(url)
        .then(response => response.json())
        .then(data => data.stats.forEach((stat, i) => {
            stat.lineColour = null;
            stat.show = false;
            stat.overall = 0;
            stat.matches = 0;

            stat.fullname = stat.name;
            stat.name = stat.name in this.props.meta ? this.props.meta[stat.name] : stat.name;

            stat.scores.forEach(score => {
                score.date = this.formatDate(score.date);
                stat.overall += score.score;
                stat.matches += score.matches;
            });

            stat.percent = stat.overall / stat.matches * 100;
            stat.show = this.state.playerId && this.state.playerId === stat.playerid;

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
                newData.sort(this.sortStats("percent", "desc"));

                return { data: newData };
            });

            if ((i + 1) === data.stats.length) {
                this.setState({ render: true });
            }
        }))
        .catch(/* do nothing */);
    }

    getWinners() {
        fetch(Constants.WINNERSURL)
        .then(response => response.json())
        .then(data => {
            this.setState(() => {
                let winners = data.rounds;

                winners.sort((a, b) => {
                    if(a.round_id < b.round_id)
                        return 1;
                    else if(a.round_id > b.round_id)
                        return -1;
                    else
                        return 0
                })

                return {
                    winners: winners,
                    render: true
                }
            })
        })
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.getPerformanceStats();
    }

    componentDidUpdate(prevProps) {
        if (this.props.meta !== prevProps.meta) {
            this.setState((oldState) => {
                let newData = [...oldState.data];

                newData.forEach(d => {
                    d.name = d.fullname in this.props.meta ? this.props.meta[d.fullname] : d.name;
                })

                return {data: newData};
            })
        }

        if (this.props.playerId !== prevProps.playerId) {
            for(let i = 0; i < this.state.data.length; i++) {
                if (this.state.data[i].playerid === this.props.playerId) {
                    this.state.data[i].show = true;
                    break;
                }
            }
        }
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

    handleDateClick(event) {
        const viewIndex = this.state.viewIndex + (event.target.id === "performance-date-picker-right" ? 1 : -1);
        let startDate = null;

        if (viewIndex === 0) {
            startDate = this.state.currentRoundStartDate;
        }

        this.setState({
            viewIndex: viewIndex,
            startDate: startDate,
            render: false,
            data: []
        }, () => {
            if (viewIndex < 2) {
                this.getPerformanceStats();
            }
            else {
                this.getWinners();
            }
        });
    }

    renderPerformance() {
        return (
            <div className="overall-stats">
                <LineGraph
                    height={200}
                    width={300}
                    backgroundColour="#635f5f"
                    axisColour="#000000"
                    gridColour={this.state.data.length > 0 && this.state.data[0].scores.length > 20 ? null : "#ffffff"}
                    textColour="#ffffff"
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
                                <span id="overall-title" className="table-column-header-contents" onClick={this.handleColumnSort}>Correct</span>
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
    }

    renderWinners() {
        return (
            <div className="overall-stats">
                <div className="performance-table">
                    <table>
                        <thead>
                            <th className="table-column-header">Winner</th>
                            <th className="table-column-header">Won</th>
                            <th className="table-column-header">Jackpot</th>
                        </thead>
                        <tbody>
                            {this.state.winners.map((round, i) => {
                                return (
                                    <tr className={i % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                                        <td>{round.winner}</td>
                                        <td>{this.formatDate(round.end_date, "dd mmm yyyy")}</td>
                                        <td>{"£" + round.jackpot / 100}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="performancecontainer">
                <div className="performance">
                    <div className="performance-container">
                        <div className="performance-date-picker">
                            <div className="performance-date-picker-part">
                                {
                                    this.state.viewIndex > 0
                                    ? <div id="performance-date-picker-left" onClick={this.handleDateClick}>{"<"}</div> 
                                    : <div id="performance-date-picker-left">{""}</div>
                                }
                            </div>
                            <div className={"performance-date-picker-part"}>
                                { this.VIEWS[this.state.viewIndex][0].toUpperCase() + this.VIEWS[this.state.viewIndex].slice(1) }
                            </div>
                            <div className="performance-date-picker-part">
                                {
                                    this.state.viewIndex < this.VIEWS.length - 1
                                    ? <div id="performance-date-picker-right" onClick={this.handleDateClick}>{">"}</div>
                                    : <div id="performance-date-picker-right">{""}</div>
                                }
                            </div>
                        </div>
                            {
                                this.state.render ? (this.state.viewIndex < 2 ? this.renderPerformance() : this.renderWinners()) : null
                            }
                        </div>
                </div>
            </div>
        )
    }
}

export default Performance;