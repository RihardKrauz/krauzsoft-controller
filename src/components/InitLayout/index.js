import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './style.scss';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

class InitLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyId: ''
        };

        this.createNewSession = this.createNewSession.bind(this);
        this.joinLobby = this.joinLobby.bind(this);
        this.changeLobbyId = this.changeLobbyId.bind(this);
    }

    // const handleChange = name => event => {
    //     setValues({ ...values, [name]: event.target.value });
    //   };

    createNewSession(e) {
        e.preventDefault();
        this.props.history.push('/create');
    }

    joinLobby(e) {
        e.preventDefault();
        this.props.history.push(`/lobby/${this.state.lobbyId}`);
    }

    changeLobbyId(e) {
        this.setState({ lobbyId: e.target.value });
    }

    render() {
        return (
            <Card className="card-layout">
                <CardContent>
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

/*
            <div>
                <div className="init-form">
                    <div>
                        <TextField
                            id="lobby-input"
                            label="Лобби"
                            className="init-form__field-input"
                            onChange={this.changeLobbyId}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                    <div className="init-form__actions-panel">
                        <div className="init-form__action-wrapper">
                            <Button
                                variant="outlined"
                                color="secondary"
                                className="init-form__action-btn"
                                onClick={this.createNewSession}
                            >
                                Новая
                            </Button>
                        </div>
                        <div className="init-form__action-wrapper">
                            <Button
                                variant="outlined"
                                color="primary"
                                className="init-form__action-btn"
                                onClick={this.joinLobby}
                            >
                                Присоединиться
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

*/

export default InitLayout;
