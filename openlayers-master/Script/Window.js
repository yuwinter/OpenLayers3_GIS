//重新
function LoadSize() {
    var hi = document.body.clientHeight;
    var wd = document.body.clientWidth;
    $("#map").width(wd);
    $("#map").height(hi);
    alert($("#map").width());
    alert(document.body.clientHeight);
}