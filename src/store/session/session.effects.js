import { SET_CURRENT_USER } from './session.actions';
import storage, { STORAGE_KEYS } from '../storage';

const setCurrentUserInStorage = store => next => action => {
    if (action.type === SET_CURRENT_USER) {
        storage.set(STORAGE_KEYS.currentUser, action.payload);
    }

    return next(action);
};

export default [setCurrentUserInStorage];
