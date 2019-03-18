import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import InitLayout from '../init-layout/InitLayout';
import CreateLayout from '../create-layout/CreateLayout';
import LobbyLayout from '../lobby-layout/LobbyLayout';
import GameLayout from '../game-layout/GameLayout';

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
                        <Route path="/game/:id" component={GameLayout} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
