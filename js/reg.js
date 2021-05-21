const host_server = "http://10.201.98.79:8000/";

function isEmail() {
    var email = document.getElementById("mail").value;
    //console.log(email);
    if (email == "") {
        document.getElementById("checkmail").style.color = "red";
        document.getElementById("checkmail").innerHTML = "✘邮箱不能为空";
        return false;
    }
    var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    strEmail = pattern.test(email);
    if (strEmail) {
        document.getElementById("checkmail").style.color = "green"; //设置邮箱可用是的字体颜色
        document.getElementById("checkmail").innerHTML = "✔";

        return true;
    } else {
        document.getElementById("checkmail").style.color = "red"; //设置邮箱不可用时的字体颜色
        document.getElementById("checkmail").innerHTML = "✘请输入正确的邮箱";
        //alert("邮箱格式不正确！");
    }
}

function ispassword() {
    var pwd = document.getElementById("password").value;

    if (pwd == "") {
        document.getElementById("checkpwd").style.color = "red";
        document.getElementById("checkpwd").innerHTML = "✘密码不能为空";
        return false;
    }
    var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    strpwd = pattern.test(pwd);
    if (strpwd) {
        document.getElementById("checkpwd").style.color = "green";
        document.getElementById("checkpwd").innerHTML = "✔";

        return true;
    } else {
        document.getElementById("checkpwd").style.color = "red";
        document.getElementById("checkpwd").innerHTML = "✘密码至少包含数字和英文，长度6-20";
    }
}

function isusername() {
    var username = document.getElementById("username").value;

    if (username == "") {
        document.getElementById("checkname").style.color = "red";
        document.getElementById("checkname").innerHTML = "✘用户名不能为空";
        return false;
    }
    var pattern = /^[a-zA-Z0-9_-]{4,16}$/;
    strname = pattern.test(username);
    if (strname) {
        document.getElementById("checkname").style.color = "green";
        document.getElementById("checkname").innerHTML = "✔";

        return true;
    } else {
        document.getElementById("checkname").style.color = "red";
        document.getElementById("checkname").innerHTML = "✘用户名4到16位（字母，数字，下划线，减号）";
    }
}

function checkpassword() {
    var pwd = document.getElementById("password").value;
    var pwd2 = document.getElementById("password_again").value;

    if (pwd2 == "") {
        document.getElementById("checkpwd2").style.color = "red";
        document.getElementById("checkpwd2").innerHTML = "✘两次密码输入不一致";
        return false;
    } else if (pwd != pwd2) {
        document.getElementById("checkpwd2").style.color = "red";
        document.getElementById("checkpwd2").innerHTML = "✘两次密码输入不一致";
    } else {
        document.getElementById("checkpwd2").style.color = "green";
        document.getElementById("checkpwd2").innerHTML = "✔";

        return true;
    }
}





function send_test() {

    var reginfo = {};
    reginfo['email'] = document.getElementById("mail").value;
    reginfo['name'] = document.getElementById("username").value;
    reginfo['password'] = document.getElementById("password").value;

    if (!reginfo['email'] || !reginfo['name'] || !reginfo['password']) {
        alert("请输入正确的注册信息");
    } else {
        $.ajax({
            url: host_server + 'api/v1/users/register',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(reginfo),
            success: function(response) {
                // console.log(response);
                alert("注册成功！点击确认键转至登录界面");
                location.href = 'login.html';
            },
            error: function(response) {
                var error_info = JSON.parse(response.responseText);
                console.log(error_info);
                alert("注册失败！" + error_info.detail.msg);
            }
        });
    }
}