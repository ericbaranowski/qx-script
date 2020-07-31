//so luong tin
var limit = 5;
var wurl = {
    url: "https://api3.vnexpress.net/api/article?type=get_article_folder&cate_id=1003834&limit=" + limit + "&offset=0&option=video_autoplay,object,get_zone&app_id=9e304d",
};
$task.fetch(wurl).then(
    (response) => {
        var obj = JSON.parse(response.body);
        for (i = 0; i < limit; i++) {
            var post_time = timeConverter(obj.data["1003834"][i].publish_time);
            var title = obj.data["1003834"][i].title;
            var data_lead = obj.data["1003834"][i].lead;
            var news_url = obj.data["1003834"][i].share_url;
            var video_id = obj.data["1003834"][i].check_object.video;
            var video_link = obj.data["1003834"][i].check_object.video_autoplay[video_id].size_format["240"];
            var notificationURL = {
                "open-url": news_url,
                "media-url": video_link,
            }
            if (needUpdate(news_url, post_time)) {
                $notify("📰 VNEXPRESS.NET", title, data_lead + "\n" + "⌚" + post_time, notificationURL);
                $prefs.setValueForKey(post_time, hash(news_url));
            }
        }
    },
    (reason) => {
        $notify("False!", "", reason.error);
    }
);
//xu ly time
function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth() + 1;
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = addZero(date) + '/' + addZero(month) + '/' + addZero(year) + ' ' + addZero(hour) + ':' + addZero(min) + ':' + addZero(sec);
    return time;
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
//storedTimestamp
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