import React, { Component } from 'react';

class Predictions extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const rows = this.props.data.map((match, i) => {
            return (
                <tr key={i}>
                    {match.home_team} - {match.away_team} ({match.prediction[0].toUpperCase() + match.prediction.slice(1)})
                </tr>
            )
        });

        return (
            <div>
                <div>
                {
                    this.props.reveal && 
                    <table>
                        <tbody>{rows}</tbody>
                    </table>
                }
                </div>
            </div>
        )
    }
};

export default Predictions;
