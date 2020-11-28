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

        // fetch("https://db1662e12f5d.ngrok.io/supersix/game/livescores")
        // fetch("http://192.168.0.12:5000/supersix/game/livescores")
        fetch("./scores.json")
        .then(response => response.json())
        .then(data => data.scores.forEach((player) => {
            var found = false;
            
            player.name = player.name in this.props.meta.players ? this.props.meta.players[player.name] : player.name;

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
                <div 
                    key={index}
                    className={index % 2 === 0 ? "even" : "odd"}
                    onMouseDown={() => this.setState({ indexRow: (this.state.indexRow === index ? null : index) })}
                >
                    <p className="score">
                        <span className="scoresection playername">{player.name}</span>
                        <span className="scoresection playerscore">{player.score}/{player.matches.length}</span>
                        <img className="scoresection expand" src={this.state.indexRow ===  index ? 'shrink.png' : 'expand.png'} height='10' width='10' />
                    </p>
                    {this.state.indexRow === index ? <Predictions data={this.state.players[this.state.indexRow].matches} /> : null}
                </div>
            )
        }) || [];

        return (
            <div className="scorescontainer">
                <div className="scores">
                    {rows.length === 0 ? " No Scores" : rows}
                </div>
            </div>
        )
    }
}

export default Scores;
