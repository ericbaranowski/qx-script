/*
Shoppe Check in Get Cookie.
The following URL check in once
https://shopee.vn

^https:\/\/shopee\.vn\/me\/setting url script-request-header shopee.js

MITM = shopee.vn
*/
const $ = env();
if ($.isRequest) {
    GetCookie();
    $.done();
} else {
    checkin();
    $.done();
}

function checkin() {
    var shopeeUrl = {
        url: "https://shopee.vn/mkt/coins/api/v2/checkin",
        headers: {
            Cookie: $.read("CookieSP"),
        },
    };

    $.post(shopeeUrl, function (error, response, data) {
        if (error) {
            $.notify("Shopee checkin", "", "Lỗi kết nối‼️");
            $.done();
        } else {
            if (response.status == 200) {
                let obj = JSON.parse(data);
                if (obj["data"]["success"]) {
                    var user = obj["data"]["username"];
                    var coins = obj["data"]["increase_coins"];
                    $.notify("Shopee " + user, "", "Đã nhận được " + coins + "💰");
                    $.done();
                }
            } else {
                $.notify(
                    "Shopee Cookie đã hết hạn‼️",
                    "",
                    "Hãy đăng nhập lại 🔓"
                );
            }
        }
    }); $.done();
}

function GetCookie() {
    if ($request.headers["Cookie"]) {
        var headerSP = $request.headers["Cookie"];
        var cookie = $.write(headerSP, "CookieSP");
        if (!cookie) {
            $.notify("Shopee Cookie lỗi‼️", "", "Đăng nhập lại");
        } else {
            $.notify("Shopee Cookie done 🎉", "", "");
        }
    } else {
        $.notify("Shopee lỗi đọc cookiee‼️", "", "Đăng nhập lại");
    }
    $.done();
}

function env() {
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
