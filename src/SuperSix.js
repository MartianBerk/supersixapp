import React, { Component } from 'react';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            time: Date.now(),
            games: [
            { home_team: "Man Utd.", away_team : "Leicester",
              home_score: 0, away_score: 0},
            { home_team: "Bournemouth", away_team : "Liverpool",
              home_score: 0, away_score: 0 }
        ] };
    }

    componentDidMount() {
        var min = 0;
        var max = 5;
        this.date_interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        this.games_interval = setInterval(() => this.setState({ games: [
            { home_team: "Man Utd.", away_team : "Leicester",
              home_score: Math.floor(Math.random() * (+max - +min)) + +min, away_score: Math.floor(Math.random() * (+max - +min)) + +min },
            { home_team: "Bournemouth", away_team : "Liverpool",
              home_score: Math.floor(Math.random() * (+max - +min)) + +min, away_score: Math.floor(Math.random() * (+max - +min)) + +min }
        ] }), 20000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render () {
        var date = new Date(this.state.time);

        var year = date.getFullYear().toString();
        var month = date.getMonth().toString();
        var day = date.getDate().toString();

        var hours = date.getHours();
        var mins = "0" + date.getMinutes();
        var secs = "0" + date.getSeconds();

        const rows = this.state.games.map((game, index) => {
            return (
                <tr key={index}>
                    <td>{game.home_team} ({game.home_score}) - {game.away_team} ({game.away_score})</td>
                </tr>
            )
        }) ;

        return (
            <div>
                <div>
                    <h2>{ day.substr(-2) + "/" + month.substr(-2) + "/" + year.substr() }</h2>
                    <h3>{ hours + ":" + mins.substr(-2) + ":" + secs.substr(-2)}</h3>
                </div>
                <table>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        )
    }
}

export default SuperSix;
