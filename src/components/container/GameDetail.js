import React, { Component } from 'react';

import * as Constants from "../constants.js";
import GamePrediction from './GamePrediction.js';

import '../css/GameDetail.css';
import UserLogin from './UserLogin.js';

class GameDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeTeam: props.homeTeam,
            awayTeam: props.awayTeam,
            gameDate: props.gameDate,
            playerId: props.playerId,
            gameId: props.gameId,
            loading: true,
            leaguePosition: {},
            teamPerformance: {},
            headToHead: {}
        };
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
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.fetchGameData();
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
                    { 
                        !this.state.loading ? 
                            this.state.playerId ?
                            <GamePrediction
                                gameId={this.state.gameId}
                                playerId={this.state.playerId}
                                onPreditionSet={this.props.onPreditionSet}
                            /> :
                            <UserLogin />
                        : null
                    }
                </div>
            )
        )
    }
}

export default GameDetail;
