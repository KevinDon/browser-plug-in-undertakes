$(function() {
    $('.select-item.first .content-item div:first').click();
    $('.select-item.second .content-item div:last').click();

    chrome.extension.sendRequest({
        type: "getList",
        orderType:'daifa',
    }, function(response) {
        let strInfo = "";
        let nCount = response.list.length;
        for(let i=0;i<nCount;i++)
        {
            strInfo += response.list[i].order_id;
            strInfo += ',';
            strInfo += response.list[i].address;
            strInfo += '\r\n';
        }
        $('.third-content .el-textarea textarea').focus();
        $('.third-content .el-textarea textarea').on('input', function() {
            console.log('test')
        });
        $('.third-content .el-textarea textarea').text(strInfo);

        console.log(response);


    });
})
