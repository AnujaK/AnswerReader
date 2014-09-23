/*jslint devel: true, vars: true*/
/*global define, chrome, $, jQuery, unescape*/
var app = app || {};

jQuery(function ($) {
    'use strict';

    app.Login = {
        apiLoginCalled: false,
        API_LOGGED_IN_USER_DETAILS: "",

        callApiToGetUserDetails: function () {
            console.log("Inside callApiToGetUserDetails");
            var newdiv = document.createElement('webview'),
                divIdName = 'user-details-api-webview';
            newdiv.setAttribute('id', divIdName);
            newdiv.setAttribute('partition', 'persist:quoradeck');
            newdiv.setAttribute('style', 'width:0px;height:0px;');
            document.body.appendChild(newdiv);
            var userDetailsWebView = $('#user-details-api-webview');
            userDetailsWebView.attr('src', 'http://api.quora.com/api/logged_in_user');
            userDetailsWebView.on('loadstart', function (e) {
                //Do nothing.
            });
            userDetailsWebView.on('contentload', function (e) {
                console.log("loadstop at callApiToGetUserDetails");
                var injectedJS = "var bodyText = document.body.innerText; " + "var isApiLoggedIn; " + "var apiResponse = {loggedInUserDetails : '', isApiLoggedIn : ''}; " + "bodyText = bodyText.substring(\"while(1);\".length); " + "apiResponse.loggedInUserDetails = bodyText; " + "if(bodyText == \"\"){apiResponse.isApiLoggedIn = 'false';}else{apiResponse.isApiLoggedIn = 'true';} " + "console.log('bodyText : '+bodyText);callbackData=apiResponse;";
                userDetailsWebView.get(0).executeScript({
                    code: injectedJS
                }, function (callbackData) {
                    var callbackResponse = callbackData[0];
                    if (callbackResponse.isApiLoggedIn == 'true') {
                        //TODO : verify the flow.
                        //app.MainView.popupWebViewController();

                        app.Login.API_LOGGED_IN_USER_DETAILS = JSON.parse(callbackResponse.loggedInUserDetails);
                        var qdhp_profile_btn_text = document.getElementById('qdhp_profile_btn_text');
                        qdhp_profile_btn_text.innerText = unescape("%A0%A0%A0") + app.Login.API_LOGGED_IN_USER_DETAILS.name;
                        app.MainView.loadColumns();
                    }
                });
            });
        },

        doLogin: function () {
            console.log("Inside doLogin");
            var defaultWebView = document.getElementById('default-webview');
            if (defaultWebView !== null) {
                //Do nothing.
            } else {
                var newdiv = document.createElement('webview'),
                    divIdName = 'default-webview';
                newdiv.setAttribute('id', divIdName);
                newdiv.setAttribute('style', 'width: 100%; height: 100%;');
                newdiv.setAttribute('partition', 'persist:quoradeck');
                newdiv.setAttribute('tabindex', 0);
                document.body.appendChild(newdiv);
            }

            var webViewHome = $('#default-webview');

            webViewHome.attr('src', 'http://www.quora.com/');
            webViewHome.on('loadstart', function (e) {
                //Do nothing.
            });
            webViewHome.on('loadstop', function (e) {
                //Do nothing.
            });

            webViewHome.on('loadcommit', function (e) {
                console.log("webViewHome#loadcommit is called");
            });

            webViewHome.on('loadabort', function (e) {
                console.log("webViewHome#loadabort is called");
            });

            webViewHome.on('contentload', function (e) {
                console.log("webViewHome#contentload is called");
                var injectedJS = "var login = document.getElementsByClassName('header_login_text_box'); " + "console.log('loaded login' + login.length); var localIsLoggedIn;" + "if(login.length > 0 ){console.log('login page'); localIsLoggedIn='false'; } " + "else{ console.log('logged-in home page'); localIsLoggedIn='true'; } " + "console.log('last line of execute script#injectedJS');callbackData=localIsLoggedIn;";
                webViewHome.get(0).executeScript({
                    code: injectedJS
                }, function (callbackData) {
                    console.log("is logged in : callbackData : " + callbackData);
                    //Imp : check proeprly before using === here!
                    if (callbackData == 'true') {
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
                            app.Settings.restore_topics();
                            app.Settings.restore_home_settings();
                            $('#myModal').modal('show');
                            app.Login.callApiToGetUserDetails();
                        });
                    } else {
                        console.log("callbackData is false...");
                    }
                });
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
                    var signUpWebView = $('#socialSignUpWebView'),
                        signUpWebViewURL = signUpWebView.attr('src');
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
        },

        apiLoginInWebView: function () {
            var newdiv = document.createElement('webview'),
                divIdName = 'default-webview';
            newdiv.setAttribute('id', divIdName);
            newdiv.setAttribute('style', 'width: 100%; height: 100%;');
            newdiv.setAttribute('partition', 'persist:quoradeck');
            newdiv.setAttribute('tabindex', 0);

            document.body.appendChild(newdiv);

            var webViewHome = $('#default-webview'),
                isLoginWebViewLoaded = false;

            webViewHome.attr('src', 'http://api.quora.com/api/logged_in_user?fields=notifs');
            webViewHome.on('loadstart', function (e) {
                //Do nothing.
            });
            webViewHome.on('contentload', function (e) {
                if (isLoginWebViewLoaded === false) {
                    isLoginWebViewLoaded = true;
                    if (app.Login.apiLoginCalled !== true) {
                        console.log("loadstop at apiLoginInWebView");
                        var injectedJS = "var bodyText = document.body.innerText; " + "var isApiLoggedIn; " + "var apiResponse = {loggedInUserDetails : '', isApiLoggedIn : ''}; " + "bodyText = bodyText.substring(\"while(1);\".length); " + "apiResponse.loggedInUserDetails = bodyText; " + "if(bodyText == \"\"){apiResponse.isApiLoggedIn = 'false';}else{apiResponse.isApiLoggedIn = 'true';} " + "console.log('bodyText2 : '+bodyText);callbackData=apiResponse;";
                        webViewHome.get(0).executeScript({
                            code: injectedJS
                        }, function (callbackData) {
                            console.log("test 123" + callbackData[0].isApiLoggedIn);
                            var callbackResponse = callbackData[0];
                            app.Login.apiLoginCalled = true;
                            if (callbackResponse.isApiLoggedIn === 'true') {
                                app.Login.API_LOGGED_IN_USER_DETAILS = JSON.parse(callbackResponse.loggedInUserDetails);
                                var qdhp_profile_btn_text = document.getElementById('qdhp_profile_btn_text');
                                qdhp_profile_btn_text.innerText = unescape("%A0%A0%A0") + app.Login.API_LOGGED_IN_USER_DETAILS.name;
                                app.MainView.loadColumns();
                            } else {
                                console.log("calling doLogin");
                                app.Login.doLogin();
                            }

                        });
                    }
                }
            });
        }
    };
});