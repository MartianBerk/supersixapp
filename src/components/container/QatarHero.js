import React, { Component } from 'react';

import { Requests } from "../requests.js";
import Error from './Error.js';
import GameDetail from './GameDetail.js';

import '../css/QatarHero.css';

class QatarHero extends Component {
    VIEWS = ["matches", "table"];

    constructor(props) {
        super(props);
        this.state = {
            meta: {
                teams: []
            },
            hasPermission: this.props.hasPermission,
            playerId: this.props.playerId,
            loading: true,
            error: null,
            menu: ["Matches", "Table"],
            viewIndex: 0,
            matches: [],
            matchDates: [],
            selectedDate: null,
            indexRow: null,
            allPredictions: [],
            playerSelections: 0,
            scores: []
        };

        this._handleViewClick = this._handleViewClick.bind(this);
        this._handleDateClick = this._handleDateClick.bind(this);

        this.requests = new Requests();
    }

    _formatDate(matchDate) {
        let date = new Date(matchDate);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const month = date.getMonth();
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const weekday = weekdays[date.getDay()];

        return weekday + " " + day + " " + months[month];
    }

    _formatMatchTime(matchDate) {
        let d = new Date(matchDate);

        let hours = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();

        return `${hours}:${minutes}`;
    }

    _calculateExpired(match) {
        let time = '-';

        if (match.status === 'FINISHED') {
            time = 'FT';
        }
        else if (match.match_minute) {
            time = match.match_minute + '\'';
        }

        return time;
    }

    _getData() {
        this.requests.fetch("QATARHEROMATCHESURL")
        .then(response => response.json())
        .then(data => this.setState((_) => {
            let matches = [];
            let dates = [];

            data.matches.forEach(match => {
                match.home_team = {
                    label: match.home_team in this.state.meta.teams ? this.state.meta.teams[match.home_team] : match.home_team,
                    name: match.home_team
                };
                match.away_team = {
                    label: match.away_team in this.state.meta.teams ? this.state.meta.teams[match.away_team] : match.away_team,
                    name: match.away_team
                };

                matches.push(match)

                var matchDate = this._formatDate(new Date(match.match_date));
                if (dates.indexOf(matchDate) === -1) {
                    dates.push(matchDate);
                }
            });

            return { matches: matches, matchDates: dates };
        }))
        .then(() => {
            this.setState((oldState) => {
                let newMatches = [...oldState.matches];
                let newDates = [...oldState.matchDates];
                let selectedDate = null;

                const now = new Date();
                let maxDate = null;

                // sort
                newMatches.sort((a, b) => {
                    const aDate = new Date(a.match_date);
                    const bDate = new Date(b.match_date);

                    if (!selectedDate && aDate.getFullYear() === now.getFullYear() && aDate.getMonth() === now.getMonth() && aDate.getDate() === now.getDate()) {
                        selectedDate = aDate;
                    }
                    else if (!selectedDate && bDate.getFullYear() === now.getFullYear() && bDate.getMonth() === now.getMonth() && bDate.getDate() === now.getDate()) {
                        selectedDate = bDate;
                    }

                    if (a.match_date > b.match_date) {
                        maxDate = aDate;
                        return 1
                    }
                    else if (a.match_date < b.match_date) {
                        maxDate = bDate;
                        return -1
                    }
                });

                // sort dates separately for date picker
                newDates.sort((a, b) => {
                    const aDate = new Date(a);
                    const bDate = new Date(b);

                    if (aDate > bDate) {
                        return 1
                    }
                    else if (aDate < bDate) {
                        return -1
                    }
                    else {
                        return 0;
                    }
                });

                if (selectedDate) {
                    selectedDate = this._formatDate(selectedDate);
                }
                else if (now > maxDate) {
                    selectedDate = newDates[newDates.length - 1];
                }
                else {
                    selectedDate = newDates[0];
                }

                return { 
                    matches: newMatches,
                    matchDates: newDates,
                    selectedDate: selectedDate,
                    playerSelections: 0
                };
            })
        })
        .then(() => {
            this.requests.fetch(
                "QATARHEROLISTPREDICTIONSURL",
                "GET",
                null,
                {
                    "Content-Type": "application/json"
                },
                null,
                "same-origin"    
            )
            .then(response => response.json())
            .then(data => this.setState((_) => {
                let playerSelections = 0;

                data.predictions.forEach((prediction) => {
                    this.state.matches.forEach(match => {
                        if (match.id === prediction.match_id) {
                            playerSelections++;
                        }
                    })
                })

                return { playerSelections: playerSelections, allPredictions: data.predictions }
            }))
            .then(() => {
                this.requests.fetch("QATARHEROSCORESURL")
                .then(response => response.json())
                .then(data => this.setState({ scores: data.scores, loading: false }))
            })
        })
    }

    _handleViewClick(event) {
        const viewIndex = this.state.viewIndex + (event.target.id === "qatarhero-view-picker-right" ? 1 : -1);
        this.setState({ viewIndex: viewIndex });
    }

    _handleDateClick(event) {
        let dateIndex = this.state.matchDates.indexOf(this.state.selectedDate);

        switch(event.target.id) {
            case "date-picker-left": dateIndex--; break;
            case "date-picker-right": dateIndex++; break;
        };

        let playerSelections = 0;
        for (var i = 0; i < this.state.matches.length; i++) {
            if (this._formatDate(this.state.matches[i].match_date) == this.state.matchDates[dateIndex]) {
                this.state.allPredictions.forEach((prediction) => {
                    if (this.state.matches[i].id === prediction.match_id) {
                        playerSelections++;
                    }
                })
            }
        }

        this.setState({ selectedDate: this.state.matchDates[dateIndex], playerSelections: playerSelections });
    }

    componentDidMount() {
        this._getData();
    }

    componentDidUpdate(prevProps) {
        // If a login has been performed and the props playerId updated, update state
        if (this.props.playerId !== prevProps.playerId) {
            this.setState({ playerId: this.props.playerId, indexRow: null })
        }

        if (this.props.hasPermission !== prevProps.hasPermission) {
            this.setState({ hasPermission: this.props.hasPermission })
        }
    }

    renderMatches() {
        const today = new Date();

        const rows = this.state.matches.map((game, index) => {
            const gameDate = new Date(game.match_date);
            const formattedDate = this._formatDate(game.match_date);

            // Filter games by date
            if (formattedDate !== this.state.selectedDate) {
                return null;
            }
        
            // Lock 10 minutes before kickoff
            let lock = false;
            if(
                today.getFullYear() === gameDate.getFullYear() &&
                today.getMonth() === gameDate.getMonth() &&
                today.getDate() === gameDate.getDate() &&
                today.getHours() === gameDate.getHours() &&
                today.getMinutes() >= gameDate.getMinutes() - 10
            ) {
                lock = true;
            }
            else if(today > gameDate) {
                lock = true;
            }
            
            return (
                <div
                    key={index}
                    onMouseDown={
                        game.status === "POSTPONED" ? 
                            null 
                        : (event) => {
                            if (event.target.type != "submit") {
                                this.setState({ indexRow: (this.state.indexRow === index ? null : index) })
                            }
                        }
                    }
                >
                    <p className="game">
                        <span className={"gamesection hometeam" + (lock ? " gameday" : "")}>{game.home_team.label}</span>
                        <span className={"gamesection gamescores" + (lock ? " gameday" : "")}>
                            {
                                lock ? 
                                    <span className="matchscore">
                                        {game.status === "POSTPONED" ? "P" : game.home_score !== null ? game.home_score : '-'}
                                        <span className="matchscore-divider">:</span>
                                        {game.status === "POSTPONED" ? "P" : game.away_score !== null ? game.away_score : '-'}
                                    </span>
                                : 
                                game.status === "POSTPONED" ?
                                    "P : P"
                                :
                                <img src={this.state.indexRow === index ? "shrink-white.png" : "expand-white.png"} height='10' width='10' />}
                        </span>
                        <span className={"gamesection awayteam" + (lock ? " gameday" : "")}>{game.away_team.label}</span>
                        <span className="gamesection matchtime">{lock ? this._calculateExpired(game) : this._formatMatchTime(game.match_date)}</span>
                    </p>
                    {!lock && this.state.indexRow === index ? <GameDetail
                                                                playerId={this.state.playerId}
                                                                homeTeam={game.home_team.name}
                                                                awayTeam={game.away_team.name}
                                                                gameDate={game.match_date}
                                                                gameId={game.id}
                                                                onLoginSelect={() => {
                                                                    this.setState({
                                                                        indexRow: null
                                                                    })

                                                                    this.props.onLoginSelect()
                                                                }}
                                                                onSelection={(_) => {
                                                                    let selections = this.state.playerSelections;
                                                                    selections++;
                                                                    this.setState({ playerSelections: selections });
                                                                }}
                                                                disableStats={true}
                                                                qatarHero={true}
                                                                 />
                                                               : null}
                </div>
            )
        }) || [];

        let rowCount = rows.reduce((t, s) => { return t + (s ? 1 : 0) }, 0);

        return (
            <div className="qatarhero-matches">
                <div className="qatarhero-date-picker">
                    {
                        this.state.selectedDate ?
                        <div className="date-picker">
                            <div className="date-picker-part">{this.state.matchDates.indexOf(this.state.selectedDate) ? <div id="date-picker-left" onClick={this._handleDateClick}>{"<"}</div> : <div id="date-picker-left">{""}</div>}</div>
                            <div className="date-picker-part">{this.state.selectedDate}</div>
                            <div className="date-picker-part">{this.state.matchDates.indexOf(this.state.selectedDate) !== this.state.matchDates.length - 1 ? <div id="date-picker-right" onClick={this._handleDateClick}>{">"}</div> : <div id="date-picker-right">{""}</div>}</div>
                        </div>
                        : null
                    }
                </div>
                <div className={`games-player-selections${this.state.playerSelections >= rowCount ? "-complete" : ""}`}>
                    {this.state.playerSelections >= rowCount ? "Selections Complete" : "Missing Selections"}
                </div>
                <div className="qatarhero-matches-list">
                    {
                        rows.length === 0 ? null : rows
                    }
                    <div className="qatarhero-matches-whitespace">
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        )
    }

    renderTable() {
        return (
            <div className="qatarhero-table">
                <table>
                    <thead>
                        <th className="table-column-header">Player</th>
                        <th className="table-column-header">Score</th>
                        <th className="table-column-header">Bonus</th>
                        <th className="table-column-header">Total</th>
                    </thead>
                    <tbody>
                        {this.state.scores.map((score, i) => {
                            return (
                                <tr className={i % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                                    <td>{score.player}</td>
                                    <td>{score.score}</td>
                                    <td>{score.bonus}</td>
                                    <td>{score.total}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    render () {
        return (
            !this.state.loading && this.state.hasPermission ?
            (
                <div className="qatarhero-container">
                    <Error
                        error={this.state.error}
                        onAccept={_ => { this.setState({ error: null }) }}
                    />
                    <div className="qatarhero">
                        <div className="qatarhero-view-picker">
                            <div className="qatarhero-view-picker-part">
                                {
                                    this.state.viewIndex > 0
                                    ? <div id="qatarhero-view-picker-left" onClick={this._handleViewClick}>{"<"}</div> 
                                    : <div id="qatarhero-view-picker-left">{""}</div>
                                }
                            </div>
                            <div className={"qatarhero-view-picker-part"}>
                                { this.VIEWS[this.state.viewIndex][0].toUpperCase() + this.VIEWS[this.state.viewIndex].slice(1) }
                            </div>
                            <div className="qatarhero-view-picker-part">
                                {
                                    this.state.viewIndex < this.VIEWS.length - 1
                                    ? <div id="qatarhero-view-picker-right" onClick={this._handleViewClick}>{">"}</div>
                                    : <div id="qatarhero-view-picker-right">{""}</div>
                                }
                            </div>
                        </div>
                        { this.state.viewIndex === 0 ? this.renderMatches() : this.renderTable() }
                    </div>
                </div>
            )
            : null
        )
    }
}

export default QatarHero;
