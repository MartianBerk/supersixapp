import React, { Component, useState } from 'react';

import Predictions from "./Predictions.js";

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
        .catch(/* do nothing */);
    }

    componentDidMount() {
        this.scoresInterval = setInterval(() => this.getScores(), 10000)
    }

    render () {
        const rows = this.state.players.map((player, index) => {
            return (
                <tr key={index}
                    onMouseOver={() => this.setState({ indexRow: index })}
                    onMouseOut={() => this.setState({ indexRow: null })}
                >
                    <td>{player.name}</td>
                    <td>{player.score}/{player.matches.length}</td>
                    <Predictions data={player.matches} reveal={this.state.indexRow === index} />
                </tr>
            )
        });

        return (
            <div>
                <table>
                <tbody>{rows.length === 0 ? " No Scores" : rows}</tbody>
                </table>
            </div>
        )
    }
}

export default Scores;
