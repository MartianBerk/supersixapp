import React, { Component } from 'react';

class Predictions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    getPredictions() {
        var existingPlayers = this.state.players;

        //fetch("http:192.168.0.62:5000/live_scores")
        fetch("./live_scores.json")
        .then(response => response.json())
        .then(data => data.scores.forEach((player) => {
            var found = false;

            existingPlayers.forEach((existingPlayer, i) => {
                if(existingPlayer.name === player.name) {
                    found = true;
                    existingPlayers[i] = player;
                }
            });

            if(!found) {
                existingPlayers.push(player);
            }
        }))
        .then(this.setState({ players: existingPlayers }))
        .catch(error => alert(error));
    }

    componentDidMount() {
        this.predictionsInterval = setInterval(() => this.getPredictions(), 10000)
    }

    render () {
        const rows = this.state.players.map((player, index) => {
            return (
                <tr key={index}>
                    <td>{player.name}</td>
                    <td>{player.score}/{player.matches.length}</td>
                </tr>
            )
        });

        return (
            <div>
                <table>
                <tbody>{rows.length === 0 ? " No Predictions" : rows}</tbody>
                </table>
            </div>
        )
    }
}

export default Predictions;
