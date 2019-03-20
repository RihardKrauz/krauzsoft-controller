import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const TEAM_KEYS = Object.freeze({
    team1: 't1',
    team2: 't2',
    team3: 't3'
});

const UserCreatingForm = ({ setNewUserNameAction, setNewUserTeamAction, addNewUserAction, userTeamValue }) => {
    return (
        <div>
            <form className="user-creating-form" autoComplete="off">
                <FormControl className="user-creating-form__field">
                    <TextField
                        id="user-name-input"
                        label="Ваше имя"
                        className="user-creating-form__field-input"
                        onChange={setNewUserNameAction}
                        margin="normal"
                    />
                </FormControl>
                <FormControl className="user-creating-form__field">
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
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="user-creating-form__action-btn"
                        onClick={addNewUserAction}
                    >
                        Создать
                    </Button>
                </div>
            </form>
        </div>
    );
};

UserCreatingForm.propTypes = {
    setNewUserNameAction: PropTypes.func,
    setNewUserTeamAction: PropTypes.func,
    addNewUserAction: PropTypes.func,
    userTeamValue: PropTypes.string.isRequired
};

export default UserCreatingForm;
