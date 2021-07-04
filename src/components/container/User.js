import React, { Component } from 'react';

import * as Constants from "../constants.js";

import '../css/User.css';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: props.isLoggedIn,
            newUser: false,
            userData: props.userData
        };
    }

    checkLoggedIn() {

    }

    checkUser(e) {

    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    renderUserLogin() {
        return (
            // TODO: this will need to redirect to homepage if successful
            <form action={Constants.LOGINURL + "?application=superiorsix"} method="POST">
                <input type="text" onChange={this.checkUser} value="User ID" />
                <br />
                <input type="password" value="Password" />
                <br />
                {this.state.newUser && <input type="password" /> && <br />}
                <br />
                <input type="Submit" value={this.state.newUser ? "Register" : "Login"} />
            </form>
        )
    }

    renderUserProfile() {
        return (
            <p>User Profile</p>
        )
    }

    render () {
        return (
            <div className="usercontainer">
                <div className="user-profile">
                    { this.state.isLoggedIn ? this.renderUserProfile() : this.renderUserLogin() }
                </div>
            </div>
        )
    }
}

export default User;
