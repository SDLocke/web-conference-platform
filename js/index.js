$(function(){
    resizeHeight();
    $(window).bind("resize",resizeHeight);
    $("#nav>li").bind("click",function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#auth_content_iframe").attr("src",$(this).children("a").eq(0).attr("url"));
    });
});
function resizeHeight(){
    var winHeight = $(window).height();
    var toolHeight = $(".auth_toolbar").height();
    var footerHeight = $(".auth_footer").outerHeight();
    $("#auth_siderbar").height(winHeight);
    $("#auth_content").css({"min-height":winHeight+"px"});
    $("#auth_content_iframe").css({"min-height":(winHeight - toolHeight - footerHeight)+"px"});
}