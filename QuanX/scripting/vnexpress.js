//so luong tin
var limit = 5;
var categoryid = "1003834";
var wurl = {
    url: "https://api3.vnexpress.net/api/article?type=get_article_folder&cate_id=" + categoryid + "&limit=" + limit + "&offset=0&option=video_autoplay,object,get_zone&app_id=9e304d",
};
$task.fetch(wurl).then(
    (response) => {
        var obj = JSON.parse(response.body);
        for (i = 0; i < limit; i++) {
            var updatetime = timeConverter(obj.data[categoryid][i].publish_time);
            var titled = obj.data[categoryid][i].title;
            var videoid = obj.data[categoryid][i].check_object.video;
            var data_lead = obj.data[categoryid][i].lead;
            var url_news = obj.data[categoryid][i].share_url;
            var vdurl = obj.data[categoryid][i].check_object.video_autoplay[videoid].size_format["240"];
            var notificationURL = {
                "open-url": url_news,
                "media-url": vdurl,
            }
            if (needUpdate(url_news, updatetime)) {
                $notify("VNEXPRESS.NET" + "📆" + updatetime,
                    "📌" + titled, data_lead, notificationURL);
                $prefs.setValueForKey(updatetime, hash(url_news));
            }
        }
    },
    (reason) => {
        $notify("False!", "", reason.error);
    }
);
//xu ly time
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = addZero(date) + '/' + addZero(month) + '/' + year + ' ' + addZero(hour) + ':' + addZero(min);
    return time;
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
//luu timestamp
function needUpdate(url, timestamp) {
    var storedTimestamp = $prefs.valueForKey(hash(url));
    console.log(`Stored Timestamp for ${hash(url)}: ` + storedTimestamp);
    return storedTimestamp === undefined || storedTimestamp !== timestamp
        ? true
        : false;
}
//hash
function hash(str) {
    let h = 0,
        i,
        chr;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        h = (h << 5) - h + chr;
        h |= 0; // Convert to 32bit integer
    }
    return String(h);
}