import React, { Component } from 'react';

import * as Constants from "../constants.js";
import Games from "../container/Games.js";
import Performance from "../container/Performance.js";
import Scores from "../container/Scores.js";
import Head from "../container/Head.js";

import '../css/SuperSix.css';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {},
            loading: true,
            showGames: true,
            showPlayers: false,
            showPerformance: false
        };

        fetch(Constants.METAURL)
        .then(response => response.json())
        .then(data => this.setState({ meta: data.meta }))
        .then(() => this.setState({ loading: false }))
        .catch(/* do nothing */);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        if (e.target.id === "supersix-games" || e.target.id === "supersix-games-img") {
            this.setState({ showGames: true, showPlayers: false, showPerformance: false })
        }
        else if (e.target.id === "supersix-players" || e.target.id === "supersix-scores-img") {
            this.setState({ showGames: false, showPlayers: true, showPerformance: false })
        }
        else if (e.target.id === "supersix-performance" || e.target.id === "supersix-performance-img") {
            this.setState({ showGames: false, showPlayers: false, showPerformance: true })
        }
    }

    render () {
        return (
            <div className="supersix-container">
                <Head />
                <div className="supersix-menu">
                    <button 
                        className={`supersix-menu-button ${this.state.showGames ? "active" : ""}`}
                        id="supersix-games"
                        onClick={this.handleMenuClick}><img id="supersix-games-img" onClick={this.handleMenuClick} src='games.png' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPlayers ? "active" : ""}`}
                        id="supersix-players"
                        onClick={this.handleMenuClick}><img id="supersix-scores-img" onClick={this.handleMenuClick} src='scores.png' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPerformance ? "active" : ""}`}
                        id="supersix-performance"
                        onClick={this.handleMenuClick}><img id="supersix-performance-img" onClick={this.handleMenuClick} src='performance.png' height='40' width='40' /> 
                    </button> 
                </div>
                <div className={`supersix supersix-games ${this.state.showGames ? "" : "hidden"}`}>
                    { !this.state.loading ? <Games meta={{ teams: this.state.meta.teams, gameweeks: this.state.meta.gameweeks }} /> : null }
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    { !this.state.loading ? <Scores meta={{ players: this.state.meta.players, gameweeks: this.state.meta.gameweeks }} /> : null }
                </div>
                <div className={`supersix supersix-performance ${this.state.showPerformance ? "" : "hidden"}`}>
                    <Performance meta={this.state.meta.players} />
                </div>
            </div>
        )
    }
}

export default SuperSix;
