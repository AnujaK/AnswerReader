"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, $*/

//TODO : 1. Code cleanup. 2. Add meaningful log statements.

$(document).ready(function () {
    document.getElementById('qd_topics_save').addEventListener('click', save_topics);
    document.getElementById('qd_topics_save_reload').addEventListener('click', save_topics_and_reload);
    document.getElementById('manage_quora_topics').addEventListener('click', manage_topics_and_show);

    document.getElementById('qdhp_search_btn').addEventListener('click', open_qd_search);
    document.getElementById('qdhp_profile_btn').addEventListener('click', open_qd_profile);
    document.getElementById('qdhp_stats_btn').addEventListener('click', open_qd_stats);
    document.getElementById('qdhp_credits_btn').addEventListener('click', open_qd_credits);

    document.getElementById('qdhp_reload_btn').addEventListener('click', matrix_reloaded);
    document.getElementById('qd_blog').addEventListener('click', open_qd_blog);
    document.getElementById('qd_contact').addEventListener('click', open_qd_contact);

    document.getElementById('qd_dialog_back').addEventListener('click', qd_dialog_back_handler);
    document.getElementById('quick_add_topic').addEventListener('click', quick_add_topic_and_show);
    document.getElementById('qd_topics_save_quick').addEventListener('click', save_topic_quick);
    document.getElementById('qd_topics_save_reload_quick').addEventListener('click', save_topics_and_reload_quick);
    //Login workflow
    apiLoginInWebView();
    //web-view popup controller
    popupWebViewController();
});

var apiLoginCalled = false;
var API_CALLED_TO_GET_USER_DETAILS = false;
var API_LOGGED_IN_USER_DETAILS;

var apiLoginInWebView = function () {
    var newdiv = document.createElement('webview');
    var divIdName = 'default-webview';
    newdiv.setAttribute('id', divIdName);
    newdiv.setAttribute('style', 'width: 100%; height: 100%;');
    newdiv.setAttribute('partition', 'persist:quoradeck');
    newdiv.setAttribute('tabindex', 0);

    document.body.appendChild(newdiv);

    var webViewHome = $('#default-webview');
    var isLoginWebViewLoaded = false;

    webViewHome.attr('src', 'http://api.quora.com/api/logged_in_user?fields=notifs');
    webViewHome.on('loadstart', function (e) {
        //Do nothing.
    });
    webViewHome.on('loadstop', function (e) {
        if (isLoginWebViewLoaded === false) {
            isLoginWebViewLoaded = true;
            if (apiLoginCalled !== true) {
                console.log("loadstop at apiLoginInWebView");
                var injectedJS = "var bodyText = document.body.innerText; " + "var isApiLoggedIn; " + "var apiResponse = {loggedInUserDetails : '', isApiLoggedIn : ''}; " + "bodyText = bodyText.substring(\"while(1);\".length); " + "apiResponse.loggedInUserDetails = bodyText; " + "if(bodyText == \"\"){apiResponse.isApiLoggedIn = 'false';}else{apiResponse.isApiLoggedIn = 'true';} " + "console.log('bodyText : '+bodyText);callbackData=apiResponse;";
                webViewHome.get(0).executeScript({
                    code: injectedJS
                }, function (callbackData) {
                    console.log("test 123");
                    var callbackResponse = callbackData[0];
                    apiLoginCalled = true;
                    if (callbackResponse.isApiLoggedIn === 'true') {
                        API_LOGGED_IN_USER_DETAILS = JSON.parse(callbackResponse.loggedInUserDetails);
                        var qdhp_profile_btn_text = document.getElementById('qdhp_profile_btn_text');
                        qdhp_profile_btn_text.innerText = unescape("%A0%A0%A0") + API_LOGGED_IN_USER_DETAILS.name;
                        matrix_reloaded();
                    } else {
                        doLogin();
                    }

                });
            }
        }
    });
};

var doLogin = function () {
    var defaultWebView = document.getElementById('default-webview');
    if (defaultWebView !== null) {
        //Do nothing.
    } else {
        var newdiv = document.createElement('webview');
        var divIdName = 'default-webview';
        newdiv.setAttribute('id', divIdName);
        newdiv.setAttribute('style', 'width: 100%; height: 100%;');
        newdiv.setAttribute('partition', 'persist:quoradeck');
        newdiv.setAttribute('tabindex', 0);
        document.body.appendChild(newdiv);
    }

    var webViewHome = $('#default-webview');
    var isQuoraHomeWebViewLoaded = false;

    webViewHome.attr('src', 'http://www.quora.com/');
    webViewHome.on('loadstart', function (e) {
        //Do nothing.
    });
    webViewHome.on('loadstop', function (e) {
        if (isQuoraHomeWebViewLoaded === false) {
            isQuoraHomeWebViewLoaded = true;
            var injectedJS = "var login = document.getElementsByClassName('header_login_text_box'); " + "console.log('loaded login' + login.length); var localIsLoggedIn;" + "if(login.length > 0 ){console.log('login page'); localIsLoggedIn='false'; } " + "else{ console.log('logged-in home page'); localIsLoggedIn='true'; } " + "console.log('last line of execute script');callbackData=localIsLoggedIn;";
            webViewHome.get(0).executeScript({
                code: injectedJS
            }, function (callbackData) {
                console.log("is logged in : callbackData : " + callbackData);
                if (callbackData === "true") {
                    var signUpWebView = $('#socialSignUpWebView');
                    console.log("Length:  " + signUpWebView.length);
                    if (signUpWebView.length > 0) {
                        signUpWebView.width(0);
                        signUpWebView.height(0);
                        signUpWebView.hide();
                    }
                    chrome.storage.local.set({
                        'isQDInitialized': 'true'
                    }, function () {
                        restore_topics();
                        restore_home_settings();
                        $('#myModal').modal('show');
                        callApiToGetUserDetails();
                    });
                } else {
                    console.log("callbackData is false...");
                    //Do nothing.
                }
            });
        }
    });
    webViewHome.on('newwindow', function (e) {
        console.log("targetUrl : " + e.originalEvent.targetUrl);
        console.log("windowOpenDisposition : " + e.originalEvent.windowOpenDisposition);

        var socialSignUpWebView = document.getElementById('#socialSignUpWebView');

        if (socialSignUpWebView === undefined || socialSignUpWebView === null) {
            socialSignUpWebView = document.createElement('webview');
            socialSignUpWebView.setAttribute('style', 'width: 100%; height: 100%;z-index:454554;position:fixed;top:0px;left:0px;');
            socialSignUpWebView.setAttribute('partition', 'persist:quoradeck');
            socialSignUpWebView.setAttribute('id', 'socialSignUpWebView');
            document.body.appendChild(socialSignUpWebView);
            e.originalEvent.window.attach(socialSignUpWebView);
        }

        socialSignUpWebView.addEventListener('loadstop', function (e) {
            var signUpWebView = $('#socialSignUpWebView');
            var signUpWebViewURL = signUpWebView.attr('src');
            console.log("signUpWebViewURL : " + signUpWebViewURL);
            if ((signUpWebViewURL.indexOf('callback') !== -1) && (signUpWebViewURL.indexOf('oauth2') === -1)) {
                console.log("In if condition");
                signUpWebView.hide();
            } else if ((signUpWebViewURL.indexOf('https://www.facebook.com/dialog/oauth/write') != -1) || (signUpWebViewURL.indexOf('https://www.facebook.com/dialog/oauth/read') != -1)) {
                console.log("In else condition");
                //signUpWebView.hide();
            }
        });

    });
}
var callApiToGetUserDetails = function () {
    var newdiv = document.createElement('webview');
    var divIdName = 'user-details-api-webview';
    newdiv.setAttribute('id', divIdName);
    newdiv.setAttribute('partition', 'persist:quoradeck');
    newdiv.setAttribute('style', 'width:0px;height:0px;');
    document.body.appendChild(newdiv);
    var userDetailsWebView = $('#user-details-api-webview');
    userDetailsWebView.attr('src', 'http://api.quora.com/api/logged_in_user');
    userDetailsWebView.on('loadstart', function (e) {
        //Do nothing.
    });
    userDetailsWebView.on('loadstop', function (e) {
        if (API_CALLED_TO_GET_USER_DETAILS != true) {
            console.log("loadstop at callApiToGetUserDetails");
            var injectedJS = "var bodyText = document.body.innerText; " + "var isApiLoggedIn; " + "var apiResponse = {loggedInUserDetails : '', isApiLoggedIn : ''}; " + "bodyText = bodyText.substring(\"while(1);\".length); " + "apiResponse.loggedInUserDetails = bodyText; " + "if(bodyText == \"\"){apiResponse.isApiLoggedIn = 'false';}else{apiResponse.isApiLoggedIn = 'true';} " + "console.log('bodyText : '+bodyText);callbackData=apiResponse;";
            userDetailsWebView.get(0).executeScript({
                code: injectedJS
            }, function (callbackData) {
                var callbackResponse = callbackData[0];
                API_CALLED_TO_GET_USER_DETAILS = true;
                if (callbackResponse.isApiLoggedIn == 'true') {
                    API_LOGGED_IN_USER_DETAILS = JSON.parse(callbackResponse.loggedInUserDetails);
                    var qdhp_profile_btn_text = document.getElementById('qdhp_profile_btn_text');
                    qdhp_profile_btn_text.innerText = unescape("%A0%A0%A0") + API_LOGGED_IN_USER_DETAILS.name;
                    matrix_reloaded();
                }
            });
        }
    });
}

//TODO : rename method
var matrix_reloaded = function () {
    console.log("Inside matrix_reloaded function");
    var webViewHome = document.getElementById('default-webview');
    if (webViewHome !== null) {
        webViewHome.parentNode.removeChild(webViewHome);
    }

    var lbarDynamicRowsWrapper = document.getElementById('lbar_dynamic_rows_wrapper');
    var lbarDynamicRows = document.getElementById('lbar_dynamic_rows');
    if (lbarDynamicRows !== null) {
        lbarDynamicRows.parentNode.removeChild(lbarDynamicRows);
    }

    var lbarDynamicRows = document.createElement('Div');
    var lbarDynamicRowsName = 'lbar_dynamic_rows';
    lbarDynamicRows.setAttribute('id', lbarDynamicRowsName);
    lbarDynamicRowsWrapper.appendChild(lbarDynamicRows);

    $(".main-webview-panel").remove();

    chrome.storage.local.get('listOfTopics', function (result) {
        if (result && (result.listOfTopics === undefined)) {
            var topics = deepCopy(DEFAULT_TOPIC_COLUMNS);
            chrome.storage.local.set({
                'listOfTopics': JSON.stringify(topics)
            }, function () {
                display_topics(topics);
            });
        } else {
            //add columns
            var topics = JSON.parse(result.listOfTopics);

            chrome.storage.local.get('homeColumns', function (result) {
                if (result && (result.homeColumns === undefined)) {
                    var homeColumns = deepCopy(DEFAULT_HOME_COLUMNS);
                    chrome.storage.local.set({
                        'homeColumns': JSON.stringify(homeColumns)
                    }, function () {
                        display_home_settings(homeColumns);
                    });
                } else {
                    var homeColumns = JSON.parse(result.homeColumns);
                    var hColumnLoop = 0;
                    for (var i = 0; i < homeColumns.length; i++) {
                        var key_val = homeColumns[i].show;
                        if (key_val) {
                            document.getElementById("home_tab" + i).checked = key_val;
                            topics.splice(hColumnLoop, 0, homeColumns[i].rel);
                            hColumnLoop++;
                        }
                    }

                    var no_of_topics = topics.length;
                    var no_of_topics_to_display = 0;
                    console.log("no_of_topics : " + no_of_topics);

                    for (var i = 0; i < no_of_topics; i++) {
                        if (i == 0 || topics[i] != "") {
                            no_of_topics_to_display++;

                            var panel = document.createElement('div');
                            panel.setAttribute('class', 'panel panel-default main-webview-panel');
                            panel.setAttribute('style', 'width: 522px; height: 100%; display: inline-block;');

                            var panelHead = document.createElement('div');
                            panelHead.setAttribute('class', 'panel-heading');

                            panel.appendChild(panelHead);

                            var panelBody = document.createElement('div');
                            panelBody.setAttribute('class', 'panel-body');
                            panelBody.setAttribute('style', 'padding:0px;');
                            panel.appendChild(panelBody);

                            var newdiv = document.createElement('webview');
                            var divIdName = 'main-webview' + i;
                            newdiv.setAttribute('id', divIdName);
                            newdiv.setAttribute('partition', 'persist:quoradeck');
                            newdiv.setAttribute('tabindex', i);
                            newdiv.setAttribute('class', 'main-webview-class');

                            if (i < 1) {
                                var quoradeck_lbar = $('#quoradeck_lbar');
                                quoradeck_lbar.show();
                            }
                            newdiv.setAttribute('style', 'width: 520px; height: 100%;');
                            document.body.appendChild(panel);
                            panelBody.appendChild(newdiv);

                            var webView = $('#main-webview' + i);

                            var backButton = document.createElement('span');
                            backButton.setAttribute('class', 'glyphicon glyphicon-arrow-left');
                            backButton.setAttribute('id', 'col-back-button' + i);
                            backButton.setAttribute('style', 'display:none; float:left; margin-top: 2px; cursor: pointer;');
                            panelHead.appendChild(backButton);

                            (function (backButton, i) {
                                backButton.addEventListener('click', function () {
                                    var currentWebView = document.querySelector('#main-webview' + i);
                                    currentWebView.back();
                                });
                            })(backButton, i);
                            var navBtn = document.createElement('button');
                            navBtn.setAttribute('class', 'qd-btn');
                            var navSpanIcon = document.createElement('span');
                            var navSpanIconClass;
                            var navSpan = document.createElement('span');
                            navSpan.setAttribute('id', 'qd-nav-span' + i);
                            var lbLabel;
                            if (topics[i] == "") {
                                lbLabel = "Top Stories";
                                navSpanIconClass = 'glyphicon glyphicon-home';
                                navSpanIcon.setAttribute('class', navSpanIconClass);
                                navBtn.appendChild(navSpanIcon);
                            } else if (topics[i] in HOME_COLUMNS_LABEL_MAP) {
                                var home_key = topics[i];
                                lbLabel = HOME_COLUMNS_LABEL_MAP[home_key];
                                navSpanIconClass = HOME_COLUMNS_ICON_MAP[home_key];
                                navSpanIcon.setAttribute('class', navSpanIconClass);
                                navBtn.appendChild(navSpanIcon);
                            } else {
                                lbLabel = topics[i];
                                navSpanIcon.setAttribute('class', 'glyphicon glyphicon-list-alt');
                                navBtn.appendChild(navSpanIcon);
                            }
                            lbLabel = lbLabel.replace(/-/g, ' ');
                            var leftNavLabel;
                            var headerLabel;
                            if (lbLabel.length > 23) {
                                leftNavLabel = unescape("%A0%A0%A0") + lbLabel.substr(0, 20) + "...";
                                if (lbLabel.length > 52) {
                                    var label = lbLabel.substr(0, 52);
                                    headerLabel = lbLabel.substr(0, label.lastIndexOf(" ")) + " ...";
                                } else {
                                    headerLabel = lbLabel;
                                }
                            } else {
                                leftNavLabel = unescape("%A0%A0%A0") + lbLabel;
                                headerLabel = lbLabel;
                            }
                            navSpan.appendChild(document.createTextNode(leftNavLabel));
                            navBtn.appendChild(navSpan);
                            //navSpan.setAttribute('title',lbLabel);
                            //$('#qd-nav-span'+i).tooltip();
                            var colTextSpan = document.createElement('span');
                            colTextSpan.setAttribute('style', 'margin-left:6px;');
                            colTextSpan.appendChild(document.createTextNode(headerLabel));
                            panelHead.appendChild(colTextSpan);

                            var encodedTopic = encodeURIComponent(topics[i]);
                            var encodedURL;
                            if (encodedTopic === topics[i] || topics[i].indexOf('-') != -1 || topics[i].indexOf('/') != -1) {
                                encodedURL = 'http://www.quora.com/' + topics[i];
                            } else {
                                encodedURL = 'http://www.quora.com/search?q=' + encodedTopic;
                            }

                            var maximizeButton = document.createElement('span');
                            maximizeButton.setAttribute('class', 'glyphicon glyphicon-fullscreen');
                            maximizeButton.setAttribute('style', 'float:right;cursor: pointer;');
                            panelHead.appendChild(maximizeButton);
                            (function (maximizeButton, i, encodedURL) {
                                maximizeButton.addEventListener('click', function () {
                                    var columnWebView = $('#main-webview' + i);
                                    var qdNewTabItemsModal = $('#qdNewTabItemsModal');
                                    var web_dialog = $('#web_dialog');
                                    web_dialog.attr('src', columnWebView.attr('src'));
                                    qdNewTabItemsModal.modal('show');
                                });
                            })(maximizeButton, i, encodedURL);

                            var wikiButton = document.createElement('img');
                            wikiButton.setAttribute('src', '../img/wikipedia-32-black.png');
                            wikiButton.setAttribute('style', 'float:right;cursor: pointer;');
                            //panelHead.appendChild(wikiButton);
                            (function (wikiButton, i) {
                                wikiButton.addEventListener('click', function () {
                                    var columnWebView = $('#main-webview' + i);
                                    var qdNewTabItemsModal = $('#qdNewTabItemsModal');
                                    var web_dialog = $('#web_dialog');
                                    web_dialog.attr('src', columnWebView.attr('src'));
                                    qdNewTabItemsModal.modal('show');
                                });
                            })(wikiButton, i);

                            (function (navBtn, i) {
                                navBtn.addEventListener('click', function () {
                                    var leftPos = 522 * i;
                                    $('html, body').animate({
                                        scrollLeft: leftPos
                                    }, 800);
                                });
                            })(navBtn, i);

                            lbarDynamicRows.appendChild(navBtn);

                            webView.attr('src', encodedURL);

                            (function (webView, i) {
                                webView.on('loadstart', function () {});
                                webView.on('loadstop', function (e) {
                                    var mainContentWindow = e.target.contentWindow;
                                    var feed_item = $('.feed_item');
                                    injectCSS(webView.get(0), 'css/injected.css');

                                    var col_back_button = $('#col-back-button' + i);
                                    var currentWebView = document.querySelector('#main-webview' + i);
                                    if (currentWebView.canGoBack()) {
                                        col_back_button.show();
                                    } else {
                                        col_back_button.hide();
                                    }
                                });
                                webView.on('newwindow', function (e) {
                                    //This is to open in a new browser window
                                    //window.open(e.originalEvent.targetUrl);									
                                    var targetUrl = e.originalEvent.targetUrl;
                                    if (targetUrl.indexOf("chrome.google.com/webstore") != -1) {
                                        window.open(e.originalEvent.targetUrl);
                                    } else {
                                        var qdNewTabItemsModal = $('#qdNewTabItemsModal');
                                        var web_dialog = $('#web_dialog');
                                        web_dialog.attr('src', targetUrl);
                                        qdNewTabItemsModal.modal('show');

                                        var qd_dialog_back = $('#qd_dialog_back');
                                        var dialogWebView = document.querySelector('#web_dialog');
                                        if (dialogWebView.canGoBack()) {
                                            qd_dialog_back.show();
                                        } else {
                                            qd_dialog_back.hide();
                                        }
                                    }

                                });
                            })(webView, i);
                        }
                    }
                    if ($('.ps-container') === undefined || $('.ps-container').length < 1) {
                        $('#quoradeck_lbar').perfectScrollbar();
                    } else {
                        $('#quoradeck_lbar').perfectScrollbar('update');
                    }

                    var main_window_width = 522 * no_of_topics_to_display;
                    document.body.setAttribute('style', 'width: ' + main_window_width + 'px; height: 100%;margin-left:200px;');
                    console.log('wait');
                }
            });
        }


    });


}

var popupWebViewController = function () {
    var web_dialog = $('#web_dialog');
    web_dialog.on('newwindow', function (e) {
        var targetUrl = e.originalEvent.targetUrl;
        if (targetUrl.indexOf("chrome.google.com/webstore") != -1) {
            window.open(e.originalEvent.targetUrl);
        } else {
            var qdNewTabItemsModal = $('#qdNewTabItemsModal');
            var web_dialog = $('#web_dialog');
            web_dialog.attr('src', targetUrl);
            qdNewTabItemsModal.modal('show');

            var qd_dialog_back = $('#qd_dialog_back');
            var dialogWebView = document.querySelector('#web_dialog');
            if (dialogWebView.canGoBack()) {
                qd_dialog_back.show();
            } else {
                qd_dialog_back.hide();
            }
        }
    });
    web_dialog.on('loadstop', function (e) {
        var qd_dialog_back = $('#qd_dialog_back');
        var dialogWebView = document.querySelector('#web_dialog');
        if (dialogWebView.canGoBack()) {
            qd_dialog_back.show();
        } else {
            qd_dialog_back.hide();
        }
    });
}

var initialize = function () {
    console.log("first line of initialize");
    chrome.storage.local.get('isQDInitialized', function (result) {
        console.log("check if initialized " + result['isQDInitialized']);
        if (result && (result.isQDInitialized === undefined || result.isQDInitialized !== "true")) {
            doLogin();
        } else {
            console.log("in else of initialize " + result['isQDInitialized']);
            matrix_reloaded();
        }
    });
}