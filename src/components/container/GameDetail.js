import React, { Component } from 'react';

import { Requests } from "../requests.js"
import GamePrediction from './GamePrediction.js';
import GameSelection from './GameSelection.js';

import '../css/GameDetail.css';

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
        if (!this.props.qatarHero) {
            let gameDate = new Date(this.state.gameDate);

            const year = gameDate.getFullYear();
            const month = (gameDate.getMonth() + 1) > 9 ? (gameDate.getMonth() + 1) : "0" + (gameDate.getMonth() + 1);
            const day = gameDate.getDate() > 9 ? gameDate.getDate() : "0" + gameDate.getDate();
            gameDate = [day, month, year].join("-");

            const requests = new Requests();

            requests.fetch(
                "GETMATCHDETAILURL",
                "GET",
                {
                    hometeam: this.state.homeTeam,
                    awayteam: this.state.awayTeam,
                    matchdate: gameDate
                }
            )
            .then(response => response.json())
            .then(data => this.setState({
                leaguePosition: data["match_detail"]["league_position"],
                teamPerformance: data["match_detail"]["team_performance"],
                headToHead: data["match_detail"]["head_to_head"],
                loading: false
            }))
            .catch(/* do nothing */)
        }
        else {
            this.setState({ loading: false });
        }
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
                    {
                        this.props.qatarHero ?
                        null :
                        <div>
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
                        </div>
                    }
                    
                    {/* TODO: This needs to only render if we have playerId. Otherwise a login button to reveal user page. Also, handle submitted predictions.*/}
                    { 
                        !this.state.loading ? 
                            this.props.adminMode ?
                            <GameSelection
                                gameId={this.state.gameId}
                                onSelectionSet={this.props.onSelection}
                                selectionNumber={this.props.selectionNumber}
                            /> :
                            (
                                this.state.playerId ?
                                <GamePrediction
                                    gameId={this.state.gameId}
                                    playerId={this.state.playerId}
                                    onPredictionSet={this.props.onSelection}
                                    qatarHero={this.props.qatarHero}
                                    matchDay={this.props.matchDay}
                                /> :
                                <button
                                    className="gameprediction-userlogin-button"
                                    onClick={(e) => this.props.onLoginSelect()}
                                >
                                    Login
                                </button>
                            )
                        : null
                    }
                </div>
            )
        )
    }
}

export default GameDetail;
