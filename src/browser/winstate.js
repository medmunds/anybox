// Preserve and restore window state in localStorage.
// Adapted for Electron from nw.js:
// https://github.com/nwjs/nw.js/wiki/Preserve-window-state-between-sessions
//
// As written, it only handles a single-window app.
//
// This code is meant to run in the renderer process.
// To use, load from index.html (or whatever file you loadUrl into your BrowserWindow):
//   <script src="winstate.js"></script>

// Ported code:
'use strict';

/**
 * Cross-platform window state preservation.
 * Yes this code is quite complicated, but this is the best I came up with for
 * current state of node-webkit Window API (v0.7.3 and later).
 *
 * Known issues:
 * - Unmaximization not always sets the window (x, y) in the lastly used coordinates.
 * - Unmaximization animation sometimes looks wierd.
 * - Extra height added to window, at least in linux x64 gnome-shell env. It seems that
 *   when we read height then it returns it with window frame, but if we resize window
 *   then it applies dimensions only to internal document without external frame.
 *   Need to test in other environments with different visual themes.
 *
 * Change log:
 * 2015-05-08
 * - Electron (atom-shell) port
 *
 * 2013-12-01
 * - Workaround of extra height in gnome-shell added.
 *
 * 2014-03-22
 * - Repared workaround (from 2013-12-01) behaviour when use frameless window.
 *   Now it works correctly.
 * 2014-10-02
 * - Fixed cannot set windowState of null error when attempting to set localStorage
 *
 * 2015-03-05
 * - Don't call window.show() if dev tools are already open (see initWindowState).
 */

var remote = require('remote');

var win = remote.getCurrentWindow();
var localStorageKey = 'windowState'; // you could include win.id for a multi-window app
var winState;
var currWinMode;
var resizeTimeout;
var isMaximizationEvent = false;

// extra height added in linux x64 gnome-shell env, use it as workaround
var deltaHeight = (function () {
// TODO: not sure how to find out if BrowserWindow is frameless
// TODO: (also not sure if this workaround is needed in Electron)
    // use deltaHeight only in windows with frame enabled
    // if (gui.App.manifest.window.frame) return true; else return 'disabled';
    return true;
})();


function initWindowState() {
    winState = JSON.parse(localStorage[localStorageKey] || 'null');

    if (winState) {
        currWinMode = winState.mode;
        if (currWinMode === 'maximized') {
            win.maximize();
        } else {
            restoreWindowState();
        }
    } else {
        currWinMode = 'normal';
        if (deltaHeight !== 'disabled') deltaHeight = 0;
        dumpWindowState();
    }

    // On Windows win.show() also acts like win.requestAttention().
    // If you use LiveReload, it becomes annoying when your app is already open
    // but starts to blink in the taskbar on changes.
    // There seems to be no way to check if a window is open, so let's at least
    // check for dev tools.
    if (!win.isDevToolsOpened()) {
        win.show();
    }
}

function dumpWindowState() {
    if (!winState) {
        winState = {};
    }

    // we don't want to save minimized state, only maximized or normal
    if (currWinMode === 'maximized') {
        winState.mode = 'maximized';
    } else {
        winState.mode = 'normal';
    }

    // when window is maximized you want to preserve normal
    // window dimensions to restore them later (even between sessions)
    if (currWinMode === 'normal') {
        var pos = win.getPosition(),
            size = win.getSize();
        winState.x = pos[0];
        winState.y = pos[1];
        winState.width = size[0];
        winState.height = size[1];

        // save delta only of it is not zero
        if (deltaHeight !== 'disabled' && deltaHeight !== 0 && currWinMode !== 'maximized') {
            winState.deltaHeight = deltaHeight;
        }
    }
}

function restoreWindowState() {
    // deltaHeight already saved, so just restore it and adjust window height
    if (deltaHeight !== 'disabled' && typeof winState.deltaHeight !== 'undefined') {
        deltaHeight = winState.deltaHeight;
        winState.height = winState.height - deltaHeight;
    }

    win.setSize(winState.width, winState.height);
    win.setPosition(winState.x, winState.y);
}

function saveWindowState() {
    dumpWindowState();
    localStorage[localStorageKey] = JSON.stringify(winState);
}

initWindowState();

win.on('maximize', function () {
    isMaximizationEvent = true;
    currWinMode = 'maximized';
});

win.on('unmaximize', function () {
    currWinMode = 'normal';
    restoreWindowState();
});

win.on('minimize', function () {
    currWinMode = 'minimized';
});

win.on('restore', function () {
    currWinMode = 'normal';
});

window.addEventListener('resize', function () {
    // resize event is fired many times on one resize action,
    // this hack with setTiemout forces it to fire only once
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {

        // on MacOS you can resize maximized window, so it's no longer maximized
        if (isMaximizationEvent) {
            // first resize after maximization event should be ignored
            isMaximizationEvent = false;
        } else {
            if (currWinMode === 'maximized') {
                currWinMode = 'normal';
            }
        }

        // there is no deltaHeight yet, calculate it and adjust window size
        if (deltaHeight !== 'disabled' && deltaHeight === false) {
            var size = win.getSize(),
                width = size[0],
                height = size[1];
            deltaHeight = height - winState.height;

            // set correct size
            if (deltaHeight !== 0) {
                win.resizeTo(width, height - deltaHeight);
            }
        }

        dumpWindowState();

    }, 500);
}, false);

win.on('close', function () {
    try {
        saveWindowState();
    } catch(err) {
        console.log("winstateError: " + err);
    }
    this.close(true);
});
