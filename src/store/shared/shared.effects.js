const blankEffect = store => next => action => {
    return next(action);
};

export default [blankEffect];
