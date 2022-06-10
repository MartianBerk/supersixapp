import React, { Component } from 'react';

import Head from "../container/Head.js";
import SuperSixAdmin from './SuperSixAdmin.js';
import SuperSixGame from './SuperSixGame.js';

import '../css/SuperSix.css';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: null, adminMode: false };
    }

    render () {
        return (
            <div className="supersix-container">
                <Head
                    userId={this.state.userId}
                    setAdmin={(adminMode) => {
                        this.setState({ adminMode: adminMode });
                    }}
                />
                {
                    this.state.adminMode ?
                    <SuperSixAdmin
                        userId={this.state.userId}
                        onLogoutSuccess={() => {
                            this.setState({ userId: null, adminMode: false });
                        }}
                    />
                    :
                    <SuperSixGame
                        onLoginSuccess={(userId) => {
                            this.setState({ userId: userId });
                        }}
                        onLogoutSuccess={() => {
                            this.setState({ userId: null, adminMode: false });
                        }}
                    />
                }
            </div>
        )
    }
}

export default SuperSix;
