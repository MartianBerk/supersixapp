import React, { Component } from 'react';

// import '../css/Games.css';

class Round extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roundDate: null,
            buyInPence: 200
        };

        this.setDate = this.setDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setDate(event) {
        let roundDate = new Date(event.target.value);
        roundDate = `${roundDate.getDate()}-${roundDate.getMonth() + 1}-${roundDate.getFullYear()}`
        
        this.setState({ roundDate: roundDate });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.roundDate) {
            alert("Start date not selected.");
            return false;
        }

        fetch("http://192.168.0.55/webapis/supersix/admin/addround",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "start_date": this.state.roundDate,
                "buy_in": this.state.buyInPence
            })
        })
        .then();
    }

    render () {
        // TODO: existing round and close round.

        return (
            <div className="round">
                <div className="new-round">
                    Start Date:
                    <input
                        type="date"
                        onChange={(e) => { this.setDate(e) }}
                    />
                    {
                        <button onClick={this.handleSubmit}>Submit</button>
                    }
                </div>
            </div>
        )
    }
}

export default Round;
