import React, { Component } from "react";

import Error from "./Error";
import { Requests } from "../requests";

import "../css/SupersixRounds.css";


class SupersixRounds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRound: {},
            historicRounds: [],
            players: [],
            error: false,
            confirm: null,
            confirmYesAction: null,
            confirmNoAction: null,
            specialMessage: null,
            buyIn: 2,
            pickWinner: false,
            winners: []
        };

        this.requests = new Requests();

        this.handleCreateRound = this.handleCreateRound.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.handleMessageClear = this.handleMessageClear.bind(this);
        this.handleWinnerClick = this.handleWinnerClick.bind(this);
        this.handleConfirmationClick = this.handleConfirmationClick.bind(this);
    }

    getCurrentRound() {
        this.requests.fetch("CURRENTROUNDADMINURL")
        .then(response => response.json())
        .then(data => this.setState({ currentRound: data["current_round"] }))
        .catch(_ => this.setState({ error: true }));
    }

    getHistoricRounds() {
        this.requests.fetch("HISTORICROUNDSURL")
        .then(response => response.json())
        .then(data => this.setState({ historicRounds: data["rounds"] }))
        .catch(_ => this.setState({ error: true }));
    }

    getPlayers() {
        this.requests.fetch("LISTPLAYERSURL")
        .then(response => response.json())
        .then(data => this.setState({ players: data["players"].map(player => {
            if (player.retired) {
                return null;
            }
            else {
                return { id: player.id, name: player.first_name + " " + player.last_name }
            }
        }) }))
        .catch(_ => this.setState({ error: true }));
    }

    getSpecialMessage() {
        this.requests.fetch("GETSPECIALMESSAGEURL")
        .then(response => response.json())
        .then(data => this.setState({ specialMessage: data.message }))
        .catch(_ => this.setState({ error: true }));
    }

    componentDidMount() {
        this.getCurrentRound();
        this.getHistoricRounds();
        this.getPlayers();
        this.getSpecialMessage();
    }

    formatDate(date) {
        date = new Date(date);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

        return day + " " + months[month] + " " + year;
    }

    handleCreateRound(_) {
        let startDate = document.getElementById("createround-startdate").value;
        const buyIn = this.state.buyIn * 100;

        if (!startDate) {
            return null;
        }

        this.setState({
            confirm: `Adding round to start on ${this.formatDate(startDate)} with a buy in of £${this.state.buyIn}.\nProceed?`,
            confirmYesAction: (() => {
                startDate = new Date(startDate)
                startDate = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`;

                this.requests.fetch("ADDROUNDURL",
                    "POST",
                    null,
                    {
                        "Content-Type": "application/json"
                    },
                    {
                        start_date: startDate,
                        buy_in: buyIn
                    }
                )
                .then(this.getCurrentRound());
            }),
            confirmNoAction: (() => {/* do nothing */})
        })
    }

    handleMessageChange(_) {
        this.setState({ specialMessage: document.getElementById("currentround-message").value });
    }

    handleMessageSubmit(_) {
        const message = document.getElementById("currentround-message").value;

        this.setState({
            confirm: `Submitting special message '${message}'.\nProceed?`,
            confirmYesAction: (() => {
                this.requests.fetch(
                    "SETSPECIALMESSAGEURL",
                    "POST",
                    null,
                    {
                        "Content-Type": "application/json"
                    },
                    {
                        message: message
                    }
                )
                .then(this.setState({ specialMessage: message }))
                .catch(/* do nothing */);
            }),
            confirmNoAction: (() => {
                document.getElementById("currentround-message").value = null;
            })
        });
    }

    handleMessageClear(_) {
        this.setState({
            confirm: `Clearing special message.\nProceed?`,
            confirmYesAction: (() => {
                this.requests.fetch("ENDSPECIALMESSAGEURL")
                .then(this.setState({ specialMessage: null }))
                .catch(/* do nothing */);
            }),
            confirmNoAction: (() => {/* do nothing */})
        });
    }

    handleWinnerClick(_) {
        if (!this.state.pickWinner) {
            this.setState({ pickWinner: true });
        }
        else {
            if (this.state.winners.length > -1) {
                this.setState({ pickWinner: false, winners: [] });
                return null;
            }

            this.setState({
                confirm: `Ending round with ${this.state.winners.length} winner(s) on ${this.formatDate(this.state.currentRound.current_match_date)}.\nProceed?`,
                confirmYesAction: (() => {
                    let endDate = new Date(this.state.currentRound.current_match_date)
                    endDate = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
    
                    this.requests.fetch(
                        "ENDROUNDURL",
                        "POST",
                        null,
                        {
                            "Content-Type": "application/json"
                        },
                        {
                            winner_ids: this.state.winners.map(w => {return w.id}),
                            end_date: endDate
                        }
                    )
                    .then(_ => {
                        this.getCurrentRound();
                        this.setState({ pickWinner: false, winners: [] });
                    })
                    
                }),
                confirmNoAction: (() => {
                    this.setState({ pickWinner: false, winners: [] });
                })
            });
        }
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

    renderCurrentRound() {
        if (this.state.currentRound && Object.keys(this.state.currentRound).length > 0) {
            return (
                <div className="supersixadmin-rounds currentround">
                    <h2>Current Round</h2>
                    <div className="supersixadmin-rounds currentround-section">
                        <div className="supersixadmin-rounds currentround-subsection">
                            <h4>Start Date</h4>
                            <h5>{ this.formatDate(this.state.currentRound.start_date) }</h5>
                        </div>
                        <div className="supersixadmin-rounds currentround-subsection">
                            <h4>Gameweeks</h4>
                            <h5>{ this.state.currentRound.matches }</h5>
                        </div>
                        <div className="supersixadmin-rounds currentround-subsection">
                            <h4>Players</h4>
                            <h5>{ this.state.currentRound.players }</h5>
                        </div>
                        <div className="supersixadmin-rounds currentround-subsection">
                            <h4>Jackpot</h4>
                            <h5>£{ this.state.currentRound.jackpot / 100 }</h5>
                        </div>
                    </div>
                    <div className="supersixadmin-rounds currentround-section">
                        <h4>Special Message</h4>
                        <input className="currentround-message" id="currentround-message" type="text" value={this.state.specialMessage} onChange={this.handleMessageChange} />
                        <br /><br />
                        <button className="supersixadmin-rounds currentround-submit" id="currentround-submit-message" onClick={this.handleMessageSubmit}>
                            Submit
                        </button>
                        <button className="supersixadmin-rounds currentround-submit" id="currentround-clear-message" onClick={this.handleMessageClear}>
                            Clear
                        </button>
                    </div>
                    <div className="supersixadmin-rounds currentround-section">
                        <button 
                        className={"supersixadmin-rounds pick-winner-button" + (this.state.winners.length > 0 ? " active" : "")}
                        onClick={this.handleWinnerClick}
                        >
                            {this.state.pickWinner ? "Submit" + (this.state.winners.length > 1 ? " Winners" : " Winner" ) : "Pick A Winner"}
                        </button>
                        {
                            !this.state.pickWinner ? 
                            null :
                            <div className="supersixadmin-rounds pick-winner-players">
                                <br /><br />
                                {
                                    this.state.players.map(player => {
                                        return (
                                            <div className="supersixadmin-rounds pick-winner-player">
                                                <span className="supersixadmin-rounds pick-winner-player player-section">{player.name}</span>
                                                <button
                                                className={"supersixadmin-rounds pick-winner-player player-section small-button" + (this.state.winners.indexOf(player) > -1 ? " active" : "")}
                                                style={{width: 50}}
                                                onClick={_ => {
                                                    let winners = [...this.state.winners];
                                                    const i = winners.indexOf(player); 
                                                    i > -1 ? winners.splice(i, 1) : winners.push(player);
                                                    this.setState({ winners: winners });
                                                }}
                                                >
                                                    {this.state.winners.indexOf(player) === -1 ? "+" : "x"}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="supersixadmin-rounds currentround">
                    <h2>Current Round</h2>
                    <h4>Create round.</h4>
                    <div className="supersixadmin-rounds currentround-createround">
                        <div className="supersixadmin-rounds currentround-create-fields">
                            <div className="supersixadmin-rounds currentround-section create">
                                <h5>Start Date</h5>
                                <input type="date" id="createround-startdate" />
                            </div>
                            <div className="supersixadmin-rounds currentround-section create buyin">
                                <h5>Buy In (£)</h5>
                                <button className="supersixadmin-rounds buyin small-button" onClick={e => {this.setState({buyIn: this.state.buyIn > 1 ? this.state.buyIn -= 1 : this.state.buyIn})}}>-</button>
                                <span className="supersixadmin-rounds buyin">{this.state.buyIn}</span>
                                <button className="supersixadmin-rounds buyin small-button" onClick={e => {this.setState({buyIn: this.state.buyIn += 1})}}>+</button>
                            </div>
                        </div>
                        <button className="supersixadmin-rounds currentround-submit" id="currentround-create" onClick={this.handleCreateRound}> 
                            Submit
                        </button>
                    </div>
                </div>
            )
        }
    }

    renderHistoricRounds() {
        return (
            <div className="supersixadmin-rounds historicrounds">
                <br />
                <h2>Previous Rounds</h2>
                <div className="supersixadmin-rounds historicround">
                    <div className="supersixadmin-rounds historicround-section">
                        <h4>Start</h4>
                    </div>
                    <div className="supersixadmin-rounds historicround-section">
                        <h4>End</h4>
                    </div>
                    <div className="supersixadmin-rounds historicround-section">
                        <h4>Jackpot</h4>
                    </div>
                    <div className="supersixadmin-rounds historicround-section">
                        <h4>Winner</h4>
                    </div>
                </div>
                {
                    this.state.historicRounds.map((round, index) => {
                        return (
                            <div key={index} className="supersixadmin-rounds historicround">
                                <div className="supersixadmin-rounds historicround-section">
                                    <h5>{ this.formatDate(round.start_date) }</h5>
                                </div>
                                <div className="supersixadmin-rounds historicround-section">
                                    <h5>{ this.formatDate(round.end_date) }</h5>
                                </div>
                                <div className="supersixadmin-rounds historicround-section">
                                    <h5>£{ round.jackpot / 100 }</h5>
                                </div>
                                <div className="supersixadmin-rounds historicround-section">
                                    <h5>{ round.winner }</h5>
                                </div>
                            </div>
                        ) 
                    })
                }
            </div>
        )
    }

    render() {
        return (
            <div className="supersixadmin-rounds-container">
                <div className="supersixadmin-rounds">
                    {
                        this.state.error ? 
                        <Error error={this.state.error} onAccept={_ => { this.setState({ error: null }) }}/> :
                        [this.renderConfirmation(), this.renderCurrentRound(), this.renderHistoricRounds()]
                    }
                </div>
                <div className="games-whitespace">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}

export default SupersixRounds;
