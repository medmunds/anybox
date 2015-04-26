'use strict';

function initUI() {
    var content = document.createElement('webview');
    content.id = 'content';
    content.src = 'https://inbox.google.com';
    document.body.appendChild(content);

    var loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

window.addEventListener('load', initUI);
