import React, { Component } from 'react';

import { Requests } from "../requests.js";
import Error from './Error.js';

import '../css/GamePrediction.css';

class GamePrediction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerId: props.playerId,
            loading: true,
            selection: null,
            error: null
        };

        this.handleSelectionClick = this.handleSelectionClick.bind(this);

        this.requests = new Requests();
    }

    fetchPredictionData() {
        if (!this.state.playerId || !this.props.gameId) {
            this.setState({ loading: false });
            return null;
        }

        this.requests.fetch(
            this.props.qatarHero ? "QATARHEROGETPREDICTIONURL" : "GETPREDICTIONURL",
            "GET",
            {
                gameId: this.props.gameId,
                playerId: this.state.playerId
            },
            {
                "Content-Type": "application/json"
            },
            null,
            "same-origin"
        )
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({ error: data.message, loading: false })
                return null;
            }

            this.setState({
                selection: data.prediction,
                loading: false
            })
        })
        .catch(e => this.setState({ error: "Something went wrong, please try again later." }))
    }

    componentDidMount() {
        this.fetchPredictionData();
    }

    componentDidUpdate(prevProps) {
        // If a login has been performed and the props playerId updated, update state
        if (this.props.playerId !== prevProps.playerId) {
            this.setState({ playerId: this.props.playerId })
            this.fetchPredictionData();
        }
    }

    handleSelectionClick(e) {
        if (e.target.value !== this.state.selection) {
            this.requests.fetch(
                this.props.qatarHero ? "QATARHEROADDPREDICTIONURL" : "ADDPREDICTIONURL", 
                "POST",
                null,
                {
                    "Content-Type": "application/json"
                },
                {
                    game_id: this.props.gameId,
                    player_id: this.state.playerId,
                    prediction: e.target.value
                },
                "same-origin"
            )
            .then(response => response.json())
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message })
                    return null;
                }

                this.setState({ selection: d.prediction })
                this.props.onPredictionSet(d.prediction);
            })
            .catch(e => {this.setState({ error: e })})
        }
    }

    render () {
        return (
            !this.state.loading && 
            (
                <div className="gameprediction-container">
                    <Error
                        error={this.state.error}
                        onAccept={_ => { this.setState({ error: null }) }}
                    />
                    <div className="gameprediction-selection">
                        <div className="gameprediction-selections">
                            <button
                                className={"gameprediction-button gameprediction-button-selection" + (this.state.selection === "home" ? " active" : "")}
                                onClick={this.handleSelectionClick} value="home">
                                    HOME
                            </button>
                            <button className={"gameprediction-button gameprediction-button-selection" + (this.state.selection === "draw" ? " active" : "")}
                                onClick={this.handleSelectionClick} value="draw">
                                    DRAW
                            </button>
                            <button className={"gameprediction-button gameprediction-button-selection" + (this.state.selection === "away" ? " active" : "")}
                                onClick={this.handleSelectionClick} value="away">
                                    AWAY
                            </button>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default GamePrediction;
