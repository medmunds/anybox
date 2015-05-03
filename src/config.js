'use strict';

exports.appName = "Anybox";

exports.defaultNewTabName = "New Tab";
exports.defaultNewTabUrl = 'new-tab.html'; // relative to src/browser
exports.defaultTabIcon = '../assets/default-tab-icon.png'; // relative to src/browser

exports.initialUrl = 'https://inbox.google.com';


// URL patterns that should open in the SSB, rather than externally.
// Strings match at beginning of url; use /regexp/ for more-complicated tests.
exports.defaultOpenInTabPatterns = [
    // Google services
    'https://accounts.google.com/AddSession', // account switching
    'https://contacts.google.com',
    'https://inbox.google.com',
    'https://mail.google.com',
    'https://www.google.com/calendar',
    'https://www.google.com/contacts',
    'https://www.google.com/voice',

    // Outlook & related services
    'https://www.outlook.com',
    'https://account.live.com',
    'https://calendar.live.com',
    'https://mail.live.com',
    'https://people.live.com',
    'https://profile.live.com',
    /https:\/\/\w+\.mail\.live\.com/,  // e.g., col128.mail.live.com

    // Yahoo Mail
    'https://mail.yahoo.com',
    'https://login.yahoo.com', // account switching
    /https:\/\/\w+\.mail\.yahoo\.com/  // e.g., us-mg4.mail.yahoo.com
];
