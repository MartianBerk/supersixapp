import React, { Component } from 'react';

import { Requests } from "../requests.js";
import GameSelector from '../container/GameSelector.js';

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

        const requests = new Requests();

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
                        adminMode={ true }
                        meta={{
                            teams: this.props.meta.teams,
                            gameweeks: this.props.meta.gameweeks
                        }}
                    /> 
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    {null  /* TODO: Implement as prediction submitter */}
                    {/* { !this.state.loading ? <Scores
                                                playerId={ this.props.playerId }
                                                meta={{ players: this.state.meta.players, gameweeks: this.state.meta.gameweeks }}
                                                sendSelectionsUpstream={(selections, i) => {
                                                    let userData = {...this.state.userData};

                                                    if (this.props.playerId) {
                                                        userData.selections = selections.splice(i, 1)[0];
                                                    }

                                                    this.setState({ allPlayerSelections: selections, userData: userData })
                                                }}
                                            /> : null } */}
                </div>
                <div className={`supersix supersix-performance ${this.state.showPerformance ? "" : "hidden"}`}>
                    {null  /* TODO: Implement as prediction submitter */}
                    {/* { 
                        !this.state.loading && this.state.meta.gameweeks.length > 0
                        ? <Performance meta={this.state.meta.players} startDate={this.state.meta.gameweeks[0]} playerId={this.props.playerId} />
                        : null 
                    }   */}
                </div>
                <div className={`supersix supersix-user ${this.state.showUser ? "" : "hidden"}`}>
                    {null  /* TODO: Implement as player submitter */}
                    {/* { 
                        !this.state.loading ? 
                        <User
                            playerMeta={this.props.meta["players"]}
                            isLoggedIn={true}
                            userData={
                                { userId: this.props.userId }
                            }
                            adminMode={true}
                            onLogoutSuccess={() => {
                                this.props.onLogoutSuccess();
                            }}
                        /> : null
                    } */}
                </div>
            </div>
        )
    }
}

export default SuperSixAdmin;
