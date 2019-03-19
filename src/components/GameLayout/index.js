import React from 'react';
import { connect } from 'react-redux';
import storage, { STORAGE_KEYS } from '../../store/storage';
import dayjs from 'dayjs';
import Logger from './Logger';
import FalshUsersContainer from './FalshContainer';
import SuccessUsersContainer from './SuccessUsersContainer';
import TeamContainer from './TeamContainer';

const ACTION_TYPES = Object.freeze({
    admin: 't1',
    error: 't2',
    success: 't3'
});

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
        const currentUser = storage.get(STORAGE_KEYS.currentUser) || { name: '' };
        this.logString('Welcome, ' + currentUser.name);
        this.setState({ currentUser });
        this.unsubscribeSessionStorage = this.props.firebase
            .refSession(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const sessionData = snapshot.data();
                this.setState({
                    ...sessionData
                });
                if (
                    sessionData.lastActionUser &&
                    sessionData.lastActionType &&
                    sessionData.lastActionType !== ACTION_TYPES.admin
                ) {
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
        this.setState({ log: [...this.state.log, { dt: dayjs(new Date()).format('HH:mm:ss'), msg: value }] });
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
                lastActionType: ACTION_TYPES.admin
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
                lastActionType: isFalshed ? ACTION_TYPES.error : ACTION_TYPES.success
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
                        <TeamContainer teamName="team1" items={this.state.team1} />
                    </div>
                    <div>
                        <TeamContainer teamName="team2" items={this.state.team2} />
                    </div>
                    <div>
                        <TeamContainer teamName="team3" items={this.state.team3} />
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
                    <Logger messages={this.state.log} />
                </div>
                <div>
                    <FalshUsersContainer items={this.state.falshStart} />
                </div>
                <div>
                    <SuccessUsersContainer items={this.state.shouldAnswer} />
                </div>
            </div>
        );
    }
}

export default connect(state => ({ currentUser: state.session.currentUser || { name: '' } }))(GameLayout);
