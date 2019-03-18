import React from 'react';
import { connect } from 'react-redux';

class GameLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: { name: '' },
            team1: [],
            team2: [],
            team3: [],
            stage: 0,
            log: ''
        };

        this.unsubscribeSessionStorage = null;
    }

    componentDidMount() {
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
        this.unsubscribeSessionStorage();
    }

    onTygydyk(e) {
        console.log('User ' + this.props.currentUser.name);
    }

    render() {
        let stageDescription;
        switch (this.state.stage) {
            case 0:
                stageDescription = 'Admin is reading';
                break;
            case 1:
                stageDescription = 'Waiting for answer...';
                break;
            default:
                stageDescription = 'unknown';
        }

        return (
            <div>
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
                    <div>Current: {this.props.currentUser.name}</div>
                </div>
                <div>
                    <div>
                        <button onClick={this.onTygydyk}>TYGYDYK</button>
                    </div>
                    <div>Stage: {this.state.stage}</div>
                    <div>{stageDescription}</div>
                </div>
                <div>
                    <div>{this.state.log}</div>
                </div>
            </div>
        );
    }
}

export default connect(state => ({ currentUser: state.session.currentUser || { name: '' } }))(GameLayout);
