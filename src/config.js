'use strict';

exports.appName = "Inbox App";

exports.defaultNewTabName = "New Tab";
exports.defaultNewTabUrl = 'about:blank';
exports.defaultTabIcon = '../assets/default-tab-icon.png'; // relative to src/browser

exports.initialUrl = 'https://inbox.google.com';


// URL patterns that should open in the SSB, rather than externally.
// Strings match at beginning of url; use /regexp/ for more-complicated tests.
exports.defaultOpenInTabPatterns = [
    'https://accounts.google.com/AddSession',
    'https://contacts.google.com',
    'https://inbox.google.com',
    'https://mail.google.com',
    'https://www.google.com/calendar',
    'https://www.google.com/contacts',
    'https://www.google.com/voice'
];
