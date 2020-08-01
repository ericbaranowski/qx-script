let limit = 5;
var cate_id = "1003834";
var notify_s = 0;
var wurl = {
    url: `https://api3.vnexpress.net/api/article?type=get_article_folder&cate_id=${cate_id}&limit=${limit}&offset=0&option=video_autoplay,object,get_zone&app_id=9e304d`,
};
push_data();
function push_data() {
    $task.fetch(wurl).then((response) => {
        var obj = JSON.parse(response.body);
        for (const i in obj.data[cate_id]) {
            var post_time = timeConverter(obj.data[cate_id][i].publish_time);
            var title = obj.data[cate_id][i].title, data_lead = obj.data[cate_id][i].lead, news_url = obj.data[cate_id][i].share_url,
                video_id = obj.data[cate_id][i].check_object.video, video_link = obj.data[cate_id][i].check_object.video_autoplay[video_id].size_format["240"];
            var notificationURL = { "open-url": news_url, "media-url": video_link }
            if (needUpdate(news_url, post_time)) {
                $notify("📰 VNEXPRESS.NET", title, `${data_lead}\n${post_time}`, notificationURL);
                $prefs.setValueForKey(post_time, hash(news_url));
                notify_s++;
            }
        }
        if (notify_s == 0) { console.log("Không có tin mới!") }
        else{console.log(`✨Có ${notify_s} tin mới!`)}
    },
        (reason) => { console.error(reason) }
    );
}
function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear(), month = a.getMonth() + 1, date = a.getDate(), hour = a.getHours(), min = a.getMinutes(), sec = a.getSeconds(), time = `📆${addZero(date)}/${addZero(month)}/${addZero(year)} ⌚${addZero(hour)}:${addZero(min)}:${addZero(sec)} (GMT+7)`;
    return time;
}
function addZero(i) { if (i < 10) { i = "0" + i } return i }
function needUpdate(url, timestamp) {
    var storedTimestamp = $prefs.valueForKey(hash(url));
    // console.log(`Stored Timestamp for ${url}: ` + storedTimestamp);
    return storedTimestamp === undefined || storedTimestamp !== timestamp
        ? true
        : false;
}
function hash(str) {
    let h = 0, i, chr;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        h = (h << 5) - h + chr;
        h |= 0;
    } return String(h);
}