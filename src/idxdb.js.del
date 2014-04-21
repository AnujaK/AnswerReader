var srIdxDB = {};
var dbName = "QDChromeApp";
var dbVersion = "1";
srIdxDB.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
srIdxDB.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
srIdxDB.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

srIdxDB.indexedDB.onerror = function (e) {
	console.log("Database error: " + e.target.errorCode);
};
createIdxDB();
function createIdxDB() {
	console.log('createIdxDB');
	var openRequest = srIdxDB.indexedDB.open(dbName, dbVersion);
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	openRequest.onsuccess = function(event) {
		console.log("Database created");
		srIdxDB.db = openRequest.result;
	};	
	openRequest.onupgradeneeded = function (evt) {   
		console.log('Creating object store');
		
		var categoryStore = evt.currentTarget.result.createObjectStore("bookmarks", {keyPath: "id", autoIncrement:true});
	};
}
function openIdxDB() {
	console.log('openIdxDB');
	var openRequest = srIdxDB.indexedDB.open(dbName);
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	openRequest.onsuccess = function(event) {
		srIdxDB.db = openRequest.result;
	};	
}
function deleteIdxDB() {
	console.log('deleteIdxDB');
	var deleteDbRequest = srIdxDB.indexedDB.deleteDatabase(dbName);
	deleteDbRequest.onsuccess = function (event) {
   		console.log('Database deleted');
	};
	deleteDbRequest.onerror = function (e) {
		console.log("Database error: " + e.target.errorCode);
	};	
}