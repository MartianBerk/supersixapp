import React, { Component } from 'react';

// import '../css/Games.css';

class Players extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            newPlayer: {}
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getPlayers() {
        fetch("http://192.168.0.55/webapis/supersix/admin/listplayers")
        .then(response => response.json())
        .then(data => data.players.forEach(player => {
            // this allows for effective updating of a states array and rerendering
            this.setState((oldState) => {
                let newPlayers = [...oldState.players];

                let found = false;
                for(var i = 0; i < newPlayers.length; i++) {
                    if(newPlayers[i] && newPlayers[i].id === player.id) {
                        found = true;
                        break
                    }
                }

                if(!found) {
                    newPlayers.push({ id: player.id, name: (player.first_name + " " + player.last_name) });
                }
                
                return {players: newPlayers};
            });
        }))
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.getPlayers();
    }

    handleInput(event) {
        let newPlayer = this.state.newPlayer;

        switch(event.target.id) {
            case "firstname": newPlayer.first_name = event.target.value; break;
            case "lastname": newPlayer.last_name = event.target.value; break;
        };

        this.setState({newPlayer: newPlayer});
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.newPlayer.first_name || !this.state.newPlayer.last_name) {
            alert("Ensure all player fields have been filled.");
            return false;
        }

        fetch("http://192.168.0.55/webapis/supersix/admin/addplayer", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.state.newPlayer)
        })
        .then(this.getPlayers());
    }

    render () {
        const players = this.state.players.map((player, index) => {
            return (
                <form key={index}>
                    <input id={index + "-id"} name="id" type="text" value={player.id} hidden />
                    <input name="name" type="text" value={player.name} disabled />
                </form>
            )
        }) || [];

        return (
            <div className="players">
                <div className="new-player">
                    First Name: <input type="text" id="firstname" onBlur={this.handleInput} />
                    <br />
                    Last Name: <input type="text" id="lastname" onBlur={this.handleInput} />
                    <br />
                    <button onClick={ this.handleSubmit }>Submit</button>
                </div>
                <div className="current-players">
                    {this.state.players.length > 0 && players}
                </div>
            </div>
        )
    }
}

export default Players;
