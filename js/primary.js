const host_server = "http://10.201.98.79:8000/";

function load() {
    var auth = localStorage.getItem("myAuthorization");
    $.ajax({
        async: false,
        cache: false,
        type: "GET",
        url: host_server + "api/v1/users/me",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            //console.log(response);
            document.getElementById('myusername').innerHTML = response.name;
            document.getElementById('inputname').setAttribute("placeholder", response.name);
            if (response.personal_signature === null)
                document.getElementById('inputtext').setAttribute("placeholder", "无签名");
            else
                document.getElementById('inputtext').setAttribute("placeholder", response.personal_signature);

            if (response.is_email_activated === true) {
                document.getElementById("checkmail").className = "btn btn-default btn-success disabled";
                document.getElementById("checkmail").innerHTML = "已验证";
            } else {
                document.getElementById("checkmail").className = "btn btn-default btn-warning";
                document.getElementById("checkmail").innerHTML = "点击验证邮箱";
            }
        },
        error: function(response) {
            console.log(response);
            alert("未登陆！");
            location.href = "login.html";
        }
    });
}

function change_info() {
    var formData = new FormData();
    //创建要提交的参数
    var uname = document.getElementById("inputname").value;
    var ptext = document.getElementById("inputtext").value;
    var pimg = document.getElementById("InputFile").files[0];

    formData.append("name", uname);
    formData.append("personal_signature", ptext);
    if (pimg !== undefined)
        formData.append("image", pimg);
    // console.log(formData.get('name'));
    // console.log(formData.get('image'));

    var auth = localStorage.getItem("myAuthorization");

    $.ajax({
        type: "put",
        url: host_server + "api/v1/users/me",
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            console.log(response);
            alert("上传成功！");
        },
        error: function(response) {
            console.log(response);
            alert("上传失败！");
            location.href = "login.html";
        }
    });
}

function check_mail() {
    var auth = localStorage.getItem("myAuthorization");

    $.ajax({
        type: "GET",
        url: host_server + "api/v1/authentication/email/create",
        async: false,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            alert("已发送验证邮件！");
        },
        error: function(response) {
            alert("验证邮件发送失败！");
        }
    });
}