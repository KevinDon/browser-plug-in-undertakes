var strUrl="";
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
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}
function executeScriptToCurrentTab(code)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.executeScript(tabId, {code: code});
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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == "jiesuokaishi")
	{
		document.getElementById('RecvInfo_InPut').value=request.message;
	}
	else if(request.cmd == 'jiesuotingzhi')
	{
		document.getElementById('RecvInfo_InPut').value=request.message;
	}
});

function getServer_Taobao(source)
{
	//预留做一下操作
	sendMessageToContentScript({
      type: "getOrder_Taobao",
      orderType:'taobao',
      source
    }, function(response){
		if(response){
			console.log(response);
		}
	});
}
//可以注入的时候用
$('#open_Taobao').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	executeScriptToCurrentTab('window.open(\'https://trade.taobao.com/trade/itemlist/list_sold_items.htm\')');
});

//获取淘宝地址并自动打开代发界面输入地址信息
$('#getRecvInfo_Taobao').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	chrome.tabs.getSelected(null, function (tab) {
		
		// tab.url.split()
		var str1=tab.url.substring(0,tab.url.lastIndexOf("?"));
			if(str1!='https://wuliu.taobao.com/user/batch_consign.htm'){
				alert('请先打开淘宝发货页面！')
			}
	   });
	sendMessageToContentScript('getRecvInfo_Taobao', function(response){
		if(response){
			console.log(response);
		}
	});
});

var shouji='18158424282';
  
function aaaa(source)
{
	
	shouji=source
}

httpRequest('http://www.xmdaifa.com/index/index/isloginmobile',aaaa);

//获取相关信息
$('#getOrder_Taobao').click(() => {

	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	if(shouji==''){
		alert('请先登录代发网站');
		return ;
	}
	chrome.tabs.getSelected(null, function (tab) {
		let str1=tab.url.substring(0,tab.url.lastIndexOf("?"));
		if(str1.indexOf('https://wuliu.taobao.com/user/batch_consign.htm') == -1){
			alert('请先打开淘宝发货页面！');
			return ;
		}
		chrome.extension.sendRequest({
		type: "autoOrder",
		orderType:'taobao',
		}, function(response) {
			if(response.type == 'alert')
			{
				alert(response.message);
			}
			console.log(response);
    });
	});
	//http://lema.lemxx.com/openapi/openapi/packageslist.html?mobile=18158424282
	//let Url='http://lema.lemxx.com/openapi/openapi/packageslist.html?mobile='+shouji;
	//document.getElementById('RecvInfo_InPut').value=Url;
	//httpRequest(Url,getServer_Taobao);
	//httpRequest('http://lema.lemxx.com/openapi/openapi/packageslist.html?mobile=18158424282',getServer_Taobao);
	//executeScriptToCurrentTab('var x=document.getElementsByClassName(\'logis:receInfo\');alert(x[0].innerHTML);');
});


$('#open_PDD').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	executeScriptToCurrentTab('window.open(\'https://mms.pinduoduo.com/print/order/list\')');
});
$('#pdd_stop').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	chrome.tabs.getSelected(null, function (tab) {
		let str1=tab.url;
		document.getElementById('RecvInfo_InPut').value=str1;
		if(str1.indexOf('https://mms.pinduoduo.com/print/order/list') == -1){
			alert('请先打开拼多多发货页面！');
			return ;
		}
		sendMessageToContentScript('pdd_stop', function(response){
		if(response){
			console.log(response);
		}
	});
    });
});

$('#getRecvInfo_PDD').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	sendMessageToContentScript('pdd_start', function(response){
		if(response){
			document.getElementById('RecvInfo_InPut').value=response;
		}
	});
	//executeScriptToCurrentTab('var x=document.getElementsByClassName(\'logis:receInfo\');alert(x[0].innerHTML);');
});

$('#pdd_start').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
		chrome.tabs.getSelected(null, function (tab) {
		let str1=tab.url;
		if(str1.indexOf('https://mms.pinduoduo.com/print/order/list') == -1){
			alert('请先打开拼多多发货页面！');
			return ;
		}
		sendMessageToContentScript('pdd_start', function(response){
		if(response){
			console.log(response);
		}
	});
    });
});

$('#pdd_start_check').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
		chrome.tabs.getSelected(null, function (tab) {
		let str1=tab.url;
		if(str1.indexOf('https://mms.pinduoduo.com/print/order/list') == -1){
			alert('请先打开拼多多发货页面！');
			return ;
		}
		sendMessageToContentScript('pdd_start_check', function(response){
		if(response){
			console.log(response);
		}
	});
    });
});

$('#guanbi').click(() => {
	window.close();
});

$('#pdd_get').click(() => {
	if(strUrl == "")
	{
		alert('请先锁定发货地址！');
		return ;
	}
	chrome.tabs.getSelected(null, function (tab) {
			if(tab.url!='https://mms.pinduoduo.com/print/order/list'){
				alert('请先打开拼多多发货页面！')
				return ;
			}
		sendMessageToContentScript('pdd_get', function(response){
		if(response){
			document.getElementById('RecvInfo_InPut').value=response;
		}
	});
	   });

	
});
function domain_set(source)
{
	if(source == "success")
	{
		var bg = chrome.extension.getBackgroundPage();
		bg.setFahuoUrl(strUrl);
		alert("锁定成功");
	}
	else{
		alert("校验失败,请检查格式是否正确");
		strUrl="";
	}
}
function onStared()
{
	let bg = chrome.extension.getBackgroundPage();
	strUrl=bg.getFahuoUrl();
	document.getElementById('UrlValue').value=strUrl;
}
onStared();
var strDomain="http://lema.lemxx.com/openapi/openapi/finddomain.html?domain="

$('#SetUrl').click(() => {
	strUrl=document.getElementById('UrlValue').value;
	let strDomainUrl=strDomain+strUrl;
	//www.xxx.xxx
	httpRequest(strDomainUrl,domain_set);
});



