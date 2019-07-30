import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export const TEAM_KEYS = Object.freeze({
    team1: 't1',
    team2: 't2',
    team3: 't3'
});

const UserCreatingForm = ({
    isOpened,
    handleCancel,
    handleSuccess,
    setNewUserNameAction,
    setNewUserTeamAction,
    setNewUserPassAction,
    userTeamValue,
    isSuccessEnabled
}) => {
    return (
        <Dialog open={isOpened} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавить пользователя</DialogTitle>
            <DialogContent>
                <form className="user-creating-form" autoComplete="off">
                    <FormControl required className="user-creating-form__field">
                        <InputLabel htmlFor="team-select-el">Команда</InputLabel>
                        <Select
                            onChange={setNewUserTeamAction}
                            value={userTeamValue}
                            inputProps={{
                                name: 'team',
                                id: 'team-select-el'
                            }}
                        >
                            <MenuItem value={TEAM_KEYS.team1}>Команда 1</MenuItem>
                            <MenuItem value={TEAM_KEYS.team2}>Команда 2</MenuItem>
                            <MenuItem value={TEAM_KEYS.team3}>Команда 3</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="user-creating-form__field">
                        <TextField
                            id="user-name-input"
                            label="Ваше имя"
                            className="user-creating-form__field-input"
                            onChange={setNewUserNameAction}
                            margin="normal"
                            required
                        />
                    </FormControl>
                    <FormControl className="user-creating-form__field">
                        <TextField
                            id="user-pass-input"
                            label="Пароль"
                            className="user-creating-form__field-input"
                            onChange={setNewUserPassAction}
                            margin="normal"
                            required
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleSuccess} color="primary" disabled={isSuccessEnabled === false}>
                    Создать
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UserCreatingForm.propTypes = {
    setNewUserNameAction: PropTypes.func,
    setNewUserTeamAction: PropTypes.func,
    setNewUserPassAction: PropTypes.func,
    userTeamValue: PropTypes.string.isRequired,
    isOpened: PropTypes.bool,
    handleCancel: PropTypes.func,
    handleSuccess: PropTypes.func,
    isSuccessEnabled: PropTypes.bool
};

export default UserCreatingForm;
