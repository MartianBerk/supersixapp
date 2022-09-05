import React, { Component } from 'react';

import GameDetail from './GameDetail.js';
import { Requests } from "../requests.js";

import "../css/GameSelector.css";

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
            selections: [null, null, null, null, null, null],
            selectedDate: null,
            matchRow: null
        }

        this.leagueOrder = [7, 6, 5, 4];  // PL, ELC, EL1, EL2

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    loadData() {
        const requests = new Requests();

        requests.fetch("LISTLEAGUESURL")
        .then(response => response.json())
        .then(data => this.setState({ leagues: data.leagues.reduce((leagues, league) => {
            leagues[league.id] = league.name
            return leagues
        }, {})}))
        .then(_ => {
            requests.fetch("LISTMATCHESURL")
            .then(response => response.json())
            .then(data => this.setState((_) => {
                let matches = [];
                let matchLookup = {};
                let selections = [null, null, null, null, null, null];
                let dates = [];

                data.matches.forEach(match => {
                    matches.push(match)
                    matchLookup[match.id] = match;

                    var matchDate = this.formatDate(new Date(match.match_date));
                    if (dates.indexOf(matchDate) === -1) {
                        dates.push(matchDate);
                    }

                    if (match.use_match) {
                        selections.splice(match.game_number - 1, 1, match.id)
                    }
                });
            
                return { matches: matches, matchLookup: matchLookup, selections: selections, dates: dates };
            }))
            .then(() => {
                this.setState((oldState) => {
                    let newMatches = [...oldState.matches];
                    let newDates = [...oldState.dates];

                    // sort (date then league (we get time for free from dat sort))
                    newMatches.sort((a, b) => {
                        const aLeague = this.leagueOrder.indexOf(a.league_id);
                        const bLeague = this.leagueOrder.indexOf(b.league_id);

                        if (a.match_date > b.match_date) {
                            return 1
                        }
                        else if (a.match_date < b.match_date) {
                            return -1
                        }
                        else {
                            if (aLeague > bLeague) {
                                return 1
                            }
                            else if (aLeague < bLeague) {
                                return -1
                            }
                        }
                    });

                    // sort dates separately for date picker
                    newDates.sort((a, b) => {
                        const aDate = new Date(a.match_date);
                        const bDate = new Date(b.match_date);

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

    formatDate(matchDate) {
        let date = new Date(matchDate);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const month = date.getMonth();
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const weekday = weekdays[date.getDay()];

        return weekday + " " + day + " " + months[month];
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

    renderMatchSelector() {
        if (this.state.matches.length === 0) {
            return null;
        }
        
        let leagueMarker = 0;
        let timeMarker = 0;

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
                                <span className="matchselector-timebreak">
                                    {
                                        matchTime !== tMark ?
                                        <h4>{matchTime}</h4> :
                                        null
                                    }
                                </span>
                                <span className="matchselector-leaguebreak">
                                    {
                                        match.league_id !== lMark || matchTime !== tMark ?
                                        <h5>{this.state.leagues[match.league_id]}</h5> :
                                        null
                                    }
                                </span>
                                <div className="matchselector-submit-match">
                                    <div
                                        className={"matchselector-submit-match-section" + (this.state.selections.indexOf(match.id) > -1 ? " selected" : "")}
                                        onMouseDown={(e) => { 
                                            if(e.target.type !== "submit" && match.status !== "POSTPONED") {
                                                this.setState({ matchRow: match.id === this.state.matchRow ? null : match.id });
                                            }
                                        }}
                                    >
                                        <span className="gameselection hometeam">{match.home_team}</span>
                                        <span className="gameselection gameexpander">
                                        {
                                            match.status === "POSTPONED" ?
                                            "P : P" :
                                            <img src={this.state.matchRow === match.id ? "shrink-white.png" : "expand-white.png"} height='10' width='10' />
                                        }
                                        </span>
                                        <span className="gameselection awayteam">{match.away_team}</span>
                                    </div>
                                    {
                                        this.state.matchRow === match.id ?
                                        <GameDetail
                                            playerId={this.props.playerId}
                                            adminMode={true}
                                            homeTeam={match.home_team}
                                            awayTeam={match.away_team}
                                            gameDate={match.match_date}
                                            gameId={match.id}
                                            onSelection={(drop) => {
                                                this.setState(() => {
                                                    let newSelections = [...this.state.selections];

                                                    if (drop) {
                                                        newSelections.splice(newSelections.indexOf(match.id), 1, null);
                                                    }
                                                    else {
                                                        newSelections.splice(newSelections.indexOf(null), 1, match.id);
                                                    }

                                                    return {selections: newSelections}
                                                });
                                            }}
                                            selectionNumber={
                                                this.state.selections.indexOf(match.id) > -1 ? 
                                                this.state.selections.indexOf(match.id) + 1 : 
                                                this.state.selections.indexOf(null) + 1

                                            }
                                        /> :
                                        null
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    render() {
        const selections = this.state.selections.filter(s => s !== null).length;

        return (
            <div className="games">
                <div className="matchselector-load">
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
                <div className={`gameselector-selections${selections == 6 ? "-complete" : ""}`}>
                    {selections} / 6 Selections
                </div>
                <br />
                {[
                    this.renderMatchSelector()
                ]}
            </div>
        )
    }
}

export default GameSelector;
