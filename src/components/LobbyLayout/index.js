import React from 'react';
import UserCreatingForm from './UserCreatingForm';
import TeamMemberList from './TeamMemberList';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/session/session.actions';
import storage, { STORAGE_KEYS } from '../../store/storage';

const TEAM_KEYS = Object.freeze({
    team1: 't1',
    team2: 't2',
    team3: 't3'
});

class LobbyLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: { name: '' },
            team1: [],
            team2: [],
            team3: [],
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
            <div>
                <div>Im lobby {this.props.match.params.id}</div>
                <div>admin: {this.state.admin.name}</div>
                <TeamMemberList title="team1" memberList={this.state.team1} onChangeHandler={this.setCurrentUser} />
                <TeamMemberList title="team2" memberList={this.state.team2} onChangeHandler={this.setCurrentUser} />
                <TeamMemberList title="team3" memberList={this.state.team3} onChangeHandler={this.setCurrentUser} />
                <div>Current: {this.state.currentUser.name}</div>
                <div style={{ display: this.state.isNewUserPanelVisible === true ? 'block' : 'none' }}>
                    <UserCreatingForm
                        setNewUserNameAction={this.setNewUserName}
                        setNewUserTeamAction={this.setNewUserTeam}
                        addNewUserAction={this.addNewUser}
                    />
                </div>
                <div>
                    <div>
                        <button onClick={this.toggleUserCreatingContainer}>Cant find me</button>
                    </div>
                    <div>
                        <button onClick={this.joinGame} disabled={this.state.currentUser.name === ''}>
                            Go to game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(LobbyLayout);