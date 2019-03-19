import React from 'react';
import PropTypes from 'prop-types';

const Logger = ({ messages }) => {
    return (
        <div>
            LOG:
            <div>
                {messages.map((l, idx) => (
                    <div key={idx}>
                        <span>{l.dt}</span>
                        <span>{l.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

Logger.propTypes = {
    messages: PropTypes.array.isRequired
};

export default Logger;
