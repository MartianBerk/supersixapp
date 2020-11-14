import React, { Component } from 'react';

import Games from "../container/Games.js";
import Performance from "../container/Performance.js";
import Scores from "../container/Scores.js";
import Time from "../container/Time.js";

import '../css/SuperSix.css';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGames: true,
            showPlayers: false,
            showPerformance: false
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        if (e.target.id === "supersix-games") {
            this.setState({ showGames: true, showPlayers: false, showPerformance: false })
        }
        else if (e.target.id === "supersix-players") {
            this.setState({ showGames: false, showPlayers: true, showPerformance: false })
        }
        else if (e.target.id === "supersix-performance") {
            this.setState({ showGames: false, showPlayers: false, showPerformance: true })
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
                        onClick={this.handleMenuClick}>Games
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPlayers ? "active" : ""}`}
                        id="supersix-players"
                        onClick={this.handleMenuClick}>Players
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPerformance ? "active" : ""}`}
                        id="supersix-performance"
                        onClick={this.handleMenuClick}>Performance
                    </button>
                </div>
                <div className={`supersix supersix-games ${this.state.showGames ? "" : "hidden"}`}>
                    <Games />
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    <Scores />
                </div>
                <div className={`supersix supersix-performance ${this.state.showPerformance ? "" : "hidden"}`}>
                    <Performance />
                </div>
            </div>
        )
    }
}

export default SuperSix;
