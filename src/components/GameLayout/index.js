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

function beep() {
    var snd = new Audio(
        'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
    );
    snd.play();
}

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
                        if (window.navigator) window.navigator.vibrate(200);
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
                            if (this.isThisUserCaptain()) {
                                if (window.navigator) window.navigator.vibrate(200);
                                beep();
                            }
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
