import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import './App.css';

import Admin from './components/presentation/Admin.js';
import SuperSix from './components/presentation/SuperSix.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <div className="appmenu">
        {/* <ul>
          <li>
            <Link to="/">Super Six</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul> */}
      </div>
      <Switch>
        <Route exact path="/">
          <SuperSix />
        </Route>
        {/* <Route path="/admin">
          <Admin />
        </Route> */}
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
