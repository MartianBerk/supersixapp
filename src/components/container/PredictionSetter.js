import React, { Component } from 'react';

// import '../css/Games.css';

class PredictionSetter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            round: null,
            player: null,
            predictions: [],
            players: [],
            games: []
        };

        this.handlePredictionSelect = this.handlePredictionSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePlayerSelect = this.handlePlayerSelect.bind(this);
    }

    getMatches(matchDate) {
        // TODO: include ID and selected in web API response
        matchDate = new Date(matchDate);
        matchDate = `${matchDate.getDate()}-${matchDate.getMonth() + 1}-${matchDate.getFullYear()}`

        fetch("http://192.168.0.12:5000/supersix/admin/listmatches?matchDate=" + matchDate)
        .then(response => response.json())
        .then(data => this.setState({ games: data.matches.reduce((r, d) => {
            if (d.use_match) {
                r.push(d);
            }
            return r
        }, [])}))
        .catch(/* do nothing */);
    }

    getRound() {
        fetch("http://192.168.0.12:5000/supersix/admin/getround")
        .then(response => response.json())
        .then(data => this.setState({ round: data.id}))
        .catch(/* do nothing */)
    }

    getPlayers() {
        var players = [];

        fetch("http://192.168.0.12:5000/supersix/admin/listplayers")
        .then(response => response.json())
        .then(data => data.players.forEach(player => {
            players.push({ id: player.id, name: (player.first_name + " " + player.last_name) });
        }))
        .then(this.setState({ players: players}))
        .catch(/* do nothing */)
    }

    loadData(matchDate) {
        this.getRound();
        this.getPlayers();
        this.getMatches(matchDate);
    }

    formatMatchDate(matchDate) {
        let d = new Date(matchDate);

        let hours = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();

        return `${hours}:${minutes}`;
    }

    handlePredictionSelect(event) {
        const index = event.target.id.split("-")[0];
        const matchId = parseInt(document.getElementById((index + "-id")).value);

        if (event.target.value) {
            if (this.state.predictions.length === 6) {
                alert("Already selected six games");
                event.target.value = null;
            }
            else {
                this.state.predictions.push({ id: matchId, prediction: event.target.value });
            }
        }
        else {
            let index = null;
            for (var i = 0; i <= this.state.predictions.length; i++) {
                if (this.state.predictions[i].id === matchId) {
                    index = i;
                    break;
                }
            }

            this.state.predictions.splice(index, 1);
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.predictions.length != 6) {
            alert("Must submit six predictions");
            return false;
        }

        fetch("http://192.168.0.12:5000/supersix/admin/addpredictions", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.state.predictions.map(p => {
                return {
                    match_id: p.id,
                    player_id: this.state.player,
                    prediction: p.prediction,
                    round_id: this.state.round
                }
            }))
        })
        .then();
    }

    handlePlayerSelect(e) {
        this.setState({ 
            predictions: [], 
            player: e.target.value
        });

        document.getElementsByName("prediction").forEach(e => {
            e.value = null;
        });
    }

    render () {
        var predictionsForm = this.state.games.map((game, index) => {
            return (
                <form key={index} className="matchform">
                    
                    <input id={index + "-id"} name="id" type="text" value={game.id} hidden />
                    <input name="fixture" type="text" value={game.home_team + " Vs " + game.away_team} disabled />
                    <input name="date" type="text" value={"(" + this.formatMatchDate(game.match_date) + ")"} disabled />
                    <select id={index + "-prediction" } name="prediction" onChange={this.handlePredictionSelect}>
                        <option value=""></option>
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                        <option value="draw">Draw</option>
                        <option value="void">--VOID--</option>
                    </select>
                </form>
            )
        });

        var playerField = (
            <select name="players" onChange={this.handlePlayerSelect}> 
                <option value=""></option>
                { 
                    this.state.players.map(player => {
                        return (
                            <option value={player.id}>{player.name}</option>
                        )
                    })
                }
            </select>  
        )

        return (
            <div className="predictionsetter">
                Match Date: 
                <input
                    type="date"
                    onChange={(e) => { this.loadData(e.target.value) }}
                />
                {this.state.games.length > 0 && <p>Player: {playerField}</p>}
                {
                    this.state.games.length > 0 &&
                    predictionsForm
                }
                {
                    this.state.games.length > 0 &&
                    <button onClick={ this.handleSubmit }>Submit</button>
                }
            </div>
        )
    }
}

export default PredictionSetter;
