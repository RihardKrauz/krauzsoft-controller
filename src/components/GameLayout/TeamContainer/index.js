import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

const TeamContainer = ({ teamName, items, currentUser }) => {
    return (
        <div className="users-container">
            <div className="users-container__header">{teamName}</div>
            {items.map(p => (
                <div
                    className={classNames(
                        currentUser.name === p.name ? 'active' : '',
                        p.isCaptain === true ? 'captain' : '',
                        'users-container__user-wrapper'
                    )}
                    key={p.name}
                >
                    <span className="users-container__user-name">{p.name}</span>
                </div>
            ))}
        </div>
    );
};

TeamContainer.propTypes = {
    teamName: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    currentUser: PropTypes.object
};

export default TeamContainer;
