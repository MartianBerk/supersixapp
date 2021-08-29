import React, { Component } from 'react';

import * as Constants from "../constants.js";

import '../css/GameDetail.css';

class GameDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeTeam: this.props.homeTeam,
            awayTeam: this.props.awayTeam,
            gameDate: this.props.gameDate,
            playerId: this.props.playerId,
            gameId: this.props.gameId,
            loading: true,
            selection: null,
            submitted: false,
            leaguePosition: {},
            teamPerformance: {},
            headToHead: {}
        };

        this.handleSelectionClick = this.handleSelectionClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    fetchGameData() {
        let gameDate = new Date(this.state.gameDate);

        const year = gameDate.getFullYear();
        const month = (gameDate.getMonth() + 1) > 9 ? (gameDate.getMonth() + 1) : "0" + (gameDate.getMonth() + 1);
        const day = gameDate.getDate() > 9 ? gameDate.getDate() : "0" + gameDate.getDate();
        gameDate = [day, month, year].join("-");

        fetch(`${Constants.GETMATCHDETAILURL}?hometeam=${this.state.homeTeam}&awayteam=${this.state.awayTeam}&matchdate=${gameDate}`)
        .then(response => response.json())
        .then(data => this.setState({
            leaguePosition: data["match_detail"]["league_position"],
            teamPerformance: data["match_detail"]["team_performance"],
            headToHead: data["match_detail"]["head_to_head"]
        }))
        .then(_ => {
            fetch(Constants.GETPREDICTIONURL)
            .then(response => response.json())
            .then((data) => {
                let state = {};
                if (Object.keys(data["prediction"]).length > 0) {
                    state = {
                        selection: data["prediction"]["prediction"],
                        submitted: true,
                    };
                }

                this.setState({
                    ...state,
                    loading: false
                });
            })
            .catch(/* do nothing */)
        })
        .then(_ => {this.setState({ loading: false })})
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.fetchGameData();
    }

    handleSelectionClick(e) {
        if (!this.state.submitted && e.target.value !== this.state.selection) {
            this.setState({ selection: e.target.value });
        }
    }

    handleSubmitClick(_) {

    }

    renderWinDrawLoss(results) {
        return results.map((result, i) => {
            return <img 
                        key={i}
                        src={result === "WIN" ?
                            "tick.png"
                            : result === "LOSE" ?
                            "cross.png"
                            : "neutral.png"}
                        width="12"
                        height="12"
                        className="result-img" />
        })
    }

    renderPasswordField() {

    }

    renderUserSubmit() {
        if (this.state.playerId) {
            return (
                <div className="gamedetail-selection">
                    <div className="gamedetail-selections">
                        <button
                            className={"gamedetail-button gamedetail-button-selection" + (this.state.selection === "home" ? " active" : "")}
                            onClick={this.handleSelectionClick} value="home">
                                HOME
                        </button>
                        <button className={"gamedetail-button gamedetail-button-selection" + (this.state.selection === "draw" ? " active" : "")}
                            onClick={this.handleSelectionClick} value="draw">
                                DRAW
                        </button>
                        <button className={"gamedetail-button gamedetail-button-selection" + (this.state.selection === "away" ? " active" : "")}
                            onClick={this.handleSelectionClick} value="away">
                                AWAY
                        </button>
                    </div>
                    <div className="gamedetail-submit">
                        <button className={"gamedetail-button gamedetail-button-submit"  + (this.state.submitted ? " active" : "")}
                            onClick={this.handleSubmitClick}>
                                {this.state.submitted ? "SUBMITTED" : "SUBMIT"}
                        </button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="gamedetail-selection">
                    <div className="gamedetail-selections">
                        <p className="gamedetail-row">
                            <span className="gamedetail-section hometeam"></span>
                            <span className="gamedetail-section title">Please login to predict?</span>
                            <span className="gamedetail-section awayteam"></span>
                        </p>
                    </div>
                </div>
            )
        }
    }

    render () {
        return (
            !this.state.loading && 
            (
                <div className="gamedetail-container">
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.state.leaguePosition[this.state.homeTeam] || "-"}</span>
                        <span className="gamedetail-section title">League Position</span>
                        <span className="gamedetail-section awayteam">{this.state.leaguePosition[this.state.awayTeam] || "-"}</span>
                    </p>
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.renderWinDrawLoss(this.state.teamPerformance[this.state.homeTeam])}</span>
                        <span className="gamedetail-section title">Performance</span>
                        <span className="gamedetail-section awayteam">{this.renderWinDrawLoss(this.state.teamPerformance[this.state.awayTeam])}</span>
                    </p>
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.renderWinDrawLoss(this.state.headToHead[this.state.homeTeam])}</span>
                        <span className="gamedetail-section title">Head To Head</span>
                        <span className="gamedetail-section awayteam">{this.renderWinDrawLoss(this.state.headToHead[this.state.awayTeam])}</span>
                    </p>
                    {/* TODO: This needs to only render if we have playerId. Otherwise a login button to reveal user page. Also, handle submitted predictions.*/}
                    {/* {this.renderUserSubmit()} */}
                </div>
            )
        )
    }
}

export default GameDetail;
