import React, { Component } from 'react';

import * as Constants from "../constants.js";
import Predictions from "./Predictions.js";

import '../css/Scores.css';

class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerId: props.playerId,
            date: props.meta.gameweeks[props.meta.gameweeks.length - 1],
            players: [],
            indexRow: null,
            live: false
        };

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    getScores(date) {
        date = new Date(date === undefined ? this.state.date : date);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        date = [day, month, year].join("-");

        var live = false;

        fetch(`${Constants.SCORESURL}?matchDate=${date}`)
        .then(response => response.json())
        .then(data => data.scores.forEach((player, i) => {
            player.fullname = player.name;
            player.name = player.name in this.props.meta.players ? this.props.meta.players[player.name] : player.name;

            if (this.state.playerId && this.state.playerId === player.id) {
                let shared = false;

                // Only perform duplicate prediction check if all 6 predictions are selected.
                if (player.matches.length === 6) {
                    data.scores.forEach((subPlayer, j) => {
                        if (shared) {
                            // once shared has been found, no need to continue
                            return null
                        }
                        else if (j === i) {
                            // skip player
                            return null;
                        }

                        let equalPredictions = 0;
                        subPlayer.matches.forEach((match, k) => {
                            if (match.prediction === player.matches[k].prediction) {
                                equalPredictions++;
                            }
                        })

                        shared = equalPredictions === 6;
                    })
                }
            }
            
            this.setState((oldState) => {
                let newPlayers = [...oldState.players];

                let found = false;
                for (let i = 0; i < newPlayers.length; i++) {
                    if (player.name === newPlayers[i].name) {
                        newPlayers[i] = player;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    newPlayers.push(player);
                }

                return { players: newPlayers };
            });
        }))
        .then(_ => {
            let playerIndex = null;
            const allSelections = this.state.players.map((player, i) => {
                if (this.state.playerId && player.id === this.state.playerId) {
                    playerIndex = i;
                }

                return player.matches.map(match => { return match.prediction })
            }, playerIndex);

            this.props.sendSelectionsUpstream(allSelections, playerIndex)
        })
        .then(() => {
            this.setState(oldState => {
                let player = oldState.players[0];  // only need one players scores to track live

                if (!live) {
                    for (var i = 0; i < player.matches.length; i++) {
                        if (player.matches[i].status === "IN PLAY") {
                            live = true;
                            break;
                        }
                    }
                }

                return {live: live}
            })
        })
        .then(() => {
            this.setState(oldState => {
                let sorted = [...oldState.players];

                sorted.sort((a, b) => {
                    if(a.score < b.score)
                        return 1;
                    else if(a.score > b.score)
                        return -1;
                    else
                        return 0
                })

                return {players: sorted}
            })
        })
        .catch(/* do nothing */);
    }

    formatMatchDate(matchDate) {
        let date = new Date(matchDate);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

        let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        let mins = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();

        return day + " " + months[month] + " " + year + " " + hours + ":" + mins;
    }

    initiateLiveMode() {
        const date = new Date(this.state.date);
        const now = new Date()
        
        let cutoff = new Date(date.getTime());
        cutoff.setHours(cutoff.getHours() + 2);  // set cutoff 2 hours later

        if (!this.scoresInterval && now >= date && now <= cutoff) {
            this.getScores();
            this.scoresInterval = setInterval(() => this.getScores(), 10000);  // 10 sec refresh
        }
        else if (!(now >= date && now <= cutoff)) {
            this.scoresInterval = null;
        }
    }

    componentDidMount() {
        this.initiateLiveMode();
        this.getScores();  // get data first
        this.scoresInterval = null;
        this.initiateLiveModeInterval = setInterval(() => this.initiateLiveMode(), 10000);  // 10 sec refresh
    }

    componentDidUpdate(prevProps) {
        // If a login has been performed and the props playerId updated, update state
        if (this.props.playerId && this.props.playerId !== prevProps.playerId) {
            let playerIndex = null;
            
            const allSelections = this.state.players.map((player, i) => {
                if (this.state.playerId && player.id === this.state.playerId) {
                    playerIndex = i;
                }

                return player.matches.map(match => { return match.prediction })
            }, playerIndex);

            this.props.sendSelectionsUpstream(allSelections, playerIndex)
        }

        if (this.props.meta && this.props.meta !== prevProps.meta) {
            this.setState((oldState) => {
                let newPlayers = [...oldState.players];

                newPlayers.forEach(player => {
                    player.name = player.fullname in this.props.meta.players ? this.props.meta.players[player.fullname] : player.name;
                })

                return {players: newPlayers};
            })
        }
    }

    handleDateClick(event) {
        let dateIndex = this.props.meta.gameweeks.indexOf(this.state.date);

        switch(event.target.id) {
            case "date-picker-left": dateIndex--; break;
            case "date-picker-right": dateIndex++; break;
        };

        this.setState({ date: this.props.meta.gameweeks[dateIndex] });
        this.getScores(this.props.meta.gameweeks[dateIndex], true);
    }

    render () {
        const rows = this.state.players.map((player, index) => {
            return (
                <div 
                    key={index}
                    className={index % 2 === 0 ? "even" : "odd"}
                    onMouseDown={() => this.setState({ indexRow: (this.state.indexRow === index ? null : index) })}
                >
                    <p className="score">
                        <span className="scoresection playername">{player.name}</span>
                        <span className="scoresection playerscore">{player.score}/{player.matches.length}</span>
                        <img className="scoresection expand" src={this.state.indexRow ===  index ? 'shrink.png' : 'expand.png'} height='10' width='10' />
                    </p>
                    {this.state.indexRow === index ? <Predictions data={this.state.players[this.state.indexRow].matches} /> : null}
                </div>
            )
        }) || [];

        return (
            <div className="scorescontainer">
                {
                    this.state.date ? 
                    <div className="date-picker">
                        <div className="date-picker-part">{this.props.meta.gameweeks.indexOf(this.state.date) ? <div id="date-picker-left" onClick={this.handleDateClick}>{"<"}</div> : <div id="date-picker-left">{""}</div>}</div>
                        <div className={this.state.live ? "date-picker-part live" : "date-picker-part"}>{ this.formatMatchDate(this.state.date) }</div>
                        <div className="date-picker-part">{this.props.meta.gameweeks.indexOf(this.state.date) !== this.props.meta.gameweeks.length - 1 ? <div id="date-picker-right" onClick={this.handleDateClick}>{">"}</div> : <div id="date-picker-right">{""}</div>}</div>
                    </div>
                    : null
                }
                <div className="scores">
                    {rows.length === 0 ? null : rows}
                </div>
            </div>
        )
    }
}

export default Scores;
