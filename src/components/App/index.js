import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import './style.css';

import InitLayout from '../InitLayout';
import CreateLayout from '../CreateLayout';
import LobbyLayout from '../LobbyLayout';
import GameLayout from '../GameLayout';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withFirebaseContext } from '../../firebase';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" color="inherit">
                                Krauzsoft :: Controller
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                    <BrowserRouter>
                        <Switch>
                            <Redirect exact from="/" to="init" />
                            <Route path="/init" component={withFirebaseContext(InitLayout)} />
                            <ProtectedRoute path="/create" component={withFirebaseContext(CreateLayout)} />
                            <ProtectedRoute path="/lobby/:id" component={withFirebaseContext(LobbyLayout)} />
                            <ProtectedRoute path="/game/:id" component={withFirebaseContext(GameLayout)} />
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

export default App;
