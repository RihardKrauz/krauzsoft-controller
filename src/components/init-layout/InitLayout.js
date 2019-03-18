import React from 'react';

export default class InitLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyId: ''
        };

        this.createNewSession = this.createNewSession.bind(this);
        this.joinLobby = this.joinLobby.bind(this);
        this.changeLobbyId = this.changeLobbyId.bind(this);
    }

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
            <div>
                <div>
                    <input onChange={this.changeLobbyId} />
                </div>
                <div>
                    <div>
                        <button onClick={this.createNewSession}>New</button>
                    </div>
                    <div>
                        <button onClick={this.joinLobby}>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}
