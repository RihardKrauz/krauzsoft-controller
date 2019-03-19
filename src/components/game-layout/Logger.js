import React from 'react';

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

export default Logger;
