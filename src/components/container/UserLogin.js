import React, { Component } from 'react';

import * as Constants from "../constants.js";

import '../css/UserLogin.css';

class UserLogin extends Component {
    EMAIL_REGEX = new RegExp(''
        + /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")/.source
        + /@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.source
    );

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
            isLoggedIn: props.isLoggedIn,
            newUser: props.newUser || false,
            validUser: props.validUser || props.newUser || false
        };

        this.checkUser = this.checkUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    checkUser(e) {
        if (!this.state.username) {
            return null
        }

        const identityType = this.state.username.match(this.EMAIL_REGEX) ? "email" : "user_id";

        fetch(Constants.LOGGEDINURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identity_type: identityType,
                identity_value: this.state.username
            })
        })
        .then(response => response.json())
        .then(data => this.setState({
            isLoggedIn: data.is_logged_in,
            newUser: data.new_user,
            validUser: data.error ? false : true
        }))
        .catch(/* do nothing */)
    }

    loginUser(e) {
        // TODO: Error Messages
        if (!this.state.username || !this.state.password) {
            return null
        }

        if (this.state.newUser && !this.state.confirmPassword) {
            return null
        }

        if (this.state.newUser && this.state.password !== this.state.confirmPassword) {
            return null
        }

        const identityType = this.state.username.match(this.EMAIL_REGEX) ? "email" : "user_id";

        fetch(Constants.LOGINURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                identity_type: identityType,
                identity_value: this.state.username,
                password: this.state.password,
                is_first: this.state.newUser
            })
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                isLoggedIn: data.is_logged_in,
                newUser: data.new_user,
                validUser: data.error ? false : true
            });

            return data;
        })
        .then(data => {
            if (this.props.onSuccess) {
                this.props.onSuccess(data);
            }
        })
        .catch(/* do nothing */)
    }

    render () {
        return (
            <div className="userlogin-container">
                <p>
                    User ID / Email
                    <br />
                    <input
                        type="text" 
                        onChange={e => {this.setState({ username: e.target.value })}}
                    />
                </p>
                {
                    this.state.validUser ? 
                    <p>
                        Password
                        <br />
                        <input
                            type="password"
                            onChange={e => {this.setState({ password: e.target.value })}}
                        />
                    </p> 
                    : null
                }
                {
                    this.state.newUser ? 
                    <p>
                        Confirm Password
                        <br />
                        <input
                            type="password"
                            onChange={e => {this.setState({ confirmPassword: e.target.value })}}
                        />
                    </p> 
                    : null
                }
                <p>
                    <input
                        class="userlogin-submit"
                        type="submit"
                        value={this.state.validUser ? "Login" : "Check"}
                        onClick={this.state.validUser ? this.loginUser : this.checkUser} />
                </p>
            </div>
        )
    }
}

export default UserLogin;
