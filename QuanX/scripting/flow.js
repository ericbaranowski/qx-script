/**
 * This script is designed to get the airport traffic usage details, the link needs to support Quantumult to display the traffic usage
 * Original author @Meeta
 * @author: Peng-YM
 * Modify and add multi-airport information display, and support multi-platform, icon. Optimize the notification display.
 * Update address: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/flow.js
 * It is recommended to use the mini icon group: https://github.com/Orz-3/mini
 */

let subscriptions = [
    {
        link: "订阅地址1",
        name: "取个名字1",
        icon: "https://raw.githubusercontent.com/Orz-3/mini/master/pudding.png"
    },
    {
        link: "订阅地址2",
        name: "取个名字2",
        icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Nexitally.png"
    },
];

const $ = API("flow");
if ($.read("subscriptions") !== undefined) {
    subscriptions = JSON.parse($.read("subscriptions"));
}

Promise.all(subscriptions.map(async sub => await fetchInfo(sub)))
    .catch(err => $.error(err))
    .finally(() => $.done());

async function fetchInfo(sub) {
    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"
    };
    $.get({
        url: sub.link,
        headers
    }).then(resp => {
        const headers = resp.headers;
        const subkey = Object.keys(headers).filter(k => /SUBSCRIPTION-USERINFO/i.test(k))[0];
        const userinfo = headers[subkey];
        const KEY_o_now = "o_now" + sub.name;
        const KEY_today_flow = "today_flow" + sub.name;
        $.log(userinfo);
        const upload_k = Number(userinfo.match(/upload=(\d+)/)[1]);
        const download_k = Number(userinfo.match(/download=(\d+)/)[1]);
        const total_k = Number(userinfo.match(/total=(\d+)/)[1]);
        const expire_time = userinfo.match(/expire=(\d+)/)
        let expires = "No information"
        if (expire_time) {
            expires = formatTime(Number(expire_time[1] * 1000));
        }

        const residue_m =
            total_k / 1048576 - download_k / 1048576 - upload_k / 1048576;
        const residue = residue_m.toFixed(2).toString();
        const dnow = new Date().getTime().toString();
        const utime = dnow - $.read(KEY_o_now);
        const todayflow = $.read(KEY_today_flow) - residue;
        $.write(residue, KEY_today_flow);
        $.write(dnow, KEY_o_now);
        const title = `🚀 [Proxy traffic] ${sub.name}`;
        const hutime = parseInt(utime / 3600000);
        const mutime = (utime / 60000) % 60;
        const subtitle = `Remaining: ${(residue_m / 1024).toFixed(2)} GB`;
        const details = `📌 [Usage]
${
            hutime == 0
                ?
                " Used in " + mutime.toFixed(1) + " minutes: " +
                todayflow.toFixed(2) +
                " MB"
                :
                " Used in " + hutime +
                " hour " + mutime.toFixed(1) + " minutes: " +
                todayflow.toFixed(2) +
                " MB"
            }
📝 [Stats]
Total upload: ${(upload_k / 1073741824).toFixed(2)} GB
Total download: ${(download_k / 1073741824).toFixed(2)} GB
🛎 [Expire date]
${expires}`;

        if (sub.icon) {
            $.notify(title, subtitle, details, { "media-url": sub.icon });
        } else {
            $.notify(title, subtitle, details);
        }
    });
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
        date.getMonth() + 2
        }/${date.getFullYear()} ${addZero(date.getHours())}:${addZero(
            date.getMinutes()
        )}`;
}

function API(s = "untitled", t = !1) { return new class { constructor(s, t) { this.name = s, this.debug = t, this.isQX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && !this.isLoon, this.isNode = "function" == typeof require, this.isJSBox = this.isNode && "undefined" != typeof $jsbox, this.node = (() => { if (this.isNode) { return { request: "undefined" != typeof $request ? void 0 : require("request"), fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (s) { return this.then(function (t) { return ((s, t) => new Promise(function (e) { setTimeout(e.bind(null, t), s) }))(s, t) }) } } get(s) { return this.isQX ? ("string" == typeof s && (s = { url: s, method: "GET" }), $task.fetch(s)) : new Promise((t, e) => { this.isLoon || this.isSurge ? $httpClient.get(s, (s, i, o) => { s ? e(s) : t({ status: i.status, headers: i.headers, body: o }) }) : this.node.request(s, (s, i, o) => { s ? e(s) : t({ ...i, status: i.statusCode, body: o }) }) }) } post(s) { return this.isQX ? ("string" == typeof s && (s = { url: s }), s.method = "POST", $task.fetch(s)) : new Promise((t, e) => { this.isLoon || this.isSurge ? $httpClient.post(s, (s, i, o) => { s ? e(s) : t({ status: i.status, headers: i.headers, body: o }) }) : this.node.request.post(s, (s, i, o) => { s ? e(s) : t({ ...i, status: i.statusCode, body: o }) }) }) } initCache() { if (this.isQX && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (this.isLoon || this.isSurge) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), this.isNode) { let s = "root.json"; this.node.fs.existsSync(s) || this.node.fs.writeFileSync(s, JSON.stringify({}), { flag: "wx" }, s => console.log(s)), this.root = {}, s = `${this.name}.json`, this.node.fs.existsSync(s) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(s, JSON.stringify({}), { flag: "wx" }, s => console.log(s)), this.cache = {}) } } persistCache() { const s = JSON.stringify(this.cache); this.isQX && $prefs.setValueForKey(s, this.name), (this.isLoon || this.isSurge) && $persistentStore.write(s, this.name), this.isNode && (this.node.fs.writeFileSync(`${this.name}.json`, s, { flag: "w" }, s => console.log(s)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root), { flag: "w" }, s => console.log(s))) } write(s, t) { this.log(`SET ${t}`), -1 !== t.indexOf("#") ? (t = t.substr(1), this.isSurge & this.isLoon && $persistentStore.write(s, t), this.isQX && $prefs.setValueForKey(s, t), this.isNode && (this.root[t] = s)) : this.cache[t] = s, this.persistCache() } read(s) { return this.log(`READ ${s}`), -1 === s.indexOf("#") ? this.cache[s] : (s = s.substr(1), this.isSurge & this.isLoon && $persistentStore.read(data, s), this.isQX ? $prefs.valueForKey(s) : this.isNode ? this.root[s] : void 0) } delete(s) { this.log(`DELETE ${s}`), delete this.cache[s], -1 !== s.indexOf("#") ? (s = s.substr(1), this.isSurge & this.isLoon && $persistentStore.write(null, s), this.isQX && $prefs.setValueForKey(null, s), this.isNode && delete this.root[s]) : this.cache[s] = data, this.persistCache() } notify(s, t = "", e = "", i = {}) { const o = i["open-url"], n = i["media-url"], r = e + (o ? `\n点击跳转: ${o}` : "") + (n ? `\n多媒体: ${n}` : ""); if (this.isQX && $notify(s, t, e, i), this.isSurge && $notification.post(s, t, r), this.isLoon && $notification.post(s, t, e, o), this.isNode) if (this.isJSBox) { require("push").schedule({ title: s, body: (t ? t + "\n" : "") + r }) } else console.log(`${s}\n${t}\n${r}\n\n`) } log(s) { this.debug && console.log(s) } info(s) { console.log(s) } error(s) { console.log("ERROR: " + s) } wait(s) { return new Promise(t => setTimeout(t, s)) } done(s = {}) { this.isQX || this.isLoon || this.isSurge ? $done(s) : this.isNode && !this.isJSBox && "undefined" != typeof $context && ($context.headers = s.headers, $context.statusCode = s.statusCode, $context.body = s.body) } }(s, t) }

