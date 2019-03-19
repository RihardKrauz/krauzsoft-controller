import React from 'react';
import PropTypes from 'prop-types';

const TeamContainer = ({ teamName, items }) => {
    return (
        <div>
            {teamName}
            {items.map(p => (
                <div key={p.name}>{p.name}</div>
            ))}
        </div>
    );
};

TeamContainer.propTypes = {
    teamName: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
};

export default TeamContainer;
