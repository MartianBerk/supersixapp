import React, { Component } from 'react';
import { Requests } from "../requests.js";
import PlayerPrediction from './PlayerPrediction.js';

import "../css/PlayerPredictions.css";

class PlayerPredictions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            matches: [],
            predictions: {}, 
            playerIndex: null,
            selectedDate: null,
            dates: [],
            loading: true
        };

        this.requests = new Requests();

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    componentDidMount() {
        this.requests.fetch("LISTPLAYERSURL")
        .then(response => response.json())
        .then(data => this.setState(() => { 
            let predictions = {};

            data.players.forEach(player => {
                predictions[player.id] = [];
            })
            
            return { players: data.players, predictions:  predictions}
        }))
        .then(_ => {
            this.requests.fetch("LISTMATCHESURL")
            .then(response => response.json())
            .then(data => this.setState((_) => {
                let dates = [];
                let matches = [];

                data.matches.forEach(match => {
                    if (match.use_match) {
                        matches.push(match);
                        if (dates.indexOf(match.match_date) === -1) {
                            dates.push(match.match_date);
                        }
                    }
                });
            
                return { dates: dates, matches: matches, selectedDate: dates.length > 0 ? dates[0] : null };
            }))
            .then(_ => {
                let matchDate = new Date(this.state.selectedDate);
                matchDate = `${matchDate.getDate()}-${matchDate.getMonth() + 1}-${matchDate.getFullYear()}`;

                this.requests.fetch(
                    "LISTPREDICTIONSURL",
                    null,
                    {
                        matchdate: matchDate
                    }
                )
                .then(response => response.json())
                .then(data => this.setState(() => { 
                    let predictions = {...this.state.predictions};

                    data.predictions.forEach(prediction => {
                        predictions[prediction.player_id].push({match_id: prediction.match_id, prediction: prediction.prediction});
                    })

                    return {predictions: predictions, loading: false }
                }))
                .catch(/* do nothing */)
            })
        })
        .catch(/* do nothing */)
    }

    formatDate(matchDate) {
        let date = new Date(matchDate);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const month = date.getMonth();
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const weekday = weekdays[date.getDay()];

        return weekday + " " + day + " " + months[month];
    }

    handleDateClick(event) {
        let dateIndex = this.state.dates.indexOf(this.state.selectedDate);

        switch(event.target.id) {
            case "date-picker-left": dateIndex--; break;
            case "date-picker-right": dateIndex++; break;
        };

        this.setState({ selectedDate: this.state.dates[dateIndex] });
    }

    render() {
        return (
            <div className="player-predictions">
                {
                    this.state.loading ?
                    null :
                    (
                        <div>
                            <div>
                                {
                                    this.state.selectedDate ?
                                    <div className="date-picker">
                                        <div className="date-picker-part">{this.state.dates.indexOf(this.state.selectedDate) ? <div id="date-picker-left" onClick={this.handleDateClick}>{"<"}</div> : <div id="date-picker-left">{""}</div>}</div>
                                        <div className="date-picker-part">{this.formatDate(this.state.selectedDate)}</div>
                                        <div className="date-picker-part">{this.state.dates.indexOf(this.state.selectedDate) !== this.state.dates.length - 1 ? <div id="date-picker-right" onClick={this.handleDateClick}>{">"}</div> : <div id="date-picker-right">{""}</div>}</div>
                                    </div>
                                    : null
                                }
                            </div>
                            <div>
                                {
                                    this.state.players.map((player, index) => {
                                        return (
                                            <div 
                                            className="player-predictions-player"
                                            onClick={() => {
                                                this.setState({ playerIndex: (this.state.playerIndex === index ? null : index) })
                                            }}>
                                                <span className={"player-predictions-player-section" + (this.state.predictions[player.id].length === 6 ? " complete" : "")}>{player.first_name} {player.last_name}</span>
                                                <span className={"player-predictions-player-section" + (this.state.predictions[player.id].length === 6 ? " complete" : "")}>{`(${this.state.predictions[player.id].length} / 6)`}</span>
                                                <div className="player-predictions-player-matches">
                                                    {
                                                        this.state.playerIndex === index ?
                                                        this.state.matches.map(match => {
                                                            // Let's try to find the prediction first, to send to PlayerPrediction as selected.
                                                            let playerPrediction = null;
                                                            this.state.predictions[player.id].forEach(prediction => {
                                                                if (prediction.match_id === match.id) {
                                                                    playerPrediction = prediction.prediction
                                                                }
                                                            })

                                                            return (
                                                                <div className="player-predictions-player-match-container">
                                                                    <div className="player-predictions-player-match">
                                                                        <span className="player-predictions-player-match-section">{match.home_team}</span>
                                                                        <span className="player-predictions-player-match-section">Vs</span>
                                                                        <span className="player-predictions-player-match-section">{match.away_team}</span>
                                                                    </div>
                                                                    <div className="player-predictions-player-match-buttons">
                                                                        <PlayerPrediction 
                                                                            playerId={player.id}
                                                                            matchId={match.id}
                                                                            selected={playerPrediction}
                                                                            onPredictionSet={(newPrediction) => {
                                                                                let newPlayerPredictions = [...this.state.predictions[player.id]];

                                                                                let found = false;
                                                                                newPlayerPredictions.forEach(prediction => {
                                                                                    if (prediction.match_id === match.id) {
                                                                                        prediction.prediction = newPrediction;
                                                                                        found = true;
                                                                                    }
                                                                                })
                                                                        
                                                                                if (!found) {
                                                                                    newPlayerPredictions.push({ match_id: match.id, prediction: newPrediction });
                                                                                }
                                                                        
                                                                                let newPredictions = {...this.state.predictions};
                                                                                newPredictions[player.id] = newPlayerPredictions;
                                                                        
                                                                                this.setState({ predictions: newPredictions });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="games-whitespace">
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default PlayerPredictions;
