// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    // 给谷歌搜索结果的超链接增加 _target="blank"
    if (location.host == 'www.google.com.tw') {
        var objs = document.querySelectorAll('h3.r a');
        for (var i = 0; i < objs.length; i++) {
            objs[i].setAttribute('_target', 'blank');
        }
        console.log('已处理谷歌超链接！');
    } else if (location.host == 'www.baidu.com') {
        function fuckBaiduAD() {
            if (document.getElementById('my_custom_css')) return;
            var temp = document.createElement('style');
            temp.id = 'my_custom_css';
            (document.head || document.body).appendChild(temp);
            var css = `
			/* 移除百度右侧广告 */
			#content_right{display:none;}
			/* 覆盖整个屏幕的相关推荐 */
			.rrecom-btn-parent{display:none;}'
			/* 难看的按钮 */
			.result-op.xpath-log{display:none !important;}`;
            temp.innerHTML = css;
            console.log('已注入自定义CSS！');
            // 屏蔽百度推广信息
            removeAdByJs();
            // 这种必须用JS移除的广告一般会有延迟，干脆每隔一段时间清楚一次
            interval = setInterval(removeAdByJs, 2000);

            // 重新搜索时页面不会刷新，但是被注入的style会被移除，所以需要重新执行
            temp.addEventListener('DOMNodeRemoved', function (e) {
                console.log('自定义CSS被移除，重新注入！');
                if (interval) clearInterval(interval);
                fuckBaiduAD();
            });
        }

        let interval = 0;

        function removeAdByJs() {
            $('[data-tuiguang]').parents('[data-click]').remove();
        }

       //fuckBaiduAD();
        //initCustomPanel();
        //initCustomEventListen();
    }
});

function initCustomPanel() {
    var panel = document.createElement('div');
    panel.className = 'chrome-plugin-demo-panel';
    panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area">
			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
    document.body.appendChild(panel);
}

// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

/**
 // 接收来自后台的消息
 chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request.cmd == 'update_font_size') {
        var ele = document.createElement('style');
        ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
        document.head.appendChild(ele);
    } else {
        tip(JSON.stringify(request));
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    }
});
 **/

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
    chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function (response) {
        tip('收到来自后台的回复：' + response);
    });
}

// 监听长连接
chrome.runtime.onConnect.addListener(function (port) {
    console.log(port);
    if (port.name == 'test-connect') {
        port.onMessage.addListener(function (msg) {
            console.log('收到长连接消息：', msg);
            tip('收到长连接消息：' + JSON.stringify(msg));
            if (msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
        });
    }
});

window.addEventListener("message", function (e) {
    console.log('收到消息：', e.data);
    if (e.data && e.data.cmd == 'invoke') {
        eval('(' + e.data.code + ')');
    } else if (e.data && e.data.cmd == 'message') {
        tip(e.data.data);
    }
}, false);


function initCustomEventListen() {
    var hiddenDiv = document.getElementById('myCustomEventDiv');
    if (!hiddenDiv) {
        hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        hiddenDiv.id = 'myCustomEventDiv';
        document.body.appendChild(hiddenDiv);
    }
    hiddenDiv.addEventListener('myCustomEvent', function () {
        var eventData = document.getElementById('myCustomEventDiv').innerText;
        tip('收到自定义事件：' + eventData);
    });
}

var tipCount = 0;

// 简单的消息通知
function tip(info) {
    info = info || '';
    var ele = document.createElement('div');
    ele.className = 'chrome-plugin-simple-tip slideInLeft';
    ele.style.top = tipCount * 70 + 20 + 'px';
    ele.innerHTML = `<div>${info}</div>`;
    document.body.appendChild(ele);
    ele.classList.add('animated');
    tipCount++;
    setTimeout(() => {
        ele.style.top = '-100px';
        setTimeout(() => {
            ele.remove();
            tipCount--;
        }, 400);
    }, 3000);
}


//--------------------Kevin----------------------------//
//Chrome Plugin
$(function () {
    var div = '<div style="position: fixed;right: 60px;top:160px;line-height:28px;font-size:25px;color:white;height: 198px;width: 40px;text-align: center; background: #ffce00;padding:3px 2px; display:inline-block; cursor:pointer;border-radius:6px;z-index:99999;" id="batch_delivery" >从代发网站下单</div>';
    $('#step2>h3').prepend(div);
    var div1 = '<div style="position: fixed;right: 60px;top:380px;line-height:28px;font-size:25px;color:white;height: 116px;width: 40px;text-align: center; background: #ffce00;padding:3px 2px; display:inline-block; cursor:pointer;border-radius:6px;z-index:99999;" id="automatic_delivery" >自动发货</div>';
    $('#step2>h3').prepend(div1);
    $('#batch_delivery').click(function () {
        //发送消息给后台js
        let listDom = $('.consign-detail.batch');
        let list = [];
        listDom.each(function () {
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
            type: "batch_delivery",
            orderType: 'taobao',
            list
        }, function (response) {
            console.log(response);
        });
    })

    $('#automatic_delivery').click(function () {
        chrome.extension.sendMessage({
            type: "automatic_delivery",
        }, function (response) {
            setShippingNumber(response.tracking)
        });
    })
})


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request == 'getRecvInfo_Taobao') {
        $('#batch_delivery').click();
        sendResponse(request);
    } else if (request.type === 'getOrder_Taobao') {
        getOrder_Taobao(request);
        sendResponse(request);
    } else if(request === 'get_tracking_number') {
        $('.el-table_1_column_8 .el-button.el-button--success').click();
        setTimeout(function(){
            getTrackingNumber(request)
        }, 3000)
    } else if (request.type === 'automatic_delivery'){
        setShippingNumber(request.tracking)
    }else {
        sendResponse('我收到你的消息了：');
    }
});


//回填淘宝单号
function getOrder_Taobao(request) {
    var src = JSON.parse(request.source);
    $('input[name=logisType][value=2]').attr('checked', true);
    let nCount = 0;
    if (src.data.length) {
        var strExpress = '';
        for (let i = 0; i < src.data.length; i++) {
            let tr = $("tr[order_id=" + src.data[i].ordernumber + "]");
            let tx = tr.parent().parent().find('.shipping-number input[type=text]');
            if (tx.length) {
                nCount++;
                if (strExpress == '') {
                    strExpress = src.data[i].express;
                    $("select[name=sameLogisCompanyId]").find("option:contains('" + strExpress + "')").attr("selected", true);
                }
                tx.focus();
                tx.val(src.data[i].expressnumber);
            }

        }
    }
    if (nCount == 0) {
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
        address += arr[i].replace(/\s/g,"");
    }
    //str = address + '，' + name + '，' + phone;
    str = $.trim(name) + ',' + $.trim(phone) + ',' + $.trim(address);
    //900000000000,李四,13911111111,广东省 东莞市 其他区 江南大道99号

    return str;
}

function getTrackingNumber(){
    let trackNumDom = $('.el-dialog .el-table__row');
    let tracking = {
        shippingMethod: '',
        trackNum: []
    }

    trackNumDom.each(function (index) {

        let trackNum = $(this).children('td:nth-child(4)').text()
        tracking.shippingMethod = $(this).children('td:nth-child(6)').text();
        tracking.trackNum.push(trackNum);
    })

    chrome.extension.sendRequest({
        type: "get_tracking_number",
        orderType: 'taobao',
        tracking
    }, function (response) {
        console.log(response);
    });
}

function setShippingNumber(trackingNumberList) {
    let shippingDom = $('.shipping-number input')
    let shippingMethodDom = $('select.codstep2-select')
    //获取shippingMethod的code
    let shippingMethod = []
    let optionDom =shippingMethodDom.children('option');
    optionDom.each(function(index){
        let shippingName = $(this).text();
        let code = $(this).attr('value')
        if($(this).text() === $.trim(trackingNumberList.shippingMethod)){
            shippingMethodDom.val(code);
        }
    })

    shippingDom.each(function(index){
        $(this).val(trackingNumberList['trackNum'][index]);
    })
}
