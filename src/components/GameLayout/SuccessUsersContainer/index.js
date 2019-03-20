import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const SuccessUsersContainer = ({ items }) => {
    return (
        <div>
            Success:
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

SuccessUsersContainer.propTypes = {
    items: PropTypes.array.isRequired
};

export default SuccessUsersContainer;
