const host_server = "";

function send_test() {
    //创建url
    // var url = host_server + "api/v1/login/access-token";
    //创建要提交的参数
    var uname = $("#mail").val();
    var pwd = $("#password").val();
    //创建form
    var form = $("<form></form>");
    //设置属性
    // form.attr("action", url);
    // form.attr("method", "post");
    //创建input，即参数
    var username = $("<input type='text' name='username'/>");
    username.attr("value", uname);
    var password = $("<input type='text' name='password'/>");
    password.attr("value", pwd);

    //注入参数到表单
    form.append(username);
    form.append(password);

    form.appendTo("body");
    form.hide();
    //提交表单
    // form.submit();

    $.ajax({
        type: "post",
        url: host_server + "api/v1/login/access-token",
        data: form.serialize(),
        async: false,
        success: function(response) {
            console.log(response);
            var auth = response.token_type + " " + response.access_token;
            console.log(auth);
            localStorage.setItem("myAuthorization", auth);
            // alert("登录成功！点击确认进入主页");
            location.href = "主页.html"
        },
        error: function(response) {
            console.log(response);
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert("登录失败！" + error_info.detail);
        }
    });
}