import React, { Component } from "react";

import Error from "./Error";
import { Requests } from "../requests";

import "../css/Players.css";


class Players extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            error: false,
            confirm: null,
            confirmYesAction: null,
            confirmNoAction: null
        }

        this.requests = new Requests();

        this.handleConfirmationClick = this.handleConfirmationClick.bind(this);
    }

    loadPlayers() {
        this.requests.fetch("LISTPLAYERSURL")
        .then(response => response.json())
        .then(data => this.setState({ players: data.players }))
    }

    componentDidMount() {
        this.loadPlayers();
    }

    handleConfirmationClick(e) {
        if (e.target.id == "confirm-yes") {
            this.state.confirmYesAction();
        }
        else {
            this.state.confirmNoAction();
        }

        this.setState({ confirm: null });
    }

    renderConfirmation() {
        return (
            <div className={"supersixadmin-rounds confirm-container" + (!this.state.confirm ? " hidden" : "")}>
                <div className="supersixadmin-rounds confirm">
                    {this.state.confirm}
                    <div className="supersixadmin-rounds confirm-buttons">
                        <button className="supersixadmin-rounds confirm-button" id="confirm-yes" onClick={this.handleConfirmationClick}> 
                            Yes
                        </button>
                        <button className="supersixadmin-rounds confirm-button" id="confirm-no" onClick={this.handleConfirmationClick}> 
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderPlayers() {
        let activePlayers = [];
        let retiredPlayers = [];

        this.state.players.forEach(player => {
            if (!player.retired) {
                activePlayers.push(player);
            }
            else {
                retiredPlayers.push(player);
            }
        })

        const activePlayersSection = (
            <div className="supersixadmin-players active">
                <h2>Active Players</h2>
                <div className="supersixadmin-players playersection">
                    {
                        activePlayers.map((player, index) => {
                            return (
                                <div key={index} className="supersixadmin-players player">
                                    <span>{player.first_name} {player.last_name}</span>
                                    <span>
                                        <button onClick={_ => {
                                            this.setState({
                                                confirm: `Retiring '${player.first_name} ${player.last_name}'.\nProceed?`,
                                                confirmYesAction: (() => {
                                                    this.requests.fetch(
                                                        "DROPPLAYERURL",
                                                        {
                                                            id: player.id
                                                        },
                                                        {
                                                            "Content-Type": "application/json"
                                                        },
                                                        null
                                                    )
                                                    .then(response => response.json())
                                                    .then(data => {
                                                        if (data.error) {
                                                            this.setState({ error: data.message })
                                                        }
                                                        else {
                                                            let players = [...this.state.players];
                                                            players.forEach(player => { player.id === data.id ? player.retired = true : player.id = false });
                                                            this.setState({ players: players });
                                                        }
                                                    })
                                                    .catch(error => {this.setState({ error: error })});
                                                }),
                                                confirmNoAction: (() => {
                                                    return null;
                                                })
                                            });
                                        }}>
                                            <img src="expand-white.png" height='10' width='10' style={{"padding-right": "1px"}} />
                                        </button>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )

        const retiredPlayersSection = (
            <div className="supersixadmin-players retired">
                <h2>Retired Players</h2>
                <div className="supersixadmin-players playersection">
                    {
                        retiredPlayers.map((player, index) => {
                            return (
                                <div key={index} className="supersixadmin-players player">
                                    <span>{player.first_name} {player.last_name}</span>
                                    <span>
                                        <button onClick={_ => {
                                            this.setState({
                                                confirm: `Reactivating '${player.first_name} ${player.last_name}'.\nProceed?`,
                                                confirmYesAction: (() => {
                                                    this.requests.fetch(
                                                        "REACTIVATEPLAYERURL",
                                                        {
                                                            id: player.id
                                                        },
                                                        {
                                                            "Content-Type": "application/json"
                                                        },
                                                        null
                                                    )
                                                    .then(response => response.json())
                                                    .then(data => {
                                                        if (data.error) {
                                                            this.setState({ error: data.message })
                                                        }
                                                        else {
                                                            let players = [...this.state.players];
                                                            players.forEach(player => { player.id === data.id ? player.retired = false : player.id = true });
                                                            this.setState({ players: players });
                                                        }
                                                    })
                                                    .catch(error => {this.setState({ error: error })});
                                                }),
                                                confirmNoAction: (() => {
                                                    return null;
                                                })
                                            });
                                        }}><img src="shrink-white.png" height='10' width='10' /></button>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )

        return (
            <div className="supersixadmin-players-container">
                <div className="supersixadmin-players">
                    {
                        activePlayers.length > 0 ? 
                        activePlayersSection :
                        null
                    }
                    {
                        retiredPlayers.length > 0 ? 
                        retiredPlayersSection :
                        null
                    }
                    <div className="supersixadmin-players add-player">
                        <h2>Add Player</h2>
                        <div className="supersixadmin-players add-player section">
                            <h5>First Name</h5>
                            <input id="supersixadmin-players-addplayer-firstname" type="text" />
                        </div>
                        <div className="supersixadmin-players add-player section">
                            <h5>Last Name</h5>
                            <input id="supersixadmin-players-addplayer-lastname" type="text" />
                        </div>
                        <div className="supersixadmin-players add-player section">
                            <button onClick={_ => {
                                const firstName = document.getElementById("supersixadmin-players-addplayer-firstname").value;
                                const lastName = document.getElementById("supersixadmin-players-addplayer-lastname").value;

                                if (firstName && lastName) {
                                    this.setState({
                                        confirm: `Adding new player '${firstName} ${lastName}'.\nProceed?`,
                                        confirmYesAction: (() => {
                                            this.requests.fetch(
                                                "ADDPLAYERURL",
                                                "POST",
                                                null,
                                                {
                                                    "Content-Type": "application/json"
                                                },
                                                {
                                                    first_name: firstName,
                                                    last_name: lastName
                                                }
                                            )
                                            .then(response => response.json())
                                            .then(data => {
                                                if (data.error) {
                                                    this.setState({ error: data.message })
                                                }
                                                else {
                                                    let players = [...this.state.players];
                                                    players.push(data);
                                                    this.setState({ players: players })
                                                }
                                            })
                                            .catch(error => {this.setState({ error: error })});
                                        }),
                                        confirmNoAction: (() => {
                                            document.getElementById("supersixadmin-players-addplayer-firstname").value = null;
                                            document.getElementById("supersixadmin-players-addplayer-lastname").value = null;
                                        })
                                    });
                                }
                            }}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="supersixadmin-players-container">
                {
                    this.state.error ? 
                    <Error error={this.state.error} onAccept={_ => { this.setState({ error: null }) }}/> :
                    [this.renderConfirmation(), this.renderPlayers()]
                }
                <div className="supersixadmin-players-whitespace">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        )
    }
}

export default Players;
