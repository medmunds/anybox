'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const Menu = require('menu');
const shell = require('shell');

const config = require('../config');


function sendSSBCommand(/* command, ...args */) {
    let args = [].slice.call(arguments),
        command = args.shift(),
        activeWindow = BrowserWindow.getFocusedWindow(),
        activeContents = activeWindow && activeWindow.webContents;
    if (activeContents) {
        activeContents.send.apply(activeContents, ['ssb-command', command].concat(args));
    } else {
        console.log(`No activeWindow.webContents to send ssb-command '${command}'`);
        shell.beep();
    }
}


const mainMenuTemplate = [{
    label: config.appName, // or on Mac, app name from Info.plist
    submenu: [{
        label: 'About Inbox App',
        selector: 'orderFrontStandardAboutPanel:'
    }, {
        type: 'separator'
    }, {
        label: 'Preferences...',
        accelerator: 'Command+,',
        selector: 'preferences:'
    }, {
        type: 'separator'
    }, {
        label: 'Clear Browsing Data',
        accelerator: 'Command+Shift+Backspace',
        click: function() { shell.beep(); }
    }, {
        type: 'separator'
    }, {
        label: 'Services',
        submenu: []
    }, {
        type: 'separator'
    }, {
        label: `Hide ${config.appName}`,
        accelerator: 'Command+H',
        selector: 'hide:'
    }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
    }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
    }, {
        type: 'separator'
    }, {
        label: `Quit ${config.appName}`,
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
    }]
}, {
    label: 'File',
    submenu: [{
        label: 'New Tab',
        accelerator: 'Command+T',
        click: function() { sendSSBCommand('newTab'); }
    }, {
        label: 'Close Tab',
        accelerator: 'Command+W',
        click: function() { sendSSBCommand('closeActiveTab'); }
    }, {
        type: 'separator'
    }, {
        label: 'Page Setup...',
        accelerator: 'Command+Shift+P',
        selector: 'pageSetup:'
    }, {
        label: 'Print',
        accelerator: 'Command+P',
        selector: 'print:'
    }]
}, {
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
    }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
    }, {
        type: 'separator'
    }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
    }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
    }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
    }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
    }]
}, {
    label: 'View',
    submenu: [{
        label: 'Stop',
        accelerator: 'Command+.',
        click: function() { sendSSBCommand('stop'); }
    }, {
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() { sendSSBCommand('reloadActiveTab'); }
    }, {
        label: 'Reload Ignoring Cache',
        accelerator: 'Command+Shift+R',
        click: function() { sendSSBCommand('reloadActiveTabIgnoringCache'); }
    }, {
        type: 'separator'
    }, {
        label: `Reload ${config.appName}`,
        // accelerator: 'Command+Alt+R',
        click: function() { BrowserWindow.getFocusedWindow().reload(); }
    }, {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
    }]
}, {
    label: 'Window',
    submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
    }, {
        type: 'separator'
    }, {
        label: 'Next Tab',
        accelerator: 'Command+Alt+Right',
        click: function() { sendSSBCommand('activateNextTab'); }
    }, {
        label: 'Previous Tab',
        accelerator: 'Command+Alt+Left',
        click: function() { sendSSBCommand('activatePreviousTab'); }
    }, {
        type: 'separator'
    }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
    }]
}, {
    label: 'Help',
    submenu: []
}];


function init() {
    let mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}
exports.init = init;


