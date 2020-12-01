import '../css/Head.css';


import React, { Component } from 'react';

class Head extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            jackpot: 0,
            time: Date.now()
        };
    }

    fetchCurrentRound() {
        fetch("./current_round.json")
        .then(response => response.json())
        .then(data => this.setState({
            jackpot: data.current_round.jackpot,
            start_date: data.current_round.start_date,
            next_date: data.current_round.current_match_date,
            rounds: data.current_round.matches
        }))
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.fetchCurrentRound();
    }

    formatDate(date, inc_time) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        date = new Date(date);

        const year = date.getFullYear().toString();
        const month = date.getMonth().toString();
        const day = date.getDate().toString();

        const hours = date.getHours();
        const mins = "0" + date.getMinutes();
        const secs = "0" + date.getSeconds();

        date = day.substr(-2) + " " + months[month.substr(-2)] + " " + year.substr();
        if (inc_time === undefined) {
            return date;
        }

        return date + " " + hours + ":" + mins.substr(-2) + ":" + secs.substr(-2);
    }

    render () {
        return (
            <div className="head">
                <div className="round">
                    <h2>Rounds</h2>
                    <h3>{ this.state.rounds }</h3>
                </div>
                <div className="logo">
                    <img id="supersix-logo" src='logo.png' height='60' width='70' /> 
                </div>
                <div className="jackpot">
                    <h2>Jackpot</h2>
                    <h3>£{this.state.jackpot / 100}</h3>
                </div>
            </div>
        )
    }
}

export default Head;
