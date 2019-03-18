import React from 'react';

class GameLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: { name: '' },
            team1: [],
            team2: [],
            team3: [],
            currentUser: { name: '' }
        };
    }

    componentDidMount() {
        this.props.firebase.getSession(this.props.match.params.id).then(value => {
            const sessionData = value.data();
            this.setState({
                ...sessionData
            });
        });
    }

    render() {
        return (
            <div>
                <div>Im game {this.props.match.params.id}</div>
                <div>admin: {this.state.admin.name}</div>
                <div>
                    team1:{' '}
                    {this.state.team1.map(p => (
                        <div key={p.name}>{p.name}</div>
                    ))}
                </div>
                <div>
                    team2:{' '}
                    {this.state.team2.map(p => (
                        <div key={p.name}>{p.name}</div>
                    ))}
                </div>
                <div>
                    team3:{' '}
                    {this.state.team3.map(p => (
                        <div key={p.name}>{p.name}</div>
                    ))}
                </div>
                <div>Current: {this.state.currentUser.name}</div>
            </div>
        );
    }
}

export default GameLayout;
