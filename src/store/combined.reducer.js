import { combineReducers } from 'redux';
import SharedReducer from './shared/shared.reducer';
import SessionReducer from './session/session.reducer';

export default combineReducers({ shared: SharedReducer, session: SessionReducer });
