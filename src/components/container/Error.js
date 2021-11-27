import React, { Component } from 'react';

import '../css/Error.css';

class Error extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: props.error,
            accept: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            this.setState({ error: this.props.error, accept: false })
        }
    }

    render() {
        return (
            <div className={"error-container" + (this.state.error ? "-active" : "")}>
                <div className="error-box">
                    <p>{this.state.error}</p>
                    <br />
                    <button
                        className="error-button"
                        onClick={e => {
                            this.setState({ error: null, accept: true })
                            this.props.onAccept()
                        }}>
                        OK
                    </button>
                </div>
            </div>
        )
    }
}

export default Error;
