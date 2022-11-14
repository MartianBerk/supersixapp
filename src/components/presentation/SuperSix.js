import React, { Component } from 'react';

import Head from "../container/Head.js";
import SuperSixAdmin from './SuperSixAdmin.js';
import SuperSixGame from './SuperSixGame.js';

import '../css/SuperSix.css';

class SuperSix extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: null, playerId: null, meta: null, adminMode: false, qatarHero: false };
    }

    render () {
        return (
            <div className="supersix-container">
                <Head
                    userId={this.state.userId}
                    setAdmin={(adminMode) => {
                        this.setState({ adminMode: adminMode });
                    }}
                    qatarHero={this.state.qatarHero}
                />
                {
                    this.state.adminMode ?
                    <SuperSixAdmin
                        meta={this.state.meta}
                        userId={this.state.userId}
                        playerId={this.state.playerId}
                        onLogoutSuccess={() => {
                            this.setState({ userId: null, adminMode: false });
                        }}
                    />
                    :
                    <SuperSixGame
                        onLoginSuccess={(userId, playerId, meta) => {
                            this.setState({ userId: userId, playerId: playerId, meta: meta });
                        }}
                        onLogoutSuccess={() => {
                            this.setState({ userId: null, adminMode: false });
                        }}
                        onQatarHero={() => {
                            this.setState({ qatarHero: !this.state.qatarHero });
                        }}
                    />
                }
            </div>
        )
    }
}

export default SuperSix;
