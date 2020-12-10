function getRecInfo(){
chrome.tabs.executeScript(tabId, {code: 'document.body.style.backgroundColor="red"'});
}

$('#test').click(() => {
	alert('收到来自content-script的回复：');
});