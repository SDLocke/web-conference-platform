const host_server = "";
let api;
var meet_id_str = window.location.search;
var meet_id = meet_id_str.split("=")[1];

if (localStorage.getItem("myAuthorization") === null) {
    alert("请先登录！");
    location.href = "login.html";
}


if (sessionStorage.getItem("meet_name") === null || sessionStorage.getItem("meet_type") === null) {
    var auth = localStorage.getItem("myAuthorization");
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(meet_id),
        url: host_server + "api/v1/meeting/join",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            sessionStorage.setItem("meet_name", response.name);
            sessionStorage.setItem("meet_type", response.meeting_type);
            if (response.meeting_type === 0) {
                sessionStorage.setItem("meet_password", response.meeting_password);
            }
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}


var meet_name = sessionStorage.getItem("meet_name");
var meet_type = sessionStorage.getItem("meet_type");
var user_name = localStorage.getItem("user_name");
var meet_password = "";
if (meet_type === "0") {
    meet_password = sessionStorage.getItem("meet_password");
}
// console.log("meet_password:" + meet_password);
const m = () => {
    const domain = 'meet.jit.si';
    const options = {
        roomName: meet_name,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#meet')
    };
    api = new JitsiMeetExternalAPI(domain, options);
    api.executeCommand('displayName', user_name);
    api.addEventListener('participantRoleChanged', function(event) {
        if (event.role === "moderator") {
            api.executeCommand('password', meet_password);
        }
    });
    api.on('passwordRequired', function() {
        api.executeCommand('password', meet_password);
    });
    api.addEventListener('participantLeft', function(event) {
        if (event.id == "New Nickname") {
            api.remove();
        }
    });
}
window.onload = () => {
    m();
    watermark.load({
        watermark_txt: user_name,
        watermark_color: 'green'
    })
}