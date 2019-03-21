import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './style.scss';

const Logger = ({ messages }) => {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="log-panel__title">Логи</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div className="log-panel__messages">
                    {messages.map((l, idx) => (
                        <div className="log-panel__message-item" key={idx}>
                            <span className="log-panel__message-time">{l.dt}</span>
                            <span className="log-panel__message-content">{l.msg}</span>
                        </div>
                    ))}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

Logger.propTypes = {
    messages: PropTypes.array.isRequired
};

export default Logger;
