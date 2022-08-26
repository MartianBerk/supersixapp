import React, { Component } from 'react';

import GameDetail from './GameDetail.js';
import { Requests } from "../requests.js";

import "../css/Games.css";

class GameSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: props.meta,
            date: null,
            leagues: {},
            matches: [],
            dates: [],
            matchLookup: {},
            selected: [],
            selectedDate: null,
            matchRow: null
        }

        this.leagueOrder = [7, 6, 5, 4];  // PL, ELC, EL1, EL2

        this.requests = new Requests();

        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleMatchAdd = this.handleMatchAdd.bind(this);
        this.handleMatchDrop = this.handleMatchDrop.bind(this);
        this.handleMatchesSubmit = this.handleMatchesSubmit.bind(this);
    }

    loadData() {
        this.requests.fetch("LISTLEAGUESURL")
        .then(response => response.json())
        .then(data => this.setState({ leagues: data.leagues.reduce((leagues, league) => {
            leagues[league.id] = league.name
            return leagues
        }, {})}))
        .then(_ => {
            this.requests.fetch("LISTMATCHESURL")
            .then(response => response.json())
            .then(data => this.setState((_) => {
                let matches = [];
                let matchLookup = {};
                let selected = [];
                let dates = [];

                data.matches.forEach(match => {
                    matches.push(match)
                    matchLookup[match.id] = match;

                    var matchDate = this.formatDate(new Date(match.match_date));
                    if (dates.indexOf(matchDate) === -1) {
                        dates.push(matchDate);
                    }

                    if (match.use_match) {
                        selected.push(match);
                    }
                });
            
                return { matches: matches, matchLookup: matchLookup, selected: selected, dates: dates };
            }))
            .then(() => {
                this.setState((oldState) => {
                    let newMatches = [...oldState.matches];
                    let newDates = [...oldState.dates];

                    // sort (date then league then time)
                    newMatches.sort((a, b) => {
                        const aLeague = this.leagueOrder.indexOf(a.league_id);
                        const bLeague = this.leagueOrder.indexOf(b.league_id);
                        const aDate = this.formatDate(new Date(a.match_date));
                        const bDate = this.formatDate(new Date(b.match_date));

                        if (aDate > bDate) {
                            return 1
                        }
                        else if (aDate < bDate) {
                            return -1
                        }
                        else {
                            if (aLeague > bLeague) {
                                return 1
                            }
                            else if (aLeague < bLeague) {
                                return -1
                            }
                            else {
                                if (a.match_date > b.match_date) {
                                    return 1
                                }
                                else if (a.match_date < b.match_date) {
                                    return -1
                                }
                                else {
                                    return 0
                                }
                            }
                        }
                    });

                    // sort dates separately for date picker
                    newDates.sort((a, b) => {
                        if (a.match_date > b.match_date) {
                            return 1
                        }
                        else if (a.match_date < b.match_date) {
                            return -1
                        }
                        else {
                            return 0;
                        }
                    });

                    return { matches: newMatches, dates: newDates, selectedDate: newDates[0] };
                })
            })
            .catch(/* do nothing */);
        })
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.loadData();
    }

    formatDate(date) {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    formatMatchTime(matchDate) {
        let d = new Date(matchDate);

        let hours = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();

        return `${hours}:${minutes}`;
    }

    handleDateClick(event) {
        let dateIndex = this.state.dates.indexOf(this.state.selectedDate);

        switch(event.target.id) {
            case "date-picker-left": dateIndex--; break;
            case "date-picker-right": dateIndex++; break;
        };

        this.setState({ selectedDate: this.state.dates[dateIndex] });
    }

    handleMatchesSubmit(_) {
        if (this.state.selected.length !== 6) {
            alert("Must select six matches");  // TODO: render into error component
            return false;
        }

        const matchDate = this.formatDate(this.state.date);
        const selected = this.state.selected.map(match => {
            return { id: match.id, game_number: match.game_number };
        })

        // TODO: highlight button when submitted (check selected for fresh loads)
        this.requests.fetch(
            "ADDMATCHESURL",
            "POST",
            {
                matchDate: matchDate
            },
            {
                "Content-Type": "application/json"
            },
            selected
        )
        .then(response => response.json())
        .catch(/* do nothing */);
    }

    handleMatchAdd(e) {
        let id = e.target.id.split("-");

        if (id.length == 2) {
            if (this.state.selected.length == 6) {
                alert("Already selected six games.")  // TODO: error component for better rendering.
                return null;
            }

            id = parseInt(id[1]);
            const gameNumbers = [1, 2, 3, 4, 5, 6];
            let selected = [...this.state.selected];

            let inserted = false;
            for (let i = 0; i < selected.length; i++) {
                if (selected[i].game_number !== gameNumbers[i]) {
                    let match = this.state.matchLookup[id];
                    match.game_number = gameNumbers[i];
                    selected.splice(i, 0, this.state.matchLookup[id]);
                    inserted = true;
                    break;
                }
            } 
            
            if (!inserted) {
                let match = this.state.matchLookup[id];
                match.game_number = selected.length + 1;
                selected.push(match);
            }

            this.setState({ selected: selected });
        }
    }

    handleMatchDrop(e) {
        let id = e.target.id.split("-");

        if (id.length == 2) {
            id = parseInt(id[1]);

            this.setState((oldState) => {
                let selected = [...oldState.selected];
                
                let removeIndex = null;
                for (let i = 0; i < selected.length; i++) {
                    if (selected[i].id === id) {
                        removeIndex = i;
                        break
                    }
                }

                if (removeIndex !== null) {
                    selected.splice(removeIndex, 1);
                    return { selected: selected };
                }
            })
        }
    }

    renderMatchSelector() {
        if (this.state.matches.length === 0) {
            return null;
        }
        
        let leagueMarker = 0;
        let timeMarker = 0;
        const selected = this.state.selected.map(s => { return s.id });

        return (
            <div className="matchselector">
                <div className="matchselector-submit">
                    {this.state.matches.map(match => {
                        if (this.formatDate(new Date(match.match_date)) !== this.state.selectedDate) {
                            return null;
                        }

                        const matchTime = this.formatMatchTime(match.match_date);
                        let lMark = leagueMarker;
                        let tMark = timeMarker;
                        leagueMarker = match.league_id;
                        timeMarker = matchTime;

                        return (
                            <div>
                                {
                                    match.league_id !== lMark ?
                                    <h4>{this.state.leagues[match.league_id]}</h4> :
                                    null
                                }
                                {
                                    matchTime !== tMark ?
                                    <h5>{matchTime}</h5> :
                                    null
                                }
                                <div className="matchselector-submit-match">
                                    <div
                                        className="matchselector-submit-match-section"
                                        onMouseDown={(e) => { 
                                            if(e.target.type !== "submit" && match.status !== "POSTPONED") {
                                                this.setState({ matchRow: match.id === this.state.matchRow ? null : match.id });
                                            }
                                        }}
                                    >
                                        {
                                            match.home_team + " Vs " + match.away_team + " - " + " (" + match.status + ")"
                                        }
                                    </div>
                                    {
                                        this.state.matchRow === match.id ?
                                        <GameDetail
                                            playerId={this.props.playerId}
                                            homeTeam={match.home_team}
                                            awayTeam={match.away_team}
                                            gameDate={match.match_date}
                                            gameId={match.id}
                                            // onPredictionSet={(selection) => {
                                            //     let newSelections = [...this.state.playerSelections];
                                            //     newSelections[this.state.indexRow] = selection;

                                            //     this.setState({ playerSelections: newSelections });
                                            // }}
                                        /> :
                                        null
                                    }
                                    {/* <div className="matchselector-submit-match-section">
                                        <button
                                            id={`matchselector-${match.id}`}
                                            className="matchselector-button"
                                            onClick={selected.indexOf(match.id) > -1 ? this.handleMatchDrop : this.handleMatchAdd}>
                                                {selected.indexOf(match.id) > -1 ? "Drop" : "Add"} Match
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    renderMatchSubmission() {
        if (this.state.matches.length === 0) {
            return null;
        }

        const gameNumbers = [1, 2, 3, 4, 5, 6];

        return (
            <div className="matchsubmission">
                <h4>Selected Matches {this.state.date ? "for " + this.formatDate(this.state.date) : null}</h4>
                {gameNumbers.map((g, i) => {
                    return (
                        <div className="matchsubmission-match">
                            <div className="matchsubmission-match-section matchsubmission-match-id">
                                {g}
                            </div>
                            <div className="matchsubmission-match-section">
                                {this.state.selected.length >= g ? (this.state.selected[i].home_team + " Vs " + this.state.selected[i].away_team) : null}
                            </div>
                        </div>
                    )
                })}
                <br />
                {this.state.date ? <button className="matchsubmission-button" onClick={this.handleMatchesSubmit}>Submit</button> : null}
            </div>
        )
    }

    render() {
        return (
            <div className="games">
                <h2>Matches</h2>
                <div className="matchselector-load">
                    <h4>Match Date</h4>
                    {
                        this.state.selectedDate ?
                        <div className="date-picker">
                            <div className="date-picker-part">{this.state.dates.indexOf(this.state.selectedDate) ? <div id="date-picker-left" onClick={this.handleDateClick}>{"<"}</div> : <div id="date-picker-left">{""}</div>}</div>
                            <div className="date-picker-part">{this.state.selectedDate}</div>
                            <div className="date-picker-part">{this.state.dates.indexOf(this.state.selectedDate) !== this.state.dates.length - 1 ? <div id="date-picker-right" onClick={this.handleDateClick}>{">"}</div> : <div id="date-picker-right">{""}</div>}</div>
                        </div>
                        : null
                    }
                </div>
                {[
                    this.renderMatchSelector(),
                    this.renderMatchSubmission()
                ]}
            </div>
        )
    }
}

export default GameSelector;
