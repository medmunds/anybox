// Sites to list in the New Tab page

// (Note: require() is not available in this file.)

// Icon should be 64x64 or larger.
// Ideal is 128x128 transparent png.
//
// Set `allowsAuthUser: true` for Google sites that
// accept the ?authuser=n param to select account.


var iconAssetsDir = '../assets/site-icons/'; // relative to src/browser

var theSites = [{
    label: "Google",
    sites: [{
        label: "Inbox",
        url: 'https://inbox.google.com/',
        allowsAuthUser: true,
        icon: iconAssetsDir + 'google-inbox.png'
    }, {
        label: "Gmail",
        url: 'https://mail.google.com/',
        allowsAuthUser: true,
        icon: iconAssetsDir + 'gmail.png'
    }, {
        label: "Calendar",
        url: 'https://www.google.com/calendar',
        allowsAuthUser: true,
        icon: iconAssetsDir + 'google-calendar.png'
    }, {
        label: "Contacts",
        url: 'https://contacts.google.com/',
        allowsAuthUser: true,
        icon: iconAssetsDir + 'google-contacts.png'
    }, {
        label: "Voice",
        url: 'https://www.google.com/voice',
        allowsAuthUser: true,
        icon: iconAssetsDir + 'google-voice.png'
    }]
}, {
    label: "Other",
    sites: [{
        label: "Outlook.com",
        url: 'https://www.outlook.com/',
        icon: iconAssetsDir + 'microsoft-outlook.png'
    }, {
        label: "Yahoo Mail",
        url: 'https://mail.yahoo.com/',
        icon: iconAssetsDir + 'yahoo-mail.png'
    }]
}];
