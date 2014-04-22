"use strict";

function save_topics(callback) {
    var topicsArr = new Array();
    var keyparam = "";
    for (var i = 0; i < 10; i++) {
        keyparam = document.getElementById("keyword" + i).value;
        topicsArr[i] = keyparam;
    }
    chrome.storage.local.set({
        'listOfTopics': JSON.stringify(topicsArr)
    }, function () {
        $('#myModal').modal('hide');
        callback()
    });
}

function save_topic_quick(callback) {
    chrome.storage.local.get('listOfTopics', function (result) {
        var topics;
        if (result && (result.listOfTopics === undefined)) {
            topics = deepCopy(DEFAULT_TOPIC_COLUMNS);
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
                callback()
            }
        });
    });
}

function save_home_settings(callback) {
    var homeColumns = deepCopy(DEFAULT_HOME_COLUMNS);
    var keyparam = false;
    for (var i = 0; i < homeColumns.length; i++) {
        keyparam = document.getElementById("home_tab" + i).checked;
        homeColumns[i].show = keyparam;
    }
    chrome.storage.local.set({
        'homeColumns': JSON.stringify(homeColumns)
    }, function () {
        if (callback) {
            callback()
        }
    });
}

function remove_home_column(param_show, param_rel, callback) {
    chrome.storage.local.get('homeColumns', function (result) {
        var homeColumns;
        if (result && (result.homeColumns === undefined)) {
            homeColumns = deepCopy(DEFAULT_HOME_COLUMNS);
        } else {
            homeColumns = JSON.parse(result.homeColumns);
            for (var i = 0; i < homeColumns.length; i++) {
                if (homeColumns[i].rel === param_rel) {
                    homeColumns[i].show = param_show;
                }
            }
        }
        chrome.storage.local.set({
            'homeColumns': JSON.stringify(homeColumns)
        }, function () {
            if (callback) {
                callback()
            }
        });
    });
}

function remove_topic_column(param_topic, callback) {
    chrome.storage.local.get('listOfTopics', function (result) {
        var topics;
        if (result && (result.listOfTopics === undefined)) {
            topics = deepCopy(DEFAULT_TOPIC_COLUMNS);
        } else {
            topics = JSON.parse(result.listOfTopics);
            removeByValue(topics, param_topic);
        }
        chrome.storage.local.set({
            'listOfTopics': JSON.stringify(topics)
        }, function () {
            if (callback) {
                callback()
            }
        });
    });
}

function restore_home_settings() {
    chrome.storage.local.get('homeColumns', function (result) {
        if (result && (result.homeColumns === undefined)) {
            var homeColumns = deepCopy(DEFAULT_HOME_COLUMNS);
            chrome.storage.local.set({
                'homeColumns': JSON.stringify(homeColumns)
            }, function () {
                display_home_settings(homeColumns)
            });
        } else {
            var homeColumns = JSON.parse(result.homeColumns);
            display_home_settings(homeColumns);
        }
    });
}

function restore_topics() {
    chrome.storage.local.get('listOfTopics', function (result) {
        if (result && (result.listOfTopics === undefined)) {
            var topics = deepCopy(DEFAULT_TOPIC_COLUMNS);
            chrome.storage.local.set({
                'listOfTopics': JSON.stringify(topics)
            }, function () {
                display_topics(topics)
            });
        } else {
            var topics = JSON.parse(result.listOfTopics);
            display_topics(topics);
        }
    });
}

function display_topics(topics) {
    for (var i = 0; i < 10; i++) {
        var key_val = topics[i];
        if (key_val)
            document.getElementById("keyword" + i).value = key_val;
    }
}

function display_home_settings(homeColumns) {
    for (var i = 0; i < homeColumns.length; i++) {
        var key_val = homeColumns[i].show;
        if (key_val)
            document.getElementById("home_tab" + i).checked = key_val;
    }
}

function save_topics_and_reload_quick() {
    save_home_settings();
    save_topic_quick(matrix_reloaded);
}

function save_topics_and_reload() {
    save_home_settings();
    save_topics(matrix_reloaded);
}

function refresh_page() {
    //does not work
    document.location.reload();
}

function manage_topics_and_show() {
    restore_home_settings();
    restore_topics();
    $('#myModal').modal('show');
}

function quick_add_topic_and_show() {
    $('#quickAddTopic').modal('show');
}