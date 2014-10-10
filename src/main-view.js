/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, chrome, $, jQuery, unescape*/

//TODO : 1. Code cleanup. 2. Add meaningful log statements.

var app = app || {};

jQuery(function ($) {
	'use strict';

	app.MainView = {

		bindEvents: function () {
			document.getElementById('qd_topics_save').addEventListener('click', app.Settings.save_topics);
			document.getElementById('qd_topics_save_reload').addEventListener('click', app.Settings.save_topics_and_reload);
			document.getElementById('manage_quora_topics').addEventListener('click', app.Settings.manage_topics_and_show);

			document.getElementById('qdhp_search_btn').addEventListener('click', app.Utils.open_qd_search);
			document.getElementById('qdhp_profile_btn').addEventListener('click', app.Utils.open_qd_profile);
			document.getElementById('qdhp_inbox_btn').addEventListener('click', app.Utils.open_qd_inbox);

			document.getElementById('qdhp_reading_btn').addEventListener('click', app.Utils.open_qd_reading);
			document.getElementById('qdhp_content_btn').addEventListener('click', app.Utils.open_qd_content);

			document.getElementById('qdhp_stats_btn').addEventListener('click', app.Utils.open_qd_stats);
			document.getElementById('qdhp_credits_btn').addEventListener('click', app.Utils.open_qd_credits);

			document.getElementById('qdhp_reload_btn').addEventListener('click', app.MainView.loadColumns);
			document.getElementById('qd_blog').addEventListener('click', app.Utils.open_qd_blog);
			document.getElementById('qd_contact').addEventListener('click', app.Utils.open_qd_contact);

			document.getElementById('qd_dialog_back').addEventListener('click', app.Utils.qd_dialog_back_handler);
			document.getElementById('quick_add_topic').addEventListener('click', app.Settings.quick_add_topic_and_show);
			document.getElementById('qd_topics_save_quick').addEventListener('click', app.Settings.save_topic_quick);
			document.getElementById('qd_topics_save_reload_quick').addEventListener('click', app.Settings.save_topics_and_reload_quick);

			document.getElementById('quoradeck_lbar').addEventListener('mouseenter', app.Utils.open_left_nav);
			document.getElementById('quoradeck_lbar').addEventListener('mouseleave', app.Utils.close_left_nav);

			//Login workflow
			app.Login.apiLoginInWebView();

			//web-view popup controller
			app.MainView.popupWebViewController();
		},

		loadColumns: function () {
			console.log("Inside loadColumns function");
			var webViewHome = document.getElementById('default-webview');
			if (webViewHome !== null) {
				webViewHome.parentNode.removeChild(webViewHome);
			}

			var lbarDynamicRowsWrapper = document.getElementById('lbar_dynamic_rows_wrapper');
			var lbarDynamicRows = document.getElementById('lbar_dynamic_rows');
			if (lbarDynamicRows !== null) {
				lbarDynamicRows.parentNode.removeChild(lbarDynamicRows);
			}

			lbarDynamicRows = document.createElement('Div');
			var lbarDynamicRowsName = 'lbar_dynamic_rows';
			lbarDynamicRows.setAttribute('id', lbarDynamicRowsName);
			lbarDynamicRowsWrapper.appendChild(lbarDynamicRows);

			$(".main-webview-panel").remove();

			chrome.storage.local.get('listOfTopics', function (result) {
				//console.log("loadColumns#result.listOfTopics : " + result.listOfTopics);

				var topics = app.Utils.deepCopy(app.Constants.DEFAULT_TOPIC_COLUMNS);

				if (result && (result.listOfTopics === undefined)) {
					chrome.storage.local.set({
						'listOfTopics': JSON.stringify(topics)
					}, function () {
						app.Utils.display_topics(topics);
					});
				} else {
					topics = JSON.parse(result.listOfTopics);
				}
				chrome.storage.local.get('homeColumns', function (result) {
					//console.log("loadColumns#result.homeColumns : " + result.homeColumns);

					var homeColumns = app.Utils.deepCopy(app.Constants.DEFAULT_HOME_COLUMNS);

					if (result && (result.homeColumns === undefined)) {
						chrome.storage.local.set({
							'homeColumns': JSON.stringify(homeColumns)
						}, function () {
							app.Utils.display_home_settings(homeColumns);
						});
					} else {
						homeColumns = JSON.parse(result.homeColumns);
					}
					var hColumnLoop = 0;
					homeColumns.forEach(function (homeColumnVal, index) {
						var key_val = homeColumnVal.show;
						if (key_val) {
							document.getElementById("home_tab" + index).checked = key_val;
							topics.splice(hColumnLoop, 0, homeColumnVal.rel);
							hColumnLoop++;
						}
					});

					var no_of_topics = topics.length;
					var no_of_topics_to_display = 0;
					console.log("no_of_topics : " + no_of_topics);

					topics.forEach(function (topicVal, i) {

						console.log("value of i : " + i);
						if (i == 0 || topicVal != "") {
							no_of_topics_to_display++;

							var panel = document.createElement('div');
							panel.setAttribute('class', 'panel panel-default main-webview-panel');
							panel.setAttribute('style', 'width: 522px; height: 100%; display: inline-block;');
							panel.setAttribute('id', 'main-webview-panel' + i);

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
							navSpan.setAttribute('class', 'lbar_menu_text');
							var lbLabel;
							if (topicVal == "") {
								lbLabel = "Top Stories";
								navSpanIconClass = 'glyphicon glyphicon-home';
								navSpanIcon.setAttribute('class', navSpanIconClass);
								navBtn.appendChild(navSpanIcon);
							} else if (topicVal in app.Constants.HOME_COLUMNS_LABEL_MAP) {
								var home_key = topicVal;
								lbLabel = app.Constants.HOME_COLUMNS_LABEL_MAP[home_key];
								navSpanIconClass = app.Constants.HOME_COLUMNS_ICON_MAP[home_key];
								navSpanIcon.setAttribute('class', navSpanIconClass);
								navBtn.appendChild(navSpanIcon);
							} else {
								lbLabel = topicVal;
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

							var encodedTopic = encodeURIComponent(topicVal);
							var encodedURL;
							if (encodedTopic === topicVal || topicVal.indexOf('-') != -1 || topicVal.indexOf('/') != -1) {
								encodedURL = 'http://www.quora.com/' + topicVal;
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
									var web_dialog = document.getElementById('web_dialog');
									if (web_dialog !== null) {
										web_dialog.parentNode.removeChild(web_dialog);
									}
									var newdiv = document.createElement('webview');
									newdiv.setAttribute('id', 'web_dialog');
									newdiv.setAttribute('partition', 'persist:quoradeck');
									newdiv.setAttribute('style', 'width:100%;height:100%;');
									newdiv.setAttribute('src', columnWebView.attr('src'));

									document.getElementById('qdNewTabBody').appendChild(newdiv);
									qdNewTabItemsModal.modal('show');
								});
							})(maximizeButton, i, encodedURL);

							var deleteButton = document.createElement('img');
							deleteButton.setAttribute('src', '../img/RecycleBin.png');
							deleteButton.setAttribute('style', 'float:right;cursor:pointer;height:15px;margin-right:10px;');
							panelHead.appendChild(deleteButton);
							(function (deleteButton, i, encodedURL) {
								deleteButton.addEventListener('click', function () {
									var mainWebViewPanel = document.getElementById('main-webview-panel' + i);
									if (mainWebViewPanel !== null) {
										mainWebViewPanel.parentNode.removeChild(mainWebViewPanel);
									}
								});
							})(deleteButton, i, encodedURL);

							var wikiButton = document.createElement('img');
							wikiButton.setAttribute('src', '../img/wikipedia-32-black.png');
							wikiButton.setAttribute('style', 'float:right;cursor: pointer;');
							//                    panelHead.appendChild(wikiButton);
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
								//TODO : loadstop or contentload?
								webView.on('contentload', function (e) {
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
										var web_dialog = document.getElementById('web_dialog');
										if (web_dialog !== null) {
											web_dialog.parentNode.removeChild(web_dialog);
										}
										var newdiv = document.createElement('webview');
										newdiv.setAttribute('id', 'web_dialog');
										newdiv.setAttribute('partition', 'persist:quoradeck');
										newdiv.setAttribute('style', 'width:100%;height:100%;');
										newdiv.setAttribute('src', targetUrl);

										document.getElementById('qdNewTabBody').appendChild(newdiv);
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
					});

					if ($('.ps-container') === undefined || $('.ps-container').length < 1) {
						$('#quoradeck_lbar').perfectScrollbar();
					} else {
						$('#quoradeck_lbar').perfectScrollbar('update');
					}

					var main_window_width = 522 * no_of_topics_to_display;
					document.body.setAttribute('style', 'width: ' + main_window_width + 'px; height: 100%;margin-left:50px;');
				});
			});
		},

		popupWebViewController: function () {
			var web_dialog = $('#web_dialog');
			web_dialog.on('newwindow', function (e) {
				e.preventDefault();
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
		},

		initialize: function () {
			console.log("first line of initialize");
			chrome.storage.local.get('isQDInitialized', function (result) {
				console.log("check if initialized " + result.isQDInitialized);
				if (result && (result.isQDInitialized === undefined || result.isQDInitialized !== "true")) {
					app.Login.doLogin();
				} else {
					console.log("in else of initialize " + result.isQDInitialized);
					app.MainView.loadColumns();
				}
			});
		}
	};
	app.MainView.bindEvents();
});