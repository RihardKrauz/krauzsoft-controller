import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const TeamMemberList = ({ title, memberList, onSelectUserAction, onChangeTeamName, currentUser }) => {
    const [open, setOpen] = React.useState(false);
    const [formTeamName, setFormTeamName] = React.useState(title);

    const setFormTeamNameAction = e => {
        setFormTeamName(e.target.value);
    };

    function handleClickOpen() {
        setOpen(true);
    }

    function cancelChanges() {
        setOpen(false);
    }

    function applyChanges() {
        onChangeTeamName(formTeamName);
        setOpen(false);
    }

    return (
        <div className="team-panel-layout">
            <div className="team-content">
                <div className="team-content__header" onClick={handleClickOpen}>
                    {title}:
                </div>
                {memberList.map(p => (
                    <div
                        className={classNames(
                            currentUser.name === p.name ? 'active' : '',
                            'team-content__user-wrapper'
                        )}
                        key={p.name}
                        onClick={() => onSelectUserAction(p)}
                    >
                        <span className="team-content__user-name">{p.name}</span>
                    </div>
                ))}
            </div>
            <Dialog open={open} onClose={cancelChanges} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Название команды</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Здесь вы можете изменить название команды (для всех участников)
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="team-name-sub-form-field"
                        label="Название"
                        onChange={setFormTeamNameAction}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelChanges} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={applyChanges} color="primary">
                        Принять
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

TeamMemberList.propTypes = {
    title: PropTypes.string.isRequired,
    memberList: PropTypes.array.isRequired,
    onSelectUserAction: PropTypes.func,
    onChangeTeamName: PropTypes.func,
    currentUser: PropTypes.object
};

export default TeamMemberList;
