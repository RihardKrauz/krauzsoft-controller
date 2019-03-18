import React from 'react';
import { FirebaseContext } from '.';

export const withFirebaseContext = Component => props => (
    <FirebaseContext.Consumer>{firebase => <Component {...props} firebase={firebase} />}</FirebaseContext.Consumer>
);

export default React.createContext(null);
