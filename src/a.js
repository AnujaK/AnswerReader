function log(message) {
  console.log("a.js message : "+message);
}

chrome.contextMenus.onClicked.addListener(function(info) {
  if (!document.hasFocus()) {
    log('Ignoring context menu click that happened in another window');
    return;
  }

  log('Item selected in A: ' + info.menuItemId);
});

window.addEventListener("load", function(e){
  log('Window A is loaded');
  setUpContextMenus("windowA");
});
window.addEventListener("focus", function(e) {
  log('Window A is focused');
  setUpContextMenus("windowA");
});

