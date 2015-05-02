'use strict';

exports.appName = "Inbox App";

exports.defaultNewTabName = "New Tab";
exports.defaultNewTabUrl = 'about:blank';
exports.defaultTabIcon = 'assets/default-tab-icon.png';


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


exports.defaultTab = {
    title: 'Inbox',
    url: 'https://inbox.google.com',
    icon: 'https://ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/ic_product_inbox_16dp_r2_2x.png'
};
