import React, { Component } from 'react';

import Games from "../container/Games.js";
import Scores from "../container/Scores.js";
import Time from "../container/Time.js";

import '../css/SuperSix.css';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGames: true,
            showPlayers: false
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        if (e.target.id === "supersix-games" || e.target.id === "supersix-games-img") {
            this.setState({ showGames: true, showPlayers: false })
        }
        else if (e.target.id === "supersix-players" || e.target.id === "supersix-scores-img") {
            this.setState({ showGames: false, showPlayers: true })
        }
    }

    render () {
        return (
            <div className="supersix-container">
                <Time />
                <div className="supersix-menu">
                    <button 
                        className={`supersix-menu-button ${this.state.showGames ? "active" : ""}`}
                        id="supersix-games"
                        onClick={this.handleMenuClick}><img id="supersix-games-img" onClick={this.handleMenuClick}  src='games.png' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPlayers ? "active" : ""}`}
                        id="supersix-players"
                        onClick={this.handleMenuClick}><img id="supersix-scores-img" onClick={this.handleMenuClick}  src='scores.png' height='40' width='40' /> 
                    </button>
                </div>
                <div className={`supersix supersix-games ${this.state.showGames ? "" : "hidden"}`}>
                    <Games />
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    <Scores />
                </div>
            </div>
        )
    }
}

export default SuperSix;
