/*jslint devel: true */
/*global define, chrome, jQuery*/


var app = app || {};

jQuery(function ($) {
    'use strict';
    app.Constants = {

        QD_DEFAULT_COLUMN_SETTINGS: [
            {
                "lbl": "Top Stories",
                "type": "home",
                "show": true,
                "colIdx": 1,
                "colKey": "top_stories",
                "rel": ""
            },
            {
                "lbl": "Questions & Answers",
                "type": "home",
                "show": false,
                "colIdx": -1,
                "colKey": "questions",
                "rel": "questions"
            },
            {
                "lbl": "Open Questions",
                "type": "home",
                "show": false,
                "colIdx": -1,
                "colKey": "open_questions",
                "rel": "open_questions"
            },
            {
                "lbl": "Blog Posts",
                "type": "home",
                "show": false,
                "colIdx": -1,
                "colKey": "posts",
                "rel": "posts"
            },
            {
                "lbl": "Notifications",
                "type": "home",
                "show": true,
                "colIdx": 2,
                "colKey": "notifications",
                "rel": "notifications"
            },
            {
                "lbl": "Music",
                "type": "topic",
                "show": true,
                "colIdx": 3,
                "colKey": "Music",
                "rel": "Music"
            },
            {
                "lbl": "Photography",
                "type": "topic",
                "show": true,
                "colIdx": 4,
                "colKey": "Photography",
                "rel": "Photography"
            },
            {
                "lbl": "Lists of Top Quora Content",
                "type": "topic",
                "show": true,
                "colIdx": 5,
                "colKey": "Lists-of-Top-Quora-Content",
                "rel": "Lists-of-Top-Quora-Content"
            }
        ],
        DEFAULT_HOME_COLUMNS: [
            {
                "show": true,
                "rel": ""
            },
            {
                "show": false,
                "rel": "questions"
            },
            {
                "show": false,
                "rel": "open_questions"
            },
            {
                "show": false,
                "rel": "posts"
            },
            {
                "show": true,
                "rel": "notifications"
            }
        ],
        DEFAULT_TOPIC_COLUMNS: [
            "Photography",
            "Lists-of-Top-Quora-Content",
            "Hollywood"
        ],
        HOME_COLUMNS_LABEL_MAP: {
            "questions": "Questions & Answers",
            "open_questions": "Open Questions",
            "posts": "Blog Posts",
            "notifications": "Notifications"
        },
        HOME_COLUMNS_ICON_MAP: {
            "questions": "glyphicon glyphicon-font",
            "open_questions": "glyphicon glyphicon-question-sign",
            "posts": "glyphicon glyphicon-bold",
            "notifications": "glyphicon glyphicon-bullhorn"
        }
    };
});