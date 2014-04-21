/*jslint devel: true */
/*global define, chrome*/
"use strict";

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('../html/window.html', {
        'id': 'main-view',
        'width': 3000,
        'height': 500,
        'minWidth': 450,
        'minHeight': 500
    });
});
chrome.runtime.onInstalled.addListener(function (details) {
    console.log("runtime.onInstalled details : " + details);
    if (details.reason === "install") {
        chrome.storage.local.clear();
    }
});