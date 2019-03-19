import React from 'react';
import dayjs from 'dayjs';

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

export default SuccessUsersContainer;
