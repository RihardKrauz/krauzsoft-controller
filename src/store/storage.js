export const STORAGE_KEYS = Object.freeze({
    currentUser: 'currentUser',
    securityKey: 'securityKey'
});

export default {
    get: itemKey => {
        const value = sessionStorage.getItem(itemKey);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    },
    set: (itemKey, value) => {
        if (value) {
            sessionStorage.setItem(itemKey, JSON.stringify(value));
        }
    }
};
