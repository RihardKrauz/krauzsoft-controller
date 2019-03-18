import React from 'react';

const GameLayout = ({ match }) => {
    return <div>Im game {match.params.id}</div>;
};

export default GameLayout;
