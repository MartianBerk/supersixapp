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
            error: null,
            extraTime: null,
            penalties: null,
            lockPrediction: false
        };

        this.handleSelectionClick = this.handleSelectionClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);

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
                extraTime: data.extra_time,
                penalties: data.penalties,
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
                    prediction: e.target.value,
                    extra_time: false,
                    penalties: false
                },
                "same-origin"
            )
            .then(response => response.json())
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message })
                    return null;
                }

                this.setState({ selection: d.prediction, extraTime: false, penalties: false })
                this.props.onPredictionSet(d.prediction);
            })
            .catch(e => {this.setState({ error: e })})
        }
    }

    handleToggleClick(e) {
        e.stopPropagation();

        if (this.state.lockPrediction) {
            return null;
        }

        const extraTime = !this.state.extraTime && !this.state.penalties;
        const penalties = this.state.extraTime && !this.state.penalties;

        this.setState({ lockPrediction: true }, () => {
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
                    prediction: this.state.selection,
                    extra_time: extraTime,
                    penalties: penalties
                },
                "same-origin"
            )
            .then(response => response.json())
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message, lockPrediction: false });
                    return null;
                }

                this.setState({ extraTime: extraTime, penalties: penalties, lockPrediction: false });
            })
        })
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
                            {
                                this.props.qatarHero && this.props.matchDay <= 3 ?
                                <button className={"gameprediction-button gameprediction-button-selection" + (this.state.selection === "draw" ? " active" : "")}
                                    onClick={this.handleSelectionClick} value="draw">
                                        DRAW
                                </button>
                                :
                                <button className="gameprediction-button gameprediction-button-selection gameprediction-toggle"
                                    onMouseDown={this.handleToggleClick} value="extratime">
                                    <span className={this.state.selection && !this.state.extraTime && !this.state.penalties ? 'active' : ''}>90</span>
                                    <span className={this.state.selection && this.state.extraTime ? 'active' : ''}>ET</span>
                                    <span className={this.state.selection && this.state.penalties ? 'active' : ''}>P</span>
                                </button>
                            }
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
