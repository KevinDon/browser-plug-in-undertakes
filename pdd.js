var g_ValidPdd=0;
var g_setIntel=0;
var list=[];
$(function() {
	var panel = document.createElement('div');
	panel.innerHTML = `
	'<div style="position: fixed;right: 60px;top:200px;line-height:23px;font-size:21px;color:white;height: 160px;width: 40px;text-align: center; background: #ff464e;padding:3px 2px; display:inline-block; cursor:pointer;border-radius:6px" id="xiaomadaifa" >从代发网站下单</div>'
	`;
	document.body.appendChild(panel);
	$('#xiaomadaifa').click(function() {
    //发送消息给后台js
		getOrder();
	})
  console.log(list);
})
	
	$('#zidongfahuo').click(function() {
			    chrome.extension.sendRequest({
				type: "autoOrder",
				orderType:'pdd',
				}, function(response) {
					if(response.type == 'alert')
					{
						alert(response.message);
					}
					console.log(response);
				});
	})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request == 'pdd_start')
	{
		if(g_ValidPdd == 1)
		{
			sendResponse('正在解锁请等待');
			return ;
		}
		g_ValidPdd=1;
		g_setIntel=setInterval('jiesuopdd()',8000);
		sendResponse('开始解锁请等待');
	}
	else if(request == 'pdd_start_check')
	{
		if(g_ValidPdd == 1)
		{
			sendResponse('正在解锁请等待');
			return ;
		}
		g_ValidPdd=1;
		g_setIntel=setInterval('jiesuopdd_check()',8000);
		sendResponse('开始解锁请等待');
	}
	else if(request == 'pdd_stop')
	{
		if(g_setIntel)
			clearInterval(g_setIntel);
		g_setIntel=0;
		g_ValidPdd=0;
		sendResponse('已停止解锁');
	}
	else if(request == 'pdd_get')
	{
		getOrder();
		sendResponse(request);
	}
	else 
	{
		
		sendResponse('我收到你的消息了：');
	}
});
function sendMessageToPop(message) {
	chrome.runtime.sendMessage(message, function(response) {
		console.log('收到来自pop的回复');
	});
}
function jiesuopdd()
{
	var x=document.getElementsByClassName('ICN_outerWrapper_4-94-1 ICN_type-lock_4-94-1');
	if(x.length)
	{
		x[0].click();
		sendMessageToPop({cmd:'jiesuokaishi', message:'剩余未解锁：'+(x.length/3-1)+'请耐心等待'});
	}
	else
	{
		clearInterval(g_setIntel);
		g_setIntel=0;
		sendMessageToPop({cmd:'jiesuotingzhi', message:'已全部解锁'});
	}	
}
function jiesuopdd_check()
{
	var jiesuocount=0;
	let listDom = $('.TB_innerMiddle_4-94-1').find('tbody').find('tr');
	listDom.each(function() {
	if(jiesuocount == 1)
	{
		return true;
	}
	let infoList=$(this).find('td');
	if(infoList !=null && infoList != undefined)
	{
		//let v1=infoList[0].find('span').getAttribute('data-checked');
		//var v1=infoList[0].find('span');
		let v1=$(this).find('td').find('span').find('label').attr('data-checked');
		if(v1 == 'true')
		{
			let v2=$(this).find('td').find('div').find('div').find('i');
			if(v2.length)
			{
				let phone=infoList[3].innerText;
				if(phone !='' && phone.indexOf('*') == -1)
				{
					//已解锁
					return false;
				}
				//未解锁
				v2[1].click();
				jiesuocount++;
				return true;
			}
		}
	}
	});
	if(jiesuocount == 0)
	{
		clearInterval(g_setIntel);
		g_setIntel=0;
		sendMessageToPop({cmd:'jiesuotingzhi', message:'已全部解锁'});
	}
}
function format(str) {
  str = str.replace('/','');
  str = str.replace('/','');
  str=str.trim();
  return str;
}
function getOrder()
{
	list.length=0;
	let listDom = $('.TB_innerMiddle_4-94-1').find('tbody').find('tr');
	listDom.each(function() {
	//let check=$(this).find('td').find('.ICN_outerWrapper_4-62-1 ICN_type-lock_4-62-1');
	let order_id = $(this).find('td').find('.order-sn').text();
	let infoList=$(this).find('td');
	//.ICN_outerWrapper_4-62-1 ICN_type-lock_4-62-1
	//let check=$(this).find('td').find('span').find('i');
	//if(check.length > 2)
	//{
		//let v1=check[1].getAttribute('data-testid');
		//if(v1 != 'beast-core-icon-lock')
		//{
	if(infoList !=null && infoList != undefined)
	{
		let phone=infoList[3].innerText;
		if(phone !='' && phone.indexOf('*') == -1)
		{
			let name=infoList[2].innerText;
			let addr1=infoList[4].innerText;
			let addr2=infoList[5].innerText;
			let address=format(name+','+phone+','+addr1+' '+addr2);
			list.push({
			order_id,
			address
		})
		}
	}
		//}
	//}

		})
		 chrome.extension.sendRequest({
				type: "toDaifa",
				orderType:'pdd',
				list
				}, function(response) {
					if(response.type == 'alert')
					{
						alert(response.message);
					}
					console.log(response);
				});
}
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