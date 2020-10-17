import React, { Component } from 'react';

import Predictions from "./Predictions.js";

import '../css/Scores.css';

class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            indexRow: null
        };
    }

    getScores() {
        var existingPlayers = this.state.players;

        fetch("http://192.168.0.65:5000/supersix/game/livescores")
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
        .then(existingPlayers.sort((a, b) => {
            if(a.score < b.score)
                return 1;
            else if(a.score > b.score)
                return -1;
            else
                return 0
        }))
        .then(this.setState({ players: existingPlayers }))
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.getScores();  // get data first
        this.scoresInterval = setInterval(() => this.getScores(), 10000)
    }

    render () {
        const rows = this.state.players.map((player, index) => {
            return (
                <tr key={index}
                    onMouseOver={() => this.setState({ indexRow: index })}
                    onMouseOut={() => this.setState({ indexRow: null })}
                >
                    <td className="playername">{player.name}</td>
                    <td className="playerscore">{player.score}/{player.matches.length}</td>
                    <Predictions data={player.matches} reveal={this.state.indexRow === index} />
                </tr>
            )
        }) || [];

        return (
            <div className="scores">
                <table className="scorestable">
                    <tbody>{rows.length === 0 ? " No Scores" : rows}</tbody>
                </table>
            </div>
        )
    }
}

export default Scores;
