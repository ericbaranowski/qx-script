var $env=env();

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
var ncovUrl = {
    url: 'https://code.junookyo.xyz/api/ncov-moh/data.json',
}
$env.get(ncovUrl, function (error, response, data) {
    if (error) {
        $env.post("NCOV", "", "Bad connection")
        $env.done();
    } else {
        if (response.statusCode == 200) {
            let obj = JSON.parse(data);
            if (obj["success"]) {
                obj = obj["data"];
                $env.notify("NCOV ", "", "🇻🇳 VN: Số người nhiễm: " + obj["vietnam"]["cases"] + ", Người chết: " + obj["vietnam"]["deaths"] + ", Hồi phục: " + obj["vietnam"]["recovered"] + "\n🌍 Global:  Số người nhiễm: " + obj["global"]["cases"] + ", Người chết: " + obj["global"]["deaths"] + ", Hồi phục: " + obj["global"]["recovered"]);
                $env.done();
            }
        } else {
            $env.notify("NCOV", "", "API ERROR");
        }
    }
});