import React, { Component } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from 'react-router-dom';

import MatchPicker from '../container/MatchPicker.js';

class Admin extends Component {
    render () {
        return (
            <div className="admin">
                <BrowserRouter>
                <div className="adminmenu">
                    <ul>
                        <li>
                            <Link to="/admin/matches">Matches</Link>
                        </li>
                        <li>
                            <Link to="/admin/predictions">Predictions</Link>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route path="/admin/matches">
                        <MatchPicker />
                    </Route>
                    <Route path="/admin/predictions">
                        Predictions Go Here...
                    </Route>
                </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Admin;
