import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setCurrentUser } from '../../store/session/session.actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { SnackbarProvider, withSnackbar } from 'notistack';
import './style.scss';

class CreateLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newSessionId: 'Загрузка...',
            currentUser: { name: '' }
        };

        this.copySessionId = this.copySessionId.bind(this);
        this.joinLobby = this.joinLobby.bind(this);
        this.changeCurrentUser = this.changeCurrentUser.bind(this);
    }

    componentDidMount() {
        this.props.firebase
            .addSession()
            .then(docRef => this.setState({ newSessionId: docRef.id }))
            .catch(err => {
                console.error(err);
                this.props.enqueueSnackbar(err, { variant: 'error' });
            });
    }

    copySessionId(e) {
        // todo: extract to utils
        const selectText = element => {
            let doc = document,
                textEl = element,
                range,
                selection;
            if (doc.body.createTextRange) {
                //ms
                range = doc.body.createTextRange();
                range.moveToElementText(textEl);
                range.select();
            } else if (window.getSelection) {
                //all others
                selection = window.getSelection();
                range = doc.createRange();
                range.selectNodeContents(textEl);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };

        e.preventDefault();
        const sessionIdEl = document.getElementById('new-session-id');
        selectText(sessionIdEl);
        document.execCommand('copy');
    }

    joinLobby(e) {
        e.preventDefault();
        this.props.firebase
            .updateSession(this.state.newSessionId, {
                admin: this.state.currentUser,
                stage: 0
            })
            .then(() => {
                this.props.dispatch(setCurrentUser(this.state.currentUser));
                this.props.history.push(`/lobby/${this.state.newSessionId}`);
            })
            .catch(err => {
                console.error(err);
                this.props.enqueueSnackbar(err, { variant: 'error' });
            });
    }

    changeCurrentUser(e) {
        this.setState({ currentUser: { name: e.target.value } });
    }

    render() {
        return (
            <Card className="card-layout card-tight">
                <CardContent>
                    <div className="session-creating-layout">
                        <div className="session-generator">
                            <span className="session-generator__key" id="new-session-id">
                                {this.state.newSessionId}
                            </span>
                            <div className="session-generator__action-wrapper">
                                <Button
                                    color="default"
                                    className="session-generator__action-btn"
                                    onClick={this.copySessionId}
                                >
                                    Скопировать
                                </Button>
                            </div>
                        </div>
                        <div className="creating-form">
                            <TextField
                                id="admin-name-input"
                                label="Ваше имя"
                                className="creating-form__field-input"
                                onChange={this.changeCurrentUser}
                                margin="normal"
                            />
                            <div className="creating-form__action-wrapper">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    className="creating-form__action-btn"
                                    disabled={this.state.currentUser.name === ''}
                                    onClick={this.joinLobby}
                                >
                                    Создать
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

CreateLayout.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired
};

const CreatingLayoutWithSnackbar = withSnackbar(CreateLayout);

const IntegrationNotistack = props => {
    return (
        <SnackbarProvider maxSnack={3}>
            <CreatingLayoutWithSnackbar {...props} />
        </SnackbarProvider>
    );
};

export default connect()(IntegrationNotistack);
