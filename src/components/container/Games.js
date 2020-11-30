import React, { Component } from 'react';

import '../css/Games.css';

class Games extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.meta.gameweeks[props.meta.gameweeks.length - 1],
            live: false,
            games: []
        };

        this.handleDateClick = this.handleDateClick.bind(this);
    }

    getMatches(date, purge) {
        date = new Date(date === undefined ? this.state.date : date);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        date = [year, month, day].join("");

        var live = false;

        // fetch("http://192.168.0.37:5000/supersix/game/livematches")
        fetch(`./matches-${date}.json`)
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

            match.home_team = match.home_team in this.props.meta.teams ? this.props.meta.teams[match.home_team] : match.home_team;
            match.away_team = match.away_team in this.props.meta.teams ? this.props.meta.teams[match.away_team] : match.away_team;

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

    componentDidMount() {
        this.getMatches();  // get data first
        this.gamesInterval = setInterval(() => this.getMatches(), 10000)
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
        const rows = this.state.games.map((game, index) => {
            // TODO: note - team names should be no more 14 chars in total for optimum experience. Look into nicknames of sorts
            return (
                <div key={index}>
                    <p className="game">
                        <span className="gamesection hometeam">{game.home_team}</span>
                        <span className="gamesection gamescores">
                            <span className="matchscore">
                                {game.home_score !== null ? game.home_score : '-'}
                                <span className="matchscore-divider">:</span>
                                {game.away_score !== null ? game.away_score : '-'}
                            </span>
                        </span>
                        <span className="gamesection awayteam">{game.away_team}</span>
                        <span className="gamesection matchtime">{this.calculateExpired(game)}</span>
                    </p>
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
                {rows.length === 0 ? "No Games" : rows}
            </div>
        )
    }
}

export default Games;
