/*jslint devel: true */
/*global define, chrome, $, jQuery*/

var app = app || {};

jQuery(function ($) {
	'use strict';

	app.Utils = {
		scrollToColumn: function (id, off) {
			$('body, html').scrollLeft(5000);
		},

		getQuoraUserDetails: function () {
			chrome.alarms.create("QUORA_USER_DETAILS_ALARM", {
				delayInMinutes: 1
			});
			chrome.alarms.get("QUORA_USER_DETAILS_ALARM", function (alarm) {
				//console.log("Scheduled Time  "+ alarm.scheduledTime);
			});
			chrome.alarms.onAlarm.addListener(function (alarm) {
				//console.log("Alarm Elapsed Name "+alarm.name);
				//console.log("This is Over");
				chrome.alarms.clear("QUORA_USER_DETAILS_ALARM");
				//console.log(" Alarms Cleared");
			});
		},

		open_qd_search: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'https://www.quora.com/search');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_reading: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'http://www.quora.com/reading_list');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_content: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'http://www.quora.com/content');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_profile: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', app.Login.API_LOGGED_IN_USER_DETAILS.link);

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_inbox: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'https://www.quora.com/messages');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_stats: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'https://www.quora.com/stats');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_credits: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'https://www.quora.com/credits');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_blog: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'http://answerreader.quora.com/');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		open_qd_contact: function () {
			var qdNewTabItemsModal = $('#qdNewTabItemsModal'),
				web_dialog = document.getElementById('web_dialog');
			if (web_dialog !== null) {
				web_dialog.parentNode.removeChild(web_dialog);
			}
			var newdiv = document.createElement('webview');
			newdiv.setAttribute('id', 'web_dialog');
			newdiv.setAttribute('partition', 'persist:quoradeck');
			newdiv.setAttribute('style', 'width:100%;height:100%;');
			newdiv.setAttribute('src', 'http://www.quora.com/Anuja-Kulkarni-Kumar');

			document.getElementById('qdNewTabBody').appendChild(newdiv);

			qdNewTabItemsModal.modal('show');
		},

		qd_dialog_back_handler: function () {
			var dialogWebView = document.querySelector('#web_dialog');
			dialogWebView.back();
		},

		deepCopy: function (o) {
			var copy = o,
				k;

			if (o && typeof o === 'object') {
				copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
				for (k in o) {
					copy[k] = this.deepCopy(o[k]);
				}
			}
			return copy;
		},

		removeByValue: function (arr, val) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == val) {
					arr.splice(i, 1);
					break;
				}
			}
		},

		removeByIndex: function (arr, index) {
			arr.splice(index, 1);
		},

		groupBy: function (data, param) {
			return _.groupBy(data, param);
		},

		filterByHome: function (data) {
			return _.filter(data, function (item) {
				return item.type == 'home';
			});
		},

		filterByTopic: function (data) {
			return _.filter(data, function (item) {
				return item.type == 'topic';
			});
		},

		sortByColIdx: function (data) {
			return _.sortBy(data, function (item) {
				return item.colIdx;
			});
		},

		moveToIndex: function (arr, moveIndex, toIndex) {
			var removedItem = arr.splice(moveIndex, 1);
			arr.splice(toIndex, 0, removedItem);
		}
	};
});