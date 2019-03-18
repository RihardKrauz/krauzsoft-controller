import React from 'react';
import UserCreatingForm from './UserCreatingForm';
import TeamMemberList from './TeamMemberList';
export default class LobbyLayout extends React.Component {
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
                team: 't1'
            }
        };

        this.setCurrentUser = this.setCurrentUser.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.setNewUserName = this.setNewUserName.bind(this);
        this.setNewUserTeam = this.setNewUserTeam.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
        this.toggleUserCreatingContainer = this.toggleUserCreatingContainer.bind(this);
    }

    componentDidMount() {
        this.props.firebase.getSession(this.props.match.params.id).then(value => {
            const sessionData = value.data();
            this.setState({
                ...sessionData
            });
        });
    }

    setCurrentUser(user) {
        this.setState({ currentUser: user });
    }

    setNewUserName(e) {
        this.setState({ newUser: { ...this.state.newUser, name: e.target.value } });
    }

    setNewUserTeam(e) {
        this.setState({ newUser: { ...this.state.newUser, team: e.target.value } });
    }

    addNewUser(e) {
        const newUser = { name: this.state.newUser.name };
        switch (this.state.newUser.team) {
            case 't1': {
                this.setState({ team1: [...this.state.team1, newUser] });
                break;
            }
            case 't2': {
                this.setState({ team2: [...this.state.team2, newUser] });
                break;
            }
            case 't3': {
                this.setState({ team3: [...this.state.team3, newUser] });
                break;
            }
            default:
                break;
        }

        this.props.firebase.updateSession(this.props.match.params.id, {
            team1: [...this.state.team1, newUser],
            team2: [...this.state.team2, newUser],
            team3: [...this.state.team3, newUser]
        });

        this.setState({ currentUser: newUser });
    }

    toggleUserCreatingContainer(e) {
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
                <div onClick={() => this.setCurrentUser(this.state.admin)}>admin: {this.state.admin.name}</div>
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
