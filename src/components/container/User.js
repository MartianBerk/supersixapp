import React, { Component } from 'react';

import * as Constants from "../constants.js";
import Error from './Error.js';
import UserLogin from './UserLogin.js';

import '../css/User.css';

class User extends Component {
    constructor(props) {
        super(props);

        let nickname = null;
        if (props.userData.firstname && props.userData.lastname) {
            if (props.playerMeta && props.playerMeta[`${props.userData.firstname} ${props.userData.lastname}`] !== undefined) {
                nickname = props.playerMeta[`${props.userData.firstname} ${props.userData.lastname}`]
            }
        }

        this.state = {
            playerMeta: props.playerMeta,
            isLoggedIn: props.isLoggedIn,
            newUser: props.newUser,
            userId: props.userData.userId,
            email: props.userData.email,
            firstname: props.userData.firstname,
            lastname: props.userData.lastname,
            nickname: nickname,
            activeChanges: false,
            error: null
        };

        this.submitChanges = this.submitChanges.bind(this);
        this.logout = this.logout.bind(this);
    }

    submitChanges(e) {
        // Do I need to add credentials here? If so, will need to in Add Prediction also.
        fetch(Constants.UPDATEDETAILSURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email
            })
        })
        .then(response => response.json())
        .then(data => this.setState({
            email: data.email,
            activeChanges: false
        }))
        .catch(e => {
            this.setState({ error: "Something went wrong.\nPlease try again later." })
        })
    }

    logout(e) {
        fetch(Constants.LOGOUTURL)
        .then(response => response.json())
        .then(data => {
            if (!data.is_logged_in) {
                this.setState({
                    isLoggedIn: false,
                    newUser: false,
                    userId: null,
                    email: null,
                    firstname: null,
                    lastname: null,
                    nickname: null,
                })

                this.props.onLogoutSuccess()
            }
        })
        .catch(e => {
            this.setState({ error: "Something went wrong.\nPlease try again later." })
        })
    }

    render () {
        return (
            <div className="userprofile-container">
                <Error 
                    error={this.state.error}
                    onAccept={_ => { this.setState({ error: null }) }}
                />
                <div className="user-profile">
                    {
                        !this.state.isLoggedIn ? 
                        <UserLogin
                            loggedIn={ this.props.isLoggedIn }
                            newUser={ this.props.newUser }
                            onSuccess={ 
                                (d) => {
                                    let data = {...d};

                                    let { is_logged_in, new_user, ...userData } = data;
                                    let isLoggedIn = data.is_logged_in || false;
                                    let newUser = data.new_user || false;

                                    // Ensure error here is handled (if no cookie set or cookie uid is invalid)
                                    if (data.error) {
                                        userData = {};
                                    }

                                    let nickname = null;
                                    if (userData.firstname && userData.lastname) {
                                        if (this.state.playerMeta && this.state.playerMeta[`${userData.firstname} ${userData.lastname}`] !== undefined) {
                                            nickname = this.state.playerMeta[`${userData.firstname} ${userData.lastname}`]
                                        }
                                    }

                                    this.setState({
                                        isLoggedIn: isLoggedIn,
                                        newUser: newUser,
                                        playerId: userData.player_id,
                                        userId: userData.user_id,
                                        email: userData.email,
                                        firstname: userData.firstname,
                                        lastname: userData.lastname,
                                        nickname: nickname
                                    })

                                    this.props.onLoginSuccess(d)
                                }
                            }
                        /> :
                        <div className="userprofile-container">
                            <p>{ this.state.userId.toUpperCase() }</p>
                            <p>
                                <input
                                    class="userprofile-submit"
                                    type="submit"
                                    value="Logout"
                                    onClick={this.logout} />
                            </p>
                            <p>
                                Email
                                <br />
                                <input
                                    type="email"
                                    value={ this.state.email }
                                    onChange={e => {
                                        if (this.state.email !== e.target.value) {
                                            this.setState({ email: e.target.value, activeChanges: true })
                                        }
                                    }}
                                />
                            </p>
                            <p>
                                First Name
                                <br />
                                <input
                                    type="text"
                                    value={ this.state.firstname }
                                    onChange={e => {
                                        if (this.state.firstname !== e.target.value) {
                                            this.setState({ firstname: e.target.value, activeChanges: true })
                                        }
                                    }}
                                />
                            </p>
                            <p>
                                Last Name
                                <br />
                                <input
                                    type="text"
                                    value={ this.state.lastname }
                                    onChange={e => {
                                        if (this.state.lastname !== e.target.value) {
                                            this.setState({ lastname: e.target.value, activeChanges: true })
                                        }
                                    }}
                                />
                            </p>
                            <p>
                                Nickname
                                <br />
                                <input
                                    type="text"
                                    value={ this.state.nickname }
                                    onChange={e => {
                                        if (this.state.nickname !== e.target.value) {
                                            this.setState({ nickname: e.target.value, activeChanges: true })
                                        }
                                    }}
                                />
                            </p>
                            {
                                this.state.activeChanges ? 
                                <p>
                                    <input
                                        class="userprofile-submit"
                                        type="submit"
                                        value="Update"
                                        onClick={this.submitChanges} />
                                </p>
                                :
                                null
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default User;
