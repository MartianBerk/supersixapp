import React, { Component } from 'react';
import { Requests } from "../requests.js";
import Error from './Error.js';

import "../css/PlayerPrediction.css";

class PlayerPrediction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            selected: this.props.selected
        }
        this.requests = new Requests();

        this.handlePredictionClick = this.handlePredictionClick.bind(this);
    }

    handlePredictionClick(event) {
        event.stopPropagation();

        const prediction = event.target.value;

        this.requests.fetch(
            "ADDPREDICTIONADMINURL",
            "POST",
            null,
            {
                "Content-Type": "application/json"
            },
            {
                match_id: this.props.matchId,
                player_id: this.props.playerId,
                prediction: prediction
            },
            "same-origin"
        )
        .then(response => response.json())
        .then(d => {
            if (d.error) {
                this.setState({ error: d.message })
                return null;
            }

            this.props.onPredictionSet(prediction);
            this.setState({ selected: prediction });
        })
        .catch(e => {this.setState({ error: e })})
    }

    render() {
        return (
            <div className="player-prediction">
                <Error
                    error={this.state.error}
                    onAccept={_ => { this.setState({ error: null }) }}
                />
                <button className={"player-predictions-player-match-button" + (this.state.selected === "home" ? " active" : "")} value="home" onClick={this.handlePredictionClick}>Home</button>
                <button className={"player-predictions-player-match-button" + (this.state.selected === "draw" ? " active" : "")} value="draw" onClick={this.handlePredictionClick}>Draw</button>
                <button className={"player-predictions-player-match-button" + (this.state.selected === "away" ? " active" : "")} value="away" onClick={this.handlePredictionClick}>Away</button>
            </div>
        )
    }
}

export default PlayerPrediction;
