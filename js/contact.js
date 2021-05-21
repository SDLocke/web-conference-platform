const host_server = "http://10.201.98.79:8000/";
var user_list = new Map();
var add_list = new Map();

function load() {
    var auth = localStorage.getItem("myAuthorization");

    var contact_req = {};
    contact_req['offset'] = '0';
    contact_req['limit'] = '10';

    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(contact_req),
        url: host_server + "api/v1/address_book/me",

        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            var i;
            for (i = 0; i < response.length; i++) {
                get_user_info(response[i]);
            }
            loadlist("contact_list", user_list);
        },
        error: function(response) {
            console.log(response);
            alert("未登陆！");
            location.href = "login.html";
        }
    });
}

function get_user_info(user_id) {
    var auth = localStorage.getItem("myAuthorization");

    $.ajax({
        async: false,
        cache: false,
        type: "GET",
        url: host_server + "api/v1/users/" + user_id,

        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            user_list[user_id] = create_list_delete(response);
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}

function create_list_delete(user_info) {
    var li_head = '<div><li id= ' + user_info.id + ' class="list-group-item d-flex justify-content-between">';
    var li_body_uname = '<div style="width: 90%;"><h6 class="my-0">' + user_info.name;
    if (user_info.is_email_activated) {
        li_body_uname += '<svg t="1620548914116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1784" width="20" height="20"><path d="M186.2 214.5c-10.4 3.7-18.8 15.7-18.8 26.7v375.5c0 11 4.2 28 9.3 37.7 0 0 30.4 57.5 117.3 144.5 97.4 97.4 199.6 124.2 199.6 124.2 10.6 2.8 27.8 2 38.1-1.8 0 0 122.6-44.7 200.9-123 73.5-73.5 113.7-144 113.7-144 5.4-9.6 9.9-26.4 9.9-37.4l0.3-376.5c0-11-8.5-23-18.8-26.7L531.3 104.9c-10.4-3.7-27.3-3.7-37.7 0L186.2 214.5z m615.4 379.4c0 11-4.3 27.9-9.7 37.5 0 0-36.8 66.8-100.1 130.1C617.5 835.8 531.3 867 531.3 867c-10.3 3.8-27.5 4.4-38.1 1.5 0 0-71.4-19.7-160.7-109-63.3-63.3-100.3-129.3-100.3-129.3-5.4-9.6-9.8-26.4-9.8-37.4v-314c0-11 8.5-23 18.9-26.6l252.3-87.8c10.4-3.6 27.4-3.6 37.8 0l251.3 87.2c10.4 3.6 18.9 15.6 18.9 26.6v315.7z" fill="#2680F0" p-id="1785"></path><path d="M325.2 528c-8.1-7.4-8.8-20.1-1.4-28.3l10.1-11.1c7.4-8.1 20.1-8.7 28.2-1.3l93.8 85.4c8.1 7.4 20.8 6.8 28.2-1.3l176.2-194c7.4-8.1 20.1-8.8 28.3-1.4l11.1 10.1c8.1 7.4 8.8 20.1 1.4 28.3l-213 234.7c-7.4 8.1-20.1 8.8-28.2 1.4L325.2 528z" fill="#2680F0" p-id="1786"></path></svg>'
    }
    var li_body_utext = '</h6><small class="text-muted">' + user_info.personal_signature + '</small></div>';
    var li_btn = '<button style="width: 10%;" class="btn btn-danger close" type="button" onclick="delete_user_id(' + user_info.id + ')">&times;</button></li></div>';
    return li_head + li_body_uname + li_body_utext + li_btn
}

function create_list_add(user_info) {
    var li_head = '<div><li id= ' + user_info.id + ' class="list-group-item d-flex justify-content-between">';
    var li_body_uname = '<div style="width: 90%;"><h6 class="my-0">' + user_info.name;
    if (user_info.is_email_activated) {
        li_body_uname += '<svg t="1620548914116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1784" width="20" height="20"><path d="M186.2 214.5c-10.4 3.7-18.8 15.7-18.8 26.7v375.5c0 11 4.2 28 9.3 37.7 0 0 30.4 57.5 117.3 144.5 97.4 97.4 199.6 124.2 199.6 124.2 10.6 2.8 27.8 2 38.1-1.8 0 0 122.6-44.7 200.9-123 73.5-73.5 113.7-144 113.7-144 5.4-9.6 9.9-26.4 9.9-37.4l0.3-376.5c0-11-8.5-23-18.8-26.7L531.3 104.9c-10.4-3.7-27.3-3.7-37.7 0L186.2 214.5z m615.4 379.4c0 11-4.3 27.9-9.7 37.5 0 0-36.8 66.8-100.1 130.1C617.5 835.8 531.3 867 531.3 867c-10.3 3.8-27.5 4.4-38.1 1.5 0 0-71.4-19.7-160.7-109-63.3-63.3-100.3-129.3-100.3-129.3-5.4-9.6-9.8-26.4-9.8-37.4v-314c0-11 8.5-23 18.9-26.6l252.3-87.8c10.4-3.6 27.4-3.6 37.8 0l251.3 87.2c10.4 3.6 18.9 15.6 18.9 26.6v315.7z" fill="#2680F0" p-id="1785"></path><path d="M325.2 528c-8.1-7.4-8.8-20.1-1.4-28.3l10.1-11.1c7.4-8.1 20.1-8.7 28.2-1.3l93.8 85.4c8.1 7.4 20.8 6.8 28.2-1.3l176.2-194c7.4-8.1 20.1-8.8 28.3-1.4l11.1 10.1c8.1 7.4 8.8 20.1 1.4 28.3l-213 234.7c-7.4 8.1-20.1 8.8-28.2 1.4L325.2 528z" fill="#2680F0" p-id="1786"></path></svg>'
    }
    var li_body_utext = '</h6><small class="text-muted">' + user_info.personal_signature + '</small></div>';
    var li_btn = '<button style="width: 10%;" class="btn btn-success close" type="button" onclick="add_user_id(' + user_info.id + ')">&plus;</button></li></div>';
    return li_head + li_body_uname + li_body_utext + li_btn
}

function loadlist(listname, showlist) {
    var contact_list = document.getElementById(listname);
    var showlist_str = "";
    for (let key in showlist) {
        showlist_str += showlist[key];
    }
    contact_list.innerHTML = showlist_str;
}

function delete_user_id(user_id) {
    var auth = localStorage.getItem("myAuthorization");

    $.ajax({
        type: "GET",
        url: host_server + "api/v1/address_book/delete/" + user_id,

        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function() {
            if (confirm("确定要删除该联系人吗？")) {
                document.getElementById(user_id).remove();
            }
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}

function find() {
    add_list = new Map();
    var auth = localStorage.getItem("myAuthorization");
    var find_user = {};
    find_user["identifier"] = document.getElementById("find_user").value;



    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: host_server + "api/v1/users/elastic_search",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(find_user),

        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(response) {
            for (var i = 0; i < response.length; i++) {
                add_list[i] = create_list_add(response[i]);
            }
            loadlist("find_user_list", add_list);
        },
    });
}

function add_user_id(user_id) {
    var auth = localStorage.getItem("myAuthorization");

    $.ajax({
        type: "GET",
        url: host_server + "api/v1/address_book/create/" + user_id,

        beforeSend: function(request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function() {
            alert("添加好友成功！");
            load();
        },
        error: function(response) {
            var error_info = JSON.parse(response.responseText);
            console.log(error_info);
            alert(error_info.detail.msg);
        }
    });
}

function search_user() {
    // var search_info = document.getElementById("search_info").value;
    // var contact_list = document.getElementById("contact_list");
    // console.log(contact_list);
    // $('#contact_list div').hide();
    // var searched = $('#contact_list li:contains("' + search_info + '")');
    // console.log(searched);
    // for (var i = 0; i < searched.length; i++) {
    //     document.getElementById(searched[i].id).parentNode.style.display = "";
    // }
}