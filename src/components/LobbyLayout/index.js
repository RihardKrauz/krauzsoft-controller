import React from 'react';
import PropTypes from 'prop-types';
import UserCreatingForm, { TEAM_KEYS } from './UserCreatingForm';
import ChangeUserForm from './ChangeUserForm';
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
            currentUser: { name: '', pass: '' },
            isNewUserPanelVisible: false,
            isOperationFormVisible: false,
            isChangeUserFormVisible: false,
            operatingFormUser: { name: '', pass: '' },
            changeUserFormData: { pass: '', comparableUser: { pass: '' } },
            isLoading: true,
            newUser: {
                name: '',
                pass: '',
                team: TEAM_KEYS.team1
            },
            adminHackCount: 0
        };

        this.unsubscribeSessionStorage = null;

        this.setCurrentUser = this.setCurrentUser.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.setNewUserName = this.setNewUserName.bind(this);
        this.setNewUserPass = this.setNewUserPass.bind(this);
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
        this.setAdmin = this.setAdmin.bind(this);
        this.setCompareUserPass = this.setCompareUserPass.bind(this);
        this.onSuccessChangeUserForm = this.onSuccessChangeUserForm.bind(this);
        this.onCloseChangeUserForm = this.onCloseChangeUserForm.bind(this);
    }

    componentDidMount() {
        this.setState({ currentUser: storage.get(STORAGE_KEYS.currentUser) || { name: '', pass: '' } });
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
            this.setState({
                isChangeUserFormVisible: true,
                changeUserFormData: { ...this.state.changeUserFormData, comparableUser: user }
            });
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

    setNewUserPass(e) {
        this.setState({ newUser: { ...this.state.newUser, pass: e.target.value } });
    }

    setNewUserTeam(e) {
        this.setState({ newUser: { ...this.state.newUser, team: e.target.value } });
    }

    setCompareUserPass(e) {
        this.setState({ changeUserFormData: { ...this.state.changeUserFormData, pass: e.target.value } });
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

    setAdmin() {
        this.setState({ adminHackCount: this.state.adminHackCount + 1 });

        if (this.state.adminHackCount > 15) {
            this.setCurrentUser(this.state.admin);
        }
    }

    addNewUser() {
        const newUser = { name: this.state.newUser.name, pass: this.state.newUser.pass };
        this.setTeamForUser(this.state.newUser.team, newUser);
        this.toggleUserCreatingContainer();
        this.setCurrentUser(newUser);
    }

    toggleUserCreatingContainer() {
        this.setState({ isNewUserPanelVisible: !this.state.isNewUserPanelVisible });
    }

    onOperationFormCloseHandler() {
        this.setState({ isOperationFormVisible: false, operatingFormUser: { user: '', pass: '' } });
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

    onSuccessChangeUserForm() {
        const { pass, comparableUser } = this.state.changeUserFormData;
        if (pass === comparableUser.pass) {
            this.setCurrentUser(comparableUser);
        } else {
            this.props.enqueueSnackbar('Не правильный пароль!', { variant: 'error' });
        }
        this.setState({ isChangeUserFormVisible: false });
    }

    onCloseChangeUserForm() {
        this.setState({ isChangeUserFormVisible: false });
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
                            <div onClick={this.setAdmin} className="players-panel__creator">
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
                                setNewUserPassAction={this.setNewUserPass}
                                setNewUserTeamAction={this.setNewUserTeam}
                                isOpened={this.state.isNewUserPanelVisible}
                                handleSuccess={this.onSuccessUserCreatingForm}
                                isSuccessEnabled={this.state.newUser.name !== '' && this.state.newUser.pass !== ''}
                                handleCancel={this.onCloseUserCreatingForm}
                                userTeamValue={this.state.newUser.team}
                            />
                        </div>
                        <div
                            className="user-changing-form-panel"
                            style={{ display: this.state.isChangeUserFormVisible === true ? 'block' : 'none' }}
                        >
                            <ChangeUserForm
                                setNewUserPassAction={this.setCompareUserPass}
                                isOpened={this.state.isChangeUserFormVisible}
                                handleSuccess={this.onSuccessChangeUserForm}
                                handleCancel={this.onCloseChangeUserForm}
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
