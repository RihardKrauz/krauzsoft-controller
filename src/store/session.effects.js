import { SET_CURRENT_USER } from './session.actions';
import storage from './storage';

const setCurrentUserInStorage = store => next => action => {
    if (action.type === SET_CURRENT_USER) {
        storage.set('currentUser', action.payload);
    }

    return next(action);
};

export default [setCurrentUserInStorage];
