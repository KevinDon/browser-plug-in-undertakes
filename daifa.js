$(function() {
	chrome.extension.sendRequest({
      type: "getList",
      orderType:'daifa',
    }, function(response) {
		let strInfo="";
		let nCount=response.list.length;
		for(let i=0;i<nCount;i++)
		{
			strInfo+=response.list[i].order_id;
			strInfo+=',';
			strInfo+=response.list[i].address;
			strInfo+='\r\n';
		}
		$('.tianxinxi textarea').val(strInfo);
		console.log(response);
    });
})
