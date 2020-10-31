import React, { Component } from 'react';

import '../css/Games.css';

class Games extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            gameOne: {},
            gameTwo: {},
            gameThree: {},
            gameFour: {},
            gameFive: {},
            gameSix: {}
        };
    }

    getMatches() {
        // TODO: include ID in web API response
        var games = [];

        // fetch("http://192.168.0.12:5000/supersix/game/livematches")
        // fetch("https://db1662e12f5d.ngrok.io/supersix/game/livematches")
        fetch("./matches.json")
        .then(response => response.json())
        .then(data => data.matches.forEach((match, i) => {
            games.push(match.id);

            switch(i) {
                case 0: this.setState({ gameOne: match }); break;
                case 1: this.setState({ gameTwo: match }); break;
                case 2: this.setState({ gameThree: match }); break;
                case 3: this.setState({ gameFour: match }); break;
                case 4: this.setState({ gameFive: match }); break;
                case 5: this.setState({ gameSix: match }); break;
            };
        }))
        .then(this.state.games.length === 0 ? this.setState({ games: games }) : null )
        .catch(/* do nothing */);
    }

    formatMatchDate(matchDate) {
        let d = new Date(matchDate);

        let hours = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();

        return `${hours}:${minutes}`;
    }

    calculateExpired(match) {
        let time = null;

        if (match.status === 'FINISHED') {
            time = 'FT';
        }
        else if (!match.match_minute) {
            time = 'K/O ' + this.formatMatchDate(match.match_date);
        }
        else {
            time = match.match_minute + '\'';
        }

        return time;
    }

    componentDidMount() {
        this.getMatches();  // get data first
        this.gamesInterval = setInterval(() => this.getMatches(), 10000)
    }

    render () {
        const rows = this.state.games.map((game, index) => {
            var gameState = null;
            [
                this.state.gameOne,
                this.state.gameTwo,
                this.state.gameThree,
                this.state.gameFour,
                this.state.gameFive,
                this.state.gameSix
            ].forEach(element => {
                if ('id' in element && element.id === game) {
                    gameState = element;
                }
            });

            if (gameState) {
                return (
                    <tr key={index}>
                        <td>{gameState.home_team}</td>
                        <td className="matchscore">{gameState.home_score !== null ? gameState.home_score : '-'}</td>
                        <td className="matchscore">{gameState.away_score !== null ? gameState.away_score : '-'}</td>
                        <td>{gameState.away_team}</td>
                        <td className="matchtime">{this.calculateExpired(gameState)}</td>
                    </tr>
                )
            }
        }) || [];

        return (
            <div className="games">
                <table className="gamestable">
                    <tbody>{rows.length === 0 ? "No Games" : rows}</tbody>
                </table>
            </div>
        )
    }
}

export default Games;
