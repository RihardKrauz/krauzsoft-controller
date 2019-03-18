import { SET_CURRENT_USER } from './session.actions';

const initialState = Object.freeze({
    currentUser: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return { ...state, currentUser: action.payload };
        default:
            return state;
    }
};
