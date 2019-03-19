import React from 'react';

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

export default TeamContainer;
