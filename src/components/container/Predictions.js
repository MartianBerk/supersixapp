import React, { Component } from 'react';
import '../css/Predictions.css';

class Predictions extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const rows = this.props.data.map((match, i) => {
            return (
                <div key={i}>
                    <p className="prediction">
                        <span className={"prediction-section prediction-hometeam" + (match.prediction === 'home' ? ' pick' : '')}>{match.home_team}</span>
                        <span className="prediction-section versus">Vs</span>
                        <span className={"prediction-section prediction-awayteam" + (match.prediction === 'away' ? ' pick' : '')}>{match.away_team}</span>
                        <span className="prediction-section">{match.correct ? <img src='tick.png' height='25' width='25' /> : ''}</span>
                    </p>
                </div>
            )
        });

        return (
            <div className="predictions">
                {rows}
            </div> 
        )
    }
};

export default Predictions;
