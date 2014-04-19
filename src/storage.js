"use strict";

function show_saved_items(){
	//restore_home_settings();
	//restore_savedItems();
	//loadSampleBookmarks();
	fetchAllIdxBookmarks(show_sample_data);
	$('#savedItemsModal').modal('show');	
}

function show_sample_data(bookmarkArray){
	//console.log("inside show_sample_data");
	if(bookmarkArray !== undefined){
		//remove old tbody if present
		var old_tbody = document.getElementById("qd_savedItems_tbody");
		if(old_tbody != null){
			old_tbody.remove();
		}
		//add new tbody
		var bookmarksTable = document.getElementById('qd_savedItems_table');
		var new_tbody = document.createElement('tbody');
		new_tbody.setAttribute('id', 'qd_savedItems_tbody');
		bookmarksTable.appendChild(new_tbody);	
		

		for(var i = 0; i<bookmarkArray.length; i++){
			var rowId = bookmarkArray[i].id;
			var row = document.createElement('tr');
			row.setAttribute('id','qd_row_'+rowId);
		
			var col2 = document.createElement('td');
			var hlink = document.createElement('a');
			hlink.setAttribute('href', bookmarkArray[i].link);
			hlink.setAttribute('target', '_blank');
			hlink.innerText = bookmarkArray[i].question;
			col2.appendChild(hlink);
			row.appendChild(col2);
			
			//add delete buttons
			var col = document.createElement('td');
			var delbtn = document.createElement('span');
			delbtn.setAttribute('class', 'glyphicon glyphicon-trash');
			delbtn.addEventListener('click', delete_saved_item_reload);
			delbtn.setAttribute('id', 'qd_id_'+rowId);
			col.appendChild(delbtn);			
			row.appendChild(col);
			new_tbody.appendChild(row);
		}
		
	}
	
}
var restore_savedItems = function() {
	chrome.storage.local.get('listOfSavedItems', function (result) {
		var savedItems;
		if(result && (result.listOfSavedItems === undefined)){
			savedItems = ["Which trading plattforms are used by hedgefunds1?", "What are some disadvantages or drawbacks of books1?", "What will you be doing at 9am on December 23, 2018 1?","What are the reasons for poor Campus Placement at IIIT-H this year1?","Which trading plattforms are used by hedgefunds2?", "What are some disadvantages or drawbacks of books2?", "What will you be doing at 9am on December 23, 2018 2?","What are the reasons for poor Campus Placement at IIIT-H this year2?","Which trading plattforms are used by hedgefunds 3?", "What are some disadvantages or drawbacks of books3?", "What will you be doing at 9am on December 23, 2018 3?","What are the reasons for poor Campus Placement at IIIT-H this year3?","Which trading plattforms are used by hedgefunds4?", "What are some disadvantages or drawbacks of books4?", "What will you be doing at 9am on December 23, 2018 4?","What are the reasons for poor Campus Placement at IIIT-H this year 4?"];
			chrome.storage.local.set({'listOfSavedItems': JSON.stringify(savedItems)}, function(){ display_topics(savedItems)});
		}
		else{
			savedItems = JSON.parse(result.listOfSavedItems);
		}
		var tableBody = document.getElementById('qd_savedItems_tbody');
		for(var i = 0; i < savedItems.length; i++){
			var row = document.createElement('tr');
			row.setAttribute('id','row_'+i);
			
			//add item from listOfSavedItems			
			var col2 = document.createElement('td');
			col2.innerText = savedItems[i];
			row.appendChild(col2);
			
			//add delete buttons
			var col = document.createElement('td');
			var delbtn = document.createElement('span');
			delbtn.setAttribute('class', 'glyphicon glyphicon-trash');
			delbtn.addEventListener('click', delete_saved_item_reload);
			delbtn.setAttribute('id', 'id_'+i);
			col.appendChild(delbtn);			
			row.appendChild(col);
			tableBody.appendChild(row);
		}
	});
}

var delete_saved_item_reload = function() {
	//var arraySplit = this.id.split('_');
	//var deleteId = arraySplit[1];
	//chrome.storage.local.get('listOfSavedItems', function (result) {
		//if(result && (result.listOfSavedItems !== undefined)){
			//document.getElementById('row_'+deleteId).style.display='none';
			//var savedItems = JSON.parse(result.listOfSavedItems);
			//savedItems.splice(deleteId,1);
		    //console.log("New array : "+savedItems);
			//chrome.storage.local.set({'listOfSavedItems': JSON.stringify(savedItems)}, function(){ display_topics(savedItems)});
		//}
		//});
	var deleteBookmarkId = this.id.substring(6);
	document.getElementById("qd_row_"+deleteBookmarkId).remove();
	//console.log("In delete_saved_item_reload before deleting id: "+deleteBookmarkId);
	deleteIdxBookmark(parseInt(deleteBookmarkId));
}
