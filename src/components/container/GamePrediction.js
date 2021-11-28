import React, { Component } from 'react';

import * as Constants from "../constants.js";

import '../css/GamePrediction.css';

class GamePrediction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerId: props.playerId,
            loading: true,
            selection: null,
            submitted: false
        };

        this.handleSelectionClick = this.handleSelectionClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
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
        .then(data => this.setState({
            selection: data.prediction,
            submitted: data.prediction ? true : false,
            loading: false
        }))
        .catch(/* do nothing */)
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
            this.setState({
                selection: e.target.value,
                submitted: false
            });
        }
    }

    handleSubmitClick(_) {
        if (this.state.selection && !this.state.submitted) {
            fetch(Constants.ADDPREDICTIONURL, {
                method: "POST",
                credentials: "same-origin",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    game_id: this.props.gameId,
                    player_id: this.state.playerId,
                    prediction: this.state.selection
                })
            })
            .then(_ => this.setState({
                submitted: true
            }))
            .then(_ => {this.props.onPredictionSet(1)})
            .catch(/* do nothing */)
        }
    }

    render () {
        return (
            !this.state.loading && 
            (
                <div className="gameprediction-container">
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
                        <div className="gameprediction-submit">
                            <button className={"gameprediction-button gameprediction-button-submit"  + (this.state.submitted ? " active" : "")}
                                onClick={this.handleSubmitClick}>
                                    {this.state.submitted ? "SUBMITTED" : "SUBMIT"}
                            </button>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default GamePrediction;
