import React from 'react';

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

export default TeamMemberList;
