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
        .then(data => this.setState({jackpot: data.current_round.jackpot}))
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.fetchCurrentRound();
        this.dateInterval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    render () {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date = new Date(this.state.time);

        var year = date.getFullYear().toString();
        var month = date.getMonth().toString();
        var day = date.getDate().toString();

        var hours = date.getHours();
        var mins = "0" + date.getMinutes();
        var secs = "0" + date.getSeconds();

        return (
            <div className="head">
                <div className="time">
                    <h2>{ day.substr(-2) + " " + months[month.substr(-2)] + " " + year.substr() }</h2>
                    <h3>{ hours + ":" + mins.substr(-2) + ":" + secs.substr(-2)}</h3>
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
