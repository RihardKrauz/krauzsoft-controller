import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import './style.scss';

const ResultsContainer = ({ title, items }) => {
    return (
        <div className="results-container">
            <div className="results-container__title">{title}</div>
            <div className="results-container__content">
                {items.map((u, idx) => (
                    <div className="game-result-item" key={idx}>
                        <span className="game-result-item__title">{u.name}</span>{' '}
                        <span className="game-result-item__time">{dayjs(u.time.toDate()).format('HH:mm:ss')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

ResultsContainer.propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired
};

export default ResultsContainer;
