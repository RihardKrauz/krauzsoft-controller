import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const FalshUsersContainer = ({ items }) => {
    return (
        <div>
            FALSH:
            <div>
                {items.map((u, idx) => (
                    <div key={idx}>
                        {u.name} {dayjs(u.time.toDate()).format('HH:mm:ss')}
                    </div>
                ))}
            </div>
        </div>
    );
};

FalshUsersContainer.propTypes = {
    items: PropTypes.array.isRequired
};

export default FalshUsersContainer;
