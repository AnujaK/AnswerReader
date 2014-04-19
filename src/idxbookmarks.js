function loadSampleBookmarks(){
	var sampleDataArr = [
		{"question":"What is your name?", 
		"link":"http://www.quora.com/Grammar/Does-any-language-have-affixes-to-represent-less-and-least-like-the-English-er-suffix-means-more-and-est-most"
		},
		{"question":"What is your name2?", 
		"link":"http://www.quora.com/Grammar/Does-any-language-have-affixes-to-represent-less-and-least-like-the-English-er-suffix-means-more-and-est-most"
		},
		{"question":"Entrepreneurship: How can I spend my $35 to get the best return on investment1?",
		"link":"http://www.quora.com/Investing/Entrepreneurship-How-can-I-spend-my-35-to-get-the-best-return-on-investment"
		},
		{"question":"Entrepreneurship: How can I spend my $35 to get the best return on investment2?",
		"link":"http://www.quora.com/Investing/Entrepreneurship-How-can-I-spend-my-35-to-get-the-best-return-on-investment"
		},
		{"question":"What is the best guitar store in bangalore1?",
		"link":"http://www.quora.com/Guitars/What-is-the-best-guitar-store-in-bangalore"
		},
		{"question":"What is the best guitar store in bangalore2?",
		"link":"http://www.quora.com/Guitars/What-is-the-best-guitar-store-in-bangalore"
		}
	];
	for(var i = 0; i<sampleDataArr.length; i++){
		addIdxBookmark(sampleDataArr[i]);
		console.log("adding bookmark addIdxBookmark");
	}
}

function addIdxBookmark(data, callback) {
	var sampleData = data;
	try {		
		var transaction = srIdxDB.db.transaction("bookmarks", "readwrite");
		var store = transaction.objectStore("bookmarks");
		if (srIdxDB != null && srIdxDB.db != null) {
			var request = store.add(sampleData);
			request.onsuccess = function(e) {
				console.log('addIdxBookmark#onsuccess'+e.target.result);
			};
			
			request.onerror = function(e) {
				console.log('addIdxBookmark#onerror : '+e.value);
			};
		}
	}
	catch(e){
		console.log(e);
	}
}

function deleteIdxBookmark(id, callback) {
	console.log('deleteIdxBkmark id: '+id);
	try {
		var transaction = srIdxDB.db.transaction("bookmarks", "readwrite");
		var store = transaction.objectStore("bookmarks");                    
		if (srIdxDB != null && srIdxDB.db != null) {
			var request = store.delete(id);
			request.onsuccess = function(e) {
				console.log('deleteIdxBookmark#onsuccess'+e.target.result);
			};
			request.onerror = function(e) {
				console.log(e.value);
			};
		}
	}
	catch(e){
		console.log(e);
	}
}

function fetchAllIdxBookmarks(callback) {
	try {
		if (srIdxDB != null && srIdxDB.db != null) {
			var store = srIdxDB.db.transaction("bookmarks").objectStore("bookmarks");
			var request = store.openCursor();
			var bookmarkArray = [];
			request.onsuccess = function(evt) {  
			    var cursor = evt.target.result;  
			    if (cursor) {
			    	var bookmarkItem = cursor.value;
					//console.log(bookmarkItem);
					bookmarkArray.push(bookmarkItem);
			        cursor.continue();  
			    }  
				else if (callback && typeof(callback) === "function") {
					// execute the callback, passing parameters as necessary
					callback(bookmarkArray);
				}
			};
		}
	}
	catch(e){
		console.log(e);
	}
}
