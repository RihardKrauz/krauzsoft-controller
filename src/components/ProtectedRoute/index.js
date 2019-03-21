import React from 'react';
import { PropTypes } from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import storage, { STORAGE_KEYS } from '../../store/storage';

const securityKey = 'MAv52bH1MPisPm8MRXWD';

export default function ProtectedRoute({ component: Component, ...rest }) {
    const isAuthenticated = storage.get(STORAGE_KEYS.securityKey) === securityKey;

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/init', state: { from: props.location } }} />
                )
            }
        />
    );
}

ProtectedRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object
};
