import React from 'react';
import storage, { STORAGE_KEYS } from '../../store/storage';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { SnackbarProvider, withSnackbar } from 'notistack';

import './style.scss';

class InitLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyId: '',
            key: ''
        };

        this.createNewSession = this.createNewSession.bind(this);
        this.joinLobby = this.joinLobby.bind(this);
        this.changeLobbyId = this.changeLobbyId.bind(this);
        this.secureAction = this.secureAction.bind(this);
        this.changeKey = this.changeKey.bind(this);
    }

    createNewSession(e) {
        e.preventDefault();
        this.secureAction(() => {
            this.props.history.push('/create');
        });
    }

    joinLobby(e) {
        e.preventDefault();
        this.secureAction(() => {
            this.props.history.push(`/lobby/${this.state.lobbyId}`);
        });
    }

    changeLobbyId(e) {
        this.setState({ lobbyId: e.target.value });
    }

    changeKey(e) {
        this.setState({ key: e.target.value });
    }

    secureAction(action) {
        this.props.firebase.getSecurityKey(this.state.key).then(snapshot => {
            if (snapshot.docs && snapshot.docs.length > 0) {
                const key = snapshot.docs[0].id;
                storage.set(STORAGE_KEYS.securityKey, key);
                action();
            } else {
                this.props.enqueueSnackbar('Неверный ключ безопасности! Спросите его у Krauz`а.', { variant: 'error' });
            }
        });
    }

    render() {
        return (
            <Card className="card-layout card-tight">
                <CardContent>
                    <div>
                        <TextField
                            id="key-input"
                            label="Ключ"
                            className="init-form__field-input"
                            onChange={this.changeKey}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                    <div>
                        <TextField
                            id="init-input"
                            label="Лобби"
                            className="init-form__field-input"
                            onChange={this.changeLobbyId}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                </CardContent>
                <CardActions className="card-actions-panel">
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="init-form__action-btn"
                        onClick={this.createNewSession}
                    >
                        Новая
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="init-form__action-btn"
                        onClick={this.joinLobby}
                    >
                        Присоединиться
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

InitLayout.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired
};

const InitLayoutWithSnackbar = withSnackbar(InitLayout);

const IntegrationNotistack = props => {
    return (
        <SnackbarProvider maxSnack={3}>
            <InitLayoutWithSnackbar {...props} />
        </SnackbarProvider>
    );
};

export default IntegrationNotistack;
