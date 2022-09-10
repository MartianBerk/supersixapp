import React, { Component } from 'react';

import GameSelector from '../container/GameSelector.js';
import Players from '../container/Players.js';
import PlayerPredictions from '../container/PlayerPredictions.js';
import SupersixRounds from '../container/SupersixRounds.js';

import '../css/SuperSix.css';

class SuperSixAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGames: true,
            showPlayers: false,
            showPerformance: false,
            showUser: false
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        if (e.target.id === "supersix-games" || e.target.id === "supersix-games-img") {
            this.setState({ showGames: true, showPlayers: false, showPerformance: false, showUser: false })
        }
        else if (e.target.id === "supersix-players" || e.target.id === "supersix-scores-img") {
            this.setState({ showGames: false, showPlayers: true, showPerformance: false, showUser: false })
        }
        else if (e.target.id === "supersix-performance" || e.target.id === "supersix-performance-img") {
            this.setState({ showGames: false, showPlayers: false, showPerformance: true, showUser: false })
        }
        else if (e.target.id === "supersix-user" || e.target.id === "supersix-user-img") {
            this.setState({ showGames: false, showPlayers: false, showPerformance: false, showUser: true })
        }
    }

    render () {
        return (
            <div className="supersixadmin-container">
                <div className="supersix-menu">
                    <button 
                        className={`supersix-menu-button ${this.state.showGames ? "active" : ""}`}
                        id="supersix-games"
                        onClick={this.handleMenuClick}><img id="supersix-games-img" onClick={this.handleMenuClick} src='fixtures-admin.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPlayers ? "active" : ""}`}
                        id="supersix-players"
                        onClick={this.handleMenuClick}><img id="supersix-scores-img" onClick={this.handleMenuClick} src='scores-admin.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPerformance ? "active" : ""}`}
                        id="supersix-performance"
                        onClick={this.handleMenuClick}><img id="supersix-performance-img" onClick={this.handleMenuClick} src='leaders-admin.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showUser ? "active" : ""}`}
                        id="supersix-user"
                        onClick={this.handleMenuClick}>
                            <img id="supersix-user-img" onClick={this.handleMenuClick} src='users-admin.svg' height='40' width='40' /> 
                    </button> 
                </div>
                <div className={`supersix supersix-games ${this.state.showGames ? "" : "hidden"}`}>
                    <GameSelector
                        playerId={ this.props.playerId }
                    /> 
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    <PlayerPredictions />
                </div>
                <div className={`supersix supersix-performance ${this.state.showPerformance ? "" : "hidden"}`}>
                    <SupersixRounds />
                </div>
                <div className={`supersix supersix-user ${this.state.showUser ? "" : "hidden"}`}>
                    <Players />
                </div>
            </div>
        )
    }
}

export default SuperSixAdmin;
