import React, { Component } from 'react';

// import '../css/Games.css';

class MatchPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            selected: []
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getMatches(matchDate) {
        // TODO: include ID and selected in web API response
        matchDate = new Date(matchDate);
        matchDate = `${matchDate.getDate()}-${matchDate.getMonth() + 1}-${matchDate.getFullYear()}`
        
        fetch("http://192.168.0.55/webapis/supersix/admin/listmatches?matchDate=" + matchDate)
        .then(response => response.json())
        .then(data => this.setState({ games: data.matches, selected: data.matches.reduce((r, d) => {
            if (d.selected) {
                r.push(d.id);
            }
            return r
        }, [])}))
        .catch(/* do nothing */);
    }

    formatMatchDate(matchDate) {
        let d = new Date(matchDate);

        let hours = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
        let minutes = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();

        return `${hours}:${minutes}`;
    }

    handleSelect(event) {
        const index = event.target.id.split("-")[0];
        const matchId = parseInt(document.getElementById((index + "-id")).value);
        
        if (event.target.checked) {
            if (this.state.selected.length === 6) {
                alert("Already selected six games");
                event.target.checked = false;
            }
            else {
                this.state.selected.push(matchId);
            }
        }
        else {
            const index = this.state.selected.indexOf(matchId);
            this.state.selected.splice(index, 1);
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.selected.length != 6) {
            alert("Must select six matches");
            return false;
        }

        fetch("http://192.168.0.55/webapis/supersix/admin/addmatches",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"ids": this.state.selected})
        })
        .then();
    }

    render () {
        var gamesForm = this.state.games.map((game, index) => {
            return (
                <form key={index} className="matchform">
                    <input id={index + "-id"} name="id" type="text" value={game.id} hidden />
                    <input name="fixture" type="text" value={game.home_team + " Vs " + game.away_team} disabled />
                    <input name="date" type="text" value={"(" + this.formatMatchDate(game.match_date) + ")"} disabled />
                    <input id={index + "-select" } name="select" type="checkbox" onClick={this.handleSelect} defaultChecked={this.state.selected.indexOf(game.id) > -1} />
                </form>
            )
        });

        return (
            <div className="matchpicker">
                Match Date:
                <input
                    type="date"
                    onChange={(e) => { this.getMatches(e.target.value) }}
                />
                {
                    this.state.games.length > 0 &&
                    gamesForm
                }
                {
                    this.state.games.length > 0 &&
                    <button onClick={this.handleSubmit}>Submit</button>
                }
            </div>
        )
    }
}

export default MatchPicker;
