/*
Old_iPA_Downloader by LangKhach
*/
var url = $request.url;
var obj = $request.body;

const api = "unlimapps";
const buy = "buyProduct";

if (url.indexOf(api) != -1) {
    var appidget = url.match(/\d{6,}$/);
    console.log("🟢\n appid: " + appidget);
    $nobyda.write(appidget.toString(), "appid");
    $nobyda.notify('Old_iPA_Dowloader', 'iTunes PC search app and click Get', 'By @Lãng Khách');
  //  $nobyda.done({ body });
}
if (url.indexOf(buy) != -1) {
    var appid = $persistentStore.read("appid");
    var body = obj.replace(/\d{6,}/, appid);
    console.log('🟢 Old_iPA_Downloader \nappid: ' + appid);
    $nobyda.notify("Old_iPA_Downloader rewrite stustus: OK", "", "");
  //  $nobyda.done({ body });
}




function nobyda() {
    const isRequest = typeof $request != "undefined";
    const isSurge = typeof $httpClient != "undefined";
    const isQuanX = typeof $task != "undefined";
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message);
        if (isSurge) $notification.post(title, subtitle, message);
    };
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key);
        if (isSurge) return $persistentStore.write(value, key);
    };
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key);
        if (isSurge) return $persistentStore.read(key);
    };
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status;
            } else if (response.statusCode) {
                response["status"] = response.statusCode;
            }
        }
        return response;
    };
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string")
                options = {
                    url: options,
                };
            options["method"] = "GET";
            $task.fetch(options).then(
                (response) => {
                    callback(null, adapterStatus(response), response.body);
                },
                (reason) => callback(reason.error, null, null)
            );
        }
        if (isSurge)
            $httpClient.get(options, (error, response, body) => {
                callback(error, adapterStatus(response), body);
            });
    };
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string")
                options = {
                    url: options,
                };
            options["method"] = "POST";
            $task.fetch(options).then(
                (response) => {
                    callback(null, adapterStatus(response), response.body);
                },
                (reason) => callback(reason.error, null, null)
            );
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body);
            });
        }
    };
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null;
        if (isSurge) isRequest ? $done(value) : $done();
    };
    return {
        isRequest,
        notify,
        write,
        read,
        get,
        post,
        done,
    };
}
