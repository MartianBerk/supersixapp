import React, { Component } from 'react';

import { Requests } from "../requests.js";
import Games from "../container/Games.js";
import Performance from "../container/Performance.js";
import Scores from "../container/Scores.js";
import User from "../container/User.js";
import QatarHero from '../container/QatarHero.js';

import '../css/SuperSix.css';

class SuperSixGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {},
            allPlayerSelections: [],
            isLoggedIn: false,
            newUser: false,
            userData: {
                playerId: null,
                qatarHeroPlayerId: null,
                permissions: [],
                userId: null,
                email: null,
                firstname: null,
                lastname: null,
                nickname: null,
                selections: null
            },
            loading: true,
            showGames: true,
            showPlayers: false,
            showPerformance: false,
            showUser: false,
            showQatarHero: false
        };

        const requests = new Requests()

        requests.fetch("METAURL")
        .then(response => response.json())
        .then(data => this.setState({ meta: data.meta }))
        .then(_ => {
            requests.fetch(
                "LOGGEDINURL",
                "POST",
                null,
                {
                    "Content-Type": "application/json"
                },
                {},
                "same-origin"
            )
            .then(response => response.json())
            .then(data => this.setState((oldState) => {
                let { is_logged_in, new_user, ...userData } = data;
                let isLoggedIn = data.is_logged_in || false;
                let newUser = data.new_user || false;

                // Ensure error here is handled (if no cookie set or cookie uid is invalid)
                if (data.error) {
                    userData = {};
                }

                this.props.onLoginSuccess(userData.user_id, userData.player_id, this.state.meta);
                
                return {
                    ...oldState,
                    isLoggedIn: isLoggedIn,
                    newUser: newUser,
                    userData: {
                        playerId: userData.player_id,
                        qatarHeroPlayerId: userData.qatar_her_player_id,
                        permissions: userData.permissions,
                        userId: userData.user_id,
                        email: userData.email,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        nickname: this.state.meta.players ? this.state.meta.players[`${userData.firstname} ${userData.lastname}`] || null : null,
                    },
                    loading: false
                }
            }))
            .catch(/* do nothing */);
        })
        .catch(/* do nothing */);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        if (e.target.id === "supersix-games" || e.target.id === "supersix-games-img") {
            if (this.state.showQatarHero) {
                this.props.onQatarHero();
            }
            
            this.setState({ showGames: true, showPlayers: false, showPerformance: false, showUser: false, showQatarHero: false })
        }
        else if (e.target.id === "supersix-players" || e.target.id === "supersix-scores-img") {
            this.setState({ showGames: false, showPlayers: true, showPerformance: false, showUser: false, showQatarHero: false })
        }
        else if (e.target.id === "supersix-performance" || e.target.id === "supersix-performance-img") {
            if (this.state.showQatarHero) {
                this.props.onQatarHero();
            }
            
            this.setState({ showGames: false, showPlayers: false, showPerformance: true, showUser: false, showQatarHero: false })
        }
        else if (e.target.id === "supersix-user" || e.target.id === "supersix-user-img") {
            if (this.state.showQatarHero) {
                this.props.onQatarHero();
            }

            this.setState({ showGames: false, showPlayers: false, showPerformance: false, showUser: true, showQatarHero: false })
        }
        else if (e.target.id === "supersix-qatar" || e.target.id === "supersix-qatar-img") {
            if (!this.state.showQatarHero) {
                this.props.onQatarHero();
            }
            this.setState({ showGames: false, showPlayers: false, showPerformance: false, showUser: false, showQatarHero: true })
        }
    }

    render () {
        let qatarHero = true;
        for (var i = 0; i < this.state.userData.permissions.length; i++) {
            let permission = this.state.userData.permissions[i];
            if (permission.name === "QATARHERO" && permission.permission === 1) {
                qatarHero = true;
                break;
            }
        }

        return (
            <div className="supersixgame-container">
                <div className="supersix-menu">
                    <button 
                        className={`supersix-menu-button ${this.state.showGames ? "active" : ""}`}
                        id="supersix-games"
                        onClick={this.handleMenuClick}><img id="supersix-games-img" onClick={this.handleMenuClick} src='fixtures.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPlayers ? "active" : ""}`}
                        id="supersix-players"
                        onClick={this.handleMenuClick}><img id="supersix-scores-img" onClick={this.handleMenuClick} src='scores.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showPerformance ? "active" : ""}`}
                        id="supersix-performance"
                        onClick={this.handleMenuClick}><img id="supersix-performance-img" onClick={this.handleMenuClick} src='leaders.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showUser ? "active" : ""}`}
                        id="supersix-user"
                        onClick={this.handleMenuClick}>
                            <img id="supersix-user-img" onClick={this.handleMenuClick} src='users.svg' height='40' width='40' /> 
                    </button>
                    <button
                        className={`supersix-menu-button ${this.state.showQatarHero ? "active" : ""}`}
                        id="supersix-qatar"
                        onClick={this.handleMenuClick}>
                            <img id="supersix-qatar-img" onClick={this.handleMenuClick} src='qatar.svg' height='40' width='40' /> 
                    </button> 
                </div>
                <div className={`supersix supersix-games ${this.state.showGames ? "" : "hidden"}`}>
                    { !this.state.loading ? <Games
                                                meta={{
                                                    teams: this.state.meta.teams,
                                                    gameweeks: this.state.meta.gameweeks
                                                }}
                                                playerId={this.state.userData.playerId}
                                                allPlayerSelections={this.state.allPlayerSelections}
                                                playerSelections={this.state.userData.selections}
                                                onLoginSelect={() => {
                                                    this.setState({ showGames: false, showUser: true })
                                                }}
                                            /> : null }
                </div>
                <div className={`supersix supersix-scores ${this.state.showPlayers ? "" : "hidden"}`}>
                    { !this.state.loading ? <Scores
                                                playerId={ this.state.userData.playerId }
                                                meta={{ players: this.state.meta.players, gameweeks: this.state.meta.gameweeks }}
                                                sendSelectionsUpstream={(selections, i) => {
                                                    let userData = {...this.state.userData};

                                                    if (this.state.userData.playerId) {
                                                        userData.selections = selections.splice(i, 1)[0];
                                                    }

                                                    this.setState({ allPlayerSelections: selections, userData: userData })
                                                }}
                                            /> : null }
                </div>
                <div className={`supersix supersix-performance ${this.state.showPerformance ? "" : "hidden"}`}>
                    { 
                        !this.state.loading && this.state.meta.gameweeks.length > 0
                        ? <Performance meta={this.state.meta.players} startDate={this.state.meta.gameweeks[0]} playerId={this.state.userData.playerId} />
                        : null 
                    }  
                </div>
                <div className={`supersix supersix-user ${this.state.showUser ? "" : "hidden"}`}>
                    { 
                        !this.state.loading ? 
                        <User
                            playerMeta={this.state.meta["players"]}
                            isLoggedIn={this.state.isLoggedIn}
                            newUser={this.state.newUser}
                            userData={this.state.userData}
                            adminMode={false}
                            onLoginSuccess={(d) => {
                                let { is_logged_in, new_user, ...userData } = d;
                                let isLoggedIn = d.is_logged_in || false;
                                let newUser = d.new_user || false;

                                // Ensure error here is handled (if no cookie set or cookie uid is invalid)
                                if (d.error) {
                                    userData = {};
                                }

                                this.setState({
                                    isLoggedIn: isLoggedIn,
                                    newUser: newUser,
                                    userData: {
                                        playerId: userData.player_id,
                                        userId: userData.user_id,
                                        email: userData.email,
                                        firstname: userData.firstname,
                                        lastname: userData.lastname,
                                        nickname: this.state.meta ? this.state.meta[`${userData.firstname} ${userData.lastname}`] || null : null,
                                        selections: 0
                                    }
                                })

                                this.props.onLoginSuccess(userData.user_id, userData.player_id, this.state.meta);
                            }}
                            onLogoutSuccess={() => {
                                this.setState({
                                    isLoggedIn: false,
                                    newUser: false,
                                    userData: {
                                        playerId: null,
                                        userId: null,
                                        email: null,
                                        firstname: null,
                                        lastname: null,
                                        nickname: null,
                                        selections: 0,
                                        selectionsShared: false
                                    }
                                })

                                this.props.onLogoutSuccess();
                            }}
                            onUpdateSuccess={(d) => {
                                let newMeta = {...this.state.meta};

                                for (const playerName in newMeta.players) {
                                    if (playerName === `${this.state.userData.firstname} ${this.state.userData.lastname}`) {
                                        newMeta.players[playerName] = d.nickname
                                        break;
                                    }
                                }

                                this.setState({
                                    meta: newMeta,
                                    userData: {
                                        email: d.email,
                                        nickname: d.nickname
                                    }
                                })
                            }}
                        /> : null
                    }
                </div>
                <div className={`supersix supersix-qatar ${this.state.showQatarHero ? "" : "hidden"}`}>
                    { 
                        !this.state.loading
                        ? <QatarHero 
                            hasPermission={qatarHero}
                            playerId={this.state.userData.qatarHeroPlayerId}
                            onLoginSelect={() => {
                                this.setState({ showGames: false, showUser: true })
                            }}
                          />
                        : null 
                    }  
                </div>
            </div>
        )
    }
}

export default SuperSixGame;
