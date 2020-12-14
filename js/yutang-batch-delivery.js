$(function () {
    $('.select-item.first .content-item div:first').click();
    $('.select-item.second .content-item div:last').click();

    chrome.extension.sendRequest({
        type: "getList",
        orderType: 'daifa',
    }, function (response) {
        let strInfo = "";
        let nCount = response.list.length;
        for (let i = 0; i < nCount; i++) {
            strInfo += response.list[i].order_id;
            strInfo += ',';
            strInfo += response.list[i].address;
            strInfo += '\r\n';
        }
        let textarea = $('.third-content .el-textarea .el-textarea__inner');
        textarea.focus();
        textarea.bind('input', function () {
            console.log('test')
            $(this).blur();//手动失去焦点
        });
        textarea.val(strInfo).text(strInfo);
        textarea.trigger("change");
    });
})
