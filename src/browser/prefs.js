'use strict';

// Simple localStorage preference management

/* global localStorage */

function getPref(key, defaultValue) {
    if (key in localStorage) {
        return JSON.parse(localStorage.getItem(key));
    } else {
        return defaultValue;
    }
}

function setPref(key, val) {
    if (val === undefined) {
        clearPref(key);
    } else {
        localStorage.setItem(key, JSON.stringify(val));
    }
}

function clearPref(key) {
    localStorage.removeItem(key);
}

function resetPrefs() {
    localStorage.clear();
}


module.exports = {
    get: getPref,
    set: setPref,
    clear: clearPref,
    reset: resetPrefs
};
