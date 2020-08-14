import React, { Component } from 'react';
import '../css/Predictions.css';

class Predictions extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const rows = this.props.data.map((match, i) => {
            return (
                <tr key={i}>
                    <td className={match.prediction === 'home' ? 'pick' : ''}>{match.home_team}</td>
                    <td>Vs</td>
                    <td className={match.prediction === 'away' ? 'pick' : ''}>{match.away_team}</td>
                    <td>{match.correct ? <img src='tick.png' height='25' width='25' /> : ''}</td>
                </tr>
            )
        });

        return (
            this.props.reveal && 
            <div className="predictions">
                <table className="predictionstable">
                    <tbody>{rows}</tbody>
                </table>
            </div>
        )
    }
};

export default Predictions;
