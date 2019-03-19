import React from 'react';
import PropTypes from 'prop-types';

const UserCreatingForm = ({ setNewUserNameAction, setNewUserTeamAction, addNewUserAction }) => {
    return (
        <div>
            <div>
                <input onChange={setNewUserNameAction} />
            </div>
            <div>
                <select onChange={setNewUserTeamAction} defaultValue="t1">
                    <option value="t1">team 1</option>
                    <option value="t2">team 2</option>
                    <option value="t3">team 3</option>
                </select>
            </div>
            <div>
                <button onClick={addNewUserAction}>add</button>
            </div>
        </div>
    );
};

UserCreatingForm.propTypes = {
    setNewUserNameAction: PropTypes.func,
    setNewUserTeamAction: PropTypes.func,
    addNewUserAction: PropTypes.func
};

export default UserCreatingForm;
