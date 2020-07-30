//so luong tin
var amount = 3;
var wurl = {
    url: "https://api3.vnexpress.net/api/article?type=get_article_folder&cate_id=1003834&limit=" + amount + "&offset=0&option=video_autoplay,object,get_zone&app_id=9e304d",
};
$task.fetch(wurl).then(
    (response) => {
        var obj = JSON.parse(response.body);
        for (i = 0; i < amount; i++) {
            var videoid = obj.data["1003834"][i].check_object.video;
            $notify("VN[E]XPRESS.NET" + ":calendar:" + timeConverter(obj.data["1003834"][i].publish_time), ":pushpin: " + obj.data["1003834"][i].title, obj.data["1003834"][i].lead, { "open-url": obj.data["1003834"][i].share_url, "media-url": obj.data["1003834"][i].check_object.video_autoplay[videoid].size_format["240"] });
        }
    },
    (reason) => {
        $notify("False!", "", reason.error);
    }
);
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year + ' ' + addZero(hour) + ':' + addZero(min);
    return time;
}