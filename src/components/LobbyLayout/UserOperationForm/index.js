import React from 'react';
import PropTypes from 'prop-types';
import { TEAM_KEYS } from '../UserCreatingForm';

import './style.scss';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const UserOperationForm = ({ isOpened, handleOk, changeTeamHandler, removeUserHandler }) => {
    const [userTeam, setUserTeam] = React.useState(TEAM_KEYS.team1);

    return (
        <Dialog open={isOpened} onClose={handleOk} aria-labelledby="form-operation-title">
            <DialogTitle id="form-operation-title">Изменить пользователя</DialogTitle>
            <DialogContent>
                <form className="user-operation-form" autoComplete="off">
                    <div>
                        <FormControl className="user-operation-form__field">
                            <InputLabel htmlFor="user-team-el">Перевести в команду</InputLabel>
                            <Select
                                onChange={e => {
                                    setUserTeam(e.target.value);
                                }}
                                value={userTeam}
                                inputProps={{
                                    name: 'team',
                                    id: 'user-team-el'
                                }}
                            >
                                <MenuItem value={TEAM_KEYS.team1}>Команда 1</MenuItem>
                                <MenuItem value={TEAM_KEYS.team2}>Команда 2</MenuItem>
                                <MenuItem value={TEAM_KEYS.team3}>Команда 3</MenuItem>
                            </Select>
                        </FormControl>
                        <div className="user-operation-form__action">
                            <Button
                                onClick={() => {
                                    changeTeamHandler(userTeam);
                                }}
                                variant="outlined"
                                color="default"
                            >
                                Перевести
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={removeUserHandler} color="secondary">
                    Удалить игрока
                </Button>
                <Button onClick={handleOk} color="primary">
                    ОК
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UserOperationForm.propTypes = {
    isOpened: PropTypes.bool,
    handleOk: PropTypes.func,
    changeTeamHandler: PropTypes.func,
    removeUserHandler: PropTypes.func
};

export default UserOperationForm;
