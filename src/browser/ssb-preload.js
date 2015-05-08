// Browser tab preload script
// This script runs in the document context of the page
// (but has access to require during initial load).
(function() {
    'use strict';

    const find = require('lodash/collection/find');
    const ipc = require('ipc');

    // Update status bar on link hover
    // (mousemove turns out to be the only bulletproof way of catching
    // enter and leave on all elements from a delegated event handler)
    let lastOverEl = false,
        currentStatusText = false;

    function onMouseMove(e) {
        // e.path reaches into web-component shadow doms
        let overEl = e.path.length && e.path[0];
        if (overEl !== lastOverEl) {
            lastOverEl = overEl;

            let link = find(e.path, { tagName: 'A' }),
                status = link && link.href;
            if (status !== currentStatusText) {
                currentStatusText = status;
                ipc.sendToHost('showStatus', [status]);
            }
        }
    }
    document.addEventListener('mousemove', onMouseMove);


    // Hack up a little "inspect" feature until we have context menus
    document.addEventListener('contextmenu', function(e) {
        console.log(e.target);
    });

})();
