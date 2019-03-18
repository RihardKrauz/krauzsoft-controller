import { combineReducers } from 'redux';
import SharedReducer from './shared.reducer';
import SessionReducer from './session.reducer';

export default combineReducers({ shared: SharedReducer, session: SessionReducer });
