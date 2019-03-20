import React from 'react';
import UserCreatingForm, { TEAM_KEYS } from './UserCreatingForm';
import TeamMemberList from './TeamMemberList';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/session/session.actions';
import storage, { STORAGE_KEYS } from '../../store/storage';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

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
    }

    componentDidMount() {
        this.setState({ currentUser: storage.get(STORAGE_KEYS.currentUser) || { name: '' } });
        this.unsubscribeSessionStorage = this.props.firebase
            .refSession(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const sessionData = snapshot.data();
                this.setState({
                    ...sessionData
                });
            });
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

    setTeamName(name) {
        return value => {
            this.setState({ [name]: value });
            this.props.firebase.updateSession(this.props.match.params.id, { [name]: value });
        };
    }

    setNewUserName(e) {
        this.setState({ newUser: { ...this.state.newUser, name: e.target.value } });
    }

    setNewUserTeam(e) {
        this.setState({ newUser: { ...this.state.newUser, team: e.target.value } });
    }

    addNewUser(e) {
        const newUser = { name: this.state.newUser.name };
        let teamChanges;
        switch (this.state.newUser.team) {
            case TEAM_KEYS.team1: {
                teamChanges = { team1: [...this.state.team1, newUser] };
                break;
            }
            case TEAM_KEYS.team2: {
                teamChanges = { team2: [...this.state.team2, newUser] };
                break;
            }
            case TEAM_KEYS.team3: {
                teamChanges = { team3: [...this.state.team3, newUser] };
                break;
            }
            default:
                break;
        }

        this.setState(teamChanges);
        this.props.firebase.updateSession(this.props.match.params.id, teamChanges);
        this.toggleUserCreatingContainer();
        this.setCurrentUser(newUser);
    }

    toggleUserCreatingContainer() {
        this.setState({ isNewUserPanelVisible: !this.state.isNewUserPanelVisible });
    }

    joinGame(e) {
        e.preventDefault();

        this.props.history.push(`/game/${this.props.match.params.id}`);
    }

    render() {
        return (
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
                                    onSelectUserAction={this.setCurrentUser}
                                    onChangeTeamName={this.setTeamName('team1Name')}
                                    currentUser={this.state.currentUser}
                                />
                                <TeamMemberList
                                    title={this.state.team2Name}
                                    memberList={this.state.team2}
                                    onSelectUserAction={this.setCurrentUser}
                                    onChangeTeamName={this.setTeamName('team2Name')}
                                    currentUser={this.state.currentUser}
                                />
                                <TeamMemberList
                                    title={this.state.team3Name}
                                    memberList={this.state.team3}
                                    onSelectUserAction={this.setCurrentUser}
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
                                addNewUserAction={this.addNewUser}
                                userTeamValue={this.state.newUser.team}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardActions className="card-actions-panel">
                    <Button
                        variant="outlined"
                        color="default"
                        className="user-creating-form__action-btn"
                        onClick={this.toggleUserCreatingContainer}
                    >
                        Создать игрока
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="user-creating-form__action-btn"
                        disabled={this.state.currentUser.name === ''}
                        onClick={this.joinGame}
                    >
                        К игре
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default connect()(LobbyLayout);
