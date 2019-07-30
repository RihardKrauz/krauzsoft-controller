import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const ChangeUserForm = ({ isOpened, handleCancel, handleSuccess, setNewUserPassAction }) => {
    return (
        <Dialog open={isOpened} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Введите свой пароль</DialogTitle>
            <DialogContent>
                <form className="user-creating-form" autoComplete="off">
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
                <Button onClick={handleSuccess} color="primary">
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ChangeUserForm.propTypes = {
    setNewUserPassAction: PropTypes.func,
    isOpened: PropTypes.bool,
    handleCancel: PropTypes.func,
    handleSuccess: PropTypes.func
};

export default ChangeUserForm;
