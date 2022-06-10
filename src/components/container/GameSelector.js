import React, { Component } from 'react';

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
            matchLookup: {},
            selected: []
        }

        this.leagueOrder = [7, 6, 5, 4];  // PL, ELC, EL1, EL2

        this.requests = new Requests();

        this.handleMatchAdd = this.handleMatchAdd.bind(this);
        this.handleMatchDrop = this.handleMatchDrop.bind(this);
        this.handleMatchesLoad = this.handleMatchesLoad.bind(this);
        this.handleMatchesSubmit = this.handleMatchesSubmit.bind(this);
    }

    loadLeagues() {
        this.requests.fetch("LISTLEAGUESURL")
        .then(response => response.json())
        .then(data => this.setState({ leagues: data.leagues.reduce((leagues, league) => {
            leagues[league.id] = league.name
            return leagues
        }, {})}))
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.loadLeagues();
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

    handleMatchesLoad(_) {
        this.setState({ matches: [], selected: [] });

        let matchDate = document.getElementById("matchselector-date").value;

        if (matchDate) {
            matchDate = new Date(matchDate);
            this.setState({ date: matchDate });

            this.requests.fetch(
                "LISTMATCHESURL",
                null,
                {
                    matchDate: this.formatDate(matchDate)
                }
            )
            .then(response => response.json())
            .then(data => this.setState((_) => {
                let matches = [];
                let matchLookup = {};
                let selected = [];

                data.matches.forEach(match => {
                    matches.push(match)
                    matchLookup[match.id] = match;

                    if (match.use_match) {
                        selected.push(match);
                    }
                });
            
                return { matches: matches, matchLookup: matchLookup, selected: selected };
            }))
            .then(() => {
                // sort

                this.setState((oldState) => {
                    let newMatches = [...oldState.matches];

                    newMatches.sort((a, b) => {
                        const aLeague = this.leagueOrder.indexOf(a.league_id);
                        const bLeague = this.leagueOrder.indexOf(b.league_id);

                        if (aLeague > bLeague) {
                            return 1
                        }
                        else if (aLeague < bLeague) {
                            return -1
                        }
                        else {
                            if (a.match_date < b.match_date) {
                                return -1
                            }
                            else if (a.match_date > b.match_date) {
                                return 1
                            }
                            else {
                                return 0
                            }
                        }
                    });
                    
                    return { matches: newMatches };
                })
            })
            .catch(e => alert(e));
        }
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

        // TODO: refresh once submitted
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
        
        let leagueMarker = 0
        const selected = this.state.selected.map(s => { return s.id });

        return (
            <div className="matchselector">
                <div className="matchselector-submit">
                    {this.state.matches.map(match => {
                        const row = match.home_team + " Vs " + match.away_team + " - " + this.formatMatchTime(match.match_date) + " (" + match.status + ")";

                        if (match.league_id !== leagueMarker) {
                            leagueMarker = match.league_id;
                            return (
                                <div>
                                    <h4>{this.state.leagues[match.league_id]}</h4>
                                    <div className="matchselector-submit-match">
                                        <div className="matchselector-submit-match-section">{row}</div>
                                        <div className="matchselector-submit-match-section">
                                            <button
                                                id={`matchselector-${match.id}`}
                                                className="matchselector-button"
                                                onClick={selected.indexOf(match.id) > -1 ? this.handleMatchDrop : this.handleMatchAdd}>
                                                    {selected.indexOf(match.id) > -1 ? "Drop" : "Add"} Match
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            leagueMarker = match.league_id;
                            return (
                                <div className="matchselector-submit-match">
                                    <div className="matchselector-submit-match-section">{row}</div>
                                    <div className="matchselector-submit-match-section">
                                        <button
                                            id={`matchselector-${match.id}`}
                                            className="matchselector-button"
                                            onClick={selected.indexOf(match.id) > -1 ? this.handleMatchDrop : this.handleMatchAdd}>
                                                {selected.indexOf(match.id) > -1 ? "Drop" : "Add"} Match
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        )
    }

    // TODO: Add/Drop doesn't work properly - investigate.
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
            <div className="matchselector-container">
                <h2>Matches</h2>
                <div className="matchselector-load">
                    <h4>Match Date</h4>
                    <input className="matchselector-load" type="date" id="matchselector-date" />
                    <button className="matchselector-button" id="matchselector-load" onClick={this.handleMatchesLoad}> 
                        Load Matches
                    </button>
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
