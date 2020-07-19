import React, { Component } from 'react';

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

        //fetch("http:192.168.0.62:5000/matches")
        fetch("./list_matches.json")
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
        .catch(error => alert(error));
    }

    componentDidMount() {
        this.gamesInterval = setInterval(() => this.getMatches(), 10000)
    }

    render () {
        const rows = this.state.games.map((game, index) => {
            var gameState = null;
            [this.state.gameOne, this.state.gameTwo].forEach(element => {
                if ('id' in element && element.id === game) {
                    gameState = element;
                }
            });

            return (
                <tr key={index}>
                    <td>{gameState.home_team} ({gameState.home_score}) - {gameState.away_team} ({gameState.away_score})</td>
                </tr>
            )
        }) || [];

        return (
            <div>
                <table>
                    <tbody>{rows.length === 0 ? "No Games" : rows}</tbody>
                </table>
            </div>
        )
    }
}

export default Games;
