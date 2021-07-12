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
            loading: true,
            leaguePosition: {},
            teamPerformance: {},
            headToHead: {}
        };
    }

    fetchGameData() {
        fetch(Constants.GETMATCHDETAILURL)
        .then(response => response.json())
        .then(data => this.setState({
            leaguePosition: data["match_detail"]["league_position"],
            teamPerformance: data["match_detail"]["team_performance"],
            headToHead: data["match_detail"]["head_to_head"],
            loading: false
        }))
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.fetchGameData();
    }

    renderWinDrawLoss(results) {
        return results.map(result => {
            return <img src={result === "WIN" ?
                            "tick.png"
                            : result === "LOSE" ?
                            "cross.png"
                            : "neutral.png"}
                    width="20"
                    height="20"
                    className="result-img" />
        })
    }

    render () {
        return (
            !this.state.loading && 
            (
                <div className="gamedetail-container">
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.state.leaguePosition[this.state.homeTeam]}</span>
                        <span className="gamedetail-section title">League Position</span>
                        <span className="gamedetail-section awayteam">{this.state.leaguePosition[this.state.awayTeam]}</span>
                    </p>
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.renderWinDrawLoss(this.state.teamPerformance[this.state.homeTeam])}</span>
                        <span className="gamedetail-section title">Team Performance</span>
                        <span className="gamedetail-section awayteam">{this.renderWinDrawLoss(this.state.teamPerformance[this.state.awayTeam])}</span>
                    </p>
                    <p className="gamedetail-row">
                        <span className="gamedetail-section hometeam">{this.renderWinDrawLoss(this.state.headToHead[this.state.homeTeam])}</span>
                        <span className="gamedetail-section title">Head To Head</span>
                        <span className="gamedetail-section awayteam">{this.renderWinDrawLoss(this.state.headToHead[this.state.awayTeam])}</span>
                    </p>
                    {/* TODO: This needs to only render if we have playerId.*/}
                    <div className="gamedetail-selection">
                        <div className="gamedetail-selections">
                            <button className="gamedetail-button gamedetail-button-selection">HOME</button>
                            <button className="gamedetail-button gamedetail-button-selection">DRAW</button>
                            <button className="gamedetail-button gamedetail-button-selection">AWAY</button>
                        </div>
                        <div className="gamedetail-submit">
                            <button className="gamedetail-button gamedetail-button-submit">SUBMIT</button>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default GameDetail;
