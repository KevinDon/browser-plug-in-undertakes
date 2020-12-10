var g_ValidPdd=0;
var g_setIntel=0;
$(function() {
  var div = '<div style="position: fixed;right: 60px;top:160px;line-height:28px;font-size:25px;color:white;height: 198px;width: 40px;text-align: center; background: #ff464e;padding:3px 2px; display:inline-block; cursor:pointer;border-radius:6px;z-index:99999;" id="xiaomadaifa" >从代发网站下单</div>';
  $('#step2>h3').prepend(div);
  var div1 = '<div style="position: fixed;right: 60px;top:380px;line-height:28px;font-size:25px;color:white;height: 116px;width: 40px;text-align: center; background: #ff464e;padding:3px 2px; display:inline-block; cursor:pointer;border-radius:6px;z-index:99999;" id="zidongfahuo" >自动发货</div>';
  $('#step2>h3').prepend(div1);
	$('#xiaomadaifa').click(function() {
    //发送消息给后台js
		let listDom = $('.consign-detail.batch');
		let list = [];
		listDom.each(function() {
		let address = $.trim($(this).find('.receive-info .logis\\:receInfo').text());
		let order_id = $(this).find('tr.order-title').attr('order_id');
		address = format(address);
		list.push({
			order_id,
			address
			})
	})
  console.log(list);
    chrome.extension.sendRequest({
      type: "toDaifa",
      orderType:'taobao',
      list
    }, function(response) {
      console.log(response);
    });
	})
	
	$('#zidongfahuo').click(function() {
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
	})
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request == 'getRecvInfo_Taobao')
	{
		$('#xiaomadaifa').click();
		sendResponse(request);
	}
	else if(request.type == 'getOrder_Taobao')
	{
		getOrder_Taobao(request);
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

//回填淘宝单号
function getOrder_Taobao(request)
{
	var src=JSON.parse(request.source);
	$('input[name=logisType][value=2]').attr('checked', true);
	let nCount=0;
	if(src.data.length)
	{
		var strExpress='';
		for(let i=0;i<src.data.length;i++)
		{
			let tr = $("tr[order_id=" + src.data[i].ordernumber + "]");
			let tx = tr.parent().parent().find('.shipping-number input[type=text]');
			if(tx.length)
			{
				nCount++;
				if(strExpress == '')
				{
					strExpress=src.data[i].express;
					$("select[name=sameLogisCompanyId]").find("option:contains('" + strExpress+ "')").attr("selected",true);
				}
				tx.focus();
				tx.val(src.data[i].expressnumber);
			}
			
		}
	}
	if(nCount == 0)
	{
		alert('没有查询到您的包裹，如果订单付款60秒后还获取不到包裹信息，请咨询客服！');
	}
}
function format(str) {
  str = str.replace(/，\d{6}，/, '，');
  arr = str.split('，');
  let phone = arr[arr.length - 1];
  let name = arr[arr.length - 2];
  let address = '';
  for (let i = 0; i <= arr.length - 3; i++) {
    address += arr[i];
  }
  //str = address + '，' + name + '，' + phone;
  str = $.trim(name)+','+ $.trim(phone)+','+ $.trim(address);
  //900000000000,李四,13911111111,广东省 东莞市 其他区 江南大道99号

  return str;
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