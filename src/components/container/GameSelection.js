import React, { Component } from 'react';

import { Requests } from "../requests.js";
import Error from './Error.js';

import '../css/GameSelection.css';

class GameSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selected: false,
            error: null
        };

        this.handleSelectClick = this.handleSelectClick.bind(this);

        this.requests = new Requests();
    }

    fetchSelectionData() {
        if (!this.props.gameId) {
            this.setState({ loading: false });
            return null;
        }

        this.requests.fetch(
            "GETMATCHURL",
            "GET",
            {
                id: this.props.gameId,
            },
            {
                "Content-Type": "application/json"
            },
            null,
            "same-origin"
        )
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({ error: data.message, loading: false })
                return null;
            }

            this.setState({
                selected: data.use_match,
                loading: false
            })
        })
        .catch(e => this.setState({ error: "Something went wrong, please try again later." }))
    }

    componentDidMount() {
        this.fetchSelectionData();
    }

    handleSelectClick(e) {
        if (this.state.selected) {
            this.requests.fetch(
                "DROPMATCHURL", 
                "GET",
                {
                    id: this.props.gameId
                },
                {
                    "Content-Type": "application/json"
                },
                null,
                "same-origin"
            )
            .then(response => response.json())
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message })
                    return null;
                }

                this.setState({ selected: false })
                this.props.onSelectionSet(true);
            })
            .catch(e => {this.setState({ error: e })})
        }
        else {
            this.requests.fetch(
                "ADDMATCHURL", 
                "POST",
                null,
                {
                    "Content-Type": "application/json"
                },
                {
                    id: this.props.gameId,
                    game_number: this.props.selectionNumber == 0 ? 1 : this.props.selectionNumber
                },
                "same-origin"
            )
            .then(response => response.json())
            .then(d => {
                if (d.error) {
                    this.setState({ error: d.message })
                    return null;
                }

                this.setState({ selected: true })
                this.props.onSelectionSet(false);
            })
            .catch(e => {this.setState({ error: e })})
        }
    }

    render () {
        return (
            !this.state.loading && 
            (
                <div className="gameselection-container">
                    <Error
                        error={this.state.error}
                        onAccept={_ => { this.setState({ error: null }) }}
                    />
                    <div className="gameselection-selection">
                        <button
                            className={"gameselection-button" + (this.state.selected ? " active" : "")}
                            onClick={this.handleSelectClick}>
                                { this.state.selected ? "DROP" : "ADD" }
                        </button>
                    </div>
                </div>
            )
        )
    }
}

export default GameSelection;
