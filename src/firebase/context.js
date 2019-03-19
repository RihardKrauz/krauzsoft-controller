import React from 'react';
import { FirebaseContext } from '.';

/* eslint react/display-name: 0 */
export const withFirebaseContext = Component => props => (
    <FirebaseContext.Consumer>{firebase => <Component {...props} firebase={firebase} />}</FirebaseContext.Consumer>
);

export default React.createContext(null);
