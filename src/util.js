/*jslint devel: true */
/*global define, chrome, $*/
"use strict";

function scrollToColumn(id, off) {
    $('body, html').scrollLeft(5000);
}

function getQuoraUserDetails() {
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
}

var open_qd_search = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');
    web_dialog.attr('src', 'https://www.quora.com/search');
    qdNewTabItemsModal.modal('show');
};

var open_qd_profile = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');
    web_dialog.attr('src', API_LOGGED_IN_USER_DETAILS.link);
    qdNewTabItemsModal.modal('show');
};

var open_qd_stats = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');
    web_dialog.attr('src', 'https://www.quora.com/stats');
    qdNewTabItemsModal.modal('show');
};

var open_qd_credits = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');
    web_dialog.attr('src', 'https://www.quora.com/credits');
    qdNewTabItemsModal.modal('show');
};

var open_qd_blog = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');
    web_dialog.attr('src', 'http://quoradeckblog.quora.com/');
    qdNewTabItemsModal.modal('show');
};

var open_qd_contact = function () {
    var qdNewTabItemsModal = $('#qdNewTabItemsModal'), web_dialog = $('#web_dialog');

    web_dialog.attr('src', 'http://www.quora.com/Anuja-Kulkarni-Kumar');
    qdNewTabItemsModal.modal('show');
};

var qd_dialog_back_handler = function () {
    var dialogWebView = document.querySelector('#web_dialog');
    dialogWebView.back();
};

//UTIL FUNCTIONS
function deepCopy(o) {
    var copy = o,
        k;

    if (o && typeof o === 'object') {
        copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
        for (k in o) {
            copy[k] = deepCopy(o[k]);
        }
    }
    return copy;
}

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

function removeByIndex(arr, index) {
    arr.splice(index, 1);
}

function groupBy(data, param) {
    return _.groupBy(data, param);
}

function filterByHome(data) {
    return _.filter(data, function (item) {
        return item.type == 'home';
    });
}

function filterByTopic(data) {
    return _.filter(data, function (item) {
        return item.type == 'topic';
    });
}

function sortByColIdx(data) {
    return _.sortBy(data, function (item) {
        return item.colIdx;
    });
}

function moveToIndex(arr, moveIndex, toIndex) {
    var removedItem = arr.splice(moveIndex, 1);
    arr.splice(toIndex, 0, removedItem);
}