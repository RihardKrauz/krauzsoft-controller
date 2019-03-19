import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './style.css';

import InitLayout from '../InitLayout';
import CreateLayout from '../CreateLayout';
import LobbyLayout from '../LobbyLayout';
import GameLayout from '../GameLayout';

import { withFirebaseContext } from '../../firebase';

class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Redirect exact from="/" to="init" />
                        <Route path="/init" component={InitLayout} />
                        <Route path="/create" component={withFirebaseContext(CreateLayout)} />
                        <Route path="/lobby/:id" component={withFirebaseContext(LobbyLayout)} />
                        <Route path="/game/:id" component={withFirebaseContext(GameLayout)} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
