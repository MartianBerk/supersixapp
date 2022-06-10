import React, { Component } from 'react';

import { Requests } from "../requests.js";

import '../css/Head.css';

class Head extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            jackpot: 0,
            time: Date.now(),
            startDate: null,
            nextDate: null,
            rounds: null,
            specialMessage: null,
            userId: props.userId,
            adminMode: false
        };

        this.requests = new Requests()

        this.handleLogoClick = this.handleLogoClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        // If a login has been performed and the props userId updated, update state
        if (this.props.userId !== prevProps.userId) {
            this.setState({ userId: this.props.userId });
        }
    }

    isSpecialEvent() {
        let date = null;
        if (this.state.nextDate) {
            date = new Date(this.state.nextDate);
        }
        
        this.requests.fetch("SPECIALMESSAGEURL")
        .then(response => response.json())
        .then(data => {
            if (!data.message && date) {
                this.requests.fetch(
                    "BANKHOLIDAYSURL",
                    "GET",
                    null,
                    null,
                    null,
                    "undefined"
                )
                .then(response => response.json())
                .then(data => {
                    const events = data["england-and-wales"]["events"] || [];
   
                    const year = date.getFullYear().toString();

                    let month = (date.getMonth() + 1).toString();
                    month = month >= 10 ? month : "0" + month;

                    let day = date.getDate().toString();
                    day = day >= 10 ? day : "0" + day;

                    const dateString = `${year}-${month}-${day}`;

                    for(var i = 0; i < events.length; i++) {
                        if (events[i].date === dateString) {
                            this.setState({ specialMessage: "Bank Holiday Bonanza" })
                            return null;
                        }
                    }
                })
                .then(_ => {
                    if (!this.state.specialMessage && [0, 6].indexOf(date.getDay()) === -1) {
                        this.setState({ specialMessage: "Midweek Madness" })
                        return null;
                    } 
                })
                .catch(/* do nothing */)
            }
            else {
                this.setState({ specialMessage: data.message });
            }
        })

        return null;
    }

    getData() {
        this.requests.fetch("CURRENTROUNDURL")
        .then(response => response.json())
        .then(data => this.setState({
            jackpot: data.current_round.jackpot,
            startDate: data.current_round.start_date,
            nextDate: data.current_round.current_match_date,
            rounds: data.current_round.matches
        }, () => {
            // special event check after round loaded
            this.isSpecialEvent()
        }))
        .catch(/* do nothing */)
    }

    componentDidMount() {
        this.getData();
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

    handleLogoClick(e) {
        if (this.state.userId) {
            this.requests.fetch(
                "CHECKPERMISSIONURL",
                null,
                {
                    "permission": "ADMIN"
                },
                {
                    "Content-Type": "application/json"
                },
                null,
                "same-origin"
            )
            .then(response => response.json())
            .then(data => {
                if (data.ADMIN) {
                    let adminMode = !this.state.adminMode;

                    this.setState({ adminMode: adminMode });
                    this.props.setAdmin(adminMode);
                }
                else {
                    this.setState({ adminMode: false })
                    this.props.setAdmin(false);
                }
            })
        }
        else {
            this.setState({ adminMode: false });
            this.props.setAdmin(false);
        }
    }

    render () {
        return (
            <div className="head">
                <div className="head-main">
                    <div className="round">
                        <h2>Rounds</h2>
                        <h3>{ this.state.rounds || 0 }</h3>
                    </div>
                    <div className="logo">
                        <img id="supersix-logo" src={this.state.adminMode ? 'logo-admin.png' : 'logo.png'} height='70' width='80' onClick={this.handleLogoClick} />
                        <div className="banner-text admin">{this.state.adminMode ? 'ADMIN Mode' : this.state.specialMessage}</div>
                    </div>
                    <div className="jackpot">
                        <h2>Jackpot</h2>
                        <h3>£{this.state.jackpot / 100}</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default Head;
