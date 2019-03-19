import React from 'react';
import { connect } from 'react-redux';
import storage from '../../store/storage';
import dayjs from 'dayjs';

class GameLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: { name: '' },
            team1: [],
            team2: [],
            team3: [],
            stage: 0,
            log: [],
            currentUser: { name: '' },
            lastActionUser: { name: '' },
            lastActionType: '',
            falshStart: [],
            shouldAnswer: []
        };

        this.unsubscribeSessionStorage = null;
        this.logString = this.logString.bind(this);
        this.onTygydyk = this.onTygydyk.bind(this);
        this.isCurrentUserAdmin = this.isCurrentUserAdmin.bind(this);
    }

    componentDidMount() {
        const currentUser = storage.get('currentUser') || { name: '' };
        this.logString('Welcome, ' + currentUser.name);
        this.setState({ currentUser });
        this.unsubscribeSessionStorage = this.props.firebase
            .refSession(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const sessionData = snapshot.data();
                this.setState({
                    ...sessionData
                });
                if (sessionData.lastActionUser && sessionData.lastActionType) {
                    this.logString(
                        sessionData.lastActionUser.name + ' ' + sessionData.stage + ' ' + sessionData.lastActionType
                    );
                }
            });
    }

    componentWillUnmount() {
        this.unsubscribeSessionStorage();
    }

    logString(value) {
        this.setState({ log: [...this.state.log, value] });
    }

    isCurrentUserAdmin() {
        return this.state.currentUser.name === this.state.admin.name;
    }

    getFirstAnsweredUser() {
        return this.state.shouldAnswer.sort((a, b) => a.time.seconds - b.time.seconds)[0] || { name: 'none' };
    }

    onTygydyk(e) {
        if (this.isCurrentUserAdmin() === true) {
            const newStage = this.state.stage === 0 ? 1 : 0;
            let sessionData = {
                stage: newStage,
                lastActionUser: this.state.currentUser,
                lastActionType: 'admin'
            };
            if (newStage === 0) {
                sessionData.falshStart = [];
                sessionData.shouldAnswer = [];
            }

            this.props.firebase.updateSession(this.props.match.params.id, sessionData);
        } else {
            const isFalshed = this.state.stage === 0 ? true : false;
            let sessionData = {
                lastActionUser: this.state.currentUser,
                lastActionType: isFalshed ? 'error' : 'success'
            };
            if (isFalshed) {
                sessionData.falshStart = [
                    ...this.state.falshStart,
                    { name: this.state.currentUser.name, time: new Date() }
                ];
            } else {
                sessionData.shouldAnswer = [
                    ...this.state.shouldAnswer,
                    { name: this.state.currentUser.name, time: new Date() }
                ];
            }

            this.props.firebase.updateSession(this.props.match.params.id, sessionData);
        }
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

        const firstAnsweredUser = this.getFirstAnsweredUser();

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
                    <div>Current: {this.state.currentUser.name}</div>
                </div>
                <div>
                    <div>
                        <button onClick={this.onTygydyk}>TYGYDYK</button>
                    </div>
                    <div>Stage: {this.state.stage}</div>
                    <div>{stageDescription}</div>
                </div>
                <div>
                    <div>First answered: {firstAnsweredUser.name}</div>
                </div>
                <div>
                    LOG:
                    <div>
                        {this.state.log.map((l, idx) => (
                            <div key={idx}>{l.msg}</div>
                        ))}
                    </div>
                </div>
                <div>
                    FALSH:
                    <div>
                        {this.state.falshStart.map((u, idx) => (
                            <div key={idx}>
                                {u.name} {dayjs(u.time.toDate()).format('HH:mm:ss')}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    SUCCESS:
                    <div>
                        {this.state.shouldAnswer.map((u, idx) => (
                            <div key={idx}>
                                {u.name} {dayjs(u.time.toDate()).format('HH:mm:ss')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state => ({ currentUser: state.session.currentUser || { name: '' } }))(GameLayout);
