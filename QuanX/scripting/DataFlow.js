//Thông tin đăng nhập
const account = {
  user: "0354353735",
  pass: "1234qwer",
};
const $ = API("DataFlow");
//apiloginmobile
var body = "account=" + account.user + "&build_code=2020.4.15.2&cmnd=&device_id=00000000-0000-0000-0000-000000000000&device_name=L%20ng%20Kh%20ch%20s%20iPhone%20%28iPhone%20X%29&keyDeviceAcc=xxx&os_type=ios&os_version=13.300000&password=" + account.pass + "&version_app=4.3.4";

var apiloginmobile = {
  url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/loginMobile',
  headers: {},
  body: body,
};

//
async function launch() {
  await loginmobile();
}

launch()

function loginmobile() {
  $httpClient.post(apiloginmobile, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var token = obj["data"]["data"]["token"];
          getdataremain(token);
        }
        else {
          $notification.post("Data Flow acount user/pass false‼️", "", "");
          //console.log(data);
        }
      }
    }
    $done();
  });
}

function getdataremain(token) {
  var body = "build_code=2020.4.15.2&device_id=00000000-0000-0000-0000-000000000000&device_name=L%20ng%20Kh%20ch%20s%20iPhone%20%28iPhone%20X%29&os_type=ios&os_version=13.300000&token=" + token + "&version_app=4.3.4";
  var dataremain = {
    url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/getDataRemain',
    headers: {},
    body: body,
  };
  $httpClient.post(dataremain, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var data = obj["data"][0];
          $notification.post("Data Flow: " + data["pack_name"], "", "Remain: " + data["remain"] + "( ~" + Math.round(data["remain_mb"] / 1024) + " GB)\nExpiredate: " + data["expireDate"]);
        }
        else {
          $notification.post("Data Flow token expired‼️", "", "Try to login again in app My Viettel");
        }
      }
    }
    $done();
  });
}

function API(s = "untitled", t = !1) { return new class { constructor(s, t) { this.name = s, this.debug = t, this.isQX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && !this.isLoon, this.isNode = "function" == typeof require, this.isJSBox = this.isNode && "undefined" != typeof $jsbox, this.node = (() => { if (this.isNode) { return { request: "undefined" != typeof $request ? void 0 : require("request"), fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (s) { return this.then(function (t) { return ((s, t) => new Promise(function (e) { setTimeout(e.bind(null, t), s) }))(s, t) }) } } get(s) { return this.isQX ? ("string" == typeof s && (s = { url: s, method: "GET" }), $task.fetch(s)) : new Promise((t, e) => { this.isLoon || this.isSurge ? $httpClient.get(s, (s, i, o) => { s ? e(s) : t({ status: i.status, headers: i.headers, body: o }) }) : this.node.request(s, (s, i, o) => { s ? e(s) : t({ ...i, status: i.statusCode, body: o }) }) }) } post(s) { return this.isQX ? ("string" == typeof s && (s = { url: s }), s.method = "POST", $task.fetch(s)) : new Promise((t, e) => { this.isLoon || this.isSurge ? $httpClient.post(s, (s, i, o) => { s ? e(s) : t({ status: i.status, headers: i.headers, body: o }) }) : this.node.request.post(s, (s, i, o) => { s ? e(s) : t({ ...i, status: i.statusCode, body: o }) }) }) } initCache() { if (this.isQX && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (this.isLoon || this.isSurge) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), this.isNode) { let s = "root.json"; this.node.fs.existsSync(s) || this.node.fs.writeFileSync(s, JSON.stringify({}), { flag: "wx" }, s => console.log(s)), this.root = {}, s = `${this.name}.json`, this.node.fs.existsSync(s) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(s, JSON.stringify({}), { flag: "wx" }, s => console.log(s)), this.cache = {}) } } persistCache() { const s = JSON.stringify(this.cache); this.isQX && $prefs.setValueForKey(s, this.name), (this.isLoon || this.isSurge) && $persistentStore.write(s, this.name), this.isNode && (this.node.fs.writeFileSync(`${this.name}.json`, s, { flag: "w" }, s => console.log(s)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root), { flag: "w" }, s => console.log(s))) } write(s, t) { this.log(`SET ${t}`), -1 !== t.indexOf("#") ? (t = t.substr(1), this.isSurge & this.isLoon && $persistentStore.write(s, t), this.isQX && $prefs.setValueForKey(s, t), this.isNode && (this.root[t] = s)) : this.cache[t] = s, this.persistCache() } read(s) { return this.log(`READ ${s}`), -1 === s.indexOf("#") ? this.cache[s] : (s = s.substr(1), this.isSurge & this.isLoon && $persistentStore.read(data, s), this.isQX ? $prefs.valueForKey(s) : this.isNode ? this.root[s] : void 0) } delete(s) { this.log(`DELETE ${s}`), delete this.cache[s], -1 !== s.indexOf("#") ? (s = s.substr(1), this.isSurge & this.isLoon && $persistentStore.write(null, s), this.isQX && $prefs.setValueForKey(null, s), this.isNode && delete this.root[s]) : this.cache[s] = data, this.persistCache() } notify(s, t = "", e = "", i = {}) { const o = i["open-url"], n = i["media-url"], r = e + (o ? `\n点击跳转: ${o}` : "") + (n ? `\n多媒体: ${n}` : ""); if (this.isQX && $notify(s, t, e, i), this.isSurge && $notification.post(s, t, r), this.isLoon && $notification.post(s, t, e, o), this.isNode) if (this.isJSBox) { require("push").schedule({ title: s, body: (t ? t + "\n" : "") + r }) } else console.log(`${s}\n${t}\n${r}\n\n`) } log(s) { this.debug && console.log(s) } info(s) { console.log(s) } error(s) { console.log("ERROR: " + s) } wait(s) { return new Promise(t => setTimeout(t, s)) } done(s = {}) { this.isQX || this.isLoon || this.isSurge ? $done(s) : this.isNode && !this.isJSBox && "undefined" != typeof $context && ($context.headers = s.headers, $context.statusCode = s.statusCode, $context.body = s.body) } }(s, t) }
