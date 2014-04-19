"use strict";

var myCssHack = function () {
    if (!registered) {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(cssToInject));
        document.body.appendChild(style);
        registered = true;
    }
};
    
var injectCSS = function(webView, cssURL) {
    var url = chrome.runtime.getURL(cssURL);
    $.get(url, function(data) {
        var cssToInject = data;
        var js = 'var registered';
        webView.executeScript({ code: js });
        js = 'var cssToInject = ' + JSON.stringify(cssToInject) + ';';
        webView.executeScript({ code: js });
        webView.executeScript({ code: '(' + myCssHack + ')()' });
    });
}
