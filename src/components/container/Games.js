import React, { Component } from 'react';

import * as Constants from "../constants.js";
import GameDetail from './GameDetail.js';

import '../css/Games.css';

class Games extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerId: props.playerId,
            playerSelections: props.playerSelections,
            selectionsShared: props.selectionsShared,
            date: props.meta.gameweeks[props.meta.gameweeks.length - 1],
            live: false,
            games: [],
            indexRow: null
        };

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    getMatches(date, purge) {
        date = new Date(date === undefined ? this.state.date : date);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        date = [day, month, year].join("-");

        var live = false;

        fetch(`${Constants.MATCHESURL}?matchDate=${date}`)
        .then(response => response.json())
        .then(data => {
            if (purge !== undefined) {
                this.setState(oldState => {
                    let newGames = [...oldState.games];

                    while (newGames.length > 0) {
                        newGames.pop()
                    }

                    return { games: newGames }
                });
            }

            return data
        })
        .then(data => data.matches.forEach(match => {
            if (!live) {
                live = match.status === "IN PLAY"
            }

            match.home_team = {
                label: match.home_team in this.props.meta.teams ? this.props.meta.teams[match.home_team] : match.home_team,
                name: match.home_team
            };
            match.away_team = {
                label: match.away_team in this.props.meta.teams ? this.props.meta.teams[match.away_team] : match.away_team,
                name: match.away_team
            };

            this.setState((oldState) => {
                let newGames = [...oldState.games];

                let found = false;
                for (let i = 0; i < newGames.length; i++) {
                    if (match.id === newGames[i].id) {
                        newGames[i] = match;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    newGames.push(match);
                }

                return { games: newGames };
            });
        }))
        .then(() => { this.setState({ live: live }) })
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

    calculateExpired(match) {
        let time = '-';

        if (match.status === 'FINISHED') {
            time = 'FT';
        }
        else if (match.match_minute) {
            time = match.match_minute + '\'';
        }

        return time;
    }

    initiateLiveMode() {
        const date = new Date(this.state.date);
        const now = new Date();

        let cutoff = new Date(date.getTime());
        cutoff.setHours(cutoff.getHours() + 2);  // set cutoff 2 hours later

        if (!this.gamesInterval && now >= date && now <= cutoff) {
            this.getMatches();
            this.gamesInterval = setInterval(() => this.getMatches(), 10000);  // 10 sec refresh
        }
        else if (!(now >= date && now <= cutoff)) {
            this.gamesInterval = null;
        }
    }

    componentDidMount() {
        this.initiateLiveMode();
        this.getMatches();  // get data first
        this.gamesInterval = null;
        this.initiateLiveModeInterval = setInterval(() => this.initiateLiveMode(), 10000);  // 10 sec refresh
    }

    componentDidUpdate(prevProps) {
        // If a login has been performed and the props playerId updated, update state
        if (this.props.playerId !== prevProps.playerId) {
            this.setState({ playerId: this.props.playerId, indexRow: null })
        }
        
        if (this.props.playerSelections !== prevProps.playerSelections) {
            this.setState({ playerSelections: this.props.playerSelections })
        }

        if (this.props.selectionsShared !== prevProps.selectionsShared) {
            this.setState({ selectionsShared: this.props.selectionsShared })
        }
    }

    handleDateClick(event) {
        let dateIndex = this.props.meta.gameweeks.indexOf(this.state.date);

        switch(event.target.id) {
            case "date-picker-left": dateIndex--; break;
            case "date-picker-right": dateIndex++; break;
        };

        this.setState({ date: this.props.meta.gameweeks[dateIndex] });
        this.getMatches(this.props.meta.gameweeks[dateIndex], true);
    }

    render () {
        const today = new Date();
        const gameDate = new Date(this.state.date);
        
        // Lock 1 hour before kickoff
        let lock = false;
        if(
            today.getFullYear() === gameDate.getFullYear() &&
            today.getMonth() === gameDate.getMonth() &&
            today.getDate() === gameDate.getDate() &&
            today.getHours() >= gameDate.getHours() - 1
        ) {
            lock = true;
        }
        else if(today > gameDate) {
            lock = true;
        }

        const rows = this.state.games.map((game, index) => {
            // TODO: note - team names should be no more 14 chars in total for optimum experience. Look into nicknames of sorts
            return (
                <div
                    key={index}
                    onMouseDown={(event) => {if (event.target.type != "submit") { this.setState({ indexRow: (this.state.indexRow === index ? null : index) }) }}}
                >
                    <p className="game">
                        <span className={"gamesection hometeam" + (lock ? " gameday" : "")}>{game.home_team.label}</span>
                        <span className={"gamesection gamescores" + (lock ? " gameday" : "")}>
                            {lock ? <span className="matchscore">
                                        {game.home_score !== null ? game.home_score : '-'}
                                        <span className="matchscore-divider">:</span>
                                        {game.away_score !== null ? game.away_score : '-'}
                                    </span>
                                    : <img src={this.state.indexRow === index ? "shrink-white.png" : "expand-white.png"} height='10' width='10' />}
                        </span>
                        <span className={"gamesection awayteam" + (lock ? " gameday" : "")}>{game.away_team.label}</span>
                        {lock ? <span className="gamesection matchtime">{this.calculateExpired(game)}</span> : null}
                    </p>
                    {!lock && this.state.indexRow === index ? <GameDetail
                                                                    playerId={this.state.playerId}
                                                                    homeTeam={game.home_team.name}
                                                                    awayTeam={game.away_team.name}
                                                                    gameDate={game.match_date}
                                                                    gameId={game.id} 
                                                                    onPredictionSet={(n) => {
                                                                        if (this.state.playerSelections < 6) {
                                                                            this.setState({playerSelections: this.state.playerSelections + n})}
                                                                        }
                                                                    }
                                                                    onLoginSelect={() => {
                                                                        this.setState({
                                                                            indexRow: null
                                                                        })

                                                                        this.props.onLoginSelect()
                                                                    }}
                                                                 />
                                                               : null}
                </div>
            )
        }) || [];

        return (
            <div className="games">
                <div className="date-picker">
                    <div className="date-picker-part">{this.props.meta.gameweeks.indexOf(this.state.date) ? <div id="date-picker-left" onClick={this.handleDateClick}>{"<"}</div> : <div id="date-picker-left">{""}</div>}</div>
                    <div className={this.state.live ? "date-picker-part live" : "date-picker-part"}>{ this.formatMatchDate(this.state.date) }</div>
                    <div className="date-picker-part">{this.props.meta.gameweeks.indexOf(this.state.date) !== this.props.meta.gameweeks.length - 1 ? <div id="date-picker-right" onClick={this.handleDateClick}>{">"}</div> : <div id="date-picker-right">{""}</div>}</div>
                </div>
                {
                    !lock && this.state.playerId && this.state.date == this.props.meta.gameweeks[this.props.meta.gameweeks.length - 1] ?
                    <div className={`games-player-selections${this.state.playerSelections === 6 ? "-complete" : ""}`}>
                        {this.state.playerSelections} / 6 Selections
                        {this.state.selectionsShared ? <span> (Possible Split Pot)</span> : null}
                    </div>
                    : null
                }
                {rows.length === 0 ? null : rows}
            </div>
        )
    }
}

export default Games;
