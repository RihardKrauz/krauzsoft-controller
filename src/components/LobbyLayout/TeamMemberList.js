import React from 'react';
import PropTypes from 'prop-types';

const TeamMemberList = ({ title, memberList, onChangeHandler }) => {
    return (
        <div>
            {title}:
            {memberList.map(p => (
                <div key={p.name} onClick={() => onChangeHandler(p)}>
                    {p.name}
                </div>
            ))}
        </div>
    );
};

TeamMemberList.propTypes = {
    title: PropTypes.string.isRequired,
    memberList: PropTypes.array.isRequired,
    onChangeHandler: PropTypes.func
};

export default TeamMemberList;
