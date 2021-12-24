import React, { Component } from 'react';

import * as Constants from "../constants.js";
import Error from './Error.js';

import '../css/UserLogin.css';

class UserLogin extends Component {
    EMAIL_REGEX = new RegExp(''
        + /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")/.source
        + /@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g.source
    );
    PWD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]{8,}$/;

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
            isLoggedIn: props.isLoggedIn,
            newUser: props.newUser || false,
            validUser: false,
            error: null
        };

        this.checkUser = this.checkUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    checkUser(e) {
        if (!this.state.username) {
            this.setState({ error: "Enter username." })
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
                identity_value: this.state.username.toLowerCase()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            }

            return data
        })
        .then(data => this.setState({
            isLoggedIn: data.is_logged_in,
            newUser: data.new_user,
            validUser: data.error ? false : true
        }))
        .then(_ => {
            if (!this.state.validUser) {
                this.setState({ error: "Invalid user." })
            }
        })
        .catch(e => this.setState({ error: "Something went wrong.\nPlease try again later." }))
    }

    loginUser(e) {
        // TODO: Error Messages
        if (!this.state.username || !this.state.password) {
            this.setState({ error: "Incomplete form" })
            return null
        }

        if (this.state.newUser && !this.state.confirmPassword) {
            this.setState({ error: "Please confirm password." })
            return null
        }

        if (this.state.newUser && !this.state.password.match(this.PWD_COMPLEXITY)) {
            this.setState({ error: "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter and one number." })
            return null
        }

        if (this.state.newUser && this.state.password !== this.state.confirmPassword) {
            this.setState({ error: "Passwords do not match." })
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
                identity_value: this.state.username.toLowerCase(),
                password: this.state.password,
                is_first: this.state.newUser
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            }

            return data
        })
        .then(data => {
            this.setState({
                isLoggedIn: data.is_logged_in,
                newUser: data.new_user
            });

            return data;
        })
        .then(data => {
            if (!data.is_logged_in) {
                this.setState({ error: "Invalid username or password." })
            }
            else if (this.props.onSuccess) {
                this.props.onSuccess(data);
            }
        })
        .catch(e => this.setState({ error: "Something went wrong.\nPlease try again later." }))
    }

    forgotPassword(e) {
        const identityType = this.state.username.match(this.EMAIL_REGEX) ? "email" : "user_id";

        fetch(Constants.FORGOTPASSWORDURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                identity_type: identityType,
                identity_value: this.state.username.toLowerCase()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            }
            else {
                this.setState({error: "Password reset email sent."});
            }
        })
        .catch(e => this.setState({ error: "Something went wrong.\nPlease try again later." }))
    }

    render () {
        return (
            <div className="userlogin-container">
                <Error 
                    error={this.state.error}
                    onAccept={_ => { this.setState({ error: null }) }}
                />
                <p>
                    User ID / Email
                    <br />
                    <input
                        className="userlogin-input"
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
                            className={"userlogin-input userlogin-password" + (
                                this.state.newUser &&
                                this.state.password
                                ?
                                this.state.password.match(this.PWD_COMPLEXITY)
                                ? " valid" : " invalid"
                                : ""
                            )}
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
                            className={"userlogin-input userlogin-password" + (
                                this.state.newUser &&
                                this.state.confirmPassword
                                ?
                                this.state.confirmPassword === this.state.password &&
                                this.state.confirmPassword.match(this.PWD_COMPLEXITY)
                                ? " valid" : " invalid"
                                : ""
                            )}
                            type="password"
                            onChange={e => {
                                this.setState({ confirmPassword: e.target.value })
                            }}
                        />
                    </p> 
                    : null
                }
                <p>
                    <input
                        className="userlogin-input userlogin-submit"
                        type="submit"
                        value={this.state.validUser ? "Login" : "Check"}
                        onClick={this.state.validUser ? this.loginUser : this.checkUser}
                    />
                </p>
                {
                    this.state.validUser ?
                    <p>
                        <input
                            className="userlogin-input userlogin-resetpwd"
                            type="submit"
                            value="Forgot Password"
                            onClick={this.forgotPassword}
                        />
                    </p>
                    : null
                }
            </div>
        )
    }
}

export default UserLogin;
