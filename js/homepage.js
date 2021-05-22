const host_server = "";
const clipboardObj = navigator.clipboard;
var owner_id;
var owner_name;
var community_list = new Map();

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
            owner_id = response.id;
            owner_name = response.name;
            localStorage.setItem("user_name", owner_name);
            document.getElementById('username').innerHTML = response.name;
            if (response.avatar_path === null)
                document.getElementById('avatar').src = "image/Default_avatar.png";
            else
                document.getElementById('avatar').src = host_server + response.avatar_path;
        },
        error: function(response) {
            console.log(response);
            alert("未登陆！");
            location.href = "login.html";
        }
    });
}

function show_mycontact() {
    var status = document.getElementById("contact_btn");
    if (status.value === "hide") {
        document.getElementById("mycontact").style.display = "block";
        status.value = "show";
    } else if (status.value === "show") {
        document.getElementById("mycontact").style.display = "none";
        status.value = "hide";
    }
}

function secret_check() {
    var issecret = document.getElementById("secret");
    if (issecret.checked) {
        document.getElementById("adding").style.display = "block";
        document.getElementById('invite_frame').contentWindow.location.reload();
    } else if (!issecret.checked) {
        document.getElementById("adding").style.display = "none";
    }
}

function show_meet_name() {
    var meet_name = document.getElementById("meet_name").value;
    document.getElementById("show_meet_name").style.color = "black";
    document.getElementById("show_meet_name").innerHTML = meet_name;
}

function cancel_create() {
    document.getElementById('common').checked = true;
    secret_check();
}

//创建会议
function create_meet() {

    var auth = localStorage.getItem("myAuthorization");
    var meeting_info = {};
    if (document.getElementById("public").checked) {
        meeting_info["meeting_type"] = 2;
    } else if (document.getElementById("secret").checked) {
        meeting_info["meeting_type"] = 0;
    } else {
        meeting_info["meeting_type"] = 1;
    }

    var invite_frame = document.getElementById("invite_frame"); //获得对应iframe的HTMLIFrameElement对象，可以获取iframe相关属性
    var array_designated_participants_list = Array.from(invite_frame.contentWindow.designated_participants_list);
    var int_array = array_designated_participants_list.map(Number);
    meeting_info["designated_participants"] = int_array;
    meeting_info["name"] = document.getElementById("meet_name").value;
    meeting_info["owner_id"] = owner_id;
    var timenow = Date.now();
    meeting_info["creation_time"] = new Date(timenow);
    meeting_info["duration"] = document.getElementById("duration").value;
    // console.log(meeting_info);

    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(meeting_info),
        url: host_server + "api/v1/meeting/create",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            console.log(response);
            layer.open({
                title: '创建会议成功！',
                content: "会议ID：" + response.meeting_id + "<br/>会议名：" + response.name + "<br/>会议链接：" + window.location.host + "/jitsi.html?ID=" + response.meeting_id,
                // closeBtn: 0,
                btn: ['确认', '复制'],
                yes: function(index, layero) {
                    sessionStorage.setItem("meet_name", response.name);
                    sessionStorage.setItem("meet_type", response.meeting_type);
                    if (response.meeting_type === 0) {
                        sessionStorage.setItem("meet_password", response.meeting_password);
                    }
                    window.open("jitsi.html?ID=" + meet_id);
                    layer.close(index);
                },
                btn2: function(index, layero) {
                    var a = navigator.clipboard.writeText("会议ID号：" + response.meeting_id + "\n会议名：" + response.name + "\n会议链接：" + window.location.host + "/jitsi.html?ID=" + response.meeting_id);
                    alert("复制会议ID成功！");
                    return false;
                }
            });
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}



// 加入会议
function join_meeting() {
    var auth = localStorage.getItem("myAuthorization");
    var meet_id = document.getElementById("meet_id").value;


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
            window.open("jitsi.html?ID=" + meet_id);
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}

// 获取推广会议
function get_share_meeting() {
    var auth = localStorage.getItem("myAuthorization");


    $.ajax({
        async: false,
        cache: false,
        type: "GET",
        url: host_server + "api/v1/meeting/share",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            generate_share_meeting(response);
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}
// 生成推广会议廊
function generate_share_meeting(share_meeting_list) {
    for (var i = 0; i < share_meeting_list.length; i++) {
        community_list[share_meeting_list[i].meeting_id] = create_list_share(share_meeting_list[i]);
    }
    var community = document.getElementById('community');

    var showlist_str = "";
    for (let key in community_list) {
        showlist_str += community_list[key];
    }
    community.innerHTML = showlist_str;
}

function create_list_share(share_meeting_info) {
    var head = '<div class="responsive"><div class="img"><a target="_blank" onclick="share_join(this)" data-id="' + share_meeting_info.meeting_id + '"><img src="image/1.png" alt="Trolltunga Norway" width="250px" height="140px"></a>'
    var body = '<div class="desc">' + share_meeting_info.name + '</div></div></div>'
    return head + body;
}

function share_join(me) {
    var auth = localStorage.getItem("myAuthorization");
    var id = me.getAttribute('data-id');
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(id),
        url: host_server + "api/v1/meeting/join",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            sessionStorage.setItem("meet_name", response.name);
            sessionStorage.setItem("meet_type", response.meeting_type);
            window.open("jitsi.html?ID=" + id);
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}