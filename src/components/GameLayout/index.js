import React from 'react';
import { connect } from 'react-redux';
import storage, { STORAGE_KEYS } from '../../store/storage';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Logger from './Logger';
import ResultsContainer from './ResultsContainer';
import TeamContainer from './TeamContainer';

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
            team1Name: 'Команда 1',
            team2Name: 'Команда 2',
            team3Name: 'Команда 3',
            stage: 0,
            log: [],
            currentUser: { name: '' },
            lastActionUser: { name: '' },
            lastActionType: '',
            falshStart: [],
            shouldAnswer: [],
            actionBtnHovered: false
        };

        this.unsubscribeSessionStorage = null;
        this.logString = this.logString.bind(this);
        this.onTygydyk = this.onTygydyk.bind(this);
        this.isCurrentUserAdmin = this.isCurrentUserAdmin.bind(this);
        this.setActionBtnHoverEnabled = this.setActionBtnHoverEnabled.bind(this);
        this.setActionBtnHoverDisabled = this.setActionBtnHoverDisabled.bind(this);
        this.getTeamByUser = this.getTeamByUser.bind(this);
    }

    componentDidMount() {
        const currentUser = storage.get(STORAGE_KEYS.currentUser) || { name: '' };
        this.logString('Приветствуем тебя, ' + currentUser.name);
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
                    const resultMessage =
                        sessionData.lastActionType === ACTION_TYPES.error ? 'слишком поспешил' : 'готов отвечать';
                    this.logString(`${sessionData.lastActionUser.name} ${resultMessage}`);
                }

                if (sessionData.lastActionType === ACTION_TYPES.admin) {
                    this.logString(
                        sessionData.stage === 0 ? `Внимательно слушаем вопрос от ${this.state.admin.name}` : 'Отвечаем!'
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
        return this.state.shouldAnswer.sort((a, b) => a.time.seconds - b.time.seconds)[0] || { name: 'пока никто' };
    }

    setActionBtnHoverEnabled() {
        this.setState({ actionBtnHovered: true });
    }

    setActionBtnHoverDisabled() {
        this.setState({ actionBtnHovered: false });
    }

    getTeamByUser(user) {
        if (!user) return '';
        if (this.state.team1.filter(u => u.name === user.name).length > 0) return this.state.team1Name;
        if (this.state.team2.filter(u => u.name === user.name).length > 0) return this.state.team2Name;
        if (this.state.team3.filter(u => u.name === user.name).length > 0) return this.state.team3Name;
        return '';
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
        const firstAnsweredUser = this.getFirstAnsweredUser();
        let tgdButtonName = 'ТЫГЫДЫК';
        if (this.state.currentUser.name === this.state.admin.name) {
            tgdButtonName = this.state.stage === 0 ? 'Жду ответ' : 'Читать вопрос';
        }

        let tdgButtonStyle = 'primary';
        // if (this.state.currentUser.name === this.state.admin.name) {
        tdgButtonStyle = this.state.stage === 0 ? 'secondary' : 'primary';
        // }

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
                                            className="tgdk-btn"
                                            color={tdgButtonStyle}
                                        >
                                            {this.state.actionBtnHovered === true ? (
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

const GameLayoutWithSnackbar = withSnackbar(GameLayout);

const IntegrationNotistack = props => {
    return (
        <SnackbarProvider maxSnack={3}>
            <GameLayoutWithSnackbar {...props} />
        </SnackbarProvider>
    );
};

export default connect(state => ({ currentUser: state.session.currentUser || { name: '' } }))(IntegrationNotistack);
