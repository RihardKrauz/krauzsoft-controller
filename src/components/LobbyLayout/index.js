import React from 'react';
import PropTypes from 'prop-types';
import UserCreatingForm, { TEAM_KEYS } from './UserCreatingForm';
import TeamMemberList from './TeamMemberList';
import UserOperationForm from './UserOperationForm';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/session/session.actions';
import storage, { STORAGE_KEYS } from '../../store/storage';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { SnackbarProvider, withSnackbar } from 'notistack';

import classNames from 'classnames';
import './style.scss';

class LobbyLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: { name: '' },
            team1: [],
            team2: [],
            team3: [],
            team1Name: 'Команда 1',
            team2Name: 'Команда 2',
            team3Name: 'Команда 3',
            currentUser: { name: '' },
            isNewUserPanelVisible: false,
            isOperationFormVisible: false,
            operatingFormUser: { name: '' },
            isLoading: true,
            newUser: {
                name: '',
                team: TEAM_KEYS.team1
            }
        };

        this.unsubscribeSessionStorage = null;

        this.setCurrentUser = this.setCurrentUser.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.setNewUserName = this.setNewUserName.bind(this);
        this.setNewUserTeam = this.setNewUserTeam.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
        this.setTeamName = this.setTeamName.bind(this);
        this.toggleUserCreatingContainer = this.toggleUserCreatingContainer.bind(this);
        this.onSuccessUserCreatingForm = this.onSuccessUserCreatingForm.bind(this);
        this.onCloseUserCreatingForm = this.onCloseUserCreatingForm.bind(this);
        this.backToRoot = this.backToRoot.bind(this);
        this.onOperationFormCloseHandler = this.onOperationFormCloseHandler.bind(this);
        this.onChangeUserTeamHandler = this.onChangeUserTeamHandler.bind(this);
        this.onRemoveUserHandler = this.onRemoveUserHandler.bind(this);
        this.setTeamForUser = this.setTeamForUser.bind(this);
        this.removeUserFromTeam = this.removeUserFromTeam.bind(this);
        this.onSelectUserAction = this.onSelectUserAction.bind(this);
        this.isCurrentUserExistsInTeams = this.isCurrentUserExistsInTeams.bind(this);
    }

    componentDidMount() {
        this.setState({ currentUser: storage.get(STORAGE_KEYS.currentUser) || { name: '' } });
        try {
            this.unsubscribeSessionStorage = this.props.firebase
                .refSession(this.props.match.params.id)
                .onSnapshot(snapshot => {
                    const sessionData = snapshot.data();
                    this.setState({
                        ...sessionData
                    });
                    this.setState({ isLoading: false });
                });
        } catch (err) {
            console.error(err);
            this.props.enqueueSnackbar(err, { variant: 'error' });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeSessionStorage instanceof Function) {
            this.unsubscribeSessionStorage();
        }
    }

    setCurrentUser(user) {
        this.setState({ currentUser: user });
        this.props.dispatch(setCurrentUser(user));
    }

    onSelectUserAction(user) {
        if (this.state.admin.name === this.state.currentUser.name) {
            this.setState({ isOperationFormVisible: true, operatingFormUser: user });
        } else {
            this.setCurrentUser(user);
        }
    }

    setTeamName(name) {
        return value => {
            this.setState({ [name]: value });
            this.props.firebase.updateSession(this.props.match.params.id, { [name]: value }).catch(err => {
                console.error(err);
                this.props.enqueueSnackbar(err, { variant: 'error' });
            });
        };
    }

    setNewUserName(e) {
        this.setState({ newUser: { ...this.state.newUser, name: e.target.value } });
    }

    setNewUserTeam(e) {
        this.setState({ newUser: { ...this.state.newUser, team: e.target.value } });
    }

    setTeamForUser(
        newTeamKey,
        user,
        customTeams = { team1: this.state.team1, team2: this.state.team2, team3: this.state.team3 }
    ) {
        let teamChanges;
        switch (newTeamKey) {
            case TEAM_KEYS.team1: {
                teamChanges = { team1: [...customTeams.team1, user] };
                break;
            }
            case TEAM_KEYS.team2: {
                teamChanges = { team2: [...customTeams.team2, user] };
                break;
            }
            case TEAM_KEYS.team3: {
                teamChanges = { team3: [...customTeams.team3, user] };
                break;
            }
            default:
                break;
        }
        this.setState({ ...customTeams, ...teamChanges });
        this.props.firebase.updateSession(this.props.match.params.id, { ...customTeams, ...teamChanges }).catch(err => {
            console.error(err);
            this.props.enqueueSnackbar(err, { variant: 'error' });
        });
    }

    addNewUser() {
        const newUser = { name: this.state.newUser.name };
        this.setTeamForUser(this.state.newUser.team, newUser);
        this.toggleUserCreatingContainer();
        this.setCurrentUser(newUser);
    }

    toggleUserCreatingContainer() {
        this.setState({ isNewUserPanelVisible: !this.state.isNewUserPanelVisible });
    }

    onOperationFormCloseHandler() {
        this.setState({ isOperationFormVisible: false, operatingFormUser: { user: '' } });
    }

    removeUserFromTeam(team, user) {
        return team.filter(u => u.name !== user.name);
    }

    onChangeUserTeamHandler(newTeam) {
        const team1 = this.removeUserFromTeam(this.state.team1, this.state.operatingFormUser);
        const team2 = this.removeUserFromTeam(this.state.team2, this.state.operatingFormUser);
        const team3 = this.removeUserFromTeam(this.state.team3, this.state.operatingFormUser);
        this.setTeamForUser(newTeam, this.state.operatingFormUser, { team1, team2, team3 });
    }

    onRemoveUserHandler() {
        const team1 = this.removeUserFromTeam(this.state.team1, this.state.operatingFormUser);
        const team2 = this.removeUserFromTeam(this.state.team2, this.state.operatingFormUser);
        const team3 = this.removeUserFromTeam(this.state.team3, this.state.operatingFormUser);
        this.setTeamForUser('', this.state.operatingFormUser, { team1, team2, team3 });
        this.onOperationFormCloseHandler();
    }

    isCurrentUserExistsInTeams() {
        return (
            [...this.state.team1, ...this.state.team2, ...this.state.team3, this.state.admin].filter(
                u => u.name === this.state.currentUser.name
            ).length > 0
        );
    }

    joinGame(e) {
        e.preventDefault();
        this.props.history.push(`/game/${this.props.match.params.id}`);
    }

    backToRoot(e) {
        e.preventDefault();
        this.props.history.push('/');
    }

    onSuccessUserCreatingForm() {
        this.addNewUser();
        this.setState({ isNewUserPanelVisible: false });
    }

    onCloseUserCreatingForm() {
        this.setState({ isNewUserPanelVisible: false });
    }

    render() {
        if (this.state.isLoading === true) {
            return (
                <div>
                    <h1>Загрузка...</h1>
                </div>
            );
        }

        return this.state.admin.name === '' ? (
            <div>
                <h1>Такой игры не существует!</h1>
                <Button variant="outlined" color="default" onClick={this.backToRoot}>
                    Назад
                </Button>
            </div>
        ) : (
            <Card className="card-layout">
                <CardContent>
                    <div className="lobby-layout">
                        <div className="players-panel">
                            <div className="players-panel__creator">
                                Создатель:{' '}
                                <span
                                    className={classNames(
                                        this.state.currentUser.name === this.state.admin.name ? 'active' : '',
                                        'players-panel__creator-name'
                                    )}
                                >
                                    {this.state.admin.name}
                                </span>
                            </div>
                            <div className="players-panel__users">
                                <TeamMemberList
                                    title={this.state.team1Name}
                                    memberList={this.state.team1}
                                    onSelectUserAction={this.onSelectUserAction}
                                    onChangeTeamName={this.setTeamName('team1Name')}
                                    currentUser={this.state.currentUser}
                                />
                                <TeamMemberList
                                    title={this.state.team2Name}
                                    memberList={this.state.team2}
                                    onSelectUserAction={this.onSelectUserAction}
                                    onChangeTeamName={this.setTeamName('team2Name')}
                                    currentUser={this.state.currentUser}
                                />
                                <TeamMemberList
                                    title={this.state.team3Name}
                                    memberList={this.state.team3}
                                    onSelectUserAction={this.onSelectUserAction}
                                    onChangeTeamName={this.setTeamName('team3Name')}
                                    currentUser={this.state.currentUser}
                                />
                            </div>
                        </div>
                        <div
                            className="user-creating-form-panel"
                            style={{ display: this.state.isNewUserPanelVisible === true ? 'block' : 'none' }}
                        >
                            <UserCreatingForm
                                setNewUserNameAction={this.setNewUserName}
                                setNewUserTeamAction={this.setNewUserTeam}
                                isOpened={this.state.isNewUserPanelVisible}
                                handleSuccess={this.onSuccessUserCreatingForm}
                                handleCancel={this.onCloseUserCreatingForm}
                                userTeamValue={this.state.newUser.team}
                            />
                        </div>
                        <UserOperationForm
                            isOpened={this.state.isOperationFormVisible}
                            handleOk={this.onOperationFormCloseHandler}
                            changeTeamHandler={this.onChangeUserTeamHandler}
                            removeUserHandler={this.onRemoveUserHandler}
                        />
                    </div>
                </CardContent>
                <CardActions className="card-actions-panel">
                    <Button
                        variant="outlined"
                        color="default"
                        className="user-creating-form__action-btn"
                        disabled={this.state.admin.name === this.state.currentUser.name}
                        onClick={this.toggleUserCreatingContainer}
                    >
                        Создать игрока
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="user-creating-form__action-btn"
                        disabled={this.state.currentUser.name === '' || !this.isCurrentUserExistsInTeams()}
                        onClick={this.joinGame}
                    >
                        К игре
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

LobbyLayout.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired
};

const LobbyLayoutWithSnackbar = withSnackbar(LobbyLayout);

const IntegrationNotistack = props => {
    return (
        <SnackbarProvider maxSnack={3}>
            <LobbyLayoutWithSnackbar {...props} />
        </SnackbarProvider>
    );
};

export default connect()(IntegrationNotistack);
