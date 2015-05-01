'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

// Report crashes to Electron's server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 800, height: 600});

    //mainWindow.webContents.on('did-finish-load', function() {
    //    // `this` is webContents
    //    console.log("mainWindow.webContents.did-finish-load", this, mainWindow);
    //});

    // Prevent browser window from loading anything other than our UI
    // (e.g., if user drops an image file on the window)
    mainWindow.webContents.on('will-navigate', function(e, url) {
        //console.log(`Preventing navigation to: ${url}`);
        e.preventDefault();
    });

    // Load our UI
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
