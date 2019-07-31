import React from 'react';
import { connect } from 'react-redux';
import storage, { STORAGE_KEYS } from '../../store/storage';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Logger from './Logger';
import ResultsContainer from './ResultsContainer';
import TeamContainer from './TeamContainer';
import { GAME_MODE } from '../CreateLayout';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import PassiveBtnIcon from '@material-ui/icons/Accessibility';
import ActiveBtnIcon from '@material-ui/icons/AccessibilityNew';
import { SnackbarProvider, withSnackbar } from 'notistack';

import './style.scss';

// export type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';

const ACTION_TYPES = Object.freeze({
    admin: 't1',
    error: 't2',
    success: 't3'
});

const CONFLICT_DELAY = 1000;

// todo: convert team1,2,3 into array
class GameLayout extends React.Component {
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
            stage: 0,
            mode: '',
            log: [],
            currentUser: { name: '' },
            lastActionUser: { name: '' },
            lastActionType: '',
            falshStart: [],
            shouldAnswer: [],
            enabledAt: null,
            conflictDelay: 1000,
            orderByTime: false,
            actionBtnHovered: false,
            isAnswerAccepted: false,
            unsubscribeSessionStorage: null,
            unsubscribeChatStorage: null
        };

        this.logString = this.logString.bind(this);
        this.onTygydyk = this.onTygydyk.bind(this);
        this.isCurrentUserAdmin = this.isCurrentUserAdmin.bind(this);
        this.setActionBtnHoverEnabled = this.setActionBtnHoverEnabled.bind(this);
        this.setActionBtnHoverDisabled = this.setActionBtnHoverDisabled.bind(this);
        this.getTeamByUser = this.getTeamByUser.bind(this);
        this.isThisUserCaptain = this.isThisUserCaptain.bind(this);
        this.getThisUserTeamCaptain = this.getThisUserTeamCaptain.bind(this);
    }

    componentDidMount() {
        const currentUser = storage.get(STORAGE_KEYS.currentUser) || { name: '' };
        this.logString('Приветствуем тебя, ' + currentUser.name);
        this.setState({ currentUser });
        try {
            this.setState({
                unsubscribeChatStorage: this.props.firebase.refChat(this.props.match.params.id).onSnapshot(snapshot => {
                    const chatData = snapshot.data();
                    if (chatData && chatData.to === currentUser.name) {
                        this.props.enqueueSnackbar(chatData.message, { variant: 'info' });
                    }
                })
            });

            this.setState({
                unsubscribeSessionStorage: this.props.firebase
                    .refSession(this.props.match.params.id)
                    .onSnapshot(snapshot => {
                        console.log('got snapshot');

                        const sessionData = snapshot.data();
                        this.setState({
                            ...sessionData
                        });
                        if (
                            sessionData.lastActionUser &&
                            sessionData.lastActionType &&
                            sessionData.lastActionType !== ACTION_TYPES.admin
                        ) {
                            const resultMessage =
                                sessionData.lastActionType === ACTION_TYPES.error
                                    ? 'слишком поспешил'
                                    : 'готов отвечать';
                            this.logString(`${sessionData.lastActionUser.name} ${resultMessage}`);

                            if (
                                sessionData.lastActionType !== ACTION_TYPES.error &&
                                this.state.isAnswerAccepted === false
                            ) {
                                this.setState({ isAnswerAccepted: true });
                                if (this.isCurrentUserAdmin() === true) {
                                    this.props.firebase
                                        .updateApproved(this.props.match.params.id, sessionData)
                                        .then(() => {
                                            console.log('updated approved');
                                            setTimeout(
                                                () => {
                                                    this.props.firebase
                                                        .getSession(this.props.match.params.id)
                                                        .then(snap => {
                                                            console.log('got session');
                                                            const snapData = snap.data();

                                                            const snapShouldAnswer = [
                                                                ...snapData.shouldAnswer,
                                                                ...sessionData.shouldAnswer.filter(s => {
                                                                    if (snapData.shouldAnswer.length > 0) {
                                                                        return (
                                                                            s.name !== snapData.shouldAnswer[0].name &&
                                                                            s.time !== snapData.shouldAnswer[0].time
                                                                        );
                                                                    }
                                                                    return true;
                                                                })
                                                            ];

                                                            this.props.firebase
                                                                .updateSession(this.props.match.params.id, {
                                                                    shouldAnswer: snapShouldAnswer
                                                                })
                                                                .then(() => {
                                                                    console.log('update session');
                                                                })
                                                                .catch(err => {
                                                                    console.error(err);
                                                                    this.props.enqueueSnackbar(err, {
                                                                        variant: 'error'
                                                                    });
                                                                });
                                                        });
                                                },
                                                this.state.conflictDelay ? this.state.conflictDelay : CONFLICT_DELAY
                                            );
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            this.props.enqueueSnackbar(err, { variant: 'error' });
                                        });
                                }
                            }
                        }

                        if (sessionData.lastActionType === ACTION_TYPES.admin) {
                            if (sessionData.stage !== 0) {
                                this.setState({ enabledAt: new Date() });
                            }
                            this.logString(
                                sessionData.stage === 0
                                    ? `Внимательно слушаем вопрос от ${this.state.admin.name}`
                                    : 'Отвечаем!'
                            );
                        }
                    })
            });
        } catch (err) {
            console.error(err);
            this.props.enqueueSnackbar(err, { variant: 'error' });
        }
    }

    componentWillUnmount() {
        if (this.state.unsubscribeSessionStorage instanceof Function) {
            this.state.unsubscribeSessionStorage();
        }
        if (this.state.unsubscribeChatStorage instanceof Function) {
            this.state.unsubscribeChatStorage();
        }
    }

    logString(value) {
        this.setState({ log: [...this.state.log, { dt: dayjs(new Date()).format('HH:mm:ss'), msg: value }] });
    }

    isCurrentUserAdmin() {
        return this.state.currentUser.name === this.state.admin.name;
    }

    getFirstAnsweredUser() {
        const firstUser =
            this.state.orderByTime === false
                ? this.state.shouldAnswer[0]
                : this.state.shouldAnswer.sort((a, b) => a.time - b.time)[0];
        return firstUser || { name: 'пока никто' };
    }

    setActionBtnHoverEnabled() {
        // this.setState({ actionBtnHovered: true });
    }

    setActionBtnHoverDisabled() {
        // this.setState({ actionBtnHovered: false });
    }

    getTeamByUser(user) {
        if (!user) return '';
        if (this.state.team1.filter(u => u.name === user.name).length > 0) return this.state.team1Name;
        if (this.state.team2.filter(u => u.name === user.name).length > 0) return this.state.team2Name;
        if (this.state.team3.filter(u => u.name === user.name).length > 0) return this.state.team3Name;
        return '';
    }

    isThisUserCaptain() {
        return (
            [...this.state.team1, ...this.state.team2, ...this.state.team3].filter(
                u => u.name === this.state.currentUser.name && u.isCaptain === true
            ).length > 0
        );
    }

    getThisUserTeamCaptain() {
        const getUserCaptain = (team, user) => {
            if (team.filter(u => u.name === user.name).length > 0) {
                const cap = team.filter(u => u.isCaptain) || [{ name: '' }];
                return cap[0];
            } else return null;
        };

        const captain =
            getUserCaptain(this.state.team1, this.state.currentUser) ||
            getUserCaptain(this.state.team2, this.state.currentUser) ||
            getUserCaptain(this.state.team2, this.state.currentUser);
        return captain;
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

            this.setState({ isAnswerAccepted: false });

            this.props.firebase
                .updateApproved(this.props.match.params.id, { shouldAnswer: [] })
                .then(snap => {})
                .catch(err => {
                    console.error(err);
                    this.props.enqueueSnackbar(err, { variant: 'error' });
                });

            this.props.firebase.updateSession(this.props.match.params.id, sessionData).catch(err => {
                console.error(err);
                this.props.enqueueSnackbar(err, { variant: 'error' });
            });
        } else {
            if (this.state.mode === GAME_MODE.captain && this.isThisUserCaptain() === false) {
                const captain = this.getThisUserTeamCaptain();
                this.props.firebase.updateChat(this.props.match.params.id, {
                    from: this.state.currentUser.name,
                    to: captain.name,
                    message: `Вас подбодрил(а) ${this.state.currentUser.name}`,
                    sendTime: new Date()
                });
                return;
            }

            const isFalshed = this.state.stage === 0 ? true : false;
            let sessionData = {
                lastActionUser: this.state.currentUser,
                lastActionType: isFalshed ? ACTION_TYPES.error : ACTION_TYPES.success
            };
            if (isFalshed) {
                sessionData.falshStart = [
                    ...this.state.falshStart,
                    { name: this.state.currentUser.name, time: new Date() - this.state.enabledAt }
                ];
            } else {
                sessionData.shouldAnswer = [
                    ...this.state.shouldAnswer,
                    { name: this.state.currentUser.name, time: new Date() - this.state.enabledAt }
                ];
            }
            if (this.state.falshStart.filter(u => u.name === this.state.currentUser.name).length === 0) {
                this.props.firebase.updateSession(this.props.match.params.id, sessionData).catch(err => {
                    console.error(err);
                    this.props.enqueueSnackbar(err, { variant: 'error' });
                });
            } else {
                this.logString(`${this.state.currentUser.name}, ты тыкнул раньше времени. Жди следующего раунда`);
            }
        }
    }

    render() {
        let tgdButtonClass = 'tgdk-btn';
        let tgdButtonName = 'ТЫГЫДЫК';
        let tdgButtonStyle = 'primary';

        const isCurrentUserAdmin = this.state.currentUser.name === this.state.admin.name;
        const isGameInPendingState = this.state.stage === 0;

        tdgButtonStyle = isGameInPendingState ? 'secondary' : 'primary';

        // console.log(isCurrentUserAdmin, isGameInPendingState, this.state);

        if (isCurrentUserAdmin) {
            tgdButtonName = isGameInPendingState ? 'Жду ответ' : 'Читать вопрос';
        } else if (this.state.mode === GAME_MODE.captain && this.isThisUserCaptain() === false) {
            tgdButtonName = 'Поддержать капитана';
            tgdButtonClass += isGameInPendingState ? ' inactive-pending' : ' inactive-ready';
            tdgButtonStyle = 'default';
        }

        const firstAnsweredUser = this.getFirstAnsweredUser();

        return (
            <Card className="card-layout">
                <CardContent>
                    <div className="game-panel">
                        <div className="stage-container">
                            <div className="stage-container__falshed-users">
                                <ResultsContainer title="Поспешили:" items={this.state.falshStart} />
                            </div>
                            <div className="stage-container__action-panel">
                                <div className="stage-container__action-wrapper">
                                    <div
                                        className={classNames(
                                            'stage-container__action-btn',
                                            this.state.stage === 0 ? 'inactive' : 'active'
                                        )}
                                    >
                                        <Fab
                                            variant="extended"
                                            aria-label="TYGYDYK"
                                            onClick={this.onTygydyk}
                                            onMouseOver={this.setActionBtnHoverEnabled}
                                            onMouseOut={this.setActionBtnHoverDisabled}
                                            className={tgdButtonClass}
                                            color={tdgButtonStyle}
                                        >
                                            {this.state.actionBtnHovered === false ? (
                                                <ActiveBtnIcon className="tgdk-btn-icon" />
                                            ) : (
                                                <PassiveBtnIcon className="tgdk-btn-icon" />
                                            )}
                                            {tgdButtonName}
                                        </Fab>
                                    </div>
                                </div>
                                <div className="stage-container__user-answering">
                                    Отвечает:{' '}
                                    <span className="stage-container__user-answering-team">
                                        {this.getTeamByUser(firstAnsweredUser)}
                                    </span>
                                    <span className="stage-container__user-answering-value">
                                        ({firstAnsweredUser.name})
                                    </span>
                                </div>
                            </div>

                            <div className="stage-container__success-users">
                                <ResultsContainer title="Молодцы:" items={this.state.shouldAnswer} />
                            </div>
                        </div>
                        <div className="log-layout">
                            <Logger messages={this.state.log} />
                        </div>
                        <div className="info-panel">
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className="log-panel__title">Команды</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <div className="game-panel__teams-info">
                                        <div className="game-panel__creator">
                                            Создатель:{' '}
                                            <span
                                                className={classNames(
                                                    this.state.currentUser.name === this.state.admin.name
                                                        ? 'active'
                                                        : '',
                                                    'game-panel__creator-name'
                                                )}
                                            >
                                                {this.state.admin.name}
                                            </span>
                                        </div>
                                        <div className="game-panel__teams">
                                            <TeamContainer
                                                teamName={this.state.team1Name}
                                                items={this.state.team1}
                                                currentUser={this.state.currentUser}
                                            />

                                            <TeamContainer
                                                teamName={this.state.team2Name}
                                                items={this.state.team2}
                                                currentUser={this.state.currentUser}
                                            />

                                            <TeamContainer
                                                teamName={this.state.team3Name}
                                                items={this.state.team3}
                                                currentUser={this.state.currentUser}
                                            />
                                        </div>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

GameLayout.propTypes = {
    enqueueSnackbar: PropTypes.func.isRequired
};

const GameLayoutWithSnackbar = withSnackbar(GameLayout);

const IntegrationNotistack = props => {
    return (
        <SnackbarProvider maxSnack={3}>
            <GameLayoutWithSnackbar {...props} />
        </SnackbarProvider>
    );
};

export default connect(state => ({ currentUser: state.session.currentUser || { name: '' } }))(IntegrationNotistack);
