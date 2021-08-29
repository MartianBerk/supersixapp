import React, { Component } from 'react';

import * as Constants from "../constants.js";

import '../css/User.css';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: props.isLoggedIn,
            newUser: false,
            userData: props.userData,
            validUser: props.isLoggedIn,
            newUser: !props.isLoggedIn
        };

        this.checkUser = this.checkUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    checkLoggedIn() {

    }

    checkUser(e) {
        this.setState({ validUser: true })
    }

    loginUser(e) {

    }

    renderUserLogin() {
        return (
            // TODO: this will need to redirect to homepage if successful
            <div className="userprofile-login">
                <p>
                    User ID / Email
                    <br />
                    <input type="text" />
                </p>
                {this.state.validUser ? <p>
                                            Password
                                            <br />
                                            <input type="password" value="Password" />
                                        </p> 
                                      : null}
                <p><input type="submit" value={this.state.validUser ? "Login" : "Check"} onClick={this.state.validUser ? this.loginUser : this.checkUser} /> </p>
            </div>
        )
    }

    renderUserProfile() {
        return (
            <div className="userprofile-profile">
                User Profile
            </div>
        )
    }

    render () {
        return (
            <div className="userprofile-container">
                <div className="user-profile">
                    { this.state.isLoggedIn ? this.renderUserProfile() : this.renderUserLogin() }
                </div>
            </div>
        )
    }
}

export default User;
