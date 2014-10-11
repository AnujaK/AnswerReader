/*jslint devel: true */
/*global define, chrome, $, jQuery*/

var app = app || {};

jQuery(function ($) {
	'use strict';

	app.Settings = {

		save_topics: function (callback) {
			var topicsArr = new Array(),
				keyparam = "";
			for (var i = 0; i < 10; i++) {
				keyparam = document.getElementById("keyword" + i).value;
				topicsArr[i] = keyparam;
			}
			chrome.storage.local.set({
				'listOfTopics': JSON.stringify(topicsArr)
			}, function () {
				$('#myModal').modal('hide');
				callback();
			});
		},

		save_topic_quick: function (callback) {
			chrome.storage.local.get('listOfTopics', function (result) {
				var topics;
				if (result && (result.listOfTopics === undefined)) {
					topics = deepCopy(app.Constants.DEFAULT_TOPIC_COLUMNS);
				} else {
					topics = JSON.parse(result.listOfTopics);
					//removeByValue(topics, param_topic);
				}
				/*ToDo: Add the new topic at the end. The topics array shouldn't exceed 10 */
				var keyparam = document.getElementById("keyword_quickAdd").value;
				var length = topics.length;
				topics[length] = keyparam;
				chrome.storage.local.set({
					'listOfTopics': JSON.stringify(topics)
				}, function () {
					$('quickAddTopic').modal('hide');
					if (callback) {
						callback();
					}
				});
			});
		},

		save_home_settings: function (callback) {
			var homeColumns = app.Utils.deepCopy(app.Constants.DEFAULT_HOME_COLUMNS);
			var keyparam = false;
			for (var i = 0; i < homeColumns.length; i++) {
				keyparam = document.getElementById("home_tab" + i).checked;
				homeColumns[i].show = keyparam;
			}
			chrome.storage.local.set({
				'homeColumns': JSON.stringify(homeColumns)
			}, function () {
				if (callback) {
					callback();
				}
			});
		},

		remove_home_column: function (param_show, param_rel, callback) {
			chrome.storage.local.get('homeColumns', function (result) {
				var homeColumns;
				if (result && (result.homeColumns === undefined)) {
					homeColumns = deepCopy(app.Constants.DEFAULT_HOME_COLUMNS);
				} else {
					homeColumns = JSON.parse(result.homeColumns);
					for (var i = 0; i < homeColumns.length; i++) {
						if (homeColumns[i].rel === param_rel) {
							homeColumns[i].show = param_show;
							document.getElementById("home_tab" + i).checked = param_show;
						}
					}
				}
				chrome.storage.local.set({
					'homeColumns': JSON.stringify(homeColumns)
				}, function () {
					if (callback) {
						callback();
					}
				});
			});
		},

		remove_topic_column: function (param_topic, callback) {
			chrome.storage.local.get('listOfTopics', function (result) {
				var topics;
				if (result && (result.listOfTopics === undefined)) {
					topics = app.Utils.deepCopy(app.Constants.DEFAULT_TOPIC_COLUMNS);
				} else {
					topics = JSON.parse(result.listOfTopics);
					app.Utils.removeByValue(topics, param_topic);
				}
				chrome.storage.local.set({
					'listOfTopics': JSON.stringify(topics)
				}, function () {
					if (callback) {
						callback();
					}
				});
			});
		},

		restore_home_settings: function () {
			chrome.storage.local.get('homeColumns', function (result) {
				if (result && (result.homeColumns === undefined)) {
					var homeColumns = app.Utils.deepCopy(app.Constants.DEFAULT_HOME_COLUMNS);
					chrome.storage.local.set({
						'homeColumns': JSON.stringify(homeColumns)
					}, function () {
						app.Settings.display_home_settings(homeColumns)
					});
				} else {
					var homeColumns = JSON.parse(result.homeColumns);
					app.Settings.display_home_settings(homeColumns);
				}
			});
		},

		restore_topics: function () {
			chrome.storage.local.get('listOfTopics', function (result) {
				if (result && (result.listOfTopics === undefined)) {
					var topics = app.Utils.deepCopy(app.Constants.DEFAULT_TOPIC_COLUMNS);
					chrome.storage.local.set({
						'listOfTopics': JSON.stringify(topics)
					}, function () {
						app.Settings.display_topics(topics);
					});
				} else {
					var topics = JSON.parse(result.listOfTopics);
					app.Settings.display_topics(topics);
				}
			});
		},

		display_topics: function (topics) {
			for (var i = 0; i < 10; i++) {
				var key_val = topics[i];
				if (key_val)
					document.getElementById("keyword" + i).value = key_val;
			}
		},

		display_home_settings: function (homeColumns) {
			for (var i = 0; i < homeColumns.length; i++) {
				var key_val = homeColumns[i].show;
				if (key_val)
					document.getElementById("home_tab" + i).checked = key_val;
			}
		},

		save_topics_and_reload_quick: function () {
			app.Settings.save_home_settings();
			app.Settings.save_topic_quick(app.MainView.loadColumns);
		},

		save_topics_and_reload: function () {
			app.Settings.save_home_settings();
			app.Settings.save_topics(app.MainView.loadColumns);
		},

		refresh_page: function () {
			//does not work
			document.location.reload();
		},

		manage_topics_and_show: function () {
			app.Settings.restore_home_settings();
			app.Settings.restore_topics();
			$('#myModal').modal('show');
		},

		quick_add_topic_and_show: function () {
			$('#quickAddTopic').modal('show');
		}
	};
});