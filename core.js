var tabBuffer={};
var tabRelation={};
var strInfo="";
var strType="";
var lastTableId;
var Url='http://lema.lemxx.com/openapi/openapi/packageslist.html?mobile=';
var shouji='';
var lastList=[];
var fahuoUrl="";
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
	if(request.type == "toDaifa")
	{
		toDaifa(request, sender, sendResponse);
	}
	else if(request.type == "getList")
	{
		getList(request, sender, sendResponse);
	}
	else if(request.type == "autoOrder")
	{
		httpRequest('http://'+fahuoUrl+'/index/index/isloginmobile',aaaa);
		if(shouji =='')
		{
			sendResponse({
			type: "alert",
			orderType:'autoOrder',
			message:'请先登录代发网站'})
			return ;
		}
		httpRequest(Url+shouji,
		function(source)
		{
			sendMessageToContentScript({
				type: "getOrder_Taobao",
				orderType:'taobao',
				source
				}, function(response){	
					console.log(response);
					});
		});
	}
});

function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}

function toDaifa(request,sender,sendResponse)
{
	chrome.tabs.create({
		url: 'http://'+fahuoUrl+'/index/order/fahuo.html',  //正式
		selected: true,
		pinned: false
    }, function(tab) {
		lastList=request.list;
		lastTableId = sender.tab.id;
		strType=request.orderType;
		sendResponse(request);
    });
}
function getList(request, sender, sendResponse)
{
	request.list=lastList;
	lastList=[];
	sendResponse(request);
}
httpRequest('http://'+fahuoUrl+'/index/index/isloginmobile',aaaa);
function aaaa(source)
{
	shouji=source
}
//设置url
function setFahuoUrl(url)
{
	fahuoUrl=url;
}
function getFahuoUrl()
{
	return fahuoUrl;
}
