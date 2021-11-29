import React, { Component } from 'react';

import * as Constants from "../constants.js";
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
    }

    fetchPredictionData() {
        if (!this.state.playerId || !this.props.gameId) {
            this.setState({ loading: false });
            return null;
        }

        fetch(`${Constants.GETPREDICTIONURL}?gameId=${this.props.gameId}&playerId=${this.state.playerId}`, {
            credentials: "same-origin",
        })
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
            fetch(Constants.ADDPREDICTIONURL, {
                method: "POST",
                credentials: "same-origin",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    game_id: this.props.gameId,
                    player_id: this.state.playerId,
                    prediction: e.target.value
                })
            })
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message })
                    return null;
                }

                this.setState({ selection: e.target.value })
                this.props.onPredictionSet(1)
            })
            .catch(e => this.setState({ error: e }))
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
